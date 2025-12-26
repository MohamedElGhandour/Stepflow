# Navigation: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Navigation](overview.md) → Navigation: Examples

## Custom button labels

```ts
await start({
  steps: [
    {
      target: "#settings",
      content: { header: "Settings", body: "Manage your preferences." },
    },
  ],
  buttons: {
    prev: { label: "Back" },
    next: { label: "Continue" },
    complete: { label: "Finish" },
  },
});
```

## Track navigation with callbacks

```ts
await start({
  steps: [
    {
      target: "#billing",
      content: { header: "Billing", body: "Update payment details." },
    },
  ],
  callbacks: {
    onStart: (step) => console.log("Start", step),
    onNext: (step) => console.log("Next", step),
  },
});
```

---
← Prev: [Navigation: API](api.md) | Next →: [Progress Indicator: Overview](../progress-indicator/overview.md)
