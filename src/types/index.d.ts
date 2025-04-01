/**
 * Core Stepflow Configuration
 */
export interface StepflowConfig {
  steps: Step[];
  callbacks?: StepflowCallbacks;
  buttons?: ButtonConfig;
  options?: StepflowOptions;
  progress?: ProgressIndicator;
}

/**
 * Individual Step Definition
 */
export interface Step {
  target: string | HTMLElement;
  content: StepContent;
  metadata?: StepMetadata;
  callbacks?: StepCallbacks;
}

/**
 * General Callback Types
 */
export interface StepflowCallbacks {
  onStart?: (firstStep: Step) => Promise<void> | void;
  onComplete?: (lastStep: Step) => Promise<void> | void;
  onCancel?: (currentStep: Step) => Promise<void> | void;
  onNext?: (currentStep: Step) => Promise<void> | void;
  onPrev?: (currentStep: Step) => Promise<void> | void;
  onError?: (error: Error | unknown) => void;
}

/**
 * Local Callback Types
 */
export interface StepCallbacks {
  onNext?: (currentStep: Step) => Promise<void> | void;
  onPrev?: (currentStep: Step) => Promise<void> | void;
}

/**
 * Navigation Button Configuration
 */
export interface ButtonConfig {
  cancel?: {
    visible?: boolean;
    label?: string;
    className?: string;
    ariaLabel?: string;
  };
  prev?: {
    visible?: boolean;
    label?: string;
    className?: string;
    ariaLabel?: string;
  };
  next?: {
    label?: string;
    className?: string;
    loading?: boolean;
    ariaLabel?: string;
  };
  complete?: {
    label?: string;
    className?: string;
    ariaLabel?: string;
  };
}

/**
 * Step Content Configuration
 */
export interface StepContent {
  header?: string | HTMLElement;
  body?: string | HTMLElement;
  footer?: string | HTMLElement;
  component?: (step: Step) => string | HTMLElement;
  placement?: Placement;
}

/**
 * Stepflow Behavior Options
 */
export interface StepflowOptions {
  keyboardControls?: boolean;
  escapeToCancel?: boolean;
  highlightBorderColor?: string;
  overlay?: {
    enabled?: boolean;
    opacity?: number;
    closeOnClick?: boolean;
  };
  transitions?: {
    smoothScroll?: boolean;
    animationDuration?: number;
  };
  //  @todo This feature is not implemented yet.
  debug?: boolean;
}

/**
 * Progress Tracking (Vanilla JS version)
 */
//  @todo This feature is not implemented yet.
export interface ProgressIndicator {
  type?: ProgressIndicatorTypes;
  position?: ProgressIndicatorPosition;
  component?: (current: number, total: number) => string | HTMLElement;
}

/**
 * Step Metadata
 */
//  @todo This feature is not implemented yet.
export interface StepMetadata {
  id?: string;
  required?: boolean;
  tags?: string[];
  analytics?: {
    eventName?: string;
    payload?: Record<string, unknown>;
  };
}

export type Status = "active" | "completed" | "canceled" | "error" | "idle";

export type Placement = "top" | "bottom" | "left" | "right" | "auto";

export type ProgressIndicatorTypes = "dots" | "counter" | "percentage" | "custom";

export type ProgressIndicatorPosition = "header" | "footer" | "inline";
