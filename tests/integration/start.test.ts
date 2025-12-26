/*
  Integration tests for the public start() API.
  These ensure a consumer can initialize the tour, navigate steps, and clean up via UI actions.
*/
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { start } from "@stepflow/index";
import { destroy } from "@stepflow/store";
import { createStepflowConfig } from "../helpers/config";
import { createTarget, setupImmediateRaf } from "../helpers/dom";

describe("start", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    setupImmediateRaf();
    vi.useFakeTimers();
    createTarget("stepflow-target-1", { top: 40, left: 20, width: 120, height: 50 }).style.position =
      "fixed";
    createTarget("stepflow-target-2", { top: 140, left: 50, width: 150, height: 60 }).style.position =
      "fixed";
  });

  afterEach(() => {
    destroy();
    vi.runAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("mounts the UI and navigates between steps via buttons", async () => {
    await start(
      createStepflowConfig({
        buttons: { cancel: { visible: true }, prev: { visible: true } },
      })
    );

    const root = document.querySelector(".sf-root");
    const overlay = document.querySelector(".sf-overlay");
    const highlight = document.querySelector(".sf-highlight");
    const tooltip = document.querySelector(".sf-tooltip");

    expect(root).not.toBeNull();
    expect(overlay).not.toBeNull();
    expect(highlight).not.toBeNull();
    expect(tooltip).not.toBeNull();
    expect(document.body.classList.contains("sf-overflow-hidden")).toBe(true);

    const header = document.querySelector(".sf-content h3");
    expect(header?.textContent).toContain("First step");

    const nextButton = document.querySelector(".sf-btn-next");
    nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // Flush async navigation (event handler returns a promise + state timers).
    await vi.runAllTimersAsync();

    const nextHeader = document.querySelector(".sf-content h3");
    expect(nextHeader?.textContent).toContain("Second step");
    // On the last step, the next button should be replaced by the complete button.
    expect(document.querySelector(".sf-btn-done")).not.toBeNull();
  });

  it("cleans up the UI when the tour is completed", async () => {
    await start(createStepflowConfig());

    document.querySelector(".sf-btn-next")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // Advance to the last step before expecting the complete button.
    await vi.runAllTimersAsync();

    document.querySelector(".sf-btn-done")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    // Allow cleanup to finish (cleanupUI -> destroy).
    await vi.runAllTimersAsync();

    expect(document.querySelector(".sf-root")).toBeNull();
    expect(document.body.classList.contains("sf-overflow-hidden")).toBe(false);
  });
});
