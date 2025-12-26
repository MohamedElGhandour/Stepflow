# Progress Indicator: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Progress Indicator](overview.md) → Progress Indicator: Examples

## Percentage progress

```ts
await start({
  steps: [
    {
      target: "#one",
      content: { header: "Step 1", body: "First step" },
    },
    {
      target: "#two",
      content: { header: "Step 2", body: "Second step" },
    },
  ],
  progress: {
    type: "percentage",
    position: "header",
  },
});
```

## Custom progress component

```ts
await start({
  steps: [
    {
      target: "#one",
      content: { header: "Step 1", body: "First step" },
    },
  ],
  progress: {
    type: "custom",
    position: "inline",
    component: (current, total) => `<strong>${current}/${total}</strong>`,
  },
});
```

---
← Prev: [Progress Indicator: API](api.md) | Next →: [API Index](../../api/index.md)
