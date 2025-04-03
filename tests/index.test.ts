import { start } from "@stepflow/index";
import { getStore, useStore } from "@stepflow/store";
import { StepflowConfig } from "@stepflow/types";

jest.mock("@stepflow/styles/style.scss", () => ({}));
jest.mock("@stepflow/store", () => ({
  useStore: jest.fn(),
  getStore: jest.fn(),
}));

describe("start", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes store and starts tour with minimal config", async () => {
    const mockStart = jest.fn().mockResolvedValue(undefined);
    const mockStore = { start: mockStart };
    (useStore as jest.Mock).mockReturnValue(mockStore);
    (getStore as jest.Mock).mockReturnValue(mockStore);

    const config: StepflowConfig = { steps: [] };
    await start(config);

    expect(useStore).toHaveBeenCalledWith(config);
    expect(getStore).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });

  it("handles errors from start", async () => {
    const mockStart = jest.fn().mockRejectedValue(new Error("Start failed"));
    const mockStore = { start: mockStart };
    (useStore as jest.Mock).mockReturnValue(mockStore);
    (getStore as jest.Mock).mockReturnValue(mockStore);

    const config: StepflowConfig = { steps: [] };
    await expect(start(config)).rejects.toThrow("Start failed");
  });

  it("passes config without steps to store", async () => {
    const mockStart = jest.fn().mockResolvedValue(undefined);
    const mockStore = { start: mockStart };
    (useStore as jest.Mock).mockReturnValue(mockStore);
    (getStore as jest.Mock).mockReturnValue(mockStore);

    const config = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await start(config);

    expect(useStore).toHaveBeenCalledWith(config);
    expect(getStore).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });

  it("passes full config with optional fields", async () => {
    const mockStart = jest.fn().mockResolvedValue(undefined);
    const mockStore = { start: mockStart };
    (useStore as jest.Mock).mockReturnValue(mockStore);
    (getStore as jest.Mock).mockReturnValue(mockStore);

    const config: StepflowConfig = {
      steps: [{ target: "#el1", content: { body: "Step 1" } }],
      callbacks: { onStart: jest.fn() },
      buttons: { next: { label: "Next" } },
      options: { overlay: { enabled: true } },
      progress: { type: "dots" },
    };
    await start(config);

    expect(useStore).toHaveBeenCalledWith(config);
    expect(getStore).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });

  it("throws if store is uninitialized", async () => {
    (useStore as jest.Mock).mockReturnValue(null);
    (getStore as jest.Mock).mockReturnValue(null);

    const config: StepflowConfig = { steps: [] };
    await expect(start(config)).rejects.toThrow("Cannot read properties of null");
  });
});
