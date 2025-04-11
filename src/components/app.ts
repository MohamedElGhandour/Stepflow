import { add, tags } from "@stepflow/lib/core";
import { overlayUI } from "@stepflow/components/overlayUI";
import { highlightUI } from "@stepflow/components/highlightUI";
import { tooltipUI } from "@stepflow/components/tooltipUI";

const { div } = tags;

export function render() {
  add(document.body, div({ class: "sf-root" }, overlayUI(), highlightUI(), tooltipUI()));
}
