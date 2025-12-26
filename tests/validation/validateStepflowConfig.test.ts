/*
  Tests config validation to ensure malformed inputs are rejected early.
  Prevents silent failures when required steps or option bounds are missing.
*/
import { describe, expect, it } from "vitest";
import { validateStepflowConfig } from "@stepflow/validation";
import { mergeStepflowConfig } from "@stepflow/config";
import { createStepflowConfig } from "../helpers/config";

describe("validateStepflowConfig", () => {
  it("throws when no steps are provided", () => {
    const config = mergeStepflowConfig({ steps: [] });

    expect(() => validateStepflowConfig(config)).toThrow("Stepflow requires at least one step");
  });

  it("throws when overlay opacity is out of range", () => {
    const config = mergeStepflowConfig(
      createStepflowConfig({
        options: {
          overlay: { opacity: 2 },
        },
      })
    );

    expect(() => validateStepflowConfig(config)).toThrow("Overlay opacity must be between 0 and 1");
  });
});
