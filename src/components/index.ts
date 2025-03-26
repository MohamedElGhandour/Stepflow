import { tags } from "../stepflow-core";
import overlayUI from "./overlay";
import highlightUI from "./highlight";
import tooltipUI from "./tooltip";
import  "../styles/style.scss";



const { div } = tags;

export default function inject() {
    const el = div(
        { class: 'stepflow' },
        overlayUI(),
        highlightUI(),
        tooltipUI(),
    );
    document.body.appendChild(el);
}
