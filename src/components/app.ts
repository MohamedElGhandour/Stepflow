import { add, tags } from "@stepflow/lib/dom";
import { overlayUI } from "@stepflow/components/overlay";
import { highlightUI } from "@stepflow/components/highlight";
import { tooltipUI } from "@stepflow/components/tooltip";

const { div } = tags;

export function render() {
  const app = div({ class: "stepflow" }, overlayUI(), highlightUI(), tooltipUI());
  add(document.body, app);
}
