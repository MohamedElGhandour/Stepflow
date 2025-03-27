import { tags } from "../stepflow-core";
import { getStore } from "../store";

const { div, button } = tags;

export default function actionsUI() {
  const { nextStep, prevStep, skip } = getStore();
  const el = div(
    {
      class: "stepflow-tooltip-actions",
    },
    button({ onclick: nextStep }, "next"),
    button({ onclick: prevStep }, "back"),
    button({ onclick: skip }, "skip")
  );
  return el;
}
