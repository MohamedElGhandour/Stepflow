import { overlayUI } from "../../src/components/overlay";
import { getStore } from "@stepflow/store";
import { tags } from "@stepflow/lib/dom";
import { classNames, vIf } from "@stepflow/utils/helpers";

jest.mock("@stepflow/store", () => ({
  getStore: jest.fn(),
}));
jest.mock("@stepflow/lib/dom", () => ({
  tags: {
    div: jest.fn(),
  },
}));
jest.mock("@stepflow/utils/helpers", () => ({
  classNames: jest.fn((...classes: (string | false | undefined | null)[]) =>
    classes.filter(Boolean).join(" ")
  ),
  vIf: jest.fn(
    (condition: () => boolean, content: () => Node) => () =>
      condition() ? content() : new Text("")
  ),
}));

describe("overlayUI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders overlay with showOverlay true and overlayCloseOnClick false", () => {
    (getStore as jest.Mock).mockReturnValue({
      showOverlay: true,
      cancel: jest.fn(),
      overlayCloseOnClick: false,
    });
    const mockDiv = { className: "stepflow-overlay" };
    (tags.div as jest.Mock).mockReturnValue(mockDiv);

    const resultFn = overlayUI();
    const result = resultFn();

    expect(getStore).toHaveBeenCalled();
    expect(classNames).toHaveBeenCalledWith("stepflow-overlay", false);
    expect(vIf).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
    expect(tags.div).toHaveBeenCalledWith({
      className: "stepflow-overlay",
      onclick: expect.any(Function),
    });
    expect(result).toEqual(mockDiv);
  });

  it("renders overlay with showOverlay true and overlayCloseOnClick true", () => {
    (getStore as jest.Mock).mockReturnValue({
      showOverlay: true,
      cancel: jest.fn(),
      overlayCloseOnClick: true,
    });
    const mockDiv = { className: "stepflow-overlay stepflow-cursor-pointer" };
    (tags.div as jest.Mock).mockReturnValue(mockDiv);

    const resultFn = overlayUI();
    const result = resultFn();

    expect(classNames).toHaveBeenCalledWith("stepflow-overlay", "stepflow-cursor-pointer");
    expect(tags.div).toHaveBeenCalledWith({
      className: "stepflow-overlay stepflow-cursor-pointer",
      onclick: expect.any(Function),
    });
    expect(result).toEqual(mockDiv);
  });

  it("returns empty Text node when showOverlay is false", () => {
    (getStore as jest.Mock).mockReturnValue({
      showOverlay: false,
      cancel: jest.fn(),
      overlayCloseOnClick: false,
    });

    const resultFn = overlayUI();
    const result = resultFn();

    expect(getStore).toHaveBeenCalled();
    expect(vIf).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
    expect(tags.div).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Text);
    expect(result.textContent).toBe("");
  });

  it("assumes store is always initialized by start", () => {
    (getStore as jest.Mock).mockReturnValue({
      showOverlay: false, // Minimum valid store
      cancel: jest.fn(),
      overlayCloseOnClick: false,
    });

    const resultFn = overlayUI();
    const result = resultFn();

    expect(getStore).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Text);
  });
});
