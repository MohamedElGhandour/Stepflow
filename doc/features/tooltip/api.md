# Tooltip: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Tooltip](overview.md) → Tooltip: API

The tooltip is rendered by internal components. There are no public methods for it, but these DOM hooks are stable in the current code.

## Tooltip DOM hooks

- What it is: CSS selectors for the tooltip container and arrow positioning.
- Signature: `.sf-tooltip`, `.sf-arrow-top`, `.sf-arrow-bottom`
- Parameters: N/A
- Returns: N/A
- Example:

```css
.sf-tooltip {
  width: 320px;
}
```

- Notes / Edge cases:
  - The tooltip uses `role="tooltip"` and `aria-modal="true"`.
  - Tooltip placement toggles `.sf-arrow-top` and `.sf-arrow-bottom`.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Tooltip: Options</a></div>
  <div>Next: <a href="examples.md">Tooltip: Examples</a></div>
</div>
