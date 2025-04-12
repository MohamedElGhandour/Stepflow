import { Direction, Status, StepflowResolvedConfig } from "@stepflow/types";
import { state } from "@stepflow/lib/core";

export type State = ReturnType<typeof useState>;

export function useState(config: StepflowResolvedConfig) {
  const { steps } = config;
  const stepsLength = steps.length;

  // Extract button configuration values with defaults.
  const prevLabel = config.buttons?.prev?.label;
  const prevClassName = config.buttons?.prev?.className;
  const prevAriaLabel = config.buttons?.prev?.ariaLabel;

  const cancelLabel = config.buttons?.cancel?.label;
  const cancelClassName = config.buttons?.cancel?.className;
  const cancelAriaLabel = config.buttons?.cancel?.ariaLabel;

  const nextLabel = config.buttons?.next?.label;
  const nextClassName = config.buttons?.next?.className;
  const nextAriaLabel = config.buttons?.next?.ariaLabel;

  const completeLabel = config.buttons?.complete?.label;
  const completeClassName = config.buttons?.complete?.className;
  const completeAriaLabel = config.buttons?.complete?.ariaLabel;

  // Extract overlay and transition options with defaults.
  const showOverlay = !!config.options?.overlay?.enabled;
  const overlayOpacity = config.options?.overlay?.opacity;
  const overlayCloseOnClick = !!config.options?.overlay?.closeOnClick;
  const highlightBorderColor = config.options?.highlightBorderColor;
  const scrollBehavior = !!config.options?.transitions?.scrollBehavior;
  const animationDuration = config.options?.transitions?.animationDuration;

  // Reactive state variables for dynamic parts of the store.
  const currentStepIndex = state<number>(0);
  const status = state<Status>("idle");
  const directionState = state<Direction>("forward");
  const error = state<Error | null>(null);

  return {
    // Options and configuration values.
    scrollBehavior,
    animationDuration,
    overlayOpacity,
    overlayCloseOnClick,
    highlightBorderColor,
    showOverlay,
    // Button configuration values.
    prevLabel,
    prevClassName,
    prevAriaLabel,
    cancelLabel,
    cancelClassName,
    cancelAriaLabel,
    nextLabel,
    nextClassName,
    nextAriaLabel,
    completeLabel,
    completeClassName,
    completeAriaLabel,
    // Reactive state
    currentStepIndex,
    status,
    directionState,
    error,
    // Raw configuration and steps.
    config,
    steps,
    stepsLength,
  };
}
