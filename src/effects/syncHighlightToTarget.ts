/**
 * Applies the calculated position and size to the highlight element based on the target element's absolute dimensions.
 *
 * @param {HTMLElement} highlightEl - The element used for highlighting.
 * @param {Element} target - The target element for which to compute positioning.
 */
export function syncHighlightToTarget(target: Element, highlightEl: HTMLElement) {
  const absoluteRect = getAbsoluteRect(target);
  const { borderRadius } = window.getComputedStyle(target);
  highlightEl.style.top = `${absoluteRect.top}px`;
  highlightEl.style.left = `${absoluteRect.left}px`;
  highlightEl.style.width = `${absoluteRect.width}px`;
  highlightEl.style.height = `${absoluteRect.height}px`;
  highlightEl.style.borderRadius = borderRadius;
}

/** Calculate the absolute position and dimensions of the target element. */
function getAbsoluteRect(target: Element) {
  const rect = target.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
  };
}
