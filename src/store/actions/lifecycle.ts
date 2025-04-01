import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { executeWithErrorHandling } from "@stepflow/utils/errorHandling";
import render from "@stepflow/component/index";
import { handleResize, keyboardControls, updateUIPositions } from "@stepflow/utils/dom/positioning";
import { useStepActions } from "@stepflow/store/actions/stepActions";
import { setHighlightStyle } from "@stepflow/utils/helpers";

export function useLifecycle(state: State, getters: Getters) {
  const { currentStep, currentTargetElement } = getters;
  const { config, highlightBorderColor, overlayOpacity } = state;
  const { prevStep, nextStep } = useStepActions(state, getters);

  const keyUpHandler = (event: KeyboardEvent) => {
    keyboardControls(event, config, { prevStep, nextStep, cancel });
  };

  function initializeUI() {
    document.body.classList.add("stepflow-overflow-hidden");

    window.addEventListener("resize", () => handleResize(currentTargetElement.val));

    if (config.options?.keyboardControls || config.options?.escapeToCancel) {
      document.addEventListener("keyup", keyUpHandler);
    }

    setHighlightStyle(highlightBorderColor, overlayOpacity);
  }

  function cleanupUI() {
    document.body.classList.remove("stepflow-overflow-hidden");
    window.removeEventListener("resize", () => handleResize(currentTargetElement.val));
    document.removeEventListener("keyup", keyUpHandler);
  }

  async function complete() {
    await executeWithErrorHandling(state, async () => {
      // Run the global callback if defined.
      await config.callbacks?.onComplete?.(currentStep.val);

      cleanupUI();
    });
  }

  async function cancel() {
    await executeWithErrorHandling(state, async () => {
      // Run the global callback if defined.
      await config.callbacks?.onCancel?.(currentStep.val);

      cleanupUI();
    });
  }

  async function start() {
    await executeWithErrorHandling(state, async () => {
      // Run the global callback if defined.
      await config.callbacks?.onStart?.(currentStep.val);
      render();
      updateUIPositions(currentTargetElement.val);
      initializeUI();
    });
  }

  return { complete, cancel, start };
}
