import { highlightUI } from "../../src/components/highlight";
import { getStore } from "@stepflow/store";
import { classNames } from "@stepflow/utils/helpers";
import { tags } from "../../src/lib/core"; // Mock dependencies

// Mock dependencies
jest.mock("@stepflow/store", () => ({
  getStore: jest.fn(),
}));
jest.mock("@stepflow/utils/helpers", () => ({
  classNames: jest.fn((...args) => args.filter(Boolean).join(" ")), // Real classNames behavior
}));
jest.mock("../../src/lib/core", () => ({
  tags: {
    div: jest.fn(),
  },
}));

describe("highlightUI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates highlight div with overlay enabled (showOverlay true)", () => {
    (getStore as jest.Mock).mockReturnValue({ showOverlay: true });
    const mockDiv = { className: "stepflow-highlight" };
    (tags.div as jest.Mock).mockReturnValue(mockDiv);

    const result = highlightUI();

    expect(getStore).toHaveBeenCalled();
    expect(classNames).toHaveBeenCalledWith("stepflow-highlight", false); // !true = false
    expect(tags.div).toHaveBeenCalledWith({ class: "stepflow-highlight" });
    expect(result).toEqual(mockDiv);
  });

  it("creates highlight div with overlay disabled (showOverlay false)", () => {
    (getStore as jest.Mock).mockReturnValue({ showOverlay: false });
    const mockDiv = { className: "stepflow-highlight stepflow-no-shadow" };
    (tags.div as jest.Mock).mockReturnValue(mockDiv);

    const result = highlightUI();

    expect(getStore).toHaveBeenCalled();
    expect(classNames).toHaveBeenCalledWith("stepflow-highlight", "stepflow-no-shadow"); // !false = true
    expect(tags.div).toHaveBeenCalledWith({ class: "stepflow-highlight stepflow-no-shadow" });
    expect(result).toEqual(mockDiv);
  });
});
