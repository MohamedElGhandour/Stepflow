// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { Stepflow } from "../src/Stepflow";

/**
 * Runs with no DOM globals at all — the real condition inside a Next.js or
 * Remix server render. v1 read `document` at module scope, so importing it threw
 * before any function ran and no `typeof window` guard on the caller's side
 * could help.
 */
describe("server rendering", () => {
  it("imports and renders with no DOM present", () => {
    expect(typeof document).toBe("undefined");
    const spy = vi.spyOn(console, "error");
    const html = renderToString(<Stepflow run steps={[{ title: "One", content: "First" }]} />);
    // Nothing to portal into on the server, so nothing is emitted — and,
    // crucially, nothing throws.
    expect(html).toBe("");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("does not throw for a selector target it cannot resolve", () => {
    expect(() =>
      renderToString(<Stepflow run steps={[{ target: "#nope", content: "x" }]} />)
    ).not.toThrow();
  });
});
