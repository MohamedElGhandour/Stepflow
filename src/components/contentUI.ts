import { tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";
import { vIf } from "@stepflow/view/conditionals";

const { div, p, h3 } = tags;

export function contentUI() {
  const { header, body, currentStep: step, stepComponent: component } = getStore();

  return div(
    { class: "sf-content" },
    vIf(
      () => !!component.val,
      () => div({ innerHTML: () => component.val?.(step.val) })
    ),
    vIf(
      () => Boolean(!component.val && header.val),
      () => h3({ innerHTML: () => header.val })
    ),
    vIf(
      () => Boolean(!component.val && body.val),
      () => p({ innerHTML: () => body.val })
    )
  );
}
