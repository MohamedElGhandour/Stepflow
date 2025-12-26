/*
  Tests for the deep merge utility used by config resolution.
  These guard against regressions that would drop defaults or overwrite values with undefined.
*/
import { describe, expect, it } from "vitest";
import { merge } from "@stepflow/utils/merge";

describe("merge", () => {
  it("deeply merges nested objects without losing defaults", () => {
    const target = { a: 1, nested: { keep: true, change: "a" } };
    // merge accepts a shallow Partial, so cast to allow nested partials in tests.
    const source = { nested: { change: "b" } } as Partial<typeof target>;

    const result = merge(target, source);

    expect(result.nested).toEqual({ keep: true, change: "b" });
  });

  it("skips undefined values to preserve existing data", () => {
    const target = { label: "Default", nested: { value: 10 } };
    // Cast to allow undefined nested values for validation of merge behavior.
    const source = ({ label: undefined, nested: { value: undefined } } as unknown) as Partial<
      typeof target
    >;

    const result = merge(target, source);

    // Undefined values should not overwrite existing defaults.
    expect(result).toEqual({ label: "Default", nested: { value: 10 } });
  });

  it("replaces non-plain objects like arrays instead of merging them", () => {
    const target = { items: ["a", "b"] };
    const source = { items: ["c"] };

    const result = merge(target, source);

    expect(result.items).toEqual(["c"]);
  });
});
