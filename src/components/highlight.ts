import { tags } from "@stepflow/lib/dom";
import { getStore } from "@stepflow/store";
import { classNames } from "@stepflow/utils/helpers";

const { div } = tags;

export function highlightUI() {
  const { showOverlay } = getStore();
  const className = classNames("stepflow-highlight", !showOverlay && "stepflow-no-shadow");
  return div({
    class: className,
  });
}
