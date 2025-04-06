import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { useErrorHandler } from "@stepflow/store/useErrorHandler";

export function useNavigation(state: State, getters: Getters) {
  const { isLastStep, isFirstStep, currentStep } = getters;
  const { currentStepIndex, config, directionState } = state;

  /**
   * Helper function to change the current step based on direction.
   * Executes relevant callbacks and updates the step index, with error handling.
   * @param direction - The direction to move: 'next' or 'prev'.
   */
  async function changeStep(direction: "next" | "prev") {
    // Prevent moving past the last step or before the first step.
    if (direction === "next" && isLastStep.val) return;
    if (direction === "prev" && isFirstStep.val) return;

    const callbackName = direction === "next" ? "onNext" : "onPrev";

    await useErrorHandler(state, async () => {
      await currentStep.val.callbacks?.[callbackName]?.(currentStep.val);
      await config.callbacks?.[callbackName]?.(currentStep.val);

      if (direction === "next") {
        directionState.val = "forward";
        currentStepIndex.val++;
      } else {
        directionState.val = "backward";
        currentStepIndex.val--;
      }
    });
  }

  /**
   * Advances to the next step
   */
  async function nextStep() {
    await changeStep("next");
  }

  /**
   * Goes back to the previous step
   */
  async function prevStep() {
    await changeStep("prev");
  }

  return { nextStep, prevStep };
}
