import { destroy, getStore, useStore } from "@stepflow/store/index";
import { StepflowConfig } from "@stepflow/types";
import { State, useState } from "@stepflow/store/state";
import { Getters, useGetters } from "@stepflow/store/getters";
import { useNavigation } from "@stepflow/store/useNavigation";
import { useHooks } from "@stepflow/store/useHooks";
import { useWatch } from "@stepflow/store/useWatch";
import { mergeStepflowConfig } from "@stepflow/config";
import { validateStepflowConfig } from "@stepflow/validation";
import { getUIHandler } from "@stepflow/helpers";

jest.mock("@stepflow/store/state");
jest.mock("@stepflow/store/getters");
jest.mock("@stepflow/store/useNavigation");
jest.mock("@stepflow/store/useHooks");
jest.mock("@stepflow/store/useWatch");
jest.mock("@stepflow/config");
jest.mock("@stepflow/validation");
jest.mock("@stepflow/helpers");

// Set up getUIHandler mock before any tests run
const mockApp = { remove: jest.fn() } as unknown as HTMLElement;
(getUIHandler as jest.Mock).mockReturnValue({ app: mockApp });

describe("store", () => {
  let mockConfig: StepflowConfig;
  let mockState: State;
  let mockGetters: Getters;
  let mockTourSteps: ReturnType<typeof useNavigation>;
  let mockLifecycle: ReturnType<typeof useHooks>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset storeInstance
    destroy();

    // Mock config
    mockConfig = {
      steps: [{ target: "#step1", content: { header: "Step 1", body: "Body 1" } }],
    };

    // Mock state
    mockState = {
      steps: mockConfig.steps,
      currentStepIndex: { val: 0 },
      status: { val: "idle" },
    } as unknown as State;
    (useState as jest.Mock).mockReturnValue(mockState);

    // Mock getters
    mockGetters = {
      currentStep: { val: mockConfig.steps[0] },
      isFirstStep: { val: true },
    } as unknown as Getters;
    (useGetters as jest.Mock).mockReturnValue(mockGetters);

    // Mock tourSteps
    mockTourSteps = {
      nextStep: jest.fn(),
      prevStep: jest.fn(),
    };
    (useNavigation as jest.Mock).mockReturnValue(mockTourSteps);

    // Mock lifecycle
    mockLifecycle = {
      start: jest.fn(),
      cancel: jest.fn(),
      complete: jest.fn(),
    };
    (useHooks as jest.Mock).mockReturnValue(mockLifecycle);

    // Mock useWatch
    (useWatch as jest.Mock).mockImplementation(() => {});

    // Mock config and validation
    (mergeStepflowConfig as jest.Mock).mockReturnValue(mockConfig);
    (validateStepflowConfig as jest.Mock).mockImplementation(() => {});
  });

  describe("useStore", () => {
    it("initializes the store with merged and validated config", () => {
      useStore(mockConfig);
      expect(mergeStepflowConfig).toHaveBeenCalledWith(mockConfig);
      expect(validateStepflowConfig).toHaveBeenCalledWith(mockConfig);
      expect(useState).toHaveBeenCalledWith(mockConfig);
      expect(useGetters).toHaveBeenCalledWith(mockState);
      expect(useNavigation).toHaveBeenCalledWith(mockState, mockGetters);
      expect(useHooks).toHaveBeenCalledWith(mockState, mockGetters, mockTourSteps);
      expect(useWatch).toHaveBeenCalledWith(mockState, mockGetters);
    });

    it("returns early if store is already initialized", () => {
      useStore(mockConfig); // First call
      const initialCallCount = (useState as jest.Mock).mock.calls.length;
      useStore(mockConfig); // Second call
      expect((useState as jest.Mock).mock.calls.length).toBe(initialCallCount); // No additional calls
    });

    it("composes state, getters, tourSteps, and lifecycle", () => {
      useStore(mockConfig);
      const storeInstance = getStore();
      expect(storeInstance).toHaveProperty("steps", mockConfig.steps);
      expect(storeInstance).toHaveProperty("currentStep", mockGetters.currentStep);
      expect(storeInstance).toHaveProperty("nextStep", mockTourSteps.nextStep);
      expect(storeInstance).toHaveProperty("start", mockLifecycle.start);
    });
  });

  describe("getStore", () => {
    it("returns the store instance if initialized", () => {
      useStore(mockConfig);
      const store = getStore();
      expect(store).toBeDefined();
      expect(store.steps).toEqual(mockConfig.steps);
    });

    it("throws if store is not initialized", () => {
      expect(() => getStore()).toThrow("Store not initialized. Call start() first.");
    });
  });

  describe("destroy", () => {
    it("removes the app and resets storeInstance", () => {
      useStore(mockConfig);
      destroy();
      expect(getUIHandler).toHaveBeenCalled();
      expect(mockApp.remove).toHaveBeenCalled();
      expect(() => getStore()).toThrow("Store not initialized. Call start() first.");
    });

    it("does nothing if app is not present", () => {
      (getUIHandler as jest.Mock).mockReturnValueOnce({ app: null });
      useStore(mockConfig);
      expect(() => destroy()).not.toThrow();
      expect(() => getStore()).toThrow("Store not initialized. Call start() first.");
    });
  });
});
