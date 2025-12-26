/*
  Tests for the reactive core (state/derive/add/tags).
  These ensure DOM bindings update when state changes, preventing stale UI updates.
*/
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { add, state, tags } from "@stepflow/lib/core";

const { div } = tags;

describe("core reactivity", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("updates text bindings when state changes", () => {
    const count = state(0);
    const el = div(count);
    add(document.body, el);

    count.val = 2;
    vi.runAllTimers();

    expect(el.textContent).toBe("2");
  });

  it("updates attribute bindings derived from state", () => {
    const label = state("idle");
    const el = div({ "data-status": label }, "Status");
    add(document.body, el);

    label.val = "active";
    vi.runAllTimers();

    expect(el.getAttribute("data-status")).toBe("active");
  });
});
