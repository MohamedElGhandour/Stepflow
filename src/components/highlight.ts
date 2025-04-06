import { tags } from "@stepflow/lib/core";
import { getStore } from "@stepflow/store";
import { classes } from "@stepflow/utils";

const { div } = tags;

export function highlightUI() {
  const { showOverlay } = getStore();
  const className = classes("stepflow-highlight", !showOverlay && "stepflow-no-shadow");
  return div({
    class: className,
  });
}
