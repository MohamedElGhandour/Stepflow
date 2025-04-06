import { tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";
import { vIf, vIfElse } from "@stepflow/view/conditionals";

const { div, button } = tags;

export function stepControlsUI() {
  const { nextStep, prevStep, cancel, complete, showCancel, showPrev, isLastStep } = getStore();

  return div(
    { class: "stepflow-tooltip-controls stepflow-normal" },
    div(
      { class: "sf-tp-left" },
      vIf(
        () => showCancel.val,
        () => button({ class: "sf-btn", onclick: cancel }, "skip")
      ),
      vIf(
        () => showPrev.val,
        () => button({ class: "sf-btn", onclick: prevStep }, "back")
      )
    ),
    div(
      vIfElse(
        () => isLastStep.val,
        () => button({ class: "sf-btn", onclick: complete }, "done"),
        () => button({ class: "sf-btn", onclick: nextStep }, "next")
      )
    )
  );
}
