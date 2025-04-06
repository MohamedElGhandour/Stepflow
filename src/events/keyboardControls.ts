import {StepflowConfig} from "@stepflow/types";

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
