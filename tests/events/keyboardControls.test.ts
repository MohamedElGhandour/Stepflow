/*
  Tests for keyboard navigation logic to prevent regressions in user input handling.
  They verify correct callback invocation based on configured options.
*/
import { describe, expect, it, vi } from "vitest";
import { keyboardControls } from "@stepflow/events/keyboardControls";
import { StepflowResolvedConfig } from "@stepflow/types";

const baseConfig: StepflowResolvedConfig = {
  steps: [],
  callbacks: {},
  buttons: {
    cancel: { visible: true, label: "Skip", className: "" },
    prev: { visible: true, label: "Back", className: "" },
    next: { label: "Next", className: "" },
    complete: { label: "Done", className: "" },
  },
  options: {
    keyboardControls: true,
    escapeToCancel: true,
    highlightBorderColor: "rgba(0,0,0,0.8)",
    overlay: { enabled: true, opacity: 0.3, closeOnClick: true },
    transitions: { scrollBehavior: "smooth", animationDuration: 300 },
  },
  progress: { type: "dots", position: "body" },
};

describe("keyboardControls", () => {
  it("invokes next/prev/cancel based on the pressed key", () => {
    const prevStep = vi.fn();
    const nextStep = vi.fn();
    const cancel = vi.fn();

    keyboardControls(new KeyboardEvent("keyup", { key: "ArrowRight" }), baseConfig, {
      prevStep,
      nextStep,
      cancel,
    });
    keyboardControls(new KeyboardEvent("keyup", { key: "ArrowLeft" }), baseConfig, {
      prevStep,
      nextStep,
      cancel,
    });
    keyboardControls(new KeyboardEvent("keyup", { key: "Escape" }), baseConfig, {
      prevStep,
      nextStep,
      cancel,
    });

    expect(nextStep).toHaveBeenCalledTimes(1);
    expect(prevStep).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the feature flags are disabled", () => {
    const prevStep = vi.fn();
    const nextStep = vi.fn();
    const cancel = vi.fn();
    const config = {
      ...baseConfig,
      options: { ...baseConfig.options, keyboardControls: false, escapeToCancel: false },
    };

    keyboardControls(new KeyboardEvent("keyup", { key: "ArrowRight" }), config, {
      prevStep,
      nextStep,
      cancel,
    });
    keyboardControls(new KeyboardEvent("keyup", { key: "Escape" }), config, {
      prevStep,
      nextStep,
      cancel,
    });

    expect(nextStep).not.toHaveBeenCalled();
    expect(cancel).not.toHaveBeenCalled();
  });
});
