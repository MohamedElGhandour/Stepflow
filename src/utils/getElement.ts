/**
 * Resolves a DOM element from a selector string or returns the element directly.
 *
 * @param target - A CSS selector string or an HTMLElement reference.
 * @returns The matched HTMLElement or null if not found.
 */
export function getElement(target: string | HTMLElement): HTMLElement | null {
  return typeof target === "string" ? document.querySelector(target) : target;
}
