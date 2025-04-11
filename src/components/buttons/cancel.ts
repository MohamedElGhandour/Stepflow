import { tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";
import { vIf } from "@stepflow/view/conditionals";

const { button } = tags;

export function cancelButton() {
  const { cancel, cancelClassName, cancelAriaLabel, cancelLabel, showCancel } = getStore();
  return vIf(
    () => showCancel.val,
    () =>
      button(
        {
          class: `sf-btn sf-btn-skip ${cancelClassName}`,
          ariaLabel: cancelAriaLabel,
          onclick: cancel,
        },
        cancelLabel
      )
  );
}
