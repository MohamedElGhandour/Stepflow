import { tags } from "@stepflow/stepflow-core";
import { getStore } from "@stepflow/store";
import stepsUI from "@stepflow/components/steps";
import actionsUI from "@stepflow/components/actions";

const { div, h3, p } = tags;

export default function tooltipUI() {
  const { header, description } = getStore();
  console.log("tooltipUI");
  const el = div(
    { id: "stepflow-tooltip", class: "stepflow-tooltip" },
    stepsUI(),
    h3(header),
    p(description),
    actionsUI()
  );
  return el;
}
