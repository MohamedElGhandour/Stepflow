import { tags } from "@stepflow/lib/dom";
import { getStore } from "@stepflow/store";
import { classNames } from "@stepflow/utils/helpers";
import highlightUI from "@stepflow/Components/highlight";

jest.mock("@stepflow/lib/dom", () => ({
  tags: {
    div: jest.fn((attrs) => ({
      tagName: "div",
      attributes: attrs,
    })),
  },
}));

jest.mock("@stepflow/store", () => ({
  getStore: jest.fn(),
}));

jest.mock("@stepflow/utils/helpers", () => ({
  classNames: jest.fn(),
}));

describe("highlightUI", () => {
  const mockDiv = tags.div as jest.Mock;
  const mockGetStore = getStore as jest.Mock;
  const mockClassNames = classNames as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a div with default class when showOverlay is true", () => {
    const storeState = { showOverlay: true };
    mockGetStore.mockReturnValue(storeState);

    const expectedClassName = "stepflow-highlight";
    mockClassNames.mockImplementation((baseClass, condition) => {
      if (baseClass === "stepflow-highlight" && condition === false) {
        return expectedClassName;
      }
      return `unexpected call: ${baseClass}, ${condition}`;
    });

    const result = highlightUI();

    expect(mockGetStore).toHaveBeenCalledTimes(1);
    expect(mockClassNames).toHaveBeenCalledTimes(1);
    expect(mockClassNames).toHaveBeenCalledWith("stepflow-highlight", false);
    expect(mockDiv).toHaveBeenCalledTimes(1);
    expect(mockDiv).toHaveBeenCalledWith({ class: expectedClassName });
    expect(result).toEqual({
      tagName: "div",
      attributes: { class: expectedClassName },
    });
  });

  it("should create a div with no-shadow class when showOverlay is false", () => {
    const storeState = { showOverlay: false };
    mockGetStore.mockReturnValue(storeState);

    const expectedClassName = "stepflow-highlight stepflow-no-shadow";
    mockClassNames.mockImplementation((baseClass, conditionalClass) => {
      if (baseClass === "stepflow-highlight" && conditionalClass === "stepflow-no-shadow") {
        return expectedClassName;
      }
      return `unexpected call: ${baseClass}, ${conditionalClass}`;
    });

    const result = highlightUI();

    expect(mockGetStore).toHaveBeenCalledTimes(1);
    expect(mockClassNames).toHaveBeenCalledTimes(1);
    expect(mockClassNames).toHaveBeenCalledWith("stepflow-highlight", "stepflow-no-shadow");
    expect(mockDiv).toHaveBeenCalledTimes(1);
    expect(mockDiv).toHaveBeenCalledWith({ class: expectedClassName });
    expect(result).toEqual({
      tagName: "div",
      attributes: { class: expectedClassName },
    });
  });
});
