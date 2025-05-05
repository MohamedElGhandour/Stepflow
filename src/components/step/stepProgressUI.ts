import { state, tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";
import { progressTemplate } from "@stepflow/view/progressTemplates";
import { ProgressIndicatorTypes } from "@stepflow/types";

const { div } = tags;

export function stepProgressUI() {
  const {
    stepsLength: total,
    currentStepIndexDisplay: current,
    progressType: type,
    progressComponent: component,
    progressPosition: position,
  } = getStore();
  const isInline = position.val === "inline";
  return div({ class: "sf-progress" }, () => {
    if (type.val === "custom" && typeof component.val === "function")
      return component.val(current.val, total);
    const guard = type.val === "dots" && isInline ? state<ProgressIndicatorTypes>("counter") : type;
    return progressTemplate(guard, current, total)();
  });
}
