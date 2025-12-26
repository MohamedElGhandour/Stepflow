# Overlay and Highlight: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: Examples

## Disable overlay

```ts
await start({
  steps: [
    {
      target: "#primary-action",
      content: { header: "Primary action", body: "Click this to proceed." },
    },
  ],
  options: {
    overlay: { enabled: false },
  },
});
```

## Adjust highlight color

```ts
await start({
  steps: [
    {
      target: "#search",
      content: { header: "Search", body: "Find items here." },
    },
  ],
  options: {
    highlightBorderColor: "rgba(0, 120, 255, 0.9)",
  },
});
```

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Overlay and Highlight: API</a></div>
  <div>Next: <a href="../navigation/overview.md">Navigation: Overview</a></div>
</div>
