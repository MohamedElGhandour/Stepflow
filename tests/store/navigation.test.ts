/*
  Tests navigation logic to ensure step transitions and callbacks behave correctly.
  These protect against regressions in next/prev navigation boundaries and side effects.
*/
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStepflowConfig } from "../helpers/config";
import { destroy, getStore, useStore } from "@stepflow/store";

describe("useNavigation", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="stepflow-target-1"></div>
      <div id="stepflow-target-2"></div>
    `;
    vi.useFakeTimers();
  });

  afterEach(() => {
    destroy();
    vi.runAllTimers();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("advances and rewinds steps while invoking callbacks", async () => {
    const onNextStep = vi.fn();
    const onPrevStep = vi.fn();
    const onNextGlobal = vi.fn();
    const onPrevGlobal = vi.fn();

    const config = createStepflowConfig({
      steps: [
        { target: "#stepflow-target-1", content: { header: "Step 1" }, callbacks: { onNext: onNextStep } },
        { target: "#stepflow-target-2", content: { header: "Step 2" }, callbacks: { onPrev: onPrevStep } },
      ],
      callbacks: { onNext: onNextGlobal, onPrev: onPrevGlobal },
    });

    useStore(config);
    const { nextStep, prevStep, currentStepIndex, directionState } = getStore();

    await nextStep();
    vi.runAllTimers();

    expect(currentStepIndex.val).toBe(1);
    expect(directionState.val).toBe("forward");
    expect(onNextStep).toHaveBeenCalledTimes(1);
    expect(onNextGlobal).toHaveBeenCalledTimes(1);

    await prevStep();
    vi.runAllTimers();

    expect(currentStepIndex.val).toBe(0);
    expect(directionState.val).toBe("backward");
    expect(onPrevStep).toHaveBeenCalledTimes(1);
    expect(onPrevGlobal).toHaveBeenCalledTimes(1);
  });

  it("does not move past the first or last step", async () => {
    const config = createStepflowConfig();
    useStore(config);
    const { nextStep, prevStep, currentStepIndex, stepsLength } = getStore();

    await prevStep();
    vi.runAllTimers();
    expect(currentStepIndex.val).toBe(0);

    currentStepIndex.val = stepsLength - 1;
    vi.runAllTimers();
    await nextStep();
    vi.runAllTimers();
    expect(currentStepIndex.val).toBe(stepsLength - 1);
  });
});
