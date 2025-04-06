/**
 * To change the scroll of `window` after highlighting an element
 *
 */
export function useScrollTo(scrollPadding: number, targetElement: Element) {
  const rect = targetElement.getBoundingClientRect();

  if (!useElementVisibility(targetElement)) {
    const winHeight = useWindowSize().height;
    const top = rect.bottom - (rect.bottom - rect.top);

    if (top < 0 || targetElement.clientHeight > winHeight) {
      // Scroll up with smooth behavior
      window.scrollBy({
        top: rect.top - (winHeight / 2 - rect.height / 2) - scrollPadding,
        behavior: "smooth",
      });
    } else {
      // Scroll down with smooth behavior
      window.scrollBy({
        top: rect.top - (winHeight / 2 - rect.height / 2) + scrollPadding,
        behavior: "smooth",
      });
    }
  }
}

/**
 * Check to see if the element is in the viewport or not
 *
 */
function useElementVisibility(el: HTMLElement | Element): boolean {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom + 80 <= window.innerHeight && // add 80 to get the text right
    rect.right <= window.innerWidth
  );
}

/**
 * Provides a cross-browser way to get the screen dimensions
 *
 */
function useWindowSize(): { width: number; height: number } {
  if (window.innerWidth !== undefined) {
    return { width: window.innerWidth, height: window.innerHeight };
  } else {
    const D = document.documentElement;
    return { width: D.clientWidth, height: D.clientHeight };
  }
}
