import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { computeHighlight, computePlacement, isVisible, type Placement, type Rect } from "./placement";
import { useTour } from "./useTour";
import type { ProgressType, StepflowProps, StepTarget } from "./types";

/**
 * React logs a warning for useLayoutEffect during server rendering. The layout
 * pass only matters in a browser, so fall back to useEffect on the server.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const DEFAULT_LABELS = { next: "Next", prev: "Back", cancel: "Skip", complete: "Done" };
const EDITABLE = "input,textarea,select,[contenteditable=true]";

function resolveTarget(target: StepTarget | undefined): HTMLElement | null {
  if (!target) return null;
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target instanceof HTMLElement
        ? target
        : target.current;
  // A present-but-unrendered target (collapsed accordion, unopened modal) gets
  // the centered fallback rather than a 0x0 ring at the viewport origin.
  return isVisible(el) ? el : null;
}

function toRect(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function Progress({
  type,
  current,
  total,
}: {
  type: ProgressType;
  current: number;
  total: number;
}): ReactNode {
  if (type === "none") return null;
  if (type === "of") return `${current} of ${total}`;
  if (type === "counter") return `${current} / ${total}`;
  if (type === "percentage") return `${Math.round((current / total) * 100)}%`;
  return (
    <ul className="sf-dots">
      {Array.from({ length: total }, (_, i) => (
        <li key={i} className={i + 1 === current ? "sf-dot sf-active" : "sf-dot"} />
      ))}
    </ul>
  );
}

export function Stepflow({
  steps,
  run = false,
  labels,
  showPrev = true,
  showCancel = true,
  overlay = true,
  highlightColor = "rgba(0, 0, 0, 0.8)",
  keyboard = true,
  escapeToCancel = true,
  lockScroll = true,
  progress = "dots",
  progressPosition = "body",
  scrollBehavior = "smooth",
  className,
  container,
  ...callbacks
}: StepflowProps) {
  const tour = useTour(steps, run, callbacks);
  const { index, status, step, isFirst, isLast, busy } = tour;
  const active = status === "active";

  const cardRef = useRef<HTMLDivElement>(null);
  // Depend on the target, never on the step object. Hosts pass an inline
  // `steps={[...]}` array, so the step's identity changes on every parent
  // render — keying effects to it re-ran scrollIntoView continuously and fought
  // the user's own scrolling.
  const target = step?.target;
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [highlight, setHighlight] = useState<Rect | null>(null);

  const overlayOn = overlay !== false;
  const overlayOpacity = typeof overlay === "object" ? (overlay.opacity ?? 0.3) : 0.3;
  const closeOnClick = typeof overlay === "object" ? (overlay.closeOnClick ?? false) : false;
  const text = { ...DEFAULT_LABELS, ...labels };

  /** Measure the target and the card, then place one against the other. */
  const sync = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const el = resolveTarget(target);
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const targetRect = el ? toRect(el) : null;
    setHighlight(computeHighlight(targetRect, viewport));
    setPlacement(
      computePlacement(targetRect, { width: card.offsetWidth, height: card.offsetHeight }, viewport)
    );
  }, [target]);

  // Placement has to land before paint, or the card visibly jumps.
  useIsomorphicLayoutEffect(() => {
    if (!active) return;
    sync();
  }, [active, sync, index]);

  // Bring the target into view. Native scrollIntoView handles nested scroll
  // containers, which v1's window.scrollBy could not reach at all.
  useEffect(() => {
    if (!active) return;
    resolveTarget(target)?.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: scrollBehavior,
    });
  }, [active, target, scrollBehavior]);

  // Fixed coordinates go stale on resize and on scroll (the page can still
  // scroll when lockScroll is false, and inner containers always can).
  useEffect(() => {
    if (!active) return;
    const onChange = () => sync();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, { capture: true, passive: true });
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, { capture: true });
    };
  }, [active, sync]);

  useEffect(() => {
    if (!active || !lockScroll) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active, lockScroll]);

  useEffect(() => {
    if (!active || !(keyboard || escapeToCancel)) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      // Never steal keys from the host's own inputs — a step pointing at a form
      // field is the whole point of a tour library.
      const el = event.target as Element | null;
      if (el?.closest?.(EDITABLE) && !cardRef.current?.contains(el)) return;

      if (escapeToCancel && event.key === "Escape") {
        event.preventDefault();
        tour.cancel();
        return;
      }
      if (!keyboard) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (isLast) tour.complete();
        else tour.next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        tour.prev();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, keyboard, escapeToCancel, isLast, tour]);

  // Focus in on start, trap Tab inside the card, restore focus on teardown.
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    cardRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const card = cardRef.current;
      if (!card) return;
      const focusable = Array.from(
        card.querySelectorAll<HTMLElement>(
          'button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
        )
      );
      // Drive the cycle ourselves rather than patching the edges. Letting the
      // browser handle the middle leaves holes — Shift+Tab from the card itself
      // walks straight out of the dialog.
      event.preventDefault();
      if (focusable.length === 0) return;
      const at = focusable.indexOf(document.activeElement as HTMLElement);
      if (at === -1) {
        (event.shiftKey ? focusable[focusable.length - 1] : focusable[0])?.focus();
        return;
      }
      const delta = event.shiftKey ? -1 : 1;
      focusable[(at + delta + focusable.length) % focusable.length]?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.({ preventScroll: true });
    };
  }, [active]);

  useEffect(() => {
    if (!active || !closeOnClick) return;
    const onClick = (event: MouseEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) tour.cancel();
    };
    // Deferred so the click that opened the tour cannot immediately close it.
    const id = window.setTimeout(() => document.addEventListener("click", onClick), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("click", onClick);
    };
  }, [active, closeOnClick, tour]);

  const host = container ?? (typeof document === "undefined" ? null : document.body);
  const total = steps.length;
  const titleId = `sf-title-${index}`;

  const progressNode = useMemo(() => {
    if (typeof progress === "function") return progress(index + 1, total);
    // Dots in the inline layout sit beside the buttons, where a row of dots
    // has no room; a counter says the same thing in less space.
    const type = progress === "dots" && progressPosition === "inline" ? "counter" : progress;
    return <Progress type={type} current={index + 1} total={total} />;
  }, [progress, progressPosition, index, total]);

  if (!active || !step || !host) return null;

  const controls = (
    <div className={`sf-controls${progressPosition === "inline" ? " sf-controls-inline" : ""}`}>
      <div className="sf-left">
        {showCancel && !isLast && (
          <button type="button" className="sf-btn sf-btn-skip" onClick={tour.cancel}>
            {text.cancel}
          </button>
        )}
        {showPrev && !isFirst && (
          <button
            type="button"
            className="sf-btn sf-btn-prev"
            onClick={tour.prev}
            disabled={busy}
          >
            {text.prev}
          </button>
        )}
      </div>
      <div>
        <button
          type="button"
          className={isLast ? "sf-btn sf-btn-done" : "sf-btn sf-btn-next"}
          onClick={isLast ? tour.complete : tour.next}
          disabled={busy}
        >
          {isLast ? text.complete : text.next}
        </button>
      </div>
    </div>
  );

  const body = (
    <div className="sf-content">
      {step.title != null && <h3 id={titleId}>{step.title}</h3>}
      {step.content != null && <div className="sf-body">{step.content}</div>}
    </div>
  );

  const progressBox = <div className="sf-progress">{progressNode}</div>;

  return createPortal(
    <div className="sf-root">
      {overlayOn && (
        <div
          className="sf-overlay"
          style={{ background: `rgba(0, 0, 0, ${overlayOpacity})` }}
          aria-hidden="true"
        />
      )}
      {highlight && (
        <div
          className={overlayOn ? "sf-highlight" : "sf-highlight sf-no-shadow"}
          aria-hidden="true"
          style={{
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
            boxShadow: overlayOn
              ? `${highlightColor} 0 0 1px 2px, rgba(0, 0, 0, ${overlayOpacity}) 0 0 0 5000px`
              : `${highlightColor} 0 0 1px 2px`,
          }}
        />
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={step.title != null ? titleId : undefined}
        tabIndex={-1}
        className={[
          "sf-card sf-tooltip",
          placement ? "sf-visible" : "",
          placement?.side === "top" ? "sf-arrow-top" : "",
          placement?.side === "bottom" ? "sf-arrow-bottom" : "",
          progressPosition === "inline" ? "sf-no-body" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          top: placement?.top ?? 0,
          left: placement?.left ?? 0,
          ["--sf-arrow-offset" as string]: `${placement?.arrowOffset ?? 0}px`,
        }}
      >
        {progressPosition === "header" ? (
          <>
            <div className="sf-card-header">{progressBox}</div>
            <div className="sf-card-body">{body}</div>
            <div className="sf-card-footer">{controls}</div>
          </>
        ) : progressPosition === "inline" ? (
          <>
            <div className="sf-card-header">{body}</div>
            <div className="sf-card-footer">
              <div className="sf-progress-controls">
                {progressBox}
                {controls}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="sf-card-header">{body}</div>
            <div className="sf-card-body">{progressBox}</div>
            <div className="sf-card-footer">{controls}</div>
          </>
        )}
      </div>
    </div>,
    host
  );
}
