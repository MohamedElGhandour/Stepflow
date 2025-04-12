/**
 * Applies the calculated position and size to the highlight element based on the target element's absolute dimensions.
 *
 * @param {HTMLElement} highlightEl - The element used for highlighting.
 * @param {Element} target - The target element for which to compute positioning.
 */
export function syncHighlightToTarget(target: Element | null, highlightEl: HTMLElement) {
  if (!target) {
    fallback(highlightEl);
    return;
  }
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

function fallback(highlightEl: HTMLElement) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate center of the viewport
  const centerX = scrollX + viewportWidth / 2;
  const centerY = scrollY + viewportHeight / 2;

  // Since the highlight is 1px by 1px, subtract half of its dimensions to center it.
  highlightEl.style.top = `${centerY - 0.5}px`;
  highlightEl.style.left = `${centerX - 0.5}px`;
  highlightEl.style.width = "1px";
  highlightEl.style.height = "1px";
  highlightEl.style.borderRadius = "0"; // Reset border radius since there's no target
}
