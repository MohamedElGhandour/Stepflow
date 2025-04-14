import { tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";

const { div } = tags;

export function stepProgressUI() {
  const { stepsLength, currentStepIndexDisplay } = getStore();
  const el = div(
    { class: "stepflow-tooltip-steps" },
    () => `Step ${currentStepIndexDisplay.val} of ${stepsLength} steps`
  );
  return el;
}
