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
  validation?: StepValidation;
  metadata?: StepMetadata;
  callbacks?: StepCallbacks;
}

/**
 * Callback Types
 */
export interface StepflowCallbacks {
  onStart?: (firstStep: Step) => Promise<void> | void;
  onComplete?: (lastStep: Step) => Promise<void> | void;
  onCancel?: (currentStep: Step) => Promise<void> | void;
  onNext?: (currentStep: Step) => Promise<void> | void;
  onPrev?: (currentStep: Step) => Promise<void> | void;
  onError?: (error: Error) => void;
}

export interface StepCallbacks {
  onStepEnter?: (currentStep: Step) => Promise<void> | void;
  onStepExit?: (currentStep: Step) => Promise<void> | void;
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
    disabled?: boolean;
  };
  next?: {
    label?: string;
    className?: string;
    loading?: boolean;
  };
  complete?: {
    label?: string;
    className?: string;
    visible?: boolean;
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
  placement?: "top" | "bottom" | "left" | "right" | "auto";
}

/**
 * Validation Types
 */
export interface StepValidation {
  beforeNext?: (currentStep: Step) => boolean | Promise<boolean>;
  beforePrev?: (currentStep: Step) => boolean | Promise<boolean>;
}

/**
 * Stepflow Behavior Options
 */
export interface StepflowOptions {
  keyboardControls?: boolean;
  escapeToCancel?: boolean;
  overlay?: {
    enabled?: boolean;
    opacity?: number;
    closeOnClick?: boolean;
  };
  transitions?: {
    smoothScroll?: boolean;
    animationDuration?: number;
  };
  debug?: boolean;
}

/**
 * Progress Tracking (Vanilla JS version)
 */
export interface ProgressIndicator {
  type?: "dots" | "counter" | "percentage" | "custom";
  position?: "header" | "footer" | "inline";
  component?: (current: number, total: number) => string | HTMLElement;
}

/**
 * Step Metadata
 */
export interface StepMetadata {
  id?: string;
  required?: boolean;
  tags?: string[];
  analytics?: {
    eventName?: string;
    payload?: Record<string, unknown>;
  };
}
