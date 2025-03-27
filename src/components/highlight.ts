import { tags } from "../stepflow-core";
import { getStore } from "../store";

const { div } = tags;

export default function highlightUI() {
  const el = div({
    id: "stepflow-highlight",
    class: "stepflow-highlight",
  });
  return el;
}
