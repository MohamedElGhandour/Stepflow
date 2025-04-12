import { getUIHandler } from "@stepflow/helpers";
import { syncUI } from "@stepflow/effects";

let resizeTimeout: ReturnType<typeof setTimeout>;

export function handleResize(target: HTMLElement | null) {
  const { highlight, tooltip } = getUIHandler();

  highlight?.classList.add("sf-no-transition");
  tooltip?.classList.add("sf-no-transition");

  syncUI(target);

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    highlight?.classList.remove("sf-no-transition");
    tooltip?.classList.remove("sf-no-transition");
  }, 100);
}
