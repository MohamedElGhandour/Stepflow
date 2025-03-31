import { tags } from "@stepflow/lib/dom";

const { div } = tags;

export default function overlayUI() {
  return div({ id: "stepflow-overlay", class: "stepflow-overlay" });
}
