import {State} from "./state";

export default function useGetters(state: State) {
    const getCurrentStep = () => state.currentStep;
    const getHeader = () => state.header;
    const getDescription = () => state.description;
    const getCurrentTarget = () => state.currentTarget;
    const getCurrentStepIndex = () => state.currentStepIndex;
    const getCurrentStepIndexDisplay = () => state.currentStepIndexDisplay;
    const isLastStep = () => state.isLastStep;
    const isFirstStep = () => state.isFirstStep;
    const getStepsLength = () => state.stepsLength;
    const getShowPrev = () => state.showPrev;
    const getShowSkip = () => state.showSkip;
    const getCurrentTargetElement = () => state.currentTargetElement;

    return {
        getCurrentStep,
        getHeader,
        getDescription,
        getCurrentTarget,
        getCurrentStepIndex,
        getCurrentStepIndexDisplay,
        isLastStep,
        isFirstStep,
        getStepsLength,
        getShowPrev,
        getShowSkip,
        getCurrentTargetElement,
    };
}
