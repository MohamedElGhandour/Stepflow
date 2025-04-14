import { tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";
import { vIfElse } from "@stepflow/view/conditionals";

const { button } = tags;

export function nextWithComplete() {
  const {
    isLastStep,
    completeClassName,
    nextStep,
    complete,
    nextClassName,
    nextAriaLabel,
    nextLabel,
    completeLabel,
    completeAriaLabel,
  } = getStore();
  return vIfElse(
    () => isLastStep.val,
    () =>
      button(
        {
          class: `sf-btn sf-btn-done ${completeClassName}`,
          ariaLabel: completeAriaLabel,
          onclick: complete,
        },
        completeLabel
      ),
    () =>
      button(
        {
          class: `sf-btn sf-btn-next ${nextClassName}`,
          ariaLabel: nextAriaLabel,
          onclick: nextStep,
        },
        nextLabel
      )
  );
}
