
import inject from "./components";
import {getStore, initStore} from "./store";
import {StepflowProps} from "./types";
import  "./styles/style.scss";

export function init(props: StepflowProps) {
    initStore(props);
    console.log("init", props);
    console.log("store",getStore());
    const {start }= getStore();
    start();
}