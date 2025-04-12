import { tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";
import { vIf } from "@stepflow/view/conditionals";

const { button } = tags;

export function prevButton() {
  const { prevClassName, prevAriaLabel, prevLabel, prevStep, showPrev } = getStore();
  return vIf(
    () => showPrev.val,
    () =>
      button(
        {
          class: `sf-btn sf-btn-prev ${prevClassName}`,
          ariaLabel: prevAriaLabel,
          onclick: prevStep,
        },
        prevLabel
      )
  );
}
