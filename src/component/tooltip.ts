import { tags } from "@stepflow/lib/dom";
import stepsUI from "@stepflow/component/steps";
import actionsUI from "@stepflow/component/actions";

const {
  div,
  // h3, p
} = tags;

export default function tooltipUI() {
  // const { header, description } = getStore();
  const el = div(
    { id: "stepflow-tooltip", class: "stepflow-tooltip" },
    stepsUI(),
    // h3(header),
    // p(description),
    actionsUI()
  );
  return el;
}
