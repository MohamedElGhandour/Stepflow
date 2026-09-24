# Navigation: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Navigation](overview.md) → Navigation: API

The navigation surface is the callback props on `<Stepflow>` and the four
methods on the `Tour` object returned by `useTour`.

## Callback props

Every callback receives `(step, index)`: the step it concerns and its
zero-based position in `steps`.

```ts
onStart?: (step: Step, index: number) => void;
onStepChange?: (step: Step, index: number) => void;
onNext?: (step: Step, index: number) => void | Promise<void>;
onPrev?: (step: Step, index: number) => void | Promise<void>;
onComplete?: (step: Step, index: number) => void;
onCancel?: (step: Step, index: number) => void;
onError?: (error: unknown) => void;
```

- `onStart` fires once per run, with the first step.
- `onStepChange` fires on every settled step, including the first. Three steps
  walked end to end give you three calls. Use it for analytics — it is the only
  callback that cannot be skipped by a keyboard shortcut or a hidden button.
- `onNext` and `onPrev` fire *before* the move, with the step you are leaving.
  Return a promise to hold the transition open.
- `onComplete` fires from Done (or ArrowRight on the last step) with the last
  step. `onCancel` fires from Skip, Escape, or an overlay click when
  `closeOnClick` is on, with whatever step was showing.
- `onError` receives anything thrown or rejected by any of the above, or by a
  step's own `onNext` / `onPrev`. Without it, the error goes to
  `console.error` with a `[stepflow]` prefix.

Handlers are read from a latest-value ref, so re-creating them on every render
— the normal case — never restarts the tour and never leaves you with a stale
closure. You do not need `useCallback` here.

## Per-step callbacks

`Step` carries its own `onNext` and `onPrev` with the same signature. They run
first, then the props:

```ts
await step.onNext?.(step, index);   // step-level
await props.onNext?.(step, index);  // global
// index advances only now
```

A step with neither callback, in a tour with neither prop, moves synchronously
— no microtask, so your tests stay synchronous.

## Async transitions and `busy`

While an awaited callback is in flight:

- `busy` is `true` and the Next/Back buttons are `disabled`.
- Further `next()`, `prev()`, `complete()`, and `cancel()` calls are ignored,
  including the ones from the arrow keys, Escape, and the Skip button. Skip
  stays visually enabled but its click does nothing until the promise settles.
- If the promise resolves, the index advances. If it rejects, it does not.

A rejection (or a synchronous throw) sends the error to `onError` and leaves the
tour on the current step, so the user can act on the failure and press Next
again. Reporting an error is not terminal — if a failure should end the tour, set
`run` to `false` in `onError`.

## `Tour`

`useTour(steps, run, callbacks)` returns the state machine without the UI. The
navigation half of it:

```ts
interface Tour {
  index: number;
  status: "idle" | "active" | "completed" | "canceled";
  step: Step | undefined;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  next: () => void;
  prev: () => void;
  complete: () => void;
  cancel: () => void;
}
```

`next()` and `prev()` do nothing at the ends of the list — there is no wrapping,
and `isLast` is your cue to call `complete()` instead. `complete()` and
`cancel()` set the terminal status before running your callback, which is why a
throwing `onComplete` cannot wedge the page. All four are no-ops once the tour
is not active.

The third argument takes the same callbacks as the component props:

```ts
interface TourCallbacks {
  onStart?: (step: Step, index: number) => void;
  onStepChange?: (step: Step, index: number) => void;
  onNext?: (step: Step, index: number) => void | Promise<void>;
  onPrev?: (step: Step, index: number) => void | Promise<void>;
  onComplete?: (step: Step, index: number) => void;
  onCancel?: (step: Step, index: number) => void;
  onError?: (error: unknown) => void;
}
```

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Navigation: Options</a></div>
  <div>Next: <a href="examples.md">Navigation: Examples</a></div>
</div>
