import { syncUIPositions } from "@stepflow/utils/dom/syncUIPosition";
import { getUIHandler } from "@stepflow/utils/helpers";
import { StepflowConfig } from "@stepflow/types";

let resizeTimeout: ReturnType<typeof setTimeout>;

export function handleResize(target: HTMLElement | null) {
  const { highlight, tooltip } = getUIHandler();

  highlight?.classList.add("stepflow-no-transition");
  tooltip?.classList.add("stepflow-no-transition");

  updateUIPositions(target);

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    highlight?.classList.remove("stepflow-no-transition");
    tooltip?.classList.remove("stepflow-no-transition");
  }, 100);
}

export function updateUIPositions(target: HTMLElement | null) {
  const { highlight, tooltip } = getUIHandler();
  syncUIPositions(highlight, tooltip, target);
}

/**
 * Handles keyboard controls for step navigation.
 *
 */
export function keyboardControls(
  event: KeyboardEvent,
  config: StepflowConfig,
  cb: { prevStep: () => void; nextStep: () => void; cancel: () => void }
) {
  const { prevStep, nextStep, cancel } = cb;
  const keyboardControls = config.options?.keyboardControls;
  const escapeToCancel = config.options?.escapeToCancel;
  if (event.key === "Escape" && escapeToCancel) {
    cancel();
  }

  if (event.key === "ArrowRight" && keyboardControls) {
    nextStep();
  }

  if (event.key === "ArrowLeft" && keyboardControls) {
    prevStep();
  }
}
