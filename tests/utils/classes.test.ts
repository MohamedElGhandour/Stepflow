/*
  Tests for class name composition helper used across UI components.
  This prevents regressions where falsy values leak into the class string.
*/
import { describe, expect, it } from "vitest";
import { classes } from "@stepflow/utils/classes";

describe("classes", () => {
  it("joins only truthy class names", () => {
    const result = classes("sf-btn", false, undefined, "active", null);

    expect(result).toBe("sf-btn active");
  });

  it("returns an empty string when all inputs are falsy", () => {
    const result = classes(undefined, false, null);

    expect(result).toBe("");
  });
});
