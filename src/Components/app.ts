import { add, tags } from "@stepflow/lib/dom";
import overlayUI from "@stepflow/Components/overlay";
import highlightUI from "@stepflow/Components/highlight";
import tooltipUI from "@stepflow/Components/tooltip";

const { div } = tags;

export default function render() {
  const el = div({ class: "stepflow" }, overlayUI(), highlightUI(), tooltipUI());
  add(document.body, el);
}
