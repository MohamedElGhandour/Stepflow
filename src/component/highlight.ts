import { tags } from "@stepflow/lib/dom";

const { div } = tags;

export default function highlightUI() {
  return div({
    id: "stepflow-highlight",
    class: "stepflow-highlight",
  });
}
