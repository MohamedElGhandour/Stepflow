import { getStore, useStore } from "@stepflow/store";
import { StepflowConfig } from "@stepflow/types";
import "@stepflow/styles/style.scss";

export async function start(props: StepflowConfig) {
  useStore(props);
  await getStore().start();
}
