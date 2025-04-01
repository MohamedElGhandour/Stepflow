export function vIf(condition: () => boolean, content: () => Node): () => Node {
  return () => (condition() ? content() : new Text(""));
}

export function vIfElse(
  condition: () => boolean,
  ifContent: () => Node,
  elseContent: () => Node
): () => Node {
  return () => (condition() ? ifContent() : elseContent());
}

/**
 * Joins class names, filtering out falsy values.
 * @param classes - A list of class names that might be falsy.
 * @returns A string of class names separated by spaces.
 */
export function classNames(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function setHighlightStyle(color = "rgba(0, 0, 0, 0.8)", opacity = 0.3) {
  const { highlight } = getUIHandler();
  highlight?.style.setProperty(
    "--box-shadow",
    `${color} 0 0 1px 2px,  rgba(0, 0, 0, ${opacity}) 0 0 0 5000px`
  );
}

/**
 * Helper Types
 */
export type StepflowStatus = "active" | "completed" | "upcoming" | "blocked";
export type NavigationDirection = "forward" | "backward";

export function getElement(target: string | HTMLElement): HTMLElement | null {
  return typeof target === "string" ? document.querySelector(target) : target;
}

export function getUIHandler() {
  const highlight = getElement(".stepflow-highlight");
  const tooltip = getElement(".stepflow-tooltip");
  return { highlight, tooltip };
}
