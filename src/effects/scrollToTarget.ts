import { useScrollTo } from "@stepflow/utils";

export function scrollToTarget(target: Element) {
  const { position } = window.getComputedStyle(target);
  if (position !== "fixed") {
    useScrollTo(30, target);
  }
}
