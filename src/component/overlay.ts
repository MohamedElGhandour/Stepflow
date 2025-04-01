import { tags } from "@stepflow/lib/dom";
import { classNames, vIf } from "@stepflow/utils/helpers";
import { getStore } from "@stepflow/store";

const { div } = tags;

export default function overlayUI() {
  const { showOverlay, cancel, overlayCloseOnClick } = getStore();
  const onClickHandler = async () => {
    if (overlayCloseOnClick) await cancel();
  };
  const className = classNames(
    "stepflow-overlay",
    overlayCloseOnClick && "stepflow-cursor-pointer"
  );
  return vIf(
    () => showOverlay,
    () => div({ className, onclick: onClickHandler })
  );
}
