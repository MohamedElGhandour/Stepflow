
import {start} from "./package/tour";
import {store} from "./store";
import {StepflowProps} from "./types";


export function init(props: StepflowProps) {
    start();
    console.log(store(props));
    console.log("init", props);
}