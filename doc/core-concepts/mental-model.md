# Mental Model

[Home](../README.md) → [Core Concepts](mental-model.md) → Mental Model

Stepflow renders a lightweight UI layer (overlay, highlight, tooltip) and keeps it synchronized with your current step’s target element.

![Stepflow mental model diagram (replace this image)](../assets/placeholders/placeholder-diagram.png)

TODO: Replace with a diagram showing steps → store → UI.

## How it flows

1) You call `start()` with a `StepflowConfig`.
2) The config is merged with defaults and validated.
3) Stepflow creates UI elements (`.sf-overlay`, `.sf-highlight`, `.sf-tooltip`).
4) The current step drives positioning and content.
5) Navigation updates the current step and resyncs the UI.

## What changes between steps

- The active target element changes.
- Tooltip content updates (header/body or custom component).
- Highlight and tooltip positions are recalculated.
- Progress indicator updates based on step index.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../getting-started/quick-start.md">Quick Start</a></div>
  <div>Next: <a href="steps-and-targets.md">Steps and Targets</a></div>
</div>
