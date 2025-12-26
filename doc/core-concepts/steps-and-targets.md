# Steps and Targets

[Home](../README.md) → [Core Concepts](mental-model.md) → Steps and Targets

Steps are the core input to Stepflow. Each step describes _what_ to show and _where_ to anchor it.

<!-- TODO: Replace with a diagram showing a target element and tooltip/highlight alignment. -->

## Step structure

```ts
interface Step {
  target?: string | HTMLElement;
  content: StepContent;
  callbacks?: StepCallbacks;
}
```

## Targets

- `target` can be a CSS selector or an `HTMLElement`.
- If no target is found, Stepflow centers the tooltip and highlight in the viewport.

## Content

```ts
interface StepContent {
  header?: string | HTMLElement;
  body?: string | HTMLElement;
  component?: (step: Step) => string | HTMLElement;
}
```

Notes:

- The UI renders `header`, `body`, and `component()` via `innerHTML`.
- TODO: Confirm behavior in code when an `HTMLElement` is provided (it is assigned to `innerHTML`).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="mental-model.md">Mental Model</a></div>
  <div>Next: <a href="positioning-and-overlay.md">Positioning and Overlay</a></div>
</div>
