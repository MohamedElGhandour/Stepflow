import type { ReactNode, RefObject } from "react";

/**
 * What a step points at. A ref is the idiomatic React choice — it survives
 * re-renders and refactors in a way a `#css-selector` string does not.
 * Omit it entirely for a centered, target-less step (intros, outros).
 */
export type StepTarget = string | HTMLElement | RefObject<HTMLElement | null>;

export interface Step {
  target?: StepTarget;
  /** Rendered as the card's heading. */
  title?: ReactNode;
  /** Rendered as the card's body. Any React node — no HTML strings, no XSS. */
  content?: ReactNode;
  /** Runs before advancing past this step. Await-ed; throw to abort the move. */
  onNext?: (step: Step, index: number) => void | Promise<void>;
  /** Runs before going back from this step. Await-ed; throw to abort the move. */
  onPrev?: (step: Step, index: number) => void | Promise<void>;
}

export type ProgressType = "dots" | "counter" | "of" | "percentage" | "none";

export type ProgressPosition = "header" | "body" | "inline";

export interface Labels {
  next?: string;
  prev?: string;
  cancel?: string;
  complete?: string;
}

export interface OverlayOptions {
  /** 0–1. Dim level of the page outside the highlight. */
  opacity?: number;
  /**
   * Cancel the tour on a click outside the card.
   * Defaults to `false` — in v1 this was on, and it meant every click on the
   * element a step was pointing at silently killed the tour.
   */
  closeOnClick?: boolean;
}

export interface StepflowProps {
  steps: Step[];
  /** The tour is mounted while this is true. Flip it to false to tear down. */
  run?: boolean;

  onStart?: (step: Step, index: number) => void;
  onComplete?: (step: Step, index: number) => void;
  onCancel?: (step: Step, index: number) => void;
  onNext?: (step: Step, index: number) => void | Promise<void>;
  onPrev?: (step: Step, index: number) => void | Promise<void>;
  onError?: (error: unknown) => void;
  /** Fires on every settled step change, including the first. */
  onStepChange?: (step: Step, index: number) => void;

  labels?: Labels;
  showPrev?: boolean;
  showCancel?: boolean;

  /** `false` disables the dimming layer and keeps only the highlight ring. */
  overlay?: boolean | OverlayOptions;
  /** Colour of the ring drawn around the target. */
  highlightColor?: string;

  /** Arrow-key navigation. Ignored while focus is in a text field. */
  keyboard?: boolean;
  /** Escape cancels the tour. */
  escapeToCancel?: boolean;
  /** Lock page scroll for the duration of the tour. */
  lockScroll?: boolean;

  /** Built-in indicator, or a render function for a custom one. */
  progress?: ProgressType | ((current: number, total: number) => ReactNode);
  progressPosition?: ProgressPosition;

  /** Passed straight to `scrollIntoView`. `"auto"` respects reduced-motion. */
  scrollBehavior?: ScrollBehavior;

  /** Added to the tooltip card, for host-side styling. */
  className?: string;
  /** Portal host. Defaults to `document.body`. */
  container?: HTMLElement | null;
}

export type Status = "idle" | "active" | "completed" | "canceled";
