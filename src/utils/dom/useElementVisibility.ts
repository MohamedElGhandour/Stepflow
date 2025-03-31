/**
 * Check to see if the element is in the viewport or not
 *
 */
export function useElementVisibility(el: HTMLElement | Element): boolean {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom + 80 <= window.innerHeight && // add 80 to get the text right
    rect.right <= window.innerWidth
  );
}
