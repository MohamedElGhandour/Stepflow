import { StepContent, StepflowConfig } from "@stepflow/types";

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
    type: "counter",
    position: "header",
  },
};

/**
 * Helper Types
 */
export type StepflowStatus = "active" | "completed" | "upcoming" | "blocked";
export type NavigationDirection = "forward" | "backward";

/**
 * Configuration Validation
 */
export function validateStepflowConfig(config: StepflowConfig) {
  if (!config.steps?.length) throw new Error("Stepflow requires at least one step");
  if (
    config.options?.overlay?.opacity &&
    (config.options.overlay.opacity < 0 || config.options.overlay.opacity > 1)
  ) {
    throw new Error("Overlay opacity must be between 0 and 1");
  }
}

/**
 * Type Guards
 */
export function isHTMLElement(target: unknown): target is HTMLElement {
  return target instanceof HTMLElement;
}

export function isCustomContent(content: StepContent): boolean {
  return !!content.component;
}
