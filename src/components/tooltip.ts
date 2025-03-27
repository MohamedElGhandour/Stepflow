import { tags } from "../stepflow-core";
import { getStore } from "../store";
import actionsUI from "./actions";
import stepsUI from "./steps";

const { div, h3, p } = tags;

export default function tooltipUI() {
  const { header, description } = getStore();
  const el = div(
    { id: "stepflow-tooltip", class: "stepflow-tooltip" },
      stepsUI(),
    h3(header),
    p(description),
    actionsUI(),
  );
  return el;
}
