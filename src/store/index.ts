import { StepflowConfig } from "@stepflow/types";
import { State, useState } from "@stepflow/store/state";
import { Getters, useGetters } from "@stepflow/store/getters";
import { useActions } from "@stepflow/store/actions";
import { validateStepflowConfig } from "@stepflow/validation";

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

let storeInstance: ReturnType<typeof store>;

export function initStore(config: StepflowConfig) {
  validateStepflowConfig(config);
  storeInstance = store(config);
}

export function getStore() {
  return storeInstance;
}
