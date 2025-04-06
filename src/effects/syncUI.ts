import { syncHighlightToTarget } from "@stepflow/effects/syncHighlightToTarget";
import { scrollToTarget } from "@stepflow/effects/scrollToTarget";
import { syncTooltipToTarget } from "@stepflow/effects/syncTooltipToTarget";
import { getUIHandler } from "@stepflow/helpers";

export function syncUI(target: HTMLElement | null) {
  const { highlight, tooltip } = getUIHandler();
  if (!target || !highlight || !tooltip) return;

  scrollToTarget(target);

  syncHighlightToTarget(target, highlight);

  syncTooltipToTarget(target, tooltip);
}
