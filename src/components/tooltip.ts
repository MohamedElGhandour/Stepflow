import { tags } from "@stepflow/lib/core";
import { stepProgressUI } from "@stepflow/components/stepProgress";
import { stepControlsUI } from "@stepflow/components/stepControls";
import { getStore } from "@stepflow/store";

const { div, h3, p } = tags;

export function tooltipUI() {
  const { header, body } = getStore();
  return div(
    { class: "stepflow-tooltip" },
    stepProgressUI(),
    h3(header),
    p(body),
    stepControlsUI()
  );
}
