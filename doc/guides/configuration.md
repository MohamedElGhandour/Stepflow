# Configuration

[Home](../README.md) → [Guides](configuration.md) → Configuration

All configuration is passed to `start(config)` and described by `StepflowConfig` in `src/types/index.d.ts`.

![Configuration overview (replace this image)](../assets/placeholders/placeholder-diagram.png)

TODO: Replace with a diagram showing the config object structure.

## StepflowConfig

```ts
interface StepflowConfig {
  steps: Step[];
  callbacks?: StepflowCallbacks;
  buttons?: ButtonConfig;
  options?: StepflowOptions;
  progress?: ProgressIndicator;
}
```

## Defaults (from `src/config/index.ts`)

```ts
const defaultStepflowConfig = {
  options: {
    keyboardControls: true,
    escapeToCancel: true,
    highlightBorderColor: "rgba(0, 0, 0, 0.8)",
    overlay: {
      enabled: true,
      opacity: 0.3,
      closeOnClick: true,
    },
    transitions: {
      scrollBehavior: "smooth",
      animationDuration: 300,
    },
  },
  buttons: {
    cancel: { visible: true, label: "Skip", className: "" },
    prev: { visible: true, label: "Back", className: "" },
    next: { label: "Next", className: "" },
    complete: { label: "Done", className: "" },
  },
  progress: {
    type: "dots",
    position: "body",
  },
};
```

Notes:

- `steps` is required and must contain at least one step.
- Overlay opacity is validated to be within `[0, 1]`.
- `options.transitions` exist in config but are not used by the runtime logic in the current code.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../core-concepts/positioning-and-overlay.md">Positioning and Overlay</a></div>
  <div>Next: <a href="styling-and-theming.md">Styling and Theming</a></div>
</div>
