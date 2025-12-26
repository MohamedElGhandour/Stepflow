# `start`

[Home](../README.md) → [API](index.md) → `start`

Initializes the Stepflow UI and starts the tour.

## Signature

```ts
start(config: StepflowConfig): Promise<void>
```

## Parameters

- `config`: `StepflowConfig`

## Returns

- `Promise<void>`

## Example

```ts
import { start } from "@mohamedelghandour/stepflow";

await start({
  steps: [
    {
      target: "#cta",
      content: { header: "Get started", body: "Click here to begin." },
    },
  ],
});
```

## Notes / Edge cases

- `steps` must include at least one item; otherwise an error is thrown.
- Overlay opacity is validated to be within `[0, 1]` when provided.
- Stepflow uses a singleton store; repeated `start()` calls do not re-initialize the tour unless it has been cleaned up internally.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="index.md">API Index</a></div>
  <div>Next: <a href="../examples/hello-world.md">Hello World</a></div>
</div>
