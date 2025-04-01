import { ProgressIndicatorPositionEnum, ProgressIndicatorTypesEnum } from "@stepflow/enums";
import { StepflowConfig } from "@stepflow/types";
import { merge } from "@stepflow/utils/merge";

const defaultStepflowConfig: StepflowConfig = {
  steps: [],
  options: {
    keyboardControls: true,
    escapeToCancel: true,
    highlightBorderColor: "rgba(0, 0, 0, 0.8)",
    overlay: {
      enabled: true,
      opacity: 0.3,
      closeOnClick: false,
    },
    transitions: {
      smoothScroll: true,
      animationDuration: 300,
    },
  },
  buttons: {
    cancel: { visible: true, label: "Skip" },
    prev: { visible: true, label: "Back" },
    next: { label: "Next" },
    complete: { label: "Done" },
  },
  progress: {
    type: ProgressIndicatorTypesEnum.counter,
    position: ProgressIndicatorPositionEnum.header,
  },
};

export function mergeStepflowConfig(userConfig: Partial<StepflowConfig>): StepflowConfig {
  const config = merge(defaultStepflowConfig, userConfig);
  console.log(config);
  return config;
}
