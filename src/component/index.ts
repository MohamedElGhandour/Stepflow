import { add, tags } from "@stepflow/utils/dom";
import overlayUI from "@stepflow/component/overlay";
import highlightUI from "@stepflow/component/highlight";
import tooltipUI from "@stepflow/component/tooltip";

const { div } = tags;

export default function inject() {
  const el = div({ class: "stepflow" }, overlayUI(), highlightUI(), tooltipUI());
  add(document.body, el);
}
