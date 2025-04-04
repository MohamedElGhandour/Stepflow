import { tags } from "@stepflow/lib/dom";
import { stepsUI } from "@stepflow/components/steps";
import { actionsUI } from "@stepflow/components/actions";

const {
  div,
  // h3, p
} = tags;

export function tooltipUI() {
  // const { header, description } = getStore();
  return div(
    { id: "stepflow-tooltip", class: "stepflow-tooltip" },
    stepsUI(),
    // h3(header),
    // p(description),
    actionsUI()
  );
}
