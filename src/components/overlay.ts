import { tags } from "@stepflow/stepflow-core";

const { div } = tags;

export default function overlayUI() {
  return div({ id: "stepflow-overlay", class: "stepflow-overlay" });
}
