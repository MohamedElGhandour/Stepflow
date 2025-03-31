import { tags } from "@stepflow/lib/dom";
import { getStore } from "@stepflow/store";
import { vIf, vIfElse } from "@stepflow/utils/helpers";

const { div, button } = tags;

export default function actionsUI() {
  const { nextStep, prevStep, cancel, complete, showCancel, showPrev, isLastStep } = getStore();

  return div(
    { class: "stepflow-tooltip-actions" },
    vIf(
      () => showCancel.val,
      () => button({ onclick: cancel }, "skip")
    ),
    vIf(
      () => showPrev.val,
      () => button({ onclick: prevStep }, "back")
    ),
    vIfElse(
      () => isLastStep.val,
      () => button({ onclick: complete }, "done"),
      () => button({ onclick: nextStep }, "next")
    )
  );
}
