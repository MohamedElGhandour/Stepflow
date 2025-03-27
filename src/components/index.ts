import { tags, add } from "../stepflow-core";
import overlayUI from "./overlay";
import highlightUI from "./highlight";
import tooltipUI from "./tooltip";



const { div } = tags;

export default function inject() {
    const el = div(
        { class: 'stepflow' },
        overlayUI(),
        highlightUI(),
        tooltipUI(),
    );
    add(document.body, el);
}
