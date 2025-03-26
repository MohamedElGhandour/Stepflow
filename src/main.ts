
import inject from "./components";
import {getStore, initStore, store} from "./store";
import {StepflowProps} from "./types";


export function init(props: StepflowProps) {
    inject();
    initStore(props);
    console.log("init", props);
    console.log("store",getStore());
    const {start }= getStore();
    start();

}