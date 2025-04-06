import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { useErrorHandler } from "@stepflow/store/useErrorHandler";
import { useNavigation } from "@stepflow/store/useNavigation";
import { handleResize, keyboardControls } from "@stepflow/events";
import { syncUI } from "@stepflow/effects";
import { initializeUI } from "@stepflow/effects/initializeUI";
import { cleanupUI } from "@stepflow/effects/cleanupUI";

export function useHooks(state: State, getters: Getters, steps: ReturnType<typeof useNavigation>) {
  const { currentStep, currentTargetElement } = getters;
  const { config, status } = state;
  const { prevStep, nextStep } = steps;

  const keyUpHandler = (event: KeyboardEvent) => {
    keyboardControls(event, config, { prevStep, nextStep, cancel });
  };

  const resizeHandler = () => {
    handleResize(currentTargetElement.val);
  };

  async function complete() {
    status.val = "completed";
    await useErrorHandler(state, async () => {
      // Run the global callback if defined.
      await config.callbacks?.onComplete?.(currentStep.val);

      await cleanupUI(resizeHandler, keyUpHandler);
    });
  }

  async function cancel() {
    status.val = "canceled";
    await useErrorHandler(state, async () => {
      // Run the global callback if defined.
      await config.callbacks?.onCancel?.(currentStep.val);

      await cleanupUI(resizeHandler, keyUpHandler);
    });
  }

  async function start() {
    if (status.val === "idle") {
      status.val = "active";
      await useErrorHandler(state, async () => {
        await config.callbacks?.onStart?.(currentStep.val);
        const { render } = await import("@stepflow/components/app"); // Dynamic import
        render();
        syncUI(currentTargetElement.val);
        initializeUI(state, resizeHandler, keyUpHandler);
      });
    }
  }

  return { complete, cancel, start };
}
