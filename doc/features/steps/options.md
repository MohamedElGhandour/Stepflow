# Steps: Options

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: Options

This page documents the `steps` configuration and related types.

## `steps`

- What it is: Ordered list of steps in the tour.
- Signature: `steps: Step[]`
- Parameters:
  - `Step.target`: `string | HTMLElement | undefined`
  - `Step.content`: `StepContent` (required)
  - `Step.callbacks`: `StepCallbacks | undefined`
- Returns: N/A
- Example:

```ts
await start({
  steps: [
    {
      target: "#profile-avatar",
      content: { header: "Profile", body: "Edit your profile here." },
    },
  ],
});
```

- Notes / Edge cases:
  - If `target` is missing or not found, the tooltip/highlight are centered.

## `StepContent`

- What it is: Defines what the tooltip renders for a step.
- Signature:

```ts
interface StepContent {
  header?: string | HTMLElement;
  body?: string | HTMLElement;
  component?: (step: Step) => string | HTMLElement;
}
```

- Parameters:
  - `header`: optional title content
  - `body`: optional body content
  - `component`: optional renderer that receives the current `Step`
- Returns: N/A
- Example:

```ts
content: {
  header: "Invite",
  body: "Add teammates to collaborate.",
}
```

- Notes / Edge cases:
  - Content is assigned via `innerHTML`.
  - TODO: Confirm behavior in code when `HTMLElement` values are provided.

## `StepCallbacks`

- What it is: Per-step navigation callbacks.
- Signature:

```ts
interface StepCallbacks {
  onNext?: (currentStep: Step) => Promise<void> | void;
  onPrev?: (currentStep: Step) => Promise<void> | void;
}
```

- Parameters:
  - `currentStep`: the current `Step` instance
- Returns: `Promise<void> | void`
- Example:

```ts
callbacks: {
  onNext: async (step) => {
    console.log("Leaving step", step);
  },
},
```

- Notes / Edge cases:
  - Step-level callbacks run before global callbacks.

---
← Prev: [Steps: Overview](overview.md) | Next →: [Steps: API](api.md)
