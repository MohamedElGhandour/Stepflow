# Quick Start

[Home](../README.md) → [Getting Started](installation.md) → Quick Start

This is the minimal setup to start a Stepflow tour.

![A simple Stepflow tooltip and highlight (replace this image)](../assets/placeholders/placeholder-example.png)

TODO: Replace with a screenshot of a minimal two-step tour.

## 1) Add targets to your UI

```html
<button id="stepflow-target-1">Create Project</button>
<button id="stepflow-target-2">Invite Team</button>
```

## 2) Start the tour

```ts
import { start } from "stepflow";

await start({
  steps: [
    {
      target: "#stepflow-target-1",
      content: {
        header: "Create your first project",
        body: "This button starts your project wizard.",
      },
    },
    {
      target: "#stepflow-target-2",
      content: {
        header: "Invite your team",
        body: "Add teammates to collaborate.",
      },
    },
  ],
});
```

Notes:

- Call `start()` after the target elements exist in the DOM.
- Step content strings are assigned via `innerHTML`. Sanitize user-provided content.

---
← Prev: [Installation](installation.md) | Next →: [Mental Model](../core-concepts/mental-model.md)
