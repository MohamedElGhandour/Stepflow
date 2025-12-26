# Architecture

[Home](../README.md) → [Developers](contributing.md) → Architecture

Stepflow is split into a small core runtime, UI components, and effects that keep the UI synchronized with the active step.

![Architecture overview (replace this image)](../assets/placeholders/placeholder-diagram.png)

TODO: Replace with an architecture diagram showing the main modules.

## Key modules

- `src/index.ts`: public entry point with `start(config)`
- `src/store/`: state, derived getters, navigation, and lifecycle hooks
- `src/effects/`: DOM synchronization (scroll, highlight, tooltip)
- `src/components/`: UI composition for overlay, highlight, tooltip, buttons
- `src/view/`: template helpers for tooltips and progress indicators
- `src/styles/stepflow.scss`: default styling

## Lifecycle

1) `start()` initializes the store and validates configuration.
2) UI is rendered via `components/app.ts`.
3) Effects sync UI to the current step.
4) Navigation updates state, which triggers `syncUI`.
5) `complete()` or `cancel()` cleans up listeners and removes the UI root.

---
← Prev: [Building](building.md) | Next →: [Assets: Placeholders](../assets/placeholders/README.md)
