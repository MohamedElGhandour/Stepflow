# Positioning and Overlay

[Home](../README.md) → [Core Concepts](mental-model.md) → Positioning and Overlay

Stepflow keeps the tooltip and highlight aligned with the current step’s target element.

![Tooltip positioning above/below targets (replace this image)](../assets/placeholders/placeholder-diagram.png)

TODO: Replace with a diagram showing tooltip placement above/below the target.

## Highlight positioning

- The highlight uses the target’s bounding box and absolute page coordinates.
- If the target is missing, the highlight is centered and shrinks to 1px.

## Tooltip positioning

- Tooltip placement prefers below the target when there is space.
- If there isn’t room below, it moves above the target.
- Horizontal positioning clamps to the viewport with a side margin.

## Scrolling behavior

- Targets with `position: fixed` do not trigger scrolling.
- Non-fixed targets will scroll into view using `window.scrollBy` with `behavior: "smooth"`.
- `options.transitions` are stored but not used to change scrolling behavior in the current code.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="steps-and-targets.md">Steps and Targets</a></div>
  <div>Next: <a href="../guides/configuration.md">Configuration</a></div>
</div>
