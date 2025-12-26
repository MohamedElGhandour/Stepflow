# Progress Indicator: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Progress Indicator](overview.md) → Progress Indicator: API

These APIs are configuration types consumed by `start()`.

## `ProgressIndicator`

- What it is: Defines the progress style and optional custom rendering.
- Signature: `ProgressIndicator`
- Parameters:
  - `type`, `position`, `component`
- Returns: N/A
- Example:

```ts
progress: {
  type: "custom",
  position: "inline",
  component: (current, total) => `${current} / ${total}`,
}
```

- Notes / Edge cases:
  - The custom component output is assigned via `innerHTML`.
  - TODO: Confirm behavior in code when the custom component returns an `HTMLElement`.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Progress Indicator: Options</a></div>
  <div>Next: <a href="examples.md">Progress Indicator: Examples</a></div>
</div>
