# Navigation: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Navigation](overview.md) → Navigation: API

These APIs are configuration types consumed by `start()`.

## `StepflowCallbacks`

- What it is: Global navigation callbacks.
- Signature: `StepflowCallbacks`
- Parameters:
  - `onStart`, `onComplete`, `onCancel`, `onNext`, `onPrev`, `onError`
- Returns: `Promise<void> | void` (except `onError`)
- Example:

```ts
callbacks: {
  onNext: (step) => console.log("Next", step),
}
```

- Notes / Edge cases:
  - Callback execution is wrapped with error handling.

---
← Prev: [Navigation: Options](options.md) | Next →: [Navigation: Examples](examples.md)
