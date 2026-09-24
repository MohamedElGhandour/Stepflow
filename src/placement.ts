/**
 * Pure placement math. No DOM access, no mutation — every input is a plain
 * number, so this is the one part of Stepflow that can be tested exactly.
 *
 * Coordinates are viewport-relative (`position: fixed`), never document-relative.
 * v1 added scrollX/scrollY to everything and positioned absolutely, which broke
 * whenever the host put a transform or `position: relative` on <body>.
 */

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
}

/** Which edge of the tooltip the arrow sits on. `none` = centered, no target. */
export type ArrowSide = "top" | "bottom" | "none";

export interface Placement {
  top: number;
  left: number;
  side: ArrowSide;
  /** Arrow offset from the tooltip's left edge, in px. */
  arrowOffset: number;
}

export const GAP = 16;
export const SIDE_MARGIN = 10;

/** Centered placement, used when a step has no target or the target is hidden. */
function centered(tooltip: Size, viewport: Viewport): Placement {
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
export function computePlacement(
  target: Rect | null,
  tooltip: Size,
  viewport: Viewport,
  gap = GAP,
  sideMargin = SIDE_MARGIN
): Placement {
  if (!target) return centered(tooltip, viewport);

  const targetBottom = target.top + target.height;

  // Horizontal: align to the target's left edge, then clamp to the viewport.
  const maxLeft = viewport.width - tooltip.width - sideMargin;
  const left = Math.max(sideMargin, Math.min(target.left, maxLeft));

  // Vertical: prefer below, fall back to above, then clamp.
  const fitsBelow = viewport.height - targetBottom >= tooltip.height + gap;
  const fitsAbove = target.top >= tooltip.height + gap;
  const side: ArrowSide = fitsBelow || !fitsAbove ? "top" : "bottom";
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
export function computeHighlight(target: Rect | null, viewport: Viewport): Rect {
  if (!target) {
    return { top: viewport.height / 2 - 0.5, left: viewport.width / 2 - 0.5, width: 1, height: 1 };
  }
  return target;
}

/** True when an element is laid out and can be pointed at. */
export function isVisible(el: Element | null | undefined): el is HTMLElement {
  return !!el && el.getClientRects().length > 0;
}
