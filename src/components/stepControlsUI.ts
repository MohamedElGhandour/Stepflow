import { tags } from "@stepflow/lib/core";
import { classes } from "@stepflow/utils";
import { cancelButton } from "@stepflow/components/buttons/cancel";
import { prevButton } from "@stepflow/components/buttons/prev";
import { nextWithComplete } from "@stepflow/components/buttons/nextWithComplete";
import { getStore } from "@stepflow/store";

const { div } = tags;

export function stepControlsUI() {
  const { progressPosition: position } = getStore();
  const isInline = position.val === "inline";
  const className = classes("sf-controls", isInline && "sf-controls-inline");
  return div(
    { class: className },
    div({ class: "sf-left" }, cancelButton(), prevButton()),
    div(nextWithComplete())
  );
}
