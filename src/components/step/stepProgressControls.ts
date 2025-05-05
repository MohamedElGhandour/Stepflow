import { tags } from "@stepflow/lib/core";
import { stepProgressUI } from "@stepflow/components/step/stepProgressUI";
import { stepControlsUI } from "@stepflow/components/step/stepControlsUI";

const { div } = tags;

export function stepProgressControls() {
  return div(
    { class: "sf-progress-controls" },
    () => stepProgressUI(),
    () => stepControlsUI()
  );
}
