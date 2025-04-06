/**
 * Conditionally renders a DOM node if the condition is true.
 * If the condition is false, returns an empty text node instead.
 *
 * @param condition - A function that returns a boolean, used to determine whether to render the content.
 * @param content - A function that returns a DOM Node to render when the condition is true.
 * @returns A function that returns the resulting DOM Node when executed.
 */
export function vIf(condition: () => boolean, content: () => Node): () => Node {
  return () => (condition() ? content() : new Text(""));
}

/**
 * Conditionally renders one of two DOM nodes based on the condition.
 *
 * @param condition - A function that returns a boolean, used to determine which content to render.
 * @param ifContent - A function that returns the DOM Node to render when the condition is true.
 * @param elseContent - A function that returns the DOM Node to render when the condition is false.
 * @returns A function that returns the appropriate DOM Node when executed.
 */
export function vIfElse(
  condition: () => boolean,
  ifContent: () => Node,
  elseContent: () => Node
): () => Node {
  return () => (condition() ? ifContent() : elseContent());
}
