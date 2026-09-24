import { useCallback, useEffect, useRef, useState } from "react";
import type { Status, Step } from "./types";

export interface TourCallbacks {
  onStart?: (step: Step, index: number) => void;
  onComplete?: (step: Step, index: number) => void;
  onCancel?: (step: Step, index: number) => void;
  onNext?: (step: Step, index: number) => void | Promise<void>;
  onPrev?: (step: Step, index: number) => void | Promise<void>;
  onError?: (error: unknown) => void;
  onStepChange?: (step: Step, index: number) => void;
}

export interface Tour {
  index: number;
  status: Status;
  step: Step | undefined;
  isFirst: boolean;
  isLast: boolean;
  /** True while an async step callback is in flight. Disables the controls. */
  busy: boolean;
  next: () => void;
  prev: () => void;
  complete: () => void;
  cancel: () => void;
}

type Terminal = "completed" | "canceled";

/**
 * The tour state machine.
 *
 * Two invariants the v1 store did not hold, and most of its bugs followed:
 *
 * 1. **One transition at a time.** A double-click during an awaited `onNext`
 *    used to increment twice, skipping a step and firing the same callback
 *    twice. `lock` closes that window.
 * 2. **Teardown is never the callback's responsibility.** The tour reaches its
 *    terminal state *before* the host callback runs, so a throwing
 *    `onComplete` can no longer strand a locked, click-eating overlay on screen.
 */
export function useTour(steps: Step[], run: boolean, callbacks: TourCallbacks): Tour {
  const [index, setIndex] = useState(0);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [busy, setBusy] = useState(false);

  // Reset on the run edge. Adjusting state during render is React's own answer
  // to "a prop changed, drop the derived state" — no effect, no extra paint.
  const [lastRun, setLastRun] = useState(run);
  if (lastRun !== run) {
    setLastRun(run);
    setIndex(0);
    setTerminal(null);
    setBusy(false);
  }

  const active = run && steps.length > 0 && terminal === null;
  const status: Status = terminal ?? (active ? "active" : "idle");

  // Latest-ref so a host that re-creates its handlers every render (the normal
  // case) never restarts the tour and never sees a stale closure. Written in an
  // effect, not during render.
  const cb = useRef(callbacks);
  const stepsRef = useRef(steps);
  useEffect(() => {
    cb.current = callbacks;
    stepsRef.current = steps;
  });

  // A transition lock has to be readable synchronously — state would batch.
  const lock = useRef(false);
  useEffect(() => {
    lock.current = false;
  }, [run]);

  // Reporting an error must not end the tour. `onNext` throwing is the
  // documented way to abort a move — a validation step that rejects bad input
  // has to leave the user on that step to fix it. A host that wants a throw to
  // be fatal sets run={false} itself.
  const report = useCallback((error: unknown) => {
    if (cb.current.onError) cb.current.onError(error);
    else console.error("[stepflow]", error);
  }, []);

  /** Runs a host callback without ever letting a throw escape into React. */
  const guard = useCallback(
    (fn: (() => void | Promise<void>) | undefined) => {
      if (!fn) return;
      try {
        const result = fn();
        if (result instanceof Promise) result.catch(report);
      } catch (error) {
        report(error);
      }
    },
    [report]
  );

  const started = useRef(false);
  useEffect(() => {
    if (!active) {
      started.current = false;
      return;
    }
    if (started.current) return;
    const step = stepsRef.current[0];
    if (!step) return;
    started.current = true;
    guard(() => cb.current.onStart?.(step, 0));
  }, [active, guard]);

  useEffect(() => {
    if (!active) return;
    const step = stepsRef.current[index];
    if (step) guard(() => cb.current.onStepChange?.(step, index));
  }, [active, index, guard]);

  const finish = useCallback(
    (next: Terminal) => {
      if (!active || lock.current) return;
      lock.current = true;
      // Terminal state first: the UI is gone before the host runs, so nothing
      // the host does can strand it on screen.
      setTerminal(next);
      const step = stepsRef.current[index];
      if (!step) return;
      guard(() =>
        next === "completed"
          ? cb.current.onComplete?.(step, index)
          : cb.current.onCancel?.(step, index)
      );
    },
    [active, index, guard]
  );

  const move = useCallback(
    (direction: 1 | -1) => {
      if (!active || lock.current) return;
      const list = stepsRef.current;
      const target = index + direction;
      // Guard on the raw index, not a derived value that may lag a render.
      if (target < 0 || target >= list.length) return;

      const step = list[index];
      if (!step) return;

      const local = direction === 1 ? step.onNext : step.onPrev;
      const global = direction === 1 ? cb.current.onNext : cb.current.onPrev;

      // Nothing to await: move now. Deferring a plain click through a microtask
      // would make every consumer's tests async for no reason.
      if (!local && !global) {
        setIndex(target);
        return;
      }

      lock.current = true;
      setBusy(true);

      void (async () => {
        try {
          await local?.(step, index);
          await global?.(step, index);
          setIndex(target);
        } catch (error) {
          report(error);
        } finally {
          lock.current = false;
          setBusy(false);
        }
      })();
    },
    [active, index, report]
  );

  const next = useCallback(() => move(1), [move]);
  const prev = useCallback(() => move(-1), [move]);
  const complete = useCallback(() => finish("completed"), [finish]);
  const cancel = useCallback(() => finish("canceled"), [finish]);

  return {
    index,
    status,
    step: steps[index],
    isFirst: index === 0,
    isLast: index === steps.length - 1,
    busy,
    next,
    prev,
    complete,
    cancel,
  };
}
