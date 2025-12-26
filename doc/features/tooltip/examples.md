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

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Tooltip: API</a></div>
  <div>Next: <a href="../overlay-and-highlight/overview.md">Overlay and Highlight: Overview</a></div>
</div>
