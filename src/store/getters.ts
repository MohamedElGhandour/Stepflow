import { State } from "@stepflow/store/state";
import { derive } from "@stepflow/lib/dom";
import { getElement } from "@stepflow/utils/helpers";

export type Getters = ReturnType<typeof useGetters>;

export function useGetters(state: State) {
  const currentStep = derive(() => state.steps[state.currentStepIndex.val]);

  const currentStepIndexDisplay = derive(() => state.currentStepIndex.val + 1);

  const isFirstStep = derive(() => state.currentStepIndex.val === 0);
  const isLastStep = derive(() => currentStepIndexDisplay.val === state.steps.length);

  const showPrev = derive(() => !!state.config.buttons?.prev?.visible && !isFirstStep.val);
  const prevLabel = derive(() => state.config.buttons?.prev?.label);
  const showCancel = derive(() => !!state.config.buttons?.cancel?.visible && !isLastStep.val);
  const cancelLabel = derive(() => state.config.buttons?.cancel?.label);
  const nextLabel = derive(() => state.config.buttons?.next?.label);
  const completeLabel = derive(() => state.config.buttons?.complete?.label);

  const currentTarget = derive(() => currentStep.val.target);
  const currentTargetElement = derive(() => getElement(currentTarget.val));
  const header = derive(() => currentStep.val.content.header);
  const body = derive(() => currentStep.val.content.body);

  return {
    currentStep,
    currentStepIndexDisplay,
    isFirstStep,
    isLastStep,
    showPrev,
    prevLabel,
    showCancel,
    cancelLabel,
    nextLabel,
    completeLabel,
    currentTarget,
    currentTargetElement,
    header,
    body,
  };
}
