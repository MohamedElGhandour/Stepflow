import { getElement } from "@stepflow/utils";

export function getUIHandler() {
  const highlight = getElement(".stepflow-highlight");
  const tooltip = getElement(".stepflow-tooltip");
  const app = getElement(".stepflow");
  return { highlight, tooltip, app };
}
