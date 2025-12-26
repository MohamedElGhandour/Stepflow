# Overlay and Highlight: Overview

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: Overview

The highlight outlines the current target element. The overlay is an optional layer that can capture clicks to cancel.

![Overlay and highlight (replace this image)](../../assets/placeholders/placeholder-example.png)

TODO: Replace with a screenshot showing overlay and highlight.

## What the highlight does

- Tracks the target element’s bounding box
- Inherits the target’s border-radius
- Uses a CSS box-shadow to create a darkened backdrop

## What the overlay does

- Renders `.sf-overlay` when enabled
- Can cancel the tour if `overlay.closeOnClick` is true

---
← Prev: [Tooltip: Examples](../tooltip/examples.md) | Next →: [Overlay and Highlight: Options](options.md)
