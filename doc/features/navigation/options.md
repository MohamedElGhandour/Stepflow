# Navigation: Options

[Home](../../README.md) → [Features](../steps/overview.md) → [Navigation](overview.md) → Navigation: Options

Navigation is configured via `buttons` and `callbacks` in `StepflowConfig`.

## `buttons`

- What it is: Labels, visibility, and classes for navigation buttons.
- Signature:

```ts
interface ButtonConfig {
  cancel?: { visible?: boolean; label?: string; className?: string; ariaLabel?: string };
  prev?: { visible?: boolean; label?: string; className?: string; ariaLabel?: string };
  next?: { label?: string; className?: string; loading?: boolean; ariaLabel?: string };
  complete?: { label?: string; className?: string; ariaLabel?: string };
}
```

- Parameters:
  - `visible`: whether the button is shown (where applicable)
  - `label`: button text
  - `className`: additional class name to append
  - `ariaLabel`: accessible label
  - `loading`: reserved for future use (not read by current UI code)
- Returns: N/A
- Defaults:
  - `cancel.visible: true`, `cancel.label: "Skip"`, `cancel.className: ""`
  - `prev.visible: true`, `prev.label: "Back"`, `prev.className: ""`
  - `next.label: "Next"`, `next.className: ""`
  - `complete.label: "Done"`, `complete.className: ""`
- Example:

```ts
buttons: {
  cancel: { label: "Skip tour", className: "btn-muted" },
  next: { label: "Continue" },
}
```

- Notes / Edge cases:
  - Cancel is hidden on the last step; Prev is hidden on the first step.

## `callbacks`

- What it is: Global tour callbacks triggered by navigation.
- Signature:

```ts
interface StepflowCallbacks {
  onStart?: (firstStep: Step) => Promise<void> | void;
  onComplete?: (lastStep: Step) => Promise<void> | void;
  onCancel?: (currentStep: Step) => Promise<void> | void;
  onNext?: (currentStep: Step) => Promise<void> | void;
  onPrev?: (currentStep: Step) => Promise<void> | void;
  onError?: (error: Error | unknown) => void;
}
```

- Parameters:
  - `currentStep` / `firstStep` / `lastStep`: the active `Step`
  - `error`: the thrown error
- Returns: `Promise<void> | void` (except `onError`)
- Example:

```ts
callbacks: {
  onComplete: () => console.log("Tour done"),
  onError: (err) => console.error(err),
},
```

- Notes / Edge cases:
  - Errors inside callbacks set status to `error`, call `onError`, and rethrow.

## `options.keyboardControls` and `options.escapeToCancel`

- What it is: Enables ArrowLeft/ArrowRight navigation and Escape-to-cancel.
- Signature:

```ts
keyboardControls?: boolean;
escapeToCancel?: boolean;
```

- Parameters: N/A
- Returns: N/A
- Defaults:
  - `keyboardControls: true`
  - `escapeToCancel: true`
- Example:

```ts
options: {
  keyboardControls: false,
  escapeToCancel: false,
}
```

- Notes / Edge cases:
  - Keyup listeners are only attached when at least one of these options is enabled.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="overview.md">Navigation: Overview</a></div>
  <div>Next: <a href="api.md">Navigation: API</a></div>
</div>
