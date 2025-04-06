import { Getters, useGetters } from "@stepflow/store/getters";
import { State } from "@stepflow/store/state";
import { getElement } from "@stepflow/utils";

jest.mock("@stepflow/lib/core", () => ({
  derive: jest.fn((fn) => ({
    get val() {
      return fn();
    },
  })),
}));
jest.mock("@stepflow/utils", () => ({
  getElement: jest.fn(),
}));

describe("useGetters", () => {
  let mockState: State;
  let getters: Getters;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      steps: [
        { target: "#step1", content: { header: "Step 1 Header", body: "Step 1 Body" } },
        { target: "#step2", content: { header: "Step 2 Header", body: "Step 2 Body" } },
      ],
      stepsLength: 2,
      currentStepIndex: { val: 0 },
      config: {
        steps: [],
        buttons: { prev: { visible: true }, cancel: { visible: true } },
      },
    } as unknown as State;
    (getElement as jest.Mock).mockReturnValue({} as HTMLElement);
    getters = useGetters(mockState);
  });

  describe("currentStep", () => {
    it("returns the current step based on index", () => {
      expect(getters.currentStep.val).toEqual(mockState.steps[0]);
      mockState.currentStepIndex.val = 1;
      expect(getters.currentStep.val).toEqual(mockState.steps[1]);
    });
  });

  describe("currentStepIndexDisplay", () => {
    it("returns 1-based index", () => {
      expect(getters.currentStepIndexDisplay.val).toBe(1);
      mockState.currentStepIndex.val = 1;
      expect(getters.currentStepIndexDisplay.val).toBe(2);
    });
  });

  describe("isFirstStep", () => {
    it("returns true for first step", () => {
      expect(getters.isFirstStep.val).toBe(true);
      mockState.currentStepIndex.val = 1;
      expect(getters.isFirstStep.val).toBe(false);
    });
  });

  describe("isLastStep", () => {
    it("returns true for last step", () => {
      expect(getters.isLastStep.val).toBe(false);
      mockState.currentStepIndex.val = 1;
      expect(getters.isLastStep.val).toBe(true);
    });
  });

  describe("showPrev", () => {
    it("shows prev button when not first step and configured", () => {
      expect(getters.showPrev.val).toBe(false); // First step
      mockState.currentStepIndex.val = 1;
      expect(getters.showPrev.val).toBe(true);
    });

    it("hides prev button if not configured", () => {
      mockState.config.buttons!.prev!.visible = false;
      mockState.currentStepIndex.val = 1;
      expect(getters.showPrev.val).toBe(false);
    });
  });

  describe("showCancel", () => {
    it("shows cancel button when not last step and configured", () => {
      expect(getters.showCancel.val).toBe(true);
      mockState.currentStepIndex.val = 1;
      expect(getters.showCancel.val).toBe(false); // Last step
    });

    it("hides cancel button if not configured", () => {
      mockState.config.buttons!.cancel!.visible = false;
      expect(getters.showCancel.val).toBe(false);
    });
  });

  describe("currentTarget", () => {
    it("returns the target of the current step", () => {
      expect(getters.currentTarget.val).toBe("#step1");
      mockState.currentStepIndex.val = 1;
      expect(getters.currentTarget.val).toBe("#step2");
    });
  });

  describe("currentTargetElement", () => {
    it("returns the DOM element for the current target", () => {
      expect(getters.currentTargetElement.val).toEqual({});
      expect(getElement).toHaveBeenCalledWith("#step1");
      (getElement as jest.Mock).mockClear(); // Clear previous calls
      mockState.currentStepIndex.val = 1;
      expect(getters.currentTargetElement.val).toEqual({}); // Trigger re-evaluation
      expect(getElement).toHaveBeenCalledWith("#step2");
    });

    it("returns null if element not found", () => {
      (getElement as jest.Mock).mockReturnValue(null);
      getters = useGetters(mockState);
      expect(getters.currentTargetElement.val).toBeNull();
    });
  });

  describe("header", () => {
    it("returns the header of the current step", () => {
      expect(getters.header.val).toBe("Step 1 Header");
      mockState.currentStepIndex.val = 1;
      expect(getters.header.val).toBe("Step 2 Header");
    });
  });

  describe("body", () => {
    it("returns the body of the current step", () => {
      expect(getters.body.val).toBe("Step 1 Body");
      mockState.currentStepIndex.val = 1;
      expect(getters.body.val).toBe("Step 2 Body");
    });
  });
});
