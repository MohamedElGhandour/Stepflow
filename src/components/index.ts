import { add, tags } from "@stepflow/stepflow-core";
import overlayUI from "@stepflow/components/overlay";
import highlightUI from "@stepflow/components/highlight";
import tooltipUI from "@stepflow/components/tooltip";

const { div } = tags;

export default function inject() {
  const el = div({ class: "stepflow" }, overlayUI(), highlightUI(), tooltipUI());
  add(document.body, el);
}
