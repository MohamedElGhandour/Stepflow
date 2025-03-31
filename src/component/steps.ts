import { tags } from "@stepflow/lib/dom";
import { getStore } from "@stepflow/store";

const { div } = tags;

export default function stepsUI() {
  const { stepsLength, currentStepIndexDisplay } = getStore();
  const el = div(
    { id: "stepflow-tooltip-steps", class: "stepflow-tooltip-steps" },
    () => `Step ${currentStepIndexDisplay.val} of ${stepsLength} steps`
  );
  return el;
}
