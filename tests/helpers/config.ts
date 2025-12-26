import { StepflowConfig } from "@stepflow/types";

export function createStepflowConfig(overrides: Partial<StepflowConfig> = {}): StepflowConfig {
  const base: StepflowConfig = {
    steps: [
      {
        target: "#stepflow-target-1",
        content: { header: "First step", body: "First body" },
      },
      {
        target: "#stepflow-target-2",
        content: { header: "Second step", body: "Second body" },
      },
    ],
  };

  return {
    ...base,
    ...overrides,
    steps: overrides.steps ?? base.steps,
  };
}
