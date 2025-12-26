# Steps: Overview

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: Overview

Steps define the tour sequence: what to say and where to point.

![Step list overview (replace this image)](../../assets/placeholders/placeholder-example.png)

TODO: Replace with a screenshot of a multi-step tour.

## What a step includes

- `target`: selector or element to anchor the highlight/tooltip
- `content`: header/body or a custom component
- `callbacks`: optional per-step navigation hooks

## When a target is missing

If `target` is omitted or cannot be resolved, Stepflow centers the tooltip and highlight in the viewport.

---
← Prev: [Accessibility](../../guides/accessibility.md) | Next →: [Steps: Options](options.md)
