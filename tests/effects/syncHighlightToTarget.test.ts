/*
  Tests highlight positioning logic to ensure the overlay tracks targets correctly.
  This guards against regressions where the highlight doesn't size or position as expected.
*/
import { syncHighlightToTarget } from "@stepflow/effects/syncHighlightToTarget";
import { beforeEach, describe, expect, it } from "vitest";
import { createTarget } from "../helpers/dom";

describe("syncHighlightToTarget", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("syncs highlight position and size to the target element", () => {
    const target = createTarget("target", { top: 20, left: 30, width: 100, height: 50 });
    target.style.borderRadius = "6px";
    const highlight = document.createElement("div");

    syncHighlightToTarget(target, highlight);

    // Inline styles are deterministic and avoid layout-dependent assertions.
    expect(highlight.style.top).toBe("20px");
    expect(highlight.style.left).toBe("30px");
    expect(highlight.style.width).toBe("100px");
    expect(highlight.style.height).toBe("50px");
    expect(highlight.style.borderRadius).toBe("6px");
  });

  it("falls back to a 1px centered highlight when no target exists", () => {
    Object.defineProperty(globalThis, "innerWidth", { value: 100, configurable: true });
    Object.defineProperty(globalThis, "innerHeight", { value: 200, configurable: true });
    Object.defineProperty(globalThis, "scrollX", { value: 0, configurable: true });
    Object.defineProperty(globalThis, "scrollY", { value: 0, configurable: true });

    const highlight = document.createElement("div");

    syncHighlightToTarget(null, highlight);

    expect(highlight.style.width).toBe("1px");
    expect(highlight.style.height).toBe("1px");
    // happy-dom normalizes "0" to "0px" for CSS lengths, so accept either.
    expect(["0", "0px"]).toContain(highlight.style.borderRadius);
    // Centering logic should result in a numeric pixel value.
    expect(highlight.style.top.endsWith("px")).toBe(true);
    expect(highlight.style.left.endsWith("px")).toBe(true);
  });
});
