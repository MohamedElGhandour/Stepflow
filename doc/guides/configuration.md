# Configuration

[Home](../README.md) → [Guides](configuration.md) → Configuration

Everything is a prop on `<Stepflow>`. There is no config object and no global
state — the tour is a component you render, and `run` is the switch. Every prop
and default on this page is read from `src/types.ts` and `src/Stepflow.tsx`.

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function Editor() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { title: "Welcome", content: "Two things to show you." },
    { target: saveRef, title: "Save", content: "Your work lands here." },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Start tour</button>
      <button ref={saveRef}>Save</button>

      <Stepflow
        steps={steps}
        run={run}
        progress="of"
        overlay={{ opacity: 0.5 }}
        labels={{ complete: "Got it" }}
        onComplete={() => setRun(false)}
        onCancel={() => setRun(false)}
      />
    </>
  );
}
```

## Steps and control

| Prop | Type | Default | Note |
| --- | --- | --- | --- |
| `steps` | `Step[]` | — | Required. An empty array leaves the tour idle. |
| `run` | `boolean` | `false` | The tour is mounted while true; nothing renders while false. |

Flipping `run` in either direction resets the tour: index back to `0`, terminal
state cleared. So flipping it false and true again restarts from the first step.
Stepflow does not flip it for you — do that in `onComplete` and `onCancel`, or
the tour stays torn down but your state still says it is running.

## Per-step options

| Field | Type | Default | Note |
| --- | --- | --- | --- |
| `target` | `string \| HTMLElement \| RefObject<HTMLElement \| null>` | — | Omit for a centered, target-less step. |
| `title` | `ReactNode` | — | The card's heading. Also labels the dialog for screen readers. |
| `content` | `ReactNode` | — | The card's body. JSX, components, strings — no HTML strings. |
| `onNext` | `(step, index) => void \| Promise<void>` | — | Runs before advancing past this step. Throw to abort the move. |
| `onPrev` | `(step, index) => void \| Promise<void>` | — | Runs before going back from this step. Throw to abort the move. |

Prefer a ref over a selector string. It survives a refactor that renames a class
or an id, and it is the reason to reach for a React tour library in the first
place. A selector string still works, and so does an `HTMLElement` you hold
yourself.

A target that is in the DOM but not laid out — a collapsed accordion, an unopened
modal, `display: none` — counts as absent, and the step renders centered instead
of ringing a zero-size box.

Step callbacks are the hook for making the next target exist before the tour
points at it:

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

export function Nav() {
  const menuRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    {
      target: menuRef,
      title: "The menu",
      content: "We'll open it for you.",
      onNext: async () => {
        setOpen(true);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      },
    },
    { target: settingsRef, title: "Settings", content: "It lives in here." },
  ];

  return (
    <>
      <button ref={menuRef} onClick={() => setOpen(!open)}>Menu</button>
      {open && <a ref={settingsRef} href="/settings">Settings</a>}
      <Stepflow steps={steps} run={run} onComplete={() => setRun(false)} onCancel={() => setRun(false)} />
    </>
  );
}
```

While a returned promise is pending the controls disable themselves, and a second
click cannot advance a second step.

## Callbacks

Every callback receives `(step, index)` — the step it happened on, and that
step's index. `onError` receives the thrown value instead.

| Prop | Type | Note |
| --- | --- | --- |
| `onStart` | `(step, index) => void` | Once, when the tour becomes active. Always index `0`. |
| `onStepChange` | `(step, index) => void` | Every settled step change, including the first. |
| `onNext` | `(step, index) => void \| Promise<void>` | Before every forward move. Awaited; throw to abort. |
| `onPrev` | `(step, index) => void \| Promise<void>` | Before every backward move. Awaited; throw to abort. |
| `onComplete` | `(step, index) => void` | The last step's Done button, or ArrowRight on the last step. |
| `onCancel` | `(step, index) => void` | Skip, Escape, or an outside click when `closeOnClick` is on. |
| `onError` | `(error: unknown) => void` | Anything a callback threw or rejected with. |

Four things about the order of events:

