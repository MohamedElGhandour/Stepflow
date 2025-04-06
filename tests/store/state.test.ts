import { useState } from "@stepflow/store/state";
import { StepflowConfig } from "@stepflow/types";
import { state } from "../../src/lib/core";

// Mock state from @stepflow/lib/dom
jest.mock("../../src/lib/core", () => ({
  state: jest.fn((initial) => initial), // Simple mock: returns initial value
}));

describe("useState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes state with minimal config", () => {
    const config: StepflowConfig = { steps: [] };
    const result = useState(config);

    expect(result).toEqual({
      smoothScroll: false,
      animationDuration: undefined,
      overlayOpacity: undefined,
      overlayCloseOnClick: false,
      highlightBorderColor: undefined,
      showOverlay: false,
      prevLabel: undefined,
      prevClassName: undefined,
      prevAriaLabel: undefined,
      cancelLabel: undefined,
      cancelClassName: "",
      cancelAriaLabel: "",
      nextLabel: undefined,
      nextClassName: "",
      nextAriaLabel: "",
      completeLabel: undefined,
      completeClassName: undefined,
      completeAriaLabel: undefined,
      currentStepIndex: 0,
      status: "idle",
      error: null,
      config,
      steps: [],
      stepsLength: 0,
    });
    expect(state).toHaveBeenCalledWith(0); // currentStepIndex
    expect(state).toHaveBeenCalledWith("idle"); // status
    expect(state).toHaveBeenCalledWith(null); // error
  });

  it("sets button configs when provided", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
      buttons: {
        prev: { label: "Back", className: "prev-btn", ariaLabel: "Previous" },
        next: { label: "Forward", className: "next-btn", ariaLabel: "Next" },
        cancel: { label: "Exit", className: "cancel-btn", ariaLabel: "Cancel" },
        complete: { label: "Done", className: "done-btn", ariaLabel: "Complete" },
      },
    };
    const result = useState(config);

    expect(result.prevLabel).toBe("Back");
    expect(result.prevClassName).toBe("prev-btn");
    expect(result.prevAriaLabel).toBe("Previous");
    expect(result.nextLabel).toBe("Forward");
    expect(result.nextClassName).toBe("next-btn");
    expect(result.nextAriaLabel).toBe("Next");
    expect(result.cancelLabel).toBe("Exit");
    expect(result.cancelClassName).toBe("cancel-btn");
    expect(result.cancelAriaLabel).toBe("Cancel");
    expect(result.completeLabel).toBe("Done");
    expect(result.completeClassName).toBe("done-btn");
    expect(result.completeAriaLabel).toBe("Complete");
    expect(result.stepsLength).toBe(1);
  });

  it("enables overlay and transition options", () => {
    const config: StepflowConfig = {
      steps: [],
      options: {
        overlay: { enabled: true, opacity: 0.5, closeOnClick: true },
        highlightBorderColor: "#ff0000",
        transitions: { smoothScroll: true, animationDuration: 300 },
      },
    };
    const result = useState(config);

    expect(result.showOverlay).toBe(true);
    expect(result.overlayOpacity).toBe(0.5);
    expect(result.overlayCloseOnClick).toBe(true);
    expect(result.highlightBorderColor).toBe("#ff0000");
    expect(result.smoothScroll).toBe(true);
    expect(result.animationDuration).toBe(300);
  });

  it("handles missing options gracefully", () => {
    const config: StepflowConfig = { steps: [{ target: "#step1", content: {} }] };
    const result = useState(config);

    expect(result.showOverlay).toBe(false);
    expect(result.overlayOpacity).toBeUndefined();
    expect(result.overlayCloseOnClick).toBe(false);
    expect(result.smoothScroll).toBe(false);
    expect(result.animationDuration).toBeUndefined();
  });
});
