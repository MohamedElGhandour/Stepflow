import { vi } from "vitest";

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
  right?: number;
  bottom?: number;
};

export function createTarget(id: string, rect: Rect): HTMLElement {
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  setElementRect(el, rect);
  return el;
}

export function setElementRect(el: Element, rect: Rect) {
  const resolvedRect = {
    right: rect.right ?? rect.left + rect.width,
    bottom: rect.bottom ?? rect.top + rect.height,
    ...rect,
  };

  Object.defineProperty(el, "getBoundingClientRect", {
    value: () => resolvedRect,
    configurable: true,
  });
}

export function setElementSize(el: Element, width: number, height: number) {
  Object.defineProperty(el, "offsetWidth", { value: width, configurable: true });
  Object.defineProperty(el, "offsetHeight", { value: height, configurable: true });
}

export function setupImmediateRaf() {
  const raf = vi.fn((callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal("requestAnimationFrame", raf);
  return raf;
}
