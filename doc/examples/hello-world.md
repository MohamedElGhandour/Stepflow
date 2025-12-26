# Hello World

[Home](../README.md) → [Examples](hello-world.md) → Hello World

A minimal two-step tour.

```ts
import { start } from "stepflow";

await start({
  steps: [
    {
      target: "#hello",
      content: { header: "Hello", body: "Welcome to Stepflow." },
    },
    {
      target: "#next",
      content: { header: "Next", body: "Continue to the next step." },
    },
  ],
});
```

---
← Prev: [API: start](../api/start.md) | Next →: [Common Recipes](common-recipes.md)
