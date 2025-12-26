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

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../api/start.md">API: start</a></div>
  <div>Next: <a href="common-recipes.md">Common Recipes</a></div>
</div>
