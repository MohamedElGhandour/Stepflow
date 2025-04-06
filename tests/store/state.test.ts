import { State, useState } from "@stepflow/store/state";
import { StepflowConfig } from "@stepflow/types";

jest.mock("@stepflow/lib/core", () => ({
  state: jest.fn((initial) => ({ val: initial })),
}));

describe("useState", () => {
  let config: StepflowConfig;
  let store: State;

  beforeEach(() => {
    jest.clearAllMocks();
    config = {
      steps: [{ target: "#step1", content: { header: "Step 1", body: "Body 1" } }],
      buttons: {
        prev: { label: "Back", className: "prev-btn", ariaLabel: "Previous step" },
        cancel: { label: "Cancel", className: "cancel-btn", ariaLabel: "Cancel tour" },
        next: { label: "Next", className: "next-btn", ariaLabel: "Next step" },
        complete: { label: "Finish", className: "complete-btn", ariaLabel: "Complete tour" },
      },
      options: {
        overlay: { enabled: true, opacity: 0.5, closeOnClick: true },
        highlightBorderColor: "#ff0000",
        transitions: { smoothScroll: true, animationDuration: 300 },
      },
    };
    store = useState(config);
  });

  describe("configuration and options", () => {
    it("sets steps and stepsLength", () => {
      expect(store.steps).toEqual(config.steps);
      expect(store.stepsLength).toBe(1);
    });

    it("sets config", () => {
      expect(store.config).toEqual(config);
    });

    it("sets overlay options", () => {
      expect(store.showOverlay).toBe(true);
      expect(store.overlayOpacity).toBe(0.5);
      expect(store.overlayCloseOnClick).toBe(true);
    });

    it("sets highlight and transition options", () => {
      expect(store.highlightBorderColor).toBe("#ff0000");
      expect(store.smoothScroll).toBe(true);
      expect(store.animationDuration).toBe(300);
    });
  });

  describe("button configuration", () => {
    it("sets prev button options", () => {
      expect(store.prevLabel).toBe("Back");
      expect(store.prevClassName).toBe("prev-btn");
      expect(store.prevAriaLabel).toBe("Previous step");
    });

    it("sets cancel button options", () => {
      expect(store.cancelLabel).toBe("Cancel");
      expect(store.cancelClassName).toBe("cancel-btn");
      expect(store.cancelAriaLabel).toBe("Cancel tour");
    });

    it("sets next button options", () => {
      expect(store.nextLabel).toBe("Next");
      expect(store.nextClassName).toBe("next-btn");
      expect(store.nextAriaLabel).toBe("Next step");
    });

    it("sets complete button options", () => {
      expect(store.completeLabel).toBe("Finish");
      expect(store.completeClassName).toBe("complete-btn");
      expect(store.completeAriaLabel).toBe("Complete tour");
    });
  });

  describe("reactive state", () => {
    it("initializes currentStepIndex", () => {
      expect(store.currentStepIndex.val).toBe(0);
    });

    it("initializes status", () => {
      expect(store.status.val).toBe("idle");
    });

    it("initializes directionState", () => {
      expect(store.directionState.val).toBe("forward");
    });

    it("initializes error", () => {
      expect(store.error.val).toBeNull();
    });
  });

  describe("defaults and edge cases", () => {
    it("handles missing button config", () => {
      const minimalConfig: StepflowConfig = { steps: [{ target: "#step1", content: {} }] };
      const minimalStore = useState(minimalConfig);
      expect(minimalStore.prevLabel).toBeUndefined();
      expect(minimalStore.cancelClassName).toBe("");
      expect(minimalStore.nextAriaLabel).toBe("");
      expect(minimalStore.completeClassName).toBeUndefined();
    });

    it("handles missing overlay and transition options", () => {
      const minimalConfig: StepflowConfig = { steps: [{ target: "#step1", content: {} }] };
      const minimalStore = useState(minimalConfig);
      expect(minimalStore.showOverlay).toBe(false);
      expect(minimalStore.overlayOpacity).toBeUndefined();
      expect(minimalStore.overlayCloseOnClick).toBe(false);
      expect(minimalStore.smoothScroll).toBe(false);
      expect(minimalStore.animationDuration).toBeUndefined();
    });

    it("handles empty steps array", () => {
      const emptyConfig: StepflowConfig = { steps: [] };
      const emptyStore = useState(emptyConfig);
      expect(emptyStore.steps).toEqual([]);
      expect(emptyStore.stepsLength).toBe(0);
    });
  });
});
