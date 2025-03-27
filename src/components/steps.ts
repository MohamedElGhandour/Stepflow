import { tags } from "../stepflow-core";
import { getStore } from "../store";

const { div} = tags;

export default function stepsUI() {
    const {stepsLength, currentStepIndexDisplay } = getStore();
    const el = div(
        { id: "stepflow-tooltip-steps", class: "stepflow-tooltip-steps" },
        `Step ${currentStepIndexDisplay} of ${stepsLength} steps`,
    );
    return el;
}
