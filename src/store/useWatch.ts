import { Getters } from "@stepflow/store/getters";
import { State } from "@stepflow/store/state";
import { derive } from "@stepflow/lib/core";
import { syncUI } from "@stepflow/effects";

export function useWatch(_state: State, getters: Getters) {
  const { currentTargetElement } = getters;

  derive(() => {
    syncUI(currentTargetElement.val);
  });
}
