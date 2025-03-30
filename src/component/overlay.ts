import { tags } from "@stepflow/utils/dom";

const { div } = tags;

export default function overlayUI() {
  return div({ id: "stepflow-overlay", class: "stepflow-overlay" });
}
