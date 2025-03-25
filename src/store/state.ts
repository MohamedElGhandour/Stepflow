// state.ts
import { StepflowProps } from "../types";

export type State = ReturnType<typeof getState>;

export function getState(props: StepflowProps, currentStepIndex: number) {
    const steps = props.steps;
    const stepsLength = steps.length;
    const currentStep = steps[currentStepIndex];
    const currentTarget = currentStep.target;
    const currentTargetElement = document.querySelector(currentTarget);
    const currentStepIndexDisplay = currentStepIndex + 1;
    const isLastStep = stepsLength === currentStepIndexDisplay;
    const isFirstStep = currentStepIndex === 0;
    const showPrev = props.showPrev && !isFirstStep;
    const showSkip = props.showSkip && !isLastStep;
    const header = currentStep.content.header;
    const description = currentStep.content.description;

    return {
        currentStepIndex,
        currentStepIndexDisplay,
        isLastStep,
        isFirstStep,
        currentStep,
        currentTarget,
        stepsLength,
        header,
        showPrev,
        description,
        showSkip,
        currentTargetElement,
    };
}
