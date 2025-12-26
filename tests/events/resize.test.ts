/*
  Tests resize handler behavior that toggles transition classes and triggers UI sync.
  Prevents regressions where resize leaves transition-disabling classes behind.
*/
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { syncUISpy } = vi.hoisted(() => ({
  syncUISpy: vi.fn(),
}));

vi.mock("@stepflow/effects", () => ({ syncUI: syncUISpy }));

import { handleResize } from "@stepflow/events/resize";

describe("handleResize", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="sf-highlight"></div>
      <div class="sf-tooltip"></div>
    `;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    syncUISpy.mockClear();
    document.body.innerHTML = "";
  });

  it("adds and removes transition-disabling classes around resize", () => {
    const highlight = document.querySelector(".sf-highlight");
    const tooltip = document.querySelector(".sf-tooltip");

    handleResize(null);

    expect(syncUISpy).toHaveBeenCalledWith(null);
    expect(highlight?.classList.contains("sf-no-transition")).toBe(true);
    expect(tooltip?.classList.contains("sf-no-transition")).toBe(true);

    // After the debounce timeout, transition classes should be removed.
    vi.runAllTimers();

    expect(highlight?.classList.contains("sf-no-transition")).toBe(false);
    expect(tooltip?.classList.contains("sf-no-transition")).toBe(false);
  });
});
