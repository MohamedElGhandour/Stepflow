import { tags } from "@stepflow/lib/core";
import { vIf } from "@stepflow/view/conditionals";
import { getStore } from "@stepflow/store";
import { classes } from "@stepflow/utils";

const { div } = tags;

export function overlayUI() {
  const { showOverlay, cancel, overlayCloseOnClick } = getStore();
  const onClickHandler = async () => {
    if (overlayCloseOnClick) await cancel();
  };
  const className = classes("sf-overlay", overlayCloseOnClick && "sf-pointer");
  return vIf(
    () => showOverlay,
    () => div({ className, onclick: onClickHandler })
  );
}
