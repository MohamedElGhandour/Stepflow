import { StepContent } from "@stepflow/types";

export const isString = (value: unknown): value is string => typeof value === "string";

export function isHTMLElement(target: unknown): target is HTMLElement {
  return target instanceof HTMLElement;
}

export function isCustomContent(content: StepContent): boolean {
  return !!content.component;
}
