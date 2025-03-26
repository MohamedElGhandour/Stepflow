import {tags} from "../stepflow-core";

const { div } = tags;

export default function highlightUI() {
    const el = div({id: 'stepflow-highlight', class: 'stepflow-highlight'});
    return el;
}