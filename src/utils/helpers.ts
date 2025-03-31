import { StepflowConfig } from "@stepflow/types";
import { ProgressIndicatorPositionEnum, ProgressIndicatorTypesEnum } from "@stepflow/enums";

export function vIf(condition: () => boolean, content: () => Node): () => Node {
  return () => (condition() ? content() : new Text(""));
}

export function vIfElse(
  condition: () => boolean,
  ifContent: () => Node,
  elseContent: () => Node
): () => Node {
  return () => (condition() ? ifContent() : elseContent());
}

/**
 * Default Configuration
 */
export const defaultStepflowConfig: Partial<StepflowConfig> = {
  options: {
    keyboardControls: true,
    escapeToCancel: true,
    overlay: {
      enabled: true,
      opacity: 0.7,
      closeOnClick: false,
    },
    transitions: {
      smoothScroll: true,
      animationDuration: 300,
    },
  },
  buttons: {
    cancel: { visible: true, label: "Done" },
    prev: { visible: true, label: "Previous" },
    next: { label: "Continue" },
    complete: { label: "Finish", visible: true },
  },
  progress: {
    type: ProgressIndicatorTypesEnum.counter,
    position: ProgressIndicatorPositionEnum.header,
  },
};

/**
 * Helper Types
 */
export type StepflowStatus = "active" | "completed" | "upcoming" | "blocked";
export type NavigationDirection = "forward" | "backward";

export function getElement(target: string | HTMLElement): HTMLElement | null {
  return typeof target === "string" ? document.querySelector(target) : target;
}

export function getUIHandler() {
  const highlight = getElement("#stepflow-highlight");
  const tooltip = getElement("#stepflow-tooltip");
  return { highlight, tooltip };
}
