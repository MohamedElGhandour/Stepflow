/*! Stepflow v2.0.0 | MIT | https://github.com/MohamedElGhandour/Stepflow */
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Pure placement math. No DOM access, no mutation — every input is a plain
 * number, so this is the one part of Stepflow that can be tested exactly.
 *
 * Coordinates are viewport-relative (`position: fixed`), never document-relative.
 * v1 added scrollX/scrollY to everything and positioned absolutely, which broke
 * whenever the host put a transform or `position: relative` on <body>.
 */
const GAP = 16;
const SIDE_MARGIN = 10;
/** Centered placement, used when a step has no target or the target is hidden. */
function centered(tooltip, viewport) {
    return {
        top: Math.max(SIDE_MARGIN, (viewport.height - tooltip.height) / 2),
        left: Math.max(SIDE_MARGIN, (viewport.width - tooltip.width) / 2),
        side: "none",
        arrowOffset: 0,
    };
}
/**
 * Places the tooltip against a target: below it if there is room, above it if
 * not, and clamped into the viewport either way.
 */
function computePlacement(target, tooltip, viewport, gap = GAP, sideMargin = SIDE_MARGIN) {
    if (!target)
        return centered(tooltip, viewport);
    const targetBottom = target.top + target.height;
    // Horizontal: align to the target's left edge, then clamp to the viewport.
    const maxLeft = viewport.width - tooltip.width - sideMargin;
    const left = Math.max(sideMargin, Math.min(target.left, maxLeft));
    // Vertical: prefer below, fall back to above, then clamp.
    const fitsBelow = viewport.height - targetBottom >= tooltip.height + gap;
    const fitsAbove = target.top >= tooltip.height + gap;
    const side = fitsBelow || !fitsAbove ? "top" : "bottom";
    const unclamped = side === "top" ? targetBottom + gap : target.top - tooltip.height - gap;
    // Clamp so the footer buttons can never land off-screen — v1 skipped this and
    // the controls became unreachable while body scroll was locked.
    const maxTop = viewport.height - tooltip.height - sideMargin;
    const top = maxTop < sideMargin ? sideMargin : Math.max(sideMargin, Math.min(unclamped, maxTop));
    // Arrow points at the target's centre, kept inside the tooltip's own edges.
    const targetCentreX = target.left + target.width / 2;
    let arrowOffset = targetCentreX - left;
    if (target.width > tooltip.width) {
        // A target wider than the tooltip has no meaningful centre to point at;
        // tuck the arrow near the leading edge instead.
        arrowOffset = Math.min(arrowOffset, tooltip.width / 10);
    }
    arrowOffset = Math.max(sideMargin, Math.min(arrowOffset, tooltip.width - sideMargin));
    return { top, left, side, arrowOffset };
}
/**
 * The highlight ring's box, or a 1px point at the viewport centre when there is
 * no target to ring.
 */
function computeHighlight(target, viewport) {
    if (!target) {
        return { top: viewport.height / 2 - 0.5, left: viewport.width / 2 - 0.5, width: 1, height: 1 };
    }
    return target;
}
/** True when an element is laid out and can be pointed at. */
function isVisible(el) {
    return !!el && el.getClientRects().length > 0;
}

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
function useTour(steps, run, callbacks) {
    const [index, setIndex] = useState(0);
    const [terminal, setTerminal] = useState(null);
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
    const status = terminal ?? (active ? "active" : "idle");
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
    const report = useCallback((error) => {
        if (cb.current.onError)
            cb.current.onError(error);
        else
            console.error("[stepflow]", error);
    }, []);
    /** Runs a host callback without ever letting a throw escape into React. */
    const guard = useCallback((fn) => {
        if (!fn)
            return;
        try {
            const result = fn();
            if (result instanceof Promise)
                result.catch(report);
        }
        catch (error) {
            report(error);
        }
    }, [report]);
    const started = useRef(false);
    useEffect(() => {
        if (!active) {
            started.current = false;
            return;
        }
        if (started.current)
            return;
        const step = stepsRef.current[0];
        if (!step)
            return;
        started.current = true;
        guard(() => cb.current.onStart?.(step, 0));
    }, [active, guard]);
    useEffect(() => {
        if (!active)
            return;
        const step = stepsRef.current[index];
        if (step)
            guard(() => cb.current.onStepChange?.(step, index));
    }, [active, index, guard]);
    const finish = useCallback((next) => {
        if (!active || lock.current)
            return;
        lock.current = true;
        // Terminal state first: the UI is gone before the host runs, so nothing
        // the host does can strand it on screen.
        setTerminal(next);
        const step = stepsRef.current[index];
        if (!step)
            return;
        guard(() => next === "completed"
            ? cb.current.onComplete?.(step, index)
            : cb.current.onCancel?.(step, index));
    }, [active, index, guard]);
    const move = useCallback((direction) => {
        if (!active || lock.current)
            return;
        const list = stepsRef.current;
        const target = index + direction;
        // Guard on the raw index, not a derived value that may lag a render.
        if (target < 0 || target >= list.length)
            return;
        const step = list[index];
        if (!step)
            return;
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
            }
            catch (error) {
                report(error);
            }
            finally {
                lock.current = false;
                setBusy(false);
            }
        })();
    }, [active, index, report]);
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

