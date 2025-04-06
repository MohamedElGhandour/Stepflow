import { tags } from "@stepflow/lib/core";
import { stepProgressUI } from "@stepflow/components/stepProgress";
import { stepControlsUI } from "@stepflow/components/stepControls";

const {
  div,
  // h3, p
} = tags;

export function tooltipUI() {
  // const { header, description } = getStore();
  return div(
    { id: "stepflow-tooltip", class: "stepflow-tooltip" },
    stepProgressUI(),
    // h3(header),
    // p(description),
    stepControlsUI()
  );
}
