import { tooltipTemplate } from "@stepflow/view/tooltipTemplates";
import { getStore } from "@stepflow/store";

export function tooltipUI() {
  const { progressPosition } = getStore();
  return tooltipTemplate(progressPosition.val);
}
