import { State } from "@stepflow/store/state";
import { Getters } from "@stepflow/store/getters";
import { useStepActions } from "@stepflow/store/actions/stepActions";
import { useLifecycle } from "@stepflow/store/actions/lifecycle";

export function useActions(state: State, getters: Getters) {
  return {
    ...useStepActions(state, getters),
    ...useLifecycle(state, getters),
  };
}
