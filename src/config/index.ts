import { StepflowConfig, StepflowResolvedConfig } from "@stepflow/types";
import { merge } from "@stepflow/utils";

const defaultStepflowConfig: StepflowConfig = {
  steps: [],
  options: {
    keyboardControls: true,
    escapeToCancel: true,
    highlightBorderColor: "rgba(0, 0, 0, 0.8)",
    overlay: {
      enabled: true,
      opacity: 0.3,
      closeOnClick: true,
    },
    transitions: {
      scrollBehavior: "smooth",
      animationDuration: 300,
    },
  },
  buttons: {
    cancel: { visible: true, label: "Skip", className: "" },
    prev: { visible: true, label: "Back", className: "" },
    next: { label: "Next", className: "" },
    complete: { label: "Done", className: "" },
  },
  progress: {
    type: "dots",
    position: "body",
  },
};

export function mergeStepflowConfig(userConfig: Partial<StepflowConfig>): StepflowResolvedConfig {
  const config = merge(defaultStepflowConfig, userConfig);
  return config as StepflowResolvedConfig;
}
