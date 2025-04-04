import { StepflowConfig } from "@stepflow/types";
import { State, useState } from "@stepflow/store/state";
import { Getters, useGetters } from "@stepflow/store/getters";
import { useActions } from "@stepflow/store/actions";
import { validateStepflowConfig } from "@stepflow/validation";
import { mergeStepflowConfig } from "@stepflow/config";
import { getUIHandler } from "@stepflow/utils/helpers";

let storeInstance: ReturnType<typeof store> | undefined;

function store(config: StepflowConfig) {
  const state: State = useState(config);
  const getters: Getters = useGetters(state);
  const actions = useActions(state, getters);

  return {
    ...state,
    ...getters,
    ...actions,
  };
}

export function useStore(prop: StepflowConfig) {
  if (storeInstance) return;
  const config = mergeStepflowConfig(prop);
  validateStepflowConfig(config);
  storeInstance = store(config);
}

export function getStore() {
  return storeInstance!;
}

export function destroy() {
  const { app } = getUIHandler();
  app?.remove();
  storeInstance = undefined;
}
