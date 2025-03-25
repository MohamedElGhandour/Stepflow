// index.ts
import {getState, State} from "./state";
import useGetters from "./getters";
import { StepflowProps } from "../types";

export function store(props: StepflowProps) {
    let currentStepIndex = 0;
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const listeners: ((state: State) => void)[] = [];

    // Notify subscribers with the current state.
    function notify() {
        const state = getState(props, currentStepIndex);
        listeners.forEach((listener) => listener(state));
    }

    // Subscribe to state updates.
    // The listener is immediately invoked with the current state.
    // Returns an unsubscribe function.
    function subscribe(listener: (state: State) => void) {
        listeners.push(listener);
        listener(getState(props, currentStepIndex));
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }

    // Helper that simulates tracking of the current target.
    function trackTarget() {
        console.log("trackTarget");
    }

    // Debounced resize handler.
    function handleResize() {
        console.log("handleResize");
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Perform any resize-dependent logic here.
            notify();
        }, 200);
    }

    // Move to the next step.
    function nextStep() {
        const state = getState(props, currentStepIndex);
        if (state.isLastStep) return;
        if (props.onNext) props.onNext();
        if (state.currentStep.onNext) state.currentStep.onNext();
        currentStepIndex++;
        trackTarget();
        notify();
    }

    // Move to the previous step.
    function prevStep() {
        const state = getState(props, currentStepIndex);
        if (state.isFirstStep) return;
        if (props.onPrev) props.onPrev();
        if (state.currentStep.onPrev) state.currentStep.onPrev();
        currentStepIndex--;
        trackTarget();
        notify();
    }

    // Skip the current step.
    function skip() {
        if (props.onSkip) props.onSkip();
        // Optionally, add logic to end the flow.
        notify();
    }

    // Finish the step flow.
    function finish() {
        if (props.onFinish) props.onFinish();
        // Optionally, add logic to destroy or clean up.
        notify();
    }

    // Start the step flow.
    function start() {
        if (props.onStart) props.onStart();
        trackTarget();
        notify();
    }

    // Return the current getters (which wrap the current state).
    function getCurrentGetters() {
        const state = getState(props, currentStepIndex);
        return useGetters(state);
    }

    return {
        // State access
        getState: () => getState(props, currentStepIndex),
        subscribe,
        // Actions
        handleResize,
        start,
        nextStep,
        prevStep,
        skip,
        finish,
        // Getter helper
        getCurrentGetters,
    };
}
