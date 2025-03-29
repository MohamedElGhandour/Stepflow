import { tags } from "@stepflow/stepflow-core";

const { div } = tags;

export default function highlightUI() {
  return div({
    id: "stepflow-highlight",
    class: "stepflow-highlight",
  });
}
