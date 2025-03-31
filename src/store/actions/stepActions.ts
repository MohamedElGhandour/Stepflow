import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { executeWithErrorHandling } from "@stepflow/utils/errorHandling";
import { derive } from "@stepflow/lib/dom";
import { updateUIPositions } from "@stepflow/utils/dom/positioning";

export function useStepActions(state: State, getters: Getters) {
  const { isLastStep, isFirstStep, currentStep, currentTargetElement } = getters;
  const { currentStepIndex, config } = state;

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

    await executeWithErrorHandling(state, async () => {
      // Run the local step callback if defined.
      await currentStep.val.callbacks?.[callbackName]?.(currentStep.val);
      // Run the global callback if defined.
      await config.callbacks?.[callbackName]?.(currentStep.val);

      // Update the step index based on direction.
      if (direction === "next") {
        currentStepIndex.val++;
      } else {
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

  //
  derive(() => {
    updateUIPositions(currentTargetElement.val);
  });

  return { nextStep, prevStep };
}
