import { getStore, initStore } from "@stepflow/store";
import { StepflowProps } from "@stepflow/types";
import "@stepflow/styles/style.scss";

export function init(props: StepflowProps) {
  initStore(props);
  const { start } = getStore();
  start();
}
