import { destroy, getStore, useStore } from "@stepflow/store";
import { StepflowConfig } from "@stepflow/types";
import { useState } from "@stepflow/store/state";
import { useGetters } from "@stepflow/store/getters";
import { useNavigation } from "../../src/store/useNavigation";
import { useHooks } from "../../src/store/useHooks";
import { mergeStepflowConfig } from "@stepflow/config";
import { validateStepflowConfig } from "@stepflow/validation";
import { getUIHandler } from "@stepflow/utils/helpers";

jest.mock("@stepflow/store/state", () => ({
  useState: jest.fn(),
}));
jest.mock("@stepflow/store/getters", () => ({
  useGetters: jest.fn(),
}));
jest.mock("../../src/store/useNavigation", () => ({
  useTourSteps: jest.fn(),
}));
jest.mock("../../src/store/useHooks", () => ({
  useLifecycle: jest.fn(),
}));
jest.mock("@stepflow/config", () => ({
  mergeStepflowConfig: jest.fn(),
}));
jest.mock("@stepflow/validation", () => ({
  validateStepflowConfig: jest.fn(),
}));
jest.mock("@stepflow/utils/helpers", () => ({
  getUIHandler: jest.fn(),
}));

describe("Store", () => {
  const mockConfig: StepflowConfig = {
    steps: [
      { target: "#step1", content: {} },
      { target: "#step2", content: {} },
    ],
  };
  const mockState = {
    showOverlay: false,
    steps: [
      { target: "#step1", content: {} },
      { target: "#step2", content: {} },
    ],
    stepsLength: 2,
    currentStepIndex: { val: 0 },
    status: { val: "idle" },
    error: { val: null },
    config: mockConfig,
  };
  const mockGetters = {
    currentStep: { val: { target: "#step1", content: {} } },
    currentStepIndexDisplay: { val: 1 },
    isFirstStep: { val: true },
    isLastStep: { val: false },
    showPrev: { val: false },
    showCancel: { val: false },
    currentTarget: { val: "#step1" },
    currentTargetElement: { val: null },
    header: { val: undefined },
    body: { val: undefined },
  };
  const mockActions = { nextStep: jest.fn(), prevStep: jest.fn() };
  const mockLifecycle = { start: jest.fn(), complete: jest.fn(), cancel: jest.fn() };
  const mockStore = { ...mockState, ...mockGetters, ...mockActions, ...mockLifecycle };

  beforeEach(() => {
    jest.clearAllMocks();
    (useState as jest.Mock).mockReturnValue(mockState);
    (useGetters as jest.Mock).mockReturnValue(mockGetters);
    (useNavigation as jest.Mock).mockReturnValue(mockActions);
    (useHooks as jest.Mock).mockReturnValue(mockLifecycle);
    (mergeStepflowConfig as jest.Mock).mockReturnValue(mockConfig);
    (validateStepflowConfig as jest.Mock).mockReturnValue(undefined);
    (getUIHandler as jest.Mock).mockReturnValue({ highlight: null, tooltip: null, app: null });
    destroy();
  });

  it("useStore initializes storeInstance with config", () => {
    useStore(mockConfig);
    expect(getStore()).toEqual(mockStore);
  });

  it("getStore returns storeInstance after initialization", () => {
    useStore(mockConfig);
    const store = getStore();
    expect(store.showOverlay).toBe(false);
    expect(typeof store.nextStep).toBe("function");
    expect(typeof store.start).toBe("function");
  });

  it("getStore throws before useStore", () => {
    expect(() => getStore()).toThrow("Store not initialized. Call start() first.");
  });

  it("destroy resets storeInstance and handles null app", () => {
    useStore(mockConfig);
    destroy();
    expect(() => getStore()).toThrow("Store not initialized. Call start() first.");
  });

  it("start updates status", async () => {
    useStore(mockConfig);
    const store = getStore();
    await store.start();
    expect(mockLifecycle.start).toHaveBeenCalled();
  });

  it("nextStep updates state", async () => {
    useStore(mockConfig);
    const store = getStore();
    (mockActions.nextStep as jest.Mock).mockImplementation(async () => {
      store.currentStepIndex.val = 1;
    });
    await store.nextStep();
    expect(mockState.currentStepIndex.val).toBe(1);
  });

  it("cancel updates status", async () => {
    useStore(mockConfig);
    const store = getStore();
    await store.cancel();
    expect(mockLifecycle.cancel).toHaveBeenCalled();
  });
});
