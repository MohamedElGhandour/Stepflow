import { getStore, useStore } from "@stepflow/store";
import { StepflowConfig } from "@stepflow/types";

export async function start(props: StepflowConfig) {
  useStore(props);
  await getStore().start();
}
