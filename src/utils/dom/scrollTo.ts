import {useElementVisibility} from "@stepflow/utils/dom/useElementVisibility";
import {useWindowSize} from "@stepflow/utils/dom/useWindowSize";

/**
 * To change the scroll of `window` after highlighting an element
 *
 */
export default function scrollTo(scrollPadding: number, targetElement: Element) {
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
