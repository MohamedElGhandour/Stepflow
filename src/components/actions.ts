import { tags } from "@stepflow/stepflow-core";
import { getStore } from "@stepflow/store";
import { vIf, vIfElse } from "@stepflow/utils/dom";

const { div, button } = tags;

export default function actionsUI() {
  const { nextStep, prevStep, skip, showSkip, showPrev, isLastStep, finish } = getStore();

  return div(
    { class: "stepflow-tooltip-actions" },
    vIf(
      () => showSkip.val,
      () => button({ onclick: skip }, "skip")
    ),
    vIf(
      () => showPrev.val,
      () => button({ onclick: prevStep }, "back")
    ),
    vIfElse(
      () => isLastStep.val,
      () => button({ onclick: finish }, "done"),
      () => button({ onclick: nextStep }, "next")
    )
  );
}
