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
  content: StepContent;
  callbacks?: StepCallbacks;
  target?: string | HTMLElement;
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
  component?: (step: Step) => string | HTMLElement;
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
    scrollBehavior?: ScrollBehavior;
    animationDuration?: number;
  };
  // //  @todo This feature is not implemented yet.
  // debug?: boolean;
}

/**
 * Progress Tracking (Vanilla JS version)
 */
export type ProgressIndicator =
  | {
      type: "custom";
      position?: ProgressIndicatorPosition;
      component: (current: number, total: number) => string | HTMLElement;
    }
  | {
      type?: Exclude<ProgressIndicatorTypes, "custom">;
      position?: ProgressIndicatorPosition;
      component?: never;
    };

export type Status = "active" | "completed" | "canceled" | "error" | "idle";

export type Direction = "forward" | "backward";

export type ProgressIndicatorTypes = "counter" | "of" | "dots" | "percentage" | "custom";

export type ProgressIndicatorPosition = "header" | "body" | "inline";

export interface StepflowResolvedConfig {
  steps: Step[];
  callbacks: Required<StepflowCallbacks>;
  buttons: {
    cancel: { visible: boolean; label: string; className: string; ariaLabel?: string };
    prev: { visible: boolean; label: string; className: string; ariaLabel?: string };
    next: { label: string; className: string; loading: boolean; ariaLabel?: string };
    complete: { label: string; className: string; ariaLabel?: string };
  };
  options: {
    keyboardControls: boolean;
    escapeToCancel: boolean;
    highlightBorderColor: string;
    overlay: { enabled: boolean; opacity: number; closeOnClick: boolean };
    transitions: { scrollBehavior: ScrollBehavior; animationDuration: number };
  };
  progress: {
    type: ProgressIndicatorTypes;
    position: ProgressIndicatorPosition;
    component?: (current: number, total: number) => string | HTMLElement;
  };
}
