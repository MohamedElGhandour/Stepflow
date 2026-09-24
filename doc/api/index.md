# API Index

[Home](../README.md) → [API](index.md) → API Index

Stepflow has one entry point. It exports a component, a hook, and the types
behind them.

```tsx
import { Stepflow, useTour } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";
```

The stylesheet is a separate subpath. Import it once, anywhere in your app; it
styles the `.sf-*` class names the component renders. A custom card built on
`useTour` does not need it.

## Values

| Export | Kind | Reference |
| --- | --- | --- |
| `Stepflow` | Component | [Stepflow](./stepflow.md) |
| `useTour` | Hook | [useTour](./use-tour.md) |

`Stepflow` renders the tour: the dimming overlay, the highlight ring, and the
card with its title, body, progress indicator, and buttons. `useTour` is the
state machine underneath it, with no UI and no DOM access, for when you want to
draw the card yourself.

## Types

Every type below is exported from the package root and is type-only.

| Type | Shape | Used for |
| --- | --- | --- |
| `Step` | `{ target?, title?, content?, onNext?, onPrev? }` | One stop on the tour. [Fields](./stepflow.md#step). |
| `StepTarget` | `string \| HTMLElement \| RefObject<HTMLElement \| null>` | What a step points at. Omit for a centered step. |
| `StepflowProps` | see [Stepflow](./stepflow.md#props) | The component's props. |
| `Labels` | `{ next?, prev?, cancel?, complete? }` | Button text. |
| `OverlayOptions` | `{ opacity?, closeOnClick? }` | The object form of the `overlay` prop. |
| `ProgressType` | `"dots" \| "counter" \| "of" \| "percentage" \| "none"` | Built-in progress indicators. |
| `ProgressPosition` | `"header" \| "body" \| "inline"` | Where the indicator sits in the card. |
| `Status` | `"idle" \| "active" \| "completed" \| "canceled"` | The tour's state. |
| `Tour` | see [useTour](./use-tour.md#the-tour-object) | What `useTour` returns. |
| `TourCallbacks` | `{ onStart?, onComplete?, onCancel?, onNext?, onPrev?, onError?, onStepChange? }` | `useTour`'s third argument. |

The placement math in `src/placement.ts` is internal. It is not exported, so the
card's position is not something you can override from the outside — style the
card with CSS instead. See
[Styling and Theming](../guides/styling-and-theming.md).

## There is no `start()`

1.x exposed a single imperative function, `start(config)`. It is gone in 2.0,
along with the `content: { header, body }` step shape, the `options` / `buttons`
/ `callbacks` config nesting, and the script-tag builds. Render `<Stepflow>` and
own the `run` flag instead. [MIGRATION.md](../../MIGRATION.md) maps every old
option to its replacement.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../features/progress-indicator/examples.md">Progress Indicator: Examples</a></div>
  <div>Next: <a href="stepflow.md">API: Stepflow</a></div>
</div>
