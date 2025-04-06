import { useNavigation } from "../../src/store/useNavigation";
import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { updateUIPositions } from "../../src/effects/updateUIPositions";

jest.mock("../../src/lib/core", () => ({
  derive: jest.fn((fn) => ({ val: fn() })),
}));
jest.mock("../../src/effects/updateUIPositions", () => ({
  updateUIPositions: jest.fn(),
}));
jest.mock("../../src/store/useErrorHandler", () => ({
  executeWithErrorHandling: jest.fn(async (state, fn) => await fn()),
}));

describe("useNavigation", () => {
  let mockState: State;
  let mockGetters: Getters;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      steps: [
        { target: "#step1", content: {} },
        { target: "#step2", content: {} },
      ],
      stepsLength: 2,
      currentStepIndex: { val: 0 },
      config: {
        steps: [
          { target: "#step1", content: {} },
          { target: "#step2", content: {} },
        ],
        callbacks: {},
      },
    } as unknown as State;
    mockGetters = {
      isFirstStep: { val: true },
      isLastStep: { val: false },
      currentStep: { val: { target: "#step1", content: {} } },
      currentTargetElement: { val: null },
    } as unknown as Getters;
  });

  it("nextStep increments currentStepIndex", async () => {
    const { nextStep } = useNavigation(mockState, mockGetters);
    await nextStep();
    expect(mockState.currentStepIndex.val).toBe(1);
    expect(updateUIPositions).toHaveBeenCalledWith(null);
  });

  it("nextStep does nothing on last step", async () => {
    mockState.currentStepIndex.val = 1;
    mockGetters.isLastStep.val = true;
    const { nextStep } = useNavigation(mockState, mockGetters);
    await nextStep();
    expect(mockState.currentStepIndex.val).toBe(1);
  });

  it("prevStep decrements currentStepIndex", async () => {
    mockState.currentStepIndex.val = 1;
    mockGetters.isFirstStep.val = false;
    const { prevStep } = useNavigation(mockState, mockGetters);
    await prevStep();
    expect(mockState.currentStepIndex.val).toBe(0);
    expect(updateUIPositions).toHaveBeenCalledWith(null);
  });

  it("prevStep does nothing on first step", async () => {
    mockState.currentStepIndex.val = 0;
    mockGetters.isFirstStep.val = true;
    const { prevStep } = useNavigation(mockState, mockGetters);
    await prevStep();
    expect(mockState.currentStepIndex.val).toBe(0);
  });

  it("calls callbacks on nextStep", async () => {
    const localCallback = jest.fn();
    const globalCallback = jest.fn();
    mockState.config.callbacks = { onNext: globalCallback };
    mockGetters.currentStep.val.callbacks = { onNext: localCallback };
    const { nextStep } = useNavigation(mockState, mockGetters);
    await nextStep();
    expect(localCallback).toHaveBeenCalledWith(mockGetters.currentStep.val);
    expect(globalCallback).toHaveBeenCalledWith(mockGetters.currentStep.val);
  });
});
