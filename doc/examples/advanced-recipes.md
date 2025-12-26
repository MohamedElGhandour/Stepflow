# Advanced Recipes

[Home](../README.md) → [Examples](hello-world.md) → Advanced Recipes

## Custom progress and callbacks

```ts
await start({
  steps: [
    {
      target: "#analytics",
      content: { header: "Analytics", body: "Track usage here." },
    },
    {
      target: "#reports",
      content: { header: "Reports", body: "Download reports here." },
    },
  ],
  progress: {
    type: "custom",
    position: "inline",
    component: (current, total) => `<span>${current} of ${total}</span>`,
  },
  callbacks: {
    onStart: () => console.log("Tour started"),
    onComplete: () => console.log("Tour completed"),
  },
});
```

## Step-specific navigation hooks

```ts
await start({
  steps: [
    {
      target: "#upload",
      content: { header: "Upload", body: "Drop files here." },
      callbacks: {
        onNext: () => console.log("Leaving upload step"),
      },
    },
  ],
});
```

---
← Prev: [Common Recipes](common-recipes.md) | Next →: [Contributing](../developers/contributing.md)
