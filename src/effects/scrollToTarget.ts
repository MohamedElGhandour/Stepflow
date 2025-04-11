import { useScrollTo } from "@stepflow/utils";

export function scrollToTarget(target: Element | null) {
  if (!target) return;
  const { position } = window.getComputedStyle(target);
  if (position !== "fixed") {
    useScrollTo(30, target);
  }
}
