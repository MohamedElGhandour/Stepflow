import { StepflowConfig } from "@stepflow/types";
import { State, useState } from "@stepflow/store/state";
import { Getters, useGetters } from "@stepflow/store/getters";
import { validateStepflowConfig } from "@stepflow/validation";
import { mergeStepflowConfig } from "@stepflow/config";
import { useNavigation } from "@stepflow/store/useNavigation";
import { useHooks } from "@stepflow/store/useHooks";
import { useWatch } from "@stepflow/store/useWatch";
import { getUIHandler } from "@stepflow/helpers";

let storeInstance: ReturnType<typeof store> | undefined;

function store(config: StepflowConfig) {
  const state: State = useState(config);
  const getters: Getters = useGetters(state);
  const tourSteps = useNavigation(state, getters);
  const lifecycle = useHooks(state, getters, tourSteps);

  useWatch(state, getters);

  return {
    ...state,
    ...getters,
    ...tourSteps,
    ...lifecycle,
  };
}

export function useStore(prop: StepflowConfig) {
  if (storeInstance) return;
  const config = mergeStepflowConfig(prop);
  validateStepflowConfig(config);
  storeInstance = store(config);
}

export function getStore() {
  if (!storeInstance) {
    throw new Error("Store not initialized. Call start() first.");
  }
  return storeInstance;
}

export function destroy() {
  const { app } = getUIHandler();
  app?.remove();
  storeInstance = undefined;
}
