import {tags} from "../stepflow-core";

const { div } = tags;

export default function overlayUI() {
    const el = div({id: 'stepflow-overlay', class: 'stepflow-overlay'});
    return el;
}