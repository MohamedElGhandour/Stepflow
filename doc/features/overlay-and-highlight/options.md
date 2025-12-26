# Overlay and Highlight: Options

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: Options

These options live under `options` in `StepflowConfig`.

## `options.highlightBorderColor`

- What it is: Color used for the highlight outline.
- Signature: `highlightBorderColor?: string`
- Parameters: N/A
- Returns: N/A
- Default: `"rgba(0, 0, 0, 0.8)"`
- Example:

```ts
options: {
  highlightBorderColor: "rgba(255, 80, 80, 0.9)",
}
```

- Notes / Edge cases:
  - Used to build the `--box-shadow` style on `.sf-highlight`.

## `options.overlay`

- What it is: Controls overlay rendering and click-to-cancel behavior.
- Signature:

```ts
overlay?: {
  enabled?: boolean;
  opacity?: number;
  closeOnClick?: boolean;
};
```

- Parameters:
  - `enabled`: show/hide the overlay layer
  - `opacity`: used in the highlight box-shadow backdrop
  - `closeOnClick`: cancel the tour when the overlay is clicked
- Returns: N/A
- Defaults:
  - `enabled: true`
  - `opacity: 0.3`
  - `closeOnClick: true`
- Example:

```ts
options: {
  overlay: {
    enabled: true,
    opacity: 0.5,
    closeOnClick: true,
  },
}
```

- Notes / Edge cases:
  - `opacity` is validated to be within `[0, 1]`.

---
← Prev: [Overlay and Highlight: Overview](overview.md) | Next →: [Overlay and Highlight: API](api.md)
