import {StepflowConfig} from "@stepflow/types";

/**
 * Validates the configuration for Stepflow.
 *
 * Ensures that the configuration includes at least one step and that
 * any overlay opacity provided is within the range [0, 1].
 *
 * @param {StepflowConfig} config - The configuration object for Stepflow.
 * @throws {Error} If the configuration is invalid.
 */
export function validateStepflowConfig(config: StepflowConfig) {
  const opacity = config.options?.overlay?.opacity;

  if (!config.steps?.length) {
    throw new Error("Stepflow requires at least one step");
  }

  if (opacity && (opacity < 0 || opacity > 1)) {
    throw new Error("Overlay opacity must be between 0 and 1");
  }
}
