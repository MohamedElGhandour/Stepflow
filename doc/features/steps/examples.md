# Steps: Examples

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: Examples

## Step with custom component

```ts
await start({
  steps: [
    {
      target: "#billing",
      content: {
        component: (step) => `<strong>${step.content.header ?? "Billing"}</strong>`,
      },
    },
  ],
});
```

## Step with HTMLElement target

```ts
const element = document.querySelector("#settings");

await start({
  steps: [
    {
      target: element ?? undefined,
      content: { header: "Settings", body: "Manage preferences here." },
    },
  ],
});
```

---
← Prev: [Steps: API](api.md) | Next →: [Tooltip: Overview](../tooltip/overview.md)
