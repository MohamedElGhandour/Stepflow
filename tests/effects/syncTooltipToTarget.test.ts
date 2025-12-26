/*
  Tests tooltip positioning behavior for both target-based and fallback scenarios.
  These prevent regressions where tooltips fail to appear or lose arrow alignment.
*/
import { syncTooltipToTarget } from "@stepflow/effects/syncTooltipToTarget";
import { beforeEach, describe, expect, it } from "vitest";
import { createTarget, setElementRect, setElementSize } from "../helpers/dom";

describe("syncTooltipToTarget", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    Object.defineProperty(globalThis, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(globalThis, "innerHeight", { value: 600, configurable: true });
    Object.defineProperty(globalThis, "scrollX", { value: 0, configurable: true });
    Object.defineProperty(globalThis, "scrollY", { value: 0, configurable: true });
  });

  it("positions and shows the tooltip when the target exists (no-transition mode)", () => {
    const target = createTarget("target", { top: 100, left: 200, width: 120, height: 40 });
    const tooltip = document.createElement("div");
    tooltip.classList.add("no-transition");
    setElementSize(tooltip, 200, 80);

    syncTooltipToTarget(target, tooltip);

    expect(tooltip.classList.contains("sf-visible")).toBe(true);
    expect(tooltip.style.left.endsWith("px")).toBe(true);
    expect(tooltip.style.top.endsWith("px")).toBe(true);
    // Tooltip should have arrow classes for directional cues.
    expect(
      tooltip.classList.contains("sf-arrow-top") || tooltip.classList.contains("sf-arrow-bottom")
    ).toBe(true);
  });

  it("centers the tooltip and clears arrow styles when no target is provided", () => {
    const tooltip = document.createElement("div");
    tooltip.classList.add("sf-arrow-top", "sf-arrow-bottom", "no-transition");
    setElementSize(tooltip, 160, 90);
    setElementRect(tooltip, { top: 0, left: 0, width: 160, height: 90 });

    syncTooltipToTarget(null, tooltip);

    expect(tooltip.classList.contains("sf-visible")).toBe(true);
    expect(tooltip.classList.contains("sf-arrow-top")).toBe(false);
    expect(tooltip.classList.contains("sf-arrow-bottom")).toBe(false);
    expect(tooltip.style.getPropertyValue("--arrow-offset")).toBe("0px");
  });
});
