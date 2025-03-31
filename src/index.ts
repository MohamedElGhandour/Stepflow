import { getStore, initStore } from "@stepflow/store";
import { StepflowConfig } from "@stepflow/types";
import "@stepflow/styles/style.scss";

export function init(props: StepflowConfig) {
  initStore(props);
  const { start } = getStore();
  console.log(getStore());
  start();
}
