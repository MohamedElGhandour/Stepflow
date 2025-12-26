# Common Recipes

[Home](../README.md) → [Examples](hello-world.md) → Common Recipes

## Cancel on overlay click

```ts
await start({
  steps: [
    {
      target: "#projects",
      content: { header: "Projects", body: "Your workspace list." },
    },
  ],
  options: {
    overlay: { enabled: true, closeOnClick: true },
  },
});
```

## Custom button classes

```ts
await start({
  steps: [
    {
      target: "#invite",
      content: { header: "Invite", body: "Add teammates." },
    },
  ],
  buttons: {
    next: { className: "btn-primary" },
    cancel: { className: "btn-muted" },
  },
});
```

## Disable keyboard navigation

```ts
await start({
  steps: [
    {
      target: "#billing",
      content: { header: "Billing", body: "Manage invoices here." },
    },
  ],
  options: {
    keyboardControls: false,
    escapeToCancel: false,
  },
});
```

---
← Prev: [Hello World](hello-world.md) | Next →: [Advanced Recipes](advanced-recipes.md)
