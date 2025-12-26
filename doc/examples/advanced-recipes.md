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

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="common-recipes.md">Common Recipes</a></div>
  <div>Next: <a href="../developers/contributing.md">Contributing</a></div>
</div>
