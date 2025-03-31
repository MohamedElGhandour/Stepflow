import {PlacementEnum, ProgressIndicatorPositionEnum, ProgressIndicatorTypesEnum,} from "@stepflow/enums";

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
  metadata?: StepMetadata; //  @todo This feature is not implemented yet.
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
  placement?: PlacementEnum;
}

/**
 * Stepflow Behavior Options
 */
export interface StepflowOptions {
  keyboardControls?: boolean;
  escapeToCancel?: boolean;
  //  @todo This feature is not implemented yet.
  overlay?: {
    enabled?: boolean;
    opacity?: number;
    closeOnClick?: boolean;
  };
  //  @todo This feature is not implemented yet.
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
  type?: ProgressIndicatorTypesEnum;
  position?: ProgressIndicatorPositionEnum;
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
