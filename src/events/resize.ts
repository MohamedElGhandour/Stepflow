import { getUIHandler } from "@stepflow/helpers";
import { syncUI } from "@stepflow/effects";

let resizeTimeout: ReturnType<typeof setTimeout>;

export function handleResize(target: HTMLElement | null) {
  const { highlight, tooltip } = getUIHandler();

  highlight?.classList.add("stepflow-no-transition");
  tooltip?.classList.add("stepflow-no-transition");

  syncUI(target);

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    highlight?.classList.remove("stepflow-no-transition");
    tooltip?.classList.remove("stepflow-no-transition");
  }, 100);
}
