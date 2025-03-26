import {tags} from "../stepflow-core";

const { div } = tags;

export default function tooltipUI() {
    const el = div({id: 'stepflow-tooltip', class: 'stepflow-tooltip'}, "el sayed basha el balad");
    return el;
}