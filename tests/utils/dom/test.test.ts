import { syncUI } from "../../../src/effects/syncUI";
import { scrollToTarget } from "../../../src/effects/scrollToTarget";
import { syncHighlightToTarget } from "../../../src/effects/syncHighlightToTarget";
import { syncTooltipToTarget } from "../../../src/effects/syncTooltipToTarget";

jest.mock("../../../src/effects/scrollToTarget", () => ({
  scrollToTarget: jest.fn(),
}));
jest.mock("../../../src/effects/syncHighlightToTarget", () => ({
  syncHighlightToTarget: jest.fn(),
}));
jest.mock("../../../src/effects/syncTooltipToTarget", () => ({
  syncTooltipToTarget: jest.fn(),
}));

describe("syncUI", () => {
  let mockHighlightEl: HTMLElement;
  let mockTooltipEl: HTMLElement;
  let mockTarget: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHighlightEl = { style: {} } as HTMLElement;
    mockTooltipEl = { style: {} } as HTMLElement;
    mockTarget = {
      getBoundingClientRect: jest.fn(() => ({ top: 100, left: 200 })),
    } as unknown as HTMLElement;
  });

  it("does nothing if target is null", () => {
    syncUI(mockHighlightEl, mockTooltipEl, null);
    expect(scrollToTarget).not.toHaveBeenCalled();
    expect(syncHighlightToTarget).not.toHaveBeenCalled();
    expect(syncTooltipToTarget).not.toHaveBeenCalled();
  });

  it("does nothing if highlightEl is null", () => {
    syncUI(null, mockTooltipEl, mockTarget);
    expect(scrollToTarget).not.toHaveBeenCalled();
    expect(syncHighlightToTarget).not.toHaveBeenCalled();
    expect(syncTooltipToTarget).not.toHaveBeenCalled();
  });

  it("does nothing if tooltipEl is null", () => {
    syncUI(mockHighlightEl, null, mockTarget);
    expect(scrollToTarget).not.toHaveBeenCalled();
    expect(syncHighlightToTarget).not.toHaveBeenCalled();
    expect(syncTooltipToTarget).not.toHaveBeenCalled();
  });

  it("syncs ui positions with valid elements", () => {
    syncUI(mockHighlightEl, mockTooltipEl, mockTarget);
    expect(scrollToTarget).toHaveBeenCalledWith(mockTarget);
    expect(syncHighlightToTarget).toHaveBeenCalledWith(mockTarget, mockHighlightEl);
    expect(syncTooltipToTarget).toHaveBeenCalledWith(mockTarget, mockTooltipEl);
  });
});
