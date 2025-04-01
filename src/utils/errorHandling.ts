import { State } from "@stepflow/store/state";

export async function executeWithErrorHandling<T>(state: State, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    state.status.val = "error";
    if (state.config.callbacks?.onError) {
      state.config.callbacks.onError(error);
    }
    throw error;
  }
}
