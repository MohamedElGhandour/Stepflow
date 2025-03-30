import { tags } from "@stepflow/utils/dom";
import { getStore } from "@stepflow/core/store";
import { vIf, vIfElse } from "@stepflow/utils/helpers";

const { div, button } = tags;

export default function actionsUI() {
  const { nextStep, prevStep, cancel, showCancel, showPrev, isLastStep, finish } = getStore();

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
      () => button({ onclick: finish }, "done"),
      () => button({ onclick: nextStep }, "next")
    )
  );
}
