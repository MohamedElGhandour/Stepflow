# `useTour`

[Home](../README.md) → [API](index.md) → `useTour`

The state machine that [`Stepflow`](./stepflow.md) is built on, exported on its
own. It tracks which step you are on and what may happen next. It renders
nothing, touches no DOM, and has no opinion about what your card looks like.

Reach for it when the built-in card is the wrong shape: a bottom rail instead of
a tooltip, a step inside an existing modal, a checklist in the corner, a card
that is one of your own design-system components. You write the markup; the hook
keeps the sequence honest.

## Signature

```ts
useTour(steps: Step[], run: boolean, callbacks: TourCallbacks): Tour
```

All three arguments are positional and required. Pass `{}` when you have no
callbacks.

```tsx
import { useTour } from "@mohamedelghandour/stepflow";

const tour = useTour(steps, run, { onComplete: () => setRun(false) });
```

`callbacks` is read through a ref, so re-creating the object on every render —
the normal case — never restarts the tour and never leaves you with a stale
closure. The callbacks and their `(step, index)` arguments are the same ones the
component takes; see [Callbacks](./stepflow.md#callbacks).

## The `Tour` object

| Field | Type | Notes |
| --- | --- | --- |
| `index` | `number` | 0-based position in `steps`. |
| `status` | `Status` | `"idle"`, `"active"`, `"completed"`, or `"canceled"`. |
| `step` | `Step \| undefined` | `steps[index]`. |
| `isFirst` | `boolean` | `index === 0`. |
| `isLast` | `boolean` | `index === steps.length - 1`. |
| `busy` | `boolean` | True while an async `onNext` / `onPrev` is in flight. Disable your controls on it. |
| `next` | `() => void` | Advance one step. |
| `prev` | `() => void` | Go back one step. |
| `complete` | `() => void` | End the tour as completed. |
| `cancel` | `() => void` | End the tour as canceled. |

## How the state moves

The tour is `active` while `run` is true, `steps` is not empty, and no terminal
state has been reached. Anything else is `idle`.

`run` is the reset. Changing it in either direction puts `index` back to 0 and
clears the terminal state, so the same hook instance replays cleanly. That also
means you will only observe `status === "completed"` or `"canceled"` while `run`
is still true — flipping it to false from `onComplete` returns the hook to
`idle`.

`next()` and `prev()` do nothing at the ends of the array. **`next()` on the last
step is a no-op — it does not complete the tour.** Wire your last button to
`complete()`, the way the built-in card does.

Only one transition runs at a time. When a step's `onNext` or the tour-level
`onNext` returns a promise, `busy` goes true and further calls are dropped until
it settles, so a double-click cannot skip a step or fire the same callback twice.
The step's own callback runs first, then the tour-level one, then the index moves.

A throw or rejection from any callback is caught — it never escapes into React.
It aborts the move and goes to `onError`, or to `console.error` under
`[stepflow]` if you did not provide one. The tour stays on its current step:
reporting an error is not a terminal state.

`complete()` and `cancel()` set the terminal state *before* running your
callback, so a failing analytics call cannot leave your card stuck on screen.
After either, further calls are ignored until `run` changes.

`onStart` fires once per run with `(steps[0], 0)`. `onStepChange` fires on every
settled step, including the first.

## What the hook does not do

Everything the component adds around the state machine is yours to provide or to
skip:

- No positioning. The placement math is internal and not exported.
- No overlay, no highlight ring.
- No scrolling the target into view.
- No scroll lock.
- No keyboard handling.
- No focus management or focus trap.
- No stylesheet. `@mohamedelghandour/stepflow/styles.css` only styles the
  component's own `.sf-*` markup, so a custom card does not need it.

The example below adds back the three that matter most for a real tour: scroll
the target into view, mark it, and manage focus.

## A custom card, end to end

A tour rail pinned to the bottom of the viewport. It outlines the current target
instead of drawing an overlay, and it leaves the rest of the page interactive.

```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useTour, type Step, type StepTarget } from "@mohamedelghandour/stepflow";

function track(event: string): void {
  navigator.sendBeacon("/analytics", event);
}

/** Same union the component resolves: a ref, an element, or a selector. */
function resolve(target: StepTarget | undefined): HTMLElement | null {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector<HTMLElement>(target);
  return target instanceof HTMLElement ? target : target.current;
}

function TourRail({
  steps,
  run,
  onDone,
}: {
  steps: Step[];
  run: boolean;
  onDone: () => void;
}) {
  const tour = useTour(steps, run, { onComplete: onDone, onCancel: onDone });
  const railRef = useRef<HTMLDivElement>(null);

  // Bring the target into view and outline it. The cleanup runs on every step
  // change, so exactly one element is ever marked.
  useEffect(() => {
    if (tour.status !== "active") return;
    const el = resolve(tour.step?.target);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.style.outline = "2px solid #4f46e5";
    el.style.outlineOffset = "2px";
    return () => {
      el.style.outline = "";
      el.style.outlineOffset = "";
    };
  }, [tour.status, tour.step]);

  // Move focus into the rail on start, and hand it back on teardown.
  useEffect(() => {
    if (tour.status !== "active") return;
    const previous = document.activeElement as HTMLElement | null;
    railRef.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, [tour.status]);

  if (tour.status !== "active" || !tour.step) return null;

  return (
    <div className="rail" role="dialog" aria-label="Product tour" tabIndex={-1} ref={railRef}>
      <p className="rail-count">
        Step {tour.index + 1} of {steps.length}
      </p>
      <div className="rail-copy">
        {tour.step.title != null && <h2>{tour.step.title}</h2>}
        {tour.step.content}
      </div>
      <div className="rail-actions">
        <button type="button" onClick={tour.cancel}>
          Skip tour
        </button>
        <button type="button" onClick={tour.prev} disabled={tour.isFirst || tour.busy}>
          Back
        </button>
        {tour.isLast ? (
          <button type="button" onClick={tour.complete} disabled={tour.busy}>
            Finish
          </button>
        ) : (
          <button type="button" onClick={tour.next} disabled={tour.busy}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export function Editor() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  // Memoized so the effects above re-run when the step changes, not on every
  // render of this component.
  const steps = useMemo<Step[]>(
    () => [
      { title: "Welcome", content: "Two things and you are done." },
      {
        target: saveRef,
        title: "Save",
        content: (
          <>
            Or press <kbd>⌘S</kbd>.
          </>
        ),
      },
      {
        target: shareRef,
        title: "Share",
        content: "Invite someone to edit with you.",
        onNext: () => track("tour_reached_share"),
      },
    ],
    []
  );

  return (
    <>
      <button onClick={() => setRun(true)}>Take the tour</button>
      <button ref={saveRef}>Save</button>
      <button ref={shareRef}>Share</button>

      <TourRail steps={steps} run={run} onDone={() => setRun(false)} />
    </>
  );
}
```

The rail's own styles, for completeness:

```css
.rail {
  position: fixed;
  inset: auto 0 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e5e5e5;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
}

.rail-count {
  margin: 0;
  font-size: 0.75rem;
  color: #666;
  white-space: nowrap;
}

.rail-copy {
  flex: 1;
}

.rail-copy h2 {
  margin: 0 0 2px;
  font-size: 1rem;
}

.rail-actions {
  display: flex;
  gap: 8px;
}
```

Two things this shows that a closed card cannot. The steps are plain data with
JSX in them, so `content` can be any component you already have. And `tour` is
just an object — you decide which controls exist, when they are disabled, and
what the container is. The hook still guarantees the sequence: one transition at
a time, `busy` while your `onNext` is pending, and a terminal state your card
cannot get stuck outside of.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="stepflow.md">API: Stepflow</a></div>
  <div>Next: <a href="../examples/hello-world.md">Hello World</a></div>
</div>
