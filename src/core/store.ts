import { StepflowConfig } from "@stepflow/types";
import { derive, state } from "@stepflow/utils/dom";
import { updateHighlightAndDropdown } from "@stepflow/utils/updateHighlightAndDropdown.utils";
import inject from "component";

export function store(props: StepflowConfig) {
  const currentStepIndex = state<number>(0);
  let resizeTimeout: ReturnType<typeof setTimeout>;

  const steps = props.steps;
  const stepsLength = steps.length;
  const currentStep = derive(() => steps[currentStepIndex.val]);
  const currentStepIndexDisplay = derive(() => currentStepIndex.val + 1);
  const isFirstStep = derive(() => currentStepIndex.val === 0);
  const isLastStep = derive(() => currentStepIndexDisplay.val === stepsLength);

  // Updated button configuration access
  const showPrev = derive(() => !!props.buttons?.prev?.visible && !isFirstStep.val);
  const prevLabel = derive(() => props.buttons?.prev?.label);
  const showCancel = derive(() => !!props.buttons?.cancel?.visible && !isLastStep.val);
  const cancelLabel = derive(() => props.buttons?.cancel?.label);
  const nextLabel = derive(() => props.buttons?.next?.label);
  const completeLabel = derive(() => props.buttons?.complete?.label);

  // Updated content structure
  const currentTarget = derive(() => currentStep.val.target);
  const currentTargetElement = derive(() =>
    typeof currentTarget.val === "string"
      ? document.querySelector(currentTarget.val)
      : currentTarget.val
  );
  const header = derive(() => currentStep.val.content.header);
  const body = derive(() => currentStep.val.content.body);

  function trackTarget() {
    const highlight = document.getElementById("stepflow-highlight");
    const tooltip = document.getElementById("stepflow-tooltip");
    updateHighlightAndDropdown(highlight, tooltip, currentTargetElement.val);
  }

  function handleResize() {
    const highlight = document.getElementById("stepflow-highlight");
    const tooltip = document.getElementById("stepflow-tooltip");

    highlight?.classList.add("stepflow-no-transition");
    tooltip?.classList.add("stepflow-no-transition");

    trackTarget();

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      highlight?.classList.remove("stepflow-no-transition");
      tooltip?.classList.remove("stepflow-no-transition");
    }, 100);
  }

  // Updated callback handling
  function nextStep() {
    if (isLastStep.val) return;

    // Handle step-level first, then global
    const stepCallback = currentStep.val.callbacks?.onStepExit;
    // const globalCallback = props.callbacks?.onNext;

    Promise.resolve()
      .then(() => stepCallback?.(currentStep.val))
      // .then(() => globalCallback?.(currentStep.val))
      .then(() => {
        currentStepIndex.val += 1;
      });
  }

  derive(() => {
    if (currentTargetElement.val) {
      trackTarget();
    }
  });

  function prevStep() {
    if (isFirstStep.val) return;

    const stepCallback = currentStep.val.callbacks?.onStepExit;
    // const globalCallback = props.callbacks?.onPrev;

    Promise.resolve()
      .then(() => stepCallback?.(currentStep.val))
      // .then(() => globalCallback?.(currentStep.val))
      .then(() => {
        currentStepIndex.val -= 1;
      });
  }

  function cancel() {
    const globalCallback = props.callbacks?.onCancel;
    Promise.resolve()
      .then(() => globalCallback?.(currentStep.val))
      .then(() => {
        if (props.options?.overlay?.closeOnClick) {
          finish();
        }
      });
  }

  function complete() {
    const globalCallback = props.callbacks?.onComplete;
    Promise.resolve()
      .then(() => globalCallback?.(currentStep.val))
      .then(finish);
  }

  function finish() {
    document.body.classList.remove("stepflow-overflow-hidden");
    window.removeEventListener("resize", handleResize);
    // Add any cleanup logic here
  }

  function start() {
    const globalCallback = props.callbacks?.onStart;
    Promise.resolve()
      .then(() => globalCallback?.(currentStep.val))
      .then(() => {
        inject();
        trackTarget();
        document.body.classList.add("stepflow-overflow-hidden");
        window.addEventListener("resize", handleResize);
      });
  }

  return {
    /* State */
    currentStepIndex,
    /* Getters */
    currentStepIndexDisplay,
    currentStep,
    isFirstStep,
    isLastStep,
    showPrev,
    showCancel,
    currentTarget,
    currentTargetElement,
    header,
    body,
    stepsLength,
    /* Labels */
    prevLabel,
    cancelLabel,
    nextLabel,
    completeLabel,
    /* Actions */
    trackTarget,
    start,
    complete,
    cancel,
    prevStep,
    nextStep,
    finish,
  };
}

let storeInstance: ReturnType<typeof store>;

export function initStore(props: StepflowConfig) {
  storeInstance = store(props);
}

export function getStore() {
  return storeInstance;
}
