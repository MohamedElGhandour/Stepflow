# Overlay and Highlight: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: API

These APIs are configuration types consumed by `start()`.

## `options.overlay`

- What it is: Overlay configuration block.
- Signature: `overlay?: { enabled?: boolean; opacity?: number; closeOnClick?: boolean }`
- Parameters:
  - `enabled`: boolean
  - `opacity`: number
  - `closeOnClick`: boolean
- Returns: N/A
- Example:

```ts
options: {
  overlay: { enabled: false },
}
```

- Notes / Edge cases:
  - Overlay is rendered only when `enabled` is true (default is true).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Overlay and Highlight: Options</a></div>
  <div>Next: <a href="examples.md">Overlay and Highlight: Examples</a></div>
</div>
