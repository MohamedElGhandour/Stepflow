import { getElement } from "@stepflow/utils";

export function getUIHandler() {
  const highlight = getElement(".sf-highlight");
  const tooltip = getElement(".sf-tooltip");
  const app = getElement(".sf-root");
  return { highlight, tooltip, app };
}
