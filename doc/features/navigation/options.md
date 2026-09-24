# Navigation: Options

[Home](../../README.md) → [Features](../steps/overview.md) → [Navigation](overview.md) → Navigation: Options

Navigation is configured with flat props on `<Stepflow>`: `labels`, `showPrev`,
`showCancel`, `keyboard`, and `escapeToCancel`.

## `labels`

Button text. Supply only the ones you want to change; the rest keep their
defaults.

```ts
interface Labels {
  next?: string;
  prev?: string;
  cancel?: string;
  complete?: string;
}
```

Defaults: `next: "Next"`, `prev: "Back"`, `cancel: "Skip"`, `complete: "Done"`.

```tsx
<Stepflow
  steps={steps}
  run={run}
  labels={{ cancel: "Skip tour", next: "Continue", complete: "Finish" }}
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

`cancel` is the Skip button and `complete` is the Done button — the names come
from what they do, not from what they say. Labels are plain strings, so pass
translated text straight from your i18n layer.

## `showPrev`

Whether the Back button renders at all. It is hidden on the first step either
way.

```ts
showPrev?: boolean; // default true
```

```tsx
<Stepflow steps={steps} run={run} showPrev={false} onComplete={() => setRun(false)} />
```

Turn it off for a tour where a step has a side effect you cannot undo.

## `showCancel`

Whether the Skip button renders at all. It is hidden on the last step either
way, where Done is the way out.

```ts
showCancel?: boolean; // default true
```

```tsx
<Stepflow steps={steps} run={run} showCancel={false} onComplete={() => setRun(false)} />
```

Hiding Skip does not make the tour inescapable: Escape still cancels unless you
also pass `escapeToCancel={false}`, and `run` is yours to flip at any time.

## `keyboard`

ArrowRight to advance, ArrowLeft to go back. ArrowRight on the last step
completes the tour.

```ts
keyboard?: boolean; // default true
```

```tsx
<Stepflow steps={steps} run={run} keyboard={false} onComplete={() => setRun(false)} />
```

Ignored while focus sits in a text field outside the card — `input`, `textarea`,
`select`, or `[contenteditable=true]` — and while an IME composition is active.
Note the "outside the card" part: a text input you render inside `content` is
part of the tour UI, and arrow keys there still navigate.

## `escapeToCancel`

Escape cancels the tour, calling `onCancel` with the current step.

```ts
escapeToCancel?: boolean; // default true
```

```tsx
<Stepflow
  steps={steps}
  run={run}
  escapeToCancel={false}
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

Same text-field exemption as `keyboard`. The keydown listener is attached only
while the tour is active and only when at least one of `keyboard` /
`escapeToCancel` is on, and it is removed on teardown.

## Styling the buttons

There is no per-button `className` prop. Pass `className` to add a class to the
card and style the buttons through `.sf-btn`, `.sf-btn-skip`, `.sf-btn-prev`,
`.sf-btn-next`, and `.sf-btn-done`. Disabled buttons carry the native
`:disabled` state. See [Styling and Theming](../../guides/styling-and-theming.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="overview.md">Navigation: Overview</a></div>
  <div>Next: <a href="api.md">Navigation: API</a></div>
</div>
