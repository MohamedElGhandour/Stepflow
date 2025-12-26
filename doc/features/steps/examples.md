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

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Steps: API</a></div>
  <div>Next: <a href="../tooltip/overview.md">Tooltip: Overview</a></div>
</div>
