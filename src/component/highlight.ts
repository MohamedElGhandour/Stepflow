import { tags } from "@stepflow/utils/dom";

const { div } = tags;

export default function highlightUI() {
  return div({
    id: "stepflow-highlight",
    class: "stepflow-highlight",
  });
}
