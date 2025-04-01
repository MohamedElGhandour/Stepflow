import { add, tags } from "@stepflow/lib/dom";
import overlayUI from "@stepflow/component/overlay";
import highlightUI from "@stepflow/component/highlight";
import tooltipUI from "@stepflow/component/tooltip";

const { div } = tags;

export default function render() {
  const el = div({ class: "stepflow" }, overlayUI(), highlightUI(), tooltipUI());
  add(document.body, el);
}
