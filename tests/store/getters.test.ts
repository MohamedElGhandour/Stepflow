import { useGetters } from "@stepflow/store/getters";
import { State } from "@stepflow/store/state";
import { getElement } from "@stepflow/utils/helpers";

jest.mock("../../src/lib/core", () => ({
  derive: jest.fn((fn) => ({ val: fn() })),
}));
jest.mock("@stepflow/utils/helpers", () => ({
  getElement: jest.fn(),
}));

describe("useGetters", () => {
  let mockState: State;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      showOverlay: false,
      target: "",
      content: {},
      steps: [
        { target: "#step1", content: { header: "Step 1", body: "First" } },
        { target: "#step2", content: { header: "Step 2", body: "Second" } },
        { target: "#step3", content: { header: "Step 3", body: "Third" } }, // Added third step
      ],
      stepsLength: 3,
      currentStepIndex: { val: 0 },
      status: { val: "idle" },
      error: { val: null },
      config: {
        steps: [
          { target: "#step1", content: { header: "Step 1", body: "First" } },
          { target: "#step2", content: { header: "Step 2", body: "Second" } },
          { target: "#step3", content: { header: "Step 3", body: "Third" } },
        ],
      },
    } as unknown as State;
    (getElement as jest.Mock).mockReturnValue(null);
  });

  it("returns getters for first step", () => {
    const getters = useGetters(mockState);
    expect(getters.currentStep.val).toEqual({
      target: "#step1",
      content: { header: "Step 1", body: "First" },
    });
    expect(getters.currentStepIndexDisplay.val).toBe(1);
    expect(getters.isFirstStep.val).toBe(true);
    expect(getters.isLastStep.val).toBe(false);
    expect(getters.showPrev.val).toBe(false);
    expect(getters.showCancel.val).toBe(false);
    expect(getters.currentTarget.val).toBe("#step1");
    expect(getters.currentTargetElement.val).toBeNull();
    expect(getters.header.val).toBe("Step 1");
    expect(getters.body.val).toBe("First");
  });

  it("updates for last step", () => {
    mockState.currentStepIndex.val = 2;
    const getters = useGetters(mockState);
    expect(getters.currentStep.val).toEqual({
      target: "#step3",
      content: { header: "Step 3", body: "Third" },
    });
    expect(getters.currentStepIndexDisplay.val).toBe(3);
    expect(getters.isFirstStep.val).toBe(false);
    expect(getters.isLastStep.val).toBe(true);
    expect(getters.currentTarget.val).toBe("#step3");
    expect(getters.header.val).toBe("Step 3");
  });

  it("shows prev and cancel buttons when configured", () => {
    mockState.config.buttons = {
      prev: { visible: true },
      cancel: { visible: true },
    };
    mockState.currentStepIndex.val = 1; // Middle step (0, 1, 2)
    const getters = useGetters(mockState);

    expect(getters.isFirstStep.val).toBe(false); // Index 1 != 0
    expect(getters.isLastStep.val).toBe(false); // 2 != 3
    expect(getters.showPrev.val).toBe(true); // visible && !isFirstStep
    expect(getters.showCancel.val).toBe(true); // visible && !isLastStep
  });

  it("hides prev on first step and cancel on last step", () => {
    mockState.config.buttons = {
      prev: { visible: true },
      cancel: { visible: true },
    };
    mockState.currentStepIndex.val = 0; // First step
    const gettersFirst = useGetters(mockState);
    expect(gettersFirst.showPrev.val).toBe(false);
    expect(gettersFirst.showCancel.val).toBe(true);

    mockState.currentStepIndex.val = 2; // Last step
    const gettersLast = useGetters(mockState);
    expect(gettersLast.showPrev.val).toBe(true);
    expect(gettersLast.showCancel.val).toBe(false);
  });

  it("returns DOM element when present", () => {
    (getElement as jest.Mock).mockReturnValue({ id: "step1" });
    const getters = useGetters(mockState);
    expect(getters.currentTargetElement.val).toEqual({ id: "step1" });
  });
});
