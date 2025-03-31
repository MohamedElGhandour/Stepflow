import { syncHighlightToTarget } from "@stepflow/utils/dom/syncHighlightToTarget";
import { scrollToTarget } from "@stepflow/utils/dom/scrollToTarget";
import { syncTooltipToTarget } from "@stepflow/utils/dom/syncTooltipToTarget";

export function syncUIPositions(
  highlightEl: HTMLElement | null,
  tooltipEl: HTMLElement | null,
  target: HTMLElement | null
) {
  if (!target || !highlightEl || !tooltipEl) return;

  scrollToTarget(target);

  syncHighlightToTarget(target, highlightEl);

  syncTooltipToTarget(target, tooltipEl);
}
