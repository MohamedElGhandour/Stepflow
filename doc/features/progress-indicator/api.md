# Progress Indicator: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Progress Indicator](overview.md) → Progress Indicator: API

Two exported types and one function signature.

## `ProgressType`

```ts
type ProgressType = "dots" | "counter" | "of" | "percentage" | "none";
```

The built-in styles, accepted by the `progress` prop. See
[Options](options.md) for what each one renders.

## `ProgressPosition`

```ts
type ProgressPosition = "header" | "body" | "inline";
```

Accepted by the `progressPosition` prop. Default `"body"`.

## The render function

```ts
(current: number, total: number) => ReactNode
```

Pass one as `progress` to render your own indicator. `current` is the 1-based
step number, `total` is `steps.length`.

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress={(current, total) => (
    <span aria-live="polite">
      Step {current} of {total}
    </span>
  )}
  onComplete={() => setRun(false)}
/>
```

The return value is a React node — an element, a string, a fragment, `null`.
Nothing is parsed as HTML, so there is no `innerHTML` and no escaping to think
about. This is the replacement for v1's `type: "custom"` plus `component`,
which returned an HTML string.

The function runs during render and its result is memoized on `progress`,
`progressPosition`, the current index, and `steps.length`. It must not have side
effects.

## Building one from `useTour`

If you have replaced the whole card with `useTour`, there is no `progress` prop
to set — you render the indicator yourself from the state you already have:

```tsx
const tour = useTour(steps, run, { onComplete: () => setRun(false) });

// tour.index is 0-based; add one for display.
<span>
  {tour.index + 1} / {steps.length}
</span>;
```

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Progress Indicator: Options</a></div>
  <div>Next: <a href="examples.md">Progress Indicator: Examples</a></div>
</div>