/**
 * React logs a warning for useLayoutEffect during server rendering. The layout
 * pass only matters in a browser, so fall back to useEffect on the server.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const DEFAULT_LABELS = { next: "Next", prev: "Back", cancel: "Skip", complete: "Done" };
const EDITABLE = "input,textarea,select,[contenteditable=true]";
function resolveTarget(target) {
    if (!target)
        return null;
    const el = typeof target === "string"
        ? document.querySelector(target)
        : target instanceof HTMLElement
            ? target
            : target.current;
    // A present-but-unrendered target (collapsed accordion, unopened modal) gets
    // the centered fallback rather than a 0x0 ring at the viewport origin.
    return isVisible(el) ? el : null;
}
function toRect(el) {
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
}
function Progress({ type, current, total, }) {
    if (type === "none")
        return null;
    if (type === "of")
        return `${current} of ${total}`;
    if (type === "counter")
        return `${current} / ${total}`;
    if (type === "percentage")
        return `${Math.round((current / total) * 100)}%`;
    return (jsx("ul", { className: "sf-dots", children: Array.from({ length: total }, (_, i) => (jsx("li", { className: i + 1 === current ? "sf-dot sf-active" : "sf-dot" }, i))) }));
}
function Stepflow({ steps, run = false, labels, showPrev = true, showCancel = true, overlay = true, highlightColor = "rgba(0, 0, 0, 0.8)", keyboard = true, escapeToCancel = true, lockScroll = true, progress = "dots", progressPosition = "body", scrollBehavior = "smooth", className, container, ...callbacks }) {
    const tour = useTour(steps, run, callbacks);
    const { index, status, step, isFirst, isLast, busy } = tour;
    const active = status === "active";
    const cardRef = useRef(null);
    // Depend on the target, never on the step object. Hosts pass an inline
    // `steps={[...]}` array, so the step's identity changes on every parent
    // render — keying effects to it re-ran scrollIntoView continuously and fought
    // the user's own scrolling.
    const target = step?.target;
    const [placement, setPlacement] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const overlayOn = overlay !== false;
    const overlayOpacity = typeof overlay === "object" ? (overlay.opacity ?? 0.3) : 0.3;
    const closeOnClick = typeof overlay === "object" ? (overlay.closeOnClick ?? false) : false;
    const text = { ...DEFAULT_LABELS, ...labels };
    /** Measure the target and the card, then place one against the other. */
    const sync = useCallback(() => {
        const card = cardRef.current;
        if (!card)
            return;
        const el = resolveTarget(target);
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const targetRect = el ? toRect(el) : null;
        setHighlight(computeHighlight(targetRect, viewport));
        setPlacement(computePlacement(targetRect, { width: card.offsetWidth, height: card.offsetHeight }, viewport));
    }, [target]);
    // Placement has to land before paint, or the card visibly jumps.
    useIsomorphicLayoutEffect(() => {
        if (!active)
            return;
        sync();
    }, [active, sync, index]);
    // Bring the target into view. Native scrollIntoView handles nested scroll
    // containers, which v1's window.scrollBy could not reach at all.
    useEffect(() => {
        if (!active)
            return;
        resolveTarget(target)?.scrollIntoView({
            block: "center",
            inline: "nearest",
            behavior: scrollBehavior,
        });
    }, [active, target, scrollBehavior]);
    // Fixed coordinates go stale on resize and on scroll (the page can still
    // scroll when lockScroll is false, and inner containers always can).
    useEffect(() => {
        if (!active)
            return;
        const onChange = () => sync();
        window.addEventListener("resize", onChange);
        window.addEventListener("scroll", onChange, { capture: true, passive: true });
        return () => {
            window.removeEventListener("resize", onChange);
            window.removeEventListener("scroll", onChange, { capture: true });
        };
    }, [active, sync]);
    useEffect(() => {
        if (!active || !lockScroll)
            return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [active, lockScroll]);
    useEffect(() => {
        if (!active || !(keyboard || escapeToCancel))
            return;
        const onKeyDown = (event) => {
            if (event.isComposing)
                return;
            // Never steal keys from the host's own inputs — a step pointing at a form
            // field is the whole point of a tour library.
            const el = event.target;
            if (el?.closest?.(EDITABLE) && !cardRef.current?.contains(el))
                return;
            if (escapeToCancel && event.key === "Escape") {
                event.preventDefault();
                tour.cancel();
                return;
            }
            if (!keyboard)
                return;
            if (event.key === "ArrowRight") {
                event.preventDefault();
                if (isLast)
                    tour.complete();
                else
                    tour.next();
            }
            else if (event.key === "ArrowLeft") {
                event.preventDefault();
                tour.prev();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [active, keyboard, escapeToCancel, isLast, tour]);
    // Focus in on start, trap Tab inside the card, restore focus on teardown.
    useEffect(() => {
        if (!active)
            return;
        const previous = document.activeElement;
        cardRef.current?.focus({ preventScroll: true });
        const onKeyDown = (event) => {
            if (event.key !== "Tab")
                return;
            const card = cardRef.current;
            if (!card)
                return;
            const focusable = Array.from(card.querySelectorAll('button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'));
            // Drive the cycle ourselves rather than patching the edges. Letting the
            // browser handle the middle leaves holes — Shift+Tab from the card itself
            // walks straight out of the dialog.
            event.preventDefault();
            if (focusable.length === 0)
                return;
            const at = focusable.indexOf(document.activeElement);
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
        if (!active || !closeOnClick)
            return;
        const onClick = (event) => {
            if (!cardRef.current?.contains(event.target))
                tour.cancel();
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
        if (typeof progress === "function")
            return progress(index + 1, total);
        // Dots in the inline layout sit beside the buttons, where a row of dots
        // has no room; a counter says the same thing in less space.
        const type = progress === "dots" && progressPosition === "inline" ? "counter" : progress;
        return jsx(Progress, { type: type, current: index + 1, total: total });
    }, [progress, progressPosition, index, total]);
    if (!active || !step || !host)
        return null;
    const controls = (jsxs("div", { className: `sf-controls${progressPosition === "inline" ? " sf-controls-inline" : ""}`, children: [jsxs("div", { className: "sf-left", children: [showCancel && !isLast && (jsx("button", { type: "button", className: "sf-btn sf-btn-skip", onClick: tour.cancel, children: text.cancel })), showPrev && !isFirst && (jsx("button", { type: "button", className: "sf-btn sf-btn-prev", onClick: tour.prev, disabled: busy, children: text.prev }))] }), jsx("div", { children: jsx("button", { type: "button", className: isLast ? "sf-btn sf-btn-done" : "sf-btn sf-btn-next", onClick: isLast ? tour.complete : tour.next, disabled: busy, children: isLast ? text.complete : text.next }) })] }));
    const body = (jsxs("div", { className: "sf-content", children: [step.title != null && jsx("h3", { id: titleId, children: step.title }), step.content != null && jsx("div", { className: "sf-body", children: step.content })] }));
    const progressBox = jsx("div", { className: "sf-progress", children: progressNode });
    return createPortal(jsxs("div", { className: "sf-root", children: [overlayOn && (jsx("div", { className: "sf-overlay", style: { background: `rgba(0, 0, 0, ${overlayOpacity})` }, "aria-hidden": "true" })), highlight && (jsx("div", { className: overlayOn ? "sf-highlight" : "sf-highlight sf-no-shadow", "aria-hidden": "true", style: {
                    top: highlight.top,
                    left: highlight.left,
                    width: highlight.width,
                    height: highlight.height,
                    boxShadow: overlayOn
                        ? `${highlightColor} 0 0 1px 2px, rgba(0, 0, 0, ${overlayOpacity}) 0 0 0 5000px`
                        : `${highlightColor} 0 0 1px 2px`,
                } })), jsx("div", { ref: cardRef, role: "dialog", "aria-modal": "true", "aria-labelledby": step.title != null ? titleId : undefined, tabIndex: -1, className: [
                    "sf-card sf-tooltip",
                    placement ? "sf-visible" : "",
                    placement?.side === "top" ? "sf-arrow-top" : "",
                    placement?.side === "bottom" ? "sf-arrow-bottom" : "",
                    progressPosition === "inline" ? "sf-no-body" : "",
                    className ?? "",
                ]
                    .filter(Boolean)
                    .join(" "), style: {
                    top: placement?.top ?? 0,
                    left: placement?.left ?? 0,
                    ["--sf-arrow-offset"]: `${placement?.arrowOffset ?? 0}px`,
                }, children: progressPosition === "header" ? (jsxs(Fragment, { children: [jsx("div", { className: "sf-card-header", children: progressBox }), jsx("div", { className: "sf-card-body", children: body }), jsx("div", { className: "sf-card-footer", children: controls })] })) : progressPosition === "inline" ? (jsxs(Fragment, { children: [jsx("div", { className: "sf-card-header", children: body }), jsx("div", { className: "sf-card-footer", children: jsxs("div", { className: "sf-progress-controls", children: [progressBox, controls] }) })] })) : (jsxs(Fragment, { children: [jsx("div", { className: "sf-card-header", children: body }), jsx("div", { className: "sf-card-body", children: progressBox }), jsx("div", { className: "sf-card-footer", children: controls })] })) })] }), host);
}

export { Stepflow, useTour };
//# sourceMappingURL=stepflow.js.map
