import { StepflowProps } from "@stepflow/types";
import { derive, state } from "@stepflow/stepflow-core";
import { updateHighlightAndDropdown } from "@stepflow/utils/updateHighlightAndDropdown.utils";
import inject from "@stepflow/components";

export function store(props: StepflowProps) {
  const currentStepIndex = state<number>(0); // main reactive source
  let resizeTimeout: ReturnType<typeof setTimeout>;

  const steps = props.steps;
  const stepsLength = steps.length;
  const currentStep = derive(() => steps[currentStepIndex.val]);
  const currentStepIndexDisplay = derive(() => currentStepIndex.val + 1);
  const isFirstStep = derive(() => currentStepIndex.val === 0);
  const isLastStep = derive(() => currentStepIndexDisplay.val === stepsLength);
  const showPrev = derive(() => !!props.showPrev && !isFirstStep.val);
  const showSkip = derive(() => !!(props.showSkip && !isLastStep.val));
  const currentTarget = derive(() => currentStep.val.target);
  const currentTargetElement = derive(() => document.querySelector(currentTarget.val));
  const header = derive(() => currentStep.val.content.header);
  const description = derive(() => currentStep.val.content.description);

  function trackTarget() {
    const highlight = document.getElementById("stepflow-highlight");
    const tooltip = document.getElementById("stepflow-tooltip");
    updateHighlightAndDropdown(highlight, tooltip, currentTargetElement.val);
  }

  function handleResize() {
    const highlight = document.getElementById("stepflow-highlight");
    const tooltip = document.getElementById("stepflow-tooltip");

    // Disable transition only during resize by adding a class
    highlight?.classList.add("stepflow-no-transition");
    tooltip?.classList.add("stepflow-no-transition");

    trackTarget();

    // Debounce removal of the class after resizing stops
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      highlight?.classList.remove("stepflow-no-transition");
      tooltip?.classList.remove("stepflow-no-transition");
    }, 100); // Adjust debounce delay as needed
  }

  // Move to the next step.
  function nextStep() {
    if (isLastStep.val) return;
    if (props.onNext) props.onNext();
    if (currentStep.val.onNext) currentStep.val.onNext();
    currentStepIndex.val = currentStepIndex.val + 1;
  }

  derive(() => {
    if (currentTargetElement.val) {
      trackTarget();
    }
  });

  // Move to the previous step.
  function prevStep() {
    if (isFirstStep.val) return;
    if (props.onPrev) props.onPrev();
    if (currentStep.val.onPrev) currentStep.val.onPrev();
    currentStepIndex.val = currentStepIndex.val - 1;
  }

  // Skip the current step.
  function skip() {
    if (props.onSkip) props.onSkip();
    // Optionally, add logic to end the flow.
  }

  // Finish the step flow.
  function finish() {
    if (props.onFinish) props.onFinish();
    // Optionally, add logic to destroy or clean up.
  }

  // Start the step flow.
  function start() {
    if (props.onStart) props.onStart();
    inject();
    trackTarget();
    document.body.classList.add("stepflow-overflow-hidden");
    window.addEventListener("resize", handleResize);
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
    showSkip,
    currentTarget,
    currentTargetElement,
    header,
    description,
    stepsLength,
    /* Actions */
    trackTarget,
    start,
    finish,
    skip,
    prevStep,
    nextStep,
  };
}

let storeInstance: ReturnType<typeof store>;

export function initStore(props: StepflowProps) {
  storeInstance = store(props);
}

export function getStore() {
  return storeInstance;
}
