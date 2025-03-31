import { StepflowConfig } from "@stepflow/types";
import { state } from "@stepflow/lib/dom";
import { StatusEnum } from "@stepflow/enums";

export type State = ReturnType<typeof useState>;

export function useState(config: StepflowConfig) {
  const { steps } = config;
  const stepsLength = steps.length;

  const currentStepIndex = state<number>(0);
  const status = state<StatusEnum>(StatusEnum.idle);
  const error = state<Error | null>(null);
  return {
    currentStepIndex,
    config,
    steps,
    stepsLength,
    status,
    error,
  };
}
