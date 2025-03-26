import elementInViewport from "./elementOnViewport.utils";
import {getWinSize} from "./getWinSize.utils";


/**
 * To change the scroll of `window` after highlighting an element
 */
export default function scrollTo(scrollPadding: number, targetElement: HTMLElement | Element) {
    const rect = targetElement.getBoundingClientRect();

    if (!elementInViewport(targetElement)) {
        const winHeight = getWinSize().height;
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
