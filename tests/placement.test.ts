import { describe, expect, it } from "vitest";
import { GAP, SIDE_MARGIN, computeHighlight, computePlacement } from "../src/placement";

const VIEWPORT = { width: 1000, height: 800 };
const CARD = { width: 280, height: 200 };

describe("computePlacement", () => {
  it("places the card below the target when there is room", () => {
    const p = computePlacement({ top: 100, left: 300, width: 120, height: 40 }, CARD, VIEWPORT);
    // target bottom 140 + 16 gap
    expect(p.top).toBe(156);
    expect(p.left).toBe(300);
    expect(p.side).toBe("top");
  });

  it("flips above the target when there is no room below", () => {
    const p = computePlacement({ top: 700, left: 300, width: 120, height: 40 }, CARD, VIEWPORT);
    // target top 700 - 200 card - 16 gap
    expect(p.top).toBe(484);
    expect(p.side).toBe("bottom");
  });

  it("clamps the card into the viewport when it fits on neither side", () => {
    // This is the v1 bug: 350px card, 420px viewport, target mid-screen. v1
    // returned top: 216, putting the footer buttons 146px below the fold while
    // page scroll was locked.
    const tall = { width: 280, height: 350 };
    const small = { width: 400, height: 420 };
    const p = computePlacement({ top: 150, left: 20, width: 100, height: 50 }, tall, small);
    expect(p.top).toBe(420 - 350 - SIDE_MARGIN);
    expect(p.top + tall.height).toBeLessThanOrEqual(small.height);
  });

  it("pins to the top edge when the card is taller than the viewport", () => {
    const p = computePlacement(
      { top: 10, left: 10, width: 50, height: 20 },
      { width: 280, height: 900 },
      VIEWPORT
    );
    expect(p.top).toBe(SIDE_MARGIN);
  });

  it("clamps horizontally at both viewport edges", () => {
    const right = computePlacement({ top: 10, left: 980, width: 20, height: 20 }, CARD, VIEWPORT);
    expect(right.left).toBe(VIEWPORT.width - CARD.width - SIDE_MARGIN);

    const left = computePlacement({ top: 10, left: -50, width: 20, height: 20 }, CARD, VIEWPORT);
    expect(left.left).toBe(SIDE_MARGIN);
  });

  it("points the arrow at the target's centre", () => {
    const p = computePlacement({ top: 100, left: 300, width: 120, height: 40 }, CARD, VIEWPORT);
    // centre 360, card left 300
    expect(p.arrowOffset).toBe(60);
  });

  it("keeps the arrow inside the card's own edges", () => {
    // Target centre far left of the clamped card: arrow would land at -240.
    const p = computePlacement({ top: 10, left: 980, width: 20, height: 20 }, CARD, VIEWPORT);
    expect(p.arrowOffset).toBeGreaterThanOrEqual(SIDE_MARGIN);
    expect(p.arrowOffset).toBeLessThanOrEqual(CARD.width - SIDE_MARGIN);
  });

  it("tucks the arrow near the leading edge for targets wider than the card", () => {
    const p = computePlacement({ top: 100, left: 0, width: 900, height: 40 }, CARD, VIEWPORT);
    expect(p.arrowOffset).toBe(CARD.width / 10);
  });

  it("centres the card and drops the arrow with no target", () => {
    const p = computePlacement(null, CARD, VIEWPORT);
    expect(p.left).toBe((VIEWPORT.width - CARD.width) / 2);
    expect(p.top).toBe((VIEWPORT.height - CARD.height) / 2);
    expect(p.side).toBe("none");
    expect(p.arrowOffset).toBe(0);
  });

  it("respects a custom gap", () => {
    const a = computePlacement({ top: 100, left: 0, width: 10, height: 40 }, CARD, VIEWPORT);
    const b = computePlacement({ top: 100, left: 0, width: 10, height: 40 }, CARD, VIEWPORT, 40);
    expect(b.top - a.top).toBe(40 - GAP);
  });
});

describe("computeHighlight", () => {
  it("returns the target's own box", () => {
    const rect = { top: 5, left: 6, width: 7, height: 8 };
    expect(computeHighlight(rect, VIEWPORT)).toEqual(rect);
  });

  it("collapses to a point at the viewport centre with no target", () => {
    expect(computeHighlight(null, VIEWPORT)).toEqual({
      top: 399.5,
      left: 499.5,
      width: 1,
      height: 1,
    });
  });
});
