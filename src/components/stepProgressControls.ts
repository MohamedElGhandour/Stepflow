import { tags } from "@stepflow/lib/core";
import { stepProgressUI } from "@stepflow/components/stepProgressUI";
import { stepControlsUI } from "@stepflow/components/stepControlsUI";

const { div } = tags;

export function stepProgressControls() {
  return div(
    { class: "sf-progress-controls" },
    () => stepProgressUI(),
    () => stepControlsUI()
  );
}
