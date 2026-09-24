# Progress Indicator: Options

[Home](../../README.md) → [Features](../steps/overview.md) → [Progress Indicator](overview.md) → Progress Indicator: Options

Two independent props, both on `<Stepflow>`: `progress` and
`progressPosition`. There is no nested `progress` object in v2.

## `progress`

What the indicator shows.

```ts
type ProgressType = "dots" | "counter" | "of" | "percentage" | "none";

progress?: ProgressType | ((current: number, total: number) => ReactNode);
```

Default: `"dots"`.

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress="percentage"
  onComplete={() => setRun(false)}
/>
```

- `"dots"` renders one dot per step, the current one marked with `.sf-active`.
- `"counter"` renders `1 / 3`, `"of"` renders `1 of 3`.
- `"percentage"` renders `Math.round((current / total) * 100)` with a `%` sign,
  so a three-step tour reads `33%`, `67%`, `100%`.
- `"none"` renders nothing. The `.sf-progress` wrapper is still in the DOM, but
  it is empty and has no height of its own.
- A function receives the 1-based step number and the step count, and returns
  any React node. This replaces v1's `type: "custom"` / `component` pair.

The function is called during render, on every step change. Keep it pure — no
fetches, no state updates.

## `progressPosition`

Which row of the card the indicator occupies.

```ts
type ProgressPosition = "header" | "body" | "inline";

progressPosition?: ProgressPosition;
```

Default: `"body"`.

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress="of"
  progressPosition="header"
  onComplete={() => setRun(false)}
/>
```

The three layouts, in DOM order:

| `progressPosition` | `.sf-card-header` | `.sf-card-body` | `.sf-card-footer` |
| --- | --- | --- | --- |
| `"header"` | progress | title + content | buttons |
| `"body"` | title + content | progress | buttons |
| `"inline"` | title + content | — | progress + buttons |

In the inline layout the card also gets the `sf-no-body` class, the footer row
is wrapped in `.sf-progress-controls`, and the button row picks up
`.sf-controls-inline`. Use those if you need to tighten the spacing.

One thing to remember: `progress="dots"` in the `"inline"` position renders the
counter instead, because a row of dots does not fit beside the buttons. Every
other combination renders what you asked for.

With `progress="none"` there is nothing to place, but the rows above still
follow `progressPosition` — the empty wrapper moves with it, and `"inline"`
still collapses the card to two rows.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="overview.md">Progress Indicator: Overview</a></div>
  <div>Next: <a href="api.md">Progress Indicator: API</a></div>
</div>
