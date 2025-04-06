import { useHooks } from "../../src/store/useHooks";
import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { updateUIPositions } from "../../src/effects/updateUIPositions";
import { setHighlightStyle } from "@stepflow/utils/helpers";
import * as storeModule from "@stepflow/store/index";
import * as appModule from "@stepflow/components/app";
import { keyboardControls } from "../../src/events/keyboardControls";

jest.mock("@stepflow/store/useErrorHandler", () => ({
  useErrorHandler: jest.fn(async (state, fn) => await fn()),
}));
jest.mock("../../src/effects/updateUIPositions", () => ({
  handleResize: jest.fn(),
  keyboardControls: jest.fn(),
  updateUIPositions: jest.fn(),
}));
jest.mock("@stepflow/utils/helpers", () => ({
  setHighlightStyle: jest.fn(),
}));
jest.mock("@stepflow/store/index", () => ({
  destroy: jest.fn(),
}));
jest.mock("@stepflow/components/app", () => ({
  render: jest.fn(),
}));

describe("useHooks", () => {
  let mockState: State;
  let mockGetters: Getters;
  let mockSteps: ReturnType<(typeof import("../../src/store/useNavigation"))["useNavigation"]>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      status: { val: "idle" },
      config: { steps: [{ target: "#step1", content: {} }] },
      highlightBorderColor: "#ff0000",
      overlayOpacity: 0.5,
    } as unknown as State;
    mockGetters = {
      currentStep: { val: { target: "#step1", content: {} } },
      currentTargetElement: { val: null },
    } as unknown as Getters;
    mockSteps = {
      nextStep: jest.fn(),
      prevStep: jest.fn(),
    };
    jest.spyOn(document.body.classList, "add").mockImplementation(() => {});
    jest.spyOn(document.body.classList, "remove").mockImplementation(() => {});
    jest.spyOn(window, "addEventListener").mockImplementation(() => {});
    jest.spyOn(window, "removeEventListener").mockImplementation(() => {});
    jest.spyOn(document, "addEventListener").mockImplementation(() => {});
    jest.spyOn(document, "removeEventListener").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("start initializes ui and sets active status", async () => {
    const { start } = useHooks(mockState, mockGetters, mockSteps);
    await start();
    expect(mockState.status.val).toBe("active");
    expect(document.body.classList.add).toHaveBeenCalledWith("stepflow-overflow-hidden");
    expect(window.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(appModule.render).toHaveBeenCalled();
    expect(updateUIPositions).toHaveBeenCalledWith(null);
    expect(setHighlightStyle).toHaveBeenCalledWith("#ff0000", 0.5);
  });

  it("start does nothing if not idle", async () => {
    mockState.status.val = "active";
    const { start } = useHooks(mockState, mockGetters, mockSteps);
    await start();
    expect(document.body.classList.add).not.toHaveBeenCalled();
  });

  it("complete sets status and cleans up", async () => {
    const onComplete = jest.fn();
    mockState.config.callbacks = { onComplete };
    const { complete } = useHooks(mockState, mockGetters, mockSteps);
    await complete();
    expect(mockState.status.val).toBe("completed");
    expect(onComplete).toHaveBeenCalledWith(mockGetters.currentStep.val);
    expect(document.body.classList.remove).toHaveBeenCalledWith("stepflow-overflow-hidden");
    expect(storeModule.destroy).toHaveBeenCalled();
  });

  it("cancel sets status and cleans up", async () => {
    const onCancel = jest.fn();
    mockState.config.callbacks = { onCancel };
    const { cancel } = useHooks(mockState, mockGetters, mockSteps);
    await cancel();
    expect(mockState.status.val).toBe("canceled");
    expect(onCancel).toHaveBeenCalledWith(mockGetters.currentStep.val);
    expect(document.body.classList.remove).toHaveBeenCalledWith("stepflow-overflow-hidden");
    expect(storeModule.destroy).toHaveBeenCalled();
  });

  it("adds keyboard controls with steps and cancel", async () => {
    mockState.config.options = { keyboardControls: true };
    const { start, cancel } = useHooks(mockState, mockGetters, mockSteps);
    await start();
    expect(document.addEventListener).toHaveBeenCalledWith("keyup", expect.any(Function));
    const keyUpHandler = (document.addEventListener as jest.Mock).mock.calls[0][1];
    await keyUpHandler({ key: "ArrowRight" });
    expect(keyboardControls).toHaveBeenCalledWith({ key: "ArrowRight" }, mockState.config, {
      prevStep: mockSteps.prevStep,
      nextStep: mockSteps.nextStep,
      cancel,
    });
  });
});
