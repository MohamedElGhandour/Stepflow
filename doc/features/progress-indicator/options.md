# Progress Indicator: Options

[Home](../../README.md) → [Features](../steps/overview.md) → [Progress Indicator](overview.md) → Progress Indicator: Options

Progress settings are configured via `progress` in `StepflowConfig`.

## `progress`

- What it is: Controls progress style, placement, and optional custom rendering.
- Signature:

```ts
type ProgressIndicator =
  | {
      type: "custom";
      position?: "header" | "body" | "inline";
      component: (current: number, total: number) => string | HTMLElement;
    }
  | {
      type?: "counter" | "of" | "dots" | "percentage";
      position?: "header" | "body" | "inline";
      component?: never;
    };
```

- Parameters:
  - `type`: visual style (defaults to `"dots"`)
  - `position`: placement within the tooltip (defaults to `"body"`)
  - `component`: custom renderer for `type: "custom"`
- Returns: N/A
- Defaults:
  - `type: "dots"`
  - `position: "body"`
- Example:

```ts
progress: {
  type: "percentage",
  position: "header",
}
```

- Notes / Edge cases:
  - When `position: "inline"` and `type: "dots"`, Stepflow falls back to the counter style.

---
← Prev: [Progress Indicator: Overview](overview.md) | Next →: [Progress Indicator: API](api.md)
