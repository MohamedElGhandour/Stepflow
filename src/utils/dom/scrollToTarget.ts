import scrollTo from "@stepflow/utils/dom/scrollTo";

export function scrollToTarget(target: Element) {
  const { position } = window.getComputedStyle(target);
  if (position !== "fixed") {
    scrollTo(30, target);
  }
}
