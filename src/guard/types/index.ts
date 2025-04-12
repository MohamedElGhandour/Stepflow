import type { State } from "@stepflow/lib/core";
import { StepContent } from "@stepflow/types";

export const isString = (value: unknown): value is string => typeof value === "string";

/**
 * Type guard to check if a value is a State<string>.
 *
 * @param value - The value to check.
 * @returns True if the value is a reactive state holding a string.
 */
export const isReactiveString = (value: unknown): value is State<string> => {
  return (
    typeof value === "object" && value !== null && "val" in value && typeof value.val === "string"
  );
};

export function isHTMLElement(target: unknown): target is HTMLElement {
  return target instanceof HTMLElement;
}

export function isCustomContent(content: StepContent): boolean {
  return !!content.component;
}
