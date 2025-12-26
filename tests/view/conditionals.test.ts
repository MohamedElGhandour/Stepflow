/*
  Tests for conditional rendering helpers used by button/tooltip templates.
  These ensure false branches render empty text nodes instead of undefined or null.
*/
import { describe, expect, it } from "vitest";
import { vIf, vIfElse } from "@stepflow/view/conditionals";

describe("vIf", () => {
  it("returns the content node when condition is true", () => {
    const node = document.createElement("div");
    const render = vIf(() => true, () => node);

    const result = render();

    expect(result).toBe(node);
  });

  it("returns an empty text node when condition is false", () => {
    const render = vIf(() => false, () => document.createElement("div"));

    const result = render();

    expect(result.nodeType).toBe(Node.TEXT_NODE);
    // Text node should be empty to avoid injecting stray whitespace.
    expect(result.textContent).toBe("");
  });
});

describe("vIfElse", () => {
  it("renders the else branch when condition is false", () => {
    const ifNode = document.createElement("div");
    const elseNode = document.createElement("span");
    const render = vIfElse(() => false, () => ifNode, () => elseNode);

    const result = render();

    expect(result).toBe(elseNode);
  });
});
