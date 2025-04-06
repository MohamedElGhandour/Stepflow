import { validateStepflowConfig } from "@stepflow/validation";
import { StepflowConfig } from "@stepflow/types";

describe("validateStepflowConfig", () => {
  it("passes with a valid config with steps", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
    };
    expect(() => validateStepflowConfig(config)).not.toThrow();
  });

  it("passes with valid overlay opacity", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
      options: { overlay: { opacity: 0.5 } },
    };
    expect(() => validateStepflowConfig(config)).not.toThrow();
  });

  it("passes with opacity of 0", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
      options: { overlay: { opacity: 0 } },
    };
    expect(() => validateStepflowConfig(config)).not.toThrow();
  });

  it("passes with opacity of 1", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
      options: { overlay: { opacity: 1 } },
    };
    expect(() => validateStepflowConfig(config)).not.toThrow();
  });

  it("throws if no steps are provided", () => {
    const config: StepflowConfig = {
      steps: [],
    };
    expect(() => validateStepflowConfig(config)).toThrow("Stepflow requires at least one step");
  });

  it("throws if steps is undefined", () => {
    const config = {} as StepflowConfig;
    expect(() => validateStepflowConfig(config)).toThrow("Stepflow requires at least one step");
  });

  it("throws if opacity is less than 0", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
      options: { overlay: { opacity: -0.1 } },
    };
    expect(() => validateStepflowConfig(config)).toThrow("Overlay opacity must be between 0 and 1");
  });

  it("throws if opacity is greater than 1", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
      options: { overlay: { opacity: 1.1 } },
    };
    expect(() => validateStepflowConfig(config)).toThrow("Overlay opacity must be between 0 and 1");
  });

  it("passes if overlay options are undefined", () => {
    const config: StepflowConfig = {
      steps: [{ target: "#step1", content: {} }],
      options: {},
    };
    expect(() => validateStepflowConfig(config)).not.toThrow();
  });
});
