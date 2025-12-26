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
← Prev: [Progress Indicator: Options](options.md) | Next →: [Progress Indicator: Examples](examples.md)
