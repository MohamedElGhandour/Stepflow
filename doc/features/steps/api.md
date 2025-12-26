# Steps: API

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: API

These APIs are configuration types consumed by `start()`.

## `Step`

- What it is: Defines an individual step in the tour.
- Signature:

```ts
interface Step {
  content: StepContent;
  callbacks?: StepCallbacks;
  target?: string | HTMLElement;
}
```

- Parameters:
  - `content`: required, see `StepContent`
  - `callbacks`: optional, see `StepCallbacks`
  - `target`: selector or element
- Returns: N/A
- Example:

```ts
{
  target: "#cta-button",
  content: {
    header: "Call to action",
    body: "Use this button to start.",
  },
}
```

- Notes / Edge cases:
  - Missing targets fall back to centered UI.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Steps: Options</a></div>
  <div>Next: <a href="examples.md">Steps: Examples</a></div>
</div>
