import { ProgressIndicatorPosition } from "@stepflow/types";
import { contentUI } from "@stepflow/components/contentUI";
import { stepProgressUI } from "@stepflow/components/stepProgressUI";
import { stepControlsUI } from "@stepflow/components/stepControlsUI";
import { card } from "@stepflow/view/card";
import { stepProgressControls } from "@stepflow/components/stepProgressControls";

export function tooltipTemplate(position: ProgressIndicatorPosition) {
  if (position === "header")
    return card({
      classes: "sf-tooltip",
      attrs: { role: "tooltip", "aria-modal": "true" },
      header: stepProgressUI,
      body: contentUI,
      footer: stepControlsUI,
    });

  if (position === "inline")
    return card({
      classes: "sf-tooltip no-body",
      attrs: { role: "tooltip", "aria-modal": "true" },
      header: contentUI,
      footer: stepProgressControls,
    });

  /** default */
  return card({
    classes: "sf-tooltip",
    attrs: { role: "tooltip", "aria-modal": "true" },
    header: contentUI,
    body: stepProgressUI,
    footer: stepControlsUI,
  });
}
