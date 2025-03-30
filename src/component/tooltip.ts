import { tags } from "@stepflow/utils/dom";
import stepsUI from "@stepflow/component/steps";
import actionsUI from "@stepflow/component/actions";

const {
  div,
  // h3, p
} = tags;

export default function tooltipUI() {
  // const { header, description } = getStore();
  console.log("tooltipUI");
  const el = div(
    { id: "stepflow-tooltip", class: "stepflow-tooltip" },
    stepsUI(),
    // h3(header),
    // p(description),
    actionsUI()
  );
  return el;
}
