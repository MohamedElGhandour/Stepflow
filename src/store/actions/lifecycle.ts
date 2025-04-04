import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { executeWithErrorHandling } from "@stepflow/utils/errorHandling";
import { handleResize, keyboardControls, updateUIPositions } from "@stepflow/utils/dom/positioning";
import { useStepActions } from "@stepflow/store/actions/stepActions";
import { setHighlightStyle } from "@stepflow/utils/helpers";

export function useLifecycle(state: State, getters: Getters) {
  const { currentStep, currentTargetElement } = getters;
  const { config, highlightBorderColor, overlayOpacity, status } = state;
  const { prevStep, nextStep } = useStepActions(state, getters);

  const keyUpHandler = (event: KeyboardEvent) => {
    keyboardControls(event, config, { prevStep, nextStep, cancel });
  };

  const resizeHandler = () => {
    handleResize(currentTargetElement.val);
  };

  function initializeUI() {
    document.body.classList.add("stepflow-overflow-hidden");
    window.addEventListener("resize", resizeHandler);
    if (config.options?.keyboardControls || config.options?.escapeToCancel) {
      document.addEventListener("keyup", keyUpHandler);
    }

    setHighlightStyle(highlightBorderColor, overlayOpacity);
  }

  async function cleanupUI() {
    document.body.classList.remove("stepflow-overflow-hidden");
    window.removeEventListener("resize", resizeHandler);
    document.removeEventListener("keyup", keyUpHandler);
    const { destroy } = await import("@stepflow/store"); // Dynamic import
    destroy();
  }

  async function complete() {
    status.val = "completed";
    await executeWithErrorHandling(state, async () => {
      // Run the global callback if defined.
      await config.callbacks?.onComplete?.(currentStep.val);

      cleanupUI();
    });
  }

  async function cancel() {
    status.val = "canceled";
    await executeWithErrorHandling(state, async () => {
      // Run the global callback if defined.
      await config.callbacks?.onCancel?.(currentStep.val);

      await cleanupUI();
    });
  }

  async function start() {
    if (status.val === "idle") {
      status.val = "active";
      await executeWithErrorHandling(state, async () => {
        // Run the global callback if defined.
        await config.callbacks?.onStart?.(currentStep.val);
        const { render } = await import("@stepflow/components/app"); // Dynamic import
        render();
        updateUIPositions(currentTargetElement.val);
        initializeUI();
      });
    }
  }

  return { complete, cancel, start };
}