- A step's own `onNext` runs before the `onNext` prop. Same for `onPrev`.
- Throwing or rejecting in either one aborts the move and sends the error to
  `onError`. The tour stays on the current step; reporting an error is not
  terminal.
- `onComplete` and `onCancel` run *after* the tour has already torn itself down.
  Whatever they throw cannot leave an overlay on the page.
- With no `onError`, errors go to `console.error` under a `[stepflow]` prefix.

## Appearance

| Prop | Type | Default | Note |
| --- | --- | --- | --- |
| `labels` | `{ next?, prev?, cancel?, complete? }` | `"Next"` / `"Back"` / `"Skip"` / `"Done"` | Merged over the defaults, so pass only what you change. |
| `showPrev` | `boolean` | `true` | The Back button. Hidden on the first step regardless. |
| `showCancel` | `boolean` | `true` | The Skip button. Hidden on the last step regardless. |
| `overlay` | `boolean \| { opacity?, closeOnClick? }` | `true` | `false` drops the dimming layer and keeps the highlight ring. |
| `overlay.opacity` | `number` | `0.3` | 0–1. How dark the page outside the ring goes. |
| `highlightColor` | `string` | `"rgba(0, 0, 0, 0.8)"` | Any CSS colour. Drawn as a thin ring around the target. |
| `progress` | `"dots" \| "counter" \| "of" \| "percentage" \| "none" \| (current, total) => ReactNode` | `"dots"` | `current` is 1-based. |
| `progressPosition` | `"header" \| "body" \| "inline"` | `"body"` | `"inline"` puts the indicator on the button row. |
| `className` | `string` | — | Added to the card, after Stepflow's own classes. |

`"counter"` renders `1 / 4`, `"of"` renders `1 of 4`, `"percentage"` rounds to a
whole number. `"dots"` in the `"inline"` position renders as a counter instead —
a row of dots has no room beside the buttons.

A render function gets the same slot as the built-in indicators:

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress={(current, total) => <b>{`${current} / ${total}`}</b>}
  progressPosition="inline"
  onComplete={() => setRun(false)}
/>
```

## Behaviour

| Prop | Type | Default | Note |
| --- | --- | --- | --- |
| `overlay.closeOnClick` | `boolean` | `false` | Cancel on a click outside the card. |
| `keyboard` | `boolean` | `true` | ArrowRight / ArrowLeft move the tour. |
| `escapeToCancel` | `boolean` | `true` | Escape cancels. |
| `lockScroll` | `boolean` | `true` | Sets `overflow: hidden` on `<body>`, restored on teardown. |
| `scrollBehavior` | `ScrollBehavior` | `"smooth"` | Passed to `scrollIntoView`. `"auto"` respects reduced-motion. |
| `container` | `HTMLElement \| null` | `document.body` | Portal host. |

Neither the arrow keys nor Escape fire while focus sits in an `input`,
`textarea`, `select`, or `contenteditable` element outside the card. A step that
points at a form field stays usable.

`closeOnClick` is off by default, and the overlay never intercepts pointer
events, so the element a step is pointing at stays clickable.

Use `container` when `document.body` is the wrong layer — a modal root, a scoped
preview pane, a test harness:

```tsx
export function Preview({ steps }: { steps: Step[] }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [run, setRun] = useState(false);

  return (
    <div className="preview-pane">
      <div ref={setHost} />
      <Stepflow steps={steps} run={run} container={host} onComplete={() => setRun(false)} />
    </div>
  );
}
```

## Gone in 2.0

The v1 config object — `options`, `buttons`, `callbacks`, `progress.type` — has
no v2 equivalent; the props above replace it one for one. Two things were dropped
rather than renamed:

- **`options.transitions.animationDuration`.** It never did anything. Override the
  CSS transition on `.sf-highlight` or `.sf-tooltip` instead — see
  [Styling and Theming](styling-and-theming.md).
- **`buttons.*.className`.** There is one `className`, on the card. Style the
  buttons through their own classes.

The full mapping is in [MIGRATION.md](../../MIGRATION.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../core-concepts/positioning-and-overlay.md">Positioning and Overlay</a></div>
  <div>Next: <a href="styling-and-theming.md">Styling and Theming</a></div>
</div>
