import { State } from "@stepflow/store/state";
import { setHighlightStyle } from "@stepflow/effects";

export function initializeUI(
  state: State,
  resizeHandler: () => void,
  keyUpHandler: (e: KeyboardEvent) => void
) {
  const { config, highlightBorderColor, overlayOpacity } = state;
  document.body.classList.add("stepflow-overflow-hidden");
  window.addEventListener("resize", resizeHandler);
  if (config.options?.keyboardControls || config.options?.escapeToCancel) {
    document.addEventListener("keyup", keyUpHandler);
  }

  setHighlightStyle(highlightBorderColor, overlayOpacity);
}
