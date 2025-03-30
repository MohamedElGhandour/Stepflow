import { tags } from "@stepflow/utils/dom";
import { getStore } from "@stepflow/core/store";

const { div } = tags;

export default function stepsUI() {
  const { stepsLength, currentStepIndexDisplay } = getStore();
  const el = div(
    { id: "stepflow-tooltip-steps", class: "stepflow-tooltip-steps" },
    () => `Step ${currentStepIndexDisplay.val} of ${stepsLength} steps`
  );
  return el;
}
