# Tooltip: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Tooltip](overview.md) → Tooltip: Examples

## Header and body content

```ts
await start({
  steps: [
    {
      target: "#toolbar",
      content: { header: "Toolbar", body: "Quick actions live here." },
    },
  ],
});
```

## Custom tooltip content

```ts
await start({
  steps: [
    {
      target: "#upload",
      content: {
        component: () => "<em>Drop files here to upload.</em>",
      },
    },
  ],
});
```

---
← Prev: [Tooltip: API](api.md) | Next →: [Overlay and Highlight: Overview](../overlay-and-highlight/overview.md)
