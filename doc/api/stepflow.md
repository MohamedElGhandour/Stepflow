# `Stepflow`

[Home](../README.md) → [API](index.md) → `Stepflow`

The tour, as one component. Render it anywhere in your tree — it portals its own
DOM into `document.body`, so where you put it does not affect where it appears.
It renders nothing while `run` is false.

## Signature

```tsx
import { Stepflow, type StepflowProps } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

<Stepflow steps={steps} run={run} onComplete={() => setRun(false)} />;
```

## Example

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function Editor() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);
  const stop = () => setRun(false);

  const steps: Step[] = [
    { title: "Welcome", content: "Three things and you are done." },
    {
      target: saveRef,
      title: "Save",
      content: (
        <>
          Or press <kbd>⌘S</kbd>.
        </>
      ),
    },
    { target: "#sidebar", title: "Sidebar", content: "Your documents live here." },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Take the tour</button>
      <button ref={saveRef}>Save</button>
      <aside id="sidebar">…</aside>

      <Stepflow
        steps={steps}
        run={run}
        progress="of"
        labels={{ cancel: "Not now" }}
        onComplete={stop}
        onCancel={stop}
      />
    </>
  );
}
```

`run` is yours. Stepflow never flips it back for you, so set it to `false` in
`onComplete` and `onCancel` or the tour will not restart.

## Props

`StepflowProps`. `steps` is the only required one.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `steps` | `Step[]` | — | The tour. An empty array keeps the tour idle. |
| `run` | `boolean` | `false` | The tour is mounted while true. Flipping it in either direction resets to step 0. |
| `labels` | `Labels` | `Next` / `Back` / `Skip` / `Done` | Merged over the defaults, so you can override one key. |
| `showPrev` | `boolean` | `true` | The Back button is hidden on the first step regardless. |
| `showCancel` | `boolean` | `true` | The Skip button is hidden on the last step regardless. |
| `overlay` | `boolean \| OverlayOptions` | `true` | `false` drops the dimming and keeps the ring. |
| `highlightColor` | `string` | `"rgba(0, 0, 0, 0.8)"` | Any CSS color. Drawn as the ring around the target. |
| `keyboard` | `boolean` | `true` | Arrow-key navigation. |
| `escapeToCancel` | `boolean` | `true` | Escape calls cancel. |
| `lockScroll` | `boolean` | `true` | Sets `overflow: hidden` on `<body>` and restores the previous value on teardown. |
| `progress` | `ProgressType \| ((current: number, total: number) => ReactNode)` | `"dots"` | `current` is 1-based. |
| `progressPosition` | `ProgressPosition` | `"body"` | `"header"`, `"body"`, or `"inline"`. |
| `scrollBehavior` | `ScrollBehavior` | `"smooth"` | Passed to `scrollIntoView`. `"auto"` respects the user's reduced-motion setting. |
| `className` | `string` | — | Added to the card, alongside `sf-card sf-tooltip`. |
| `container` | `HTMLElement \| null` | `document.body` | Portal host. `null` falls back to `document.body`. |

### `overlay`

`true` gives you a dimming layer at `0.3` opacity. `false` removes the layer and
leaves only the highlight ring, which is what you want when the page behind the
tour has to stay fully legible. The object form sets both details:

```tsx
<Stepflow steps={steps} run={run} overlay={{ opacity: 0.5, closeOnClick: true }} />
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `opacity` | `number` | `0.3` | 0–1. Dim level of the page outside the highlight. |
| `closeOnClick` | `boolean` | `false` | Cancel the tour on a click outside the card. |

`closeOnClick` defaults to `false`, which is a deliberate change from 1.x. The
dimming layer is `pointer-events: none`, so the element a step points at stays
clickable — turning `closeOnClick` on means a click on that element also ends the
tour. When it is on, the document listener is attached on a deferred tick, so the
click that started the tour cannot immediately close it.

### `progress`

The five built-ins render `1 of 3`, `1 / 3`, `33%`, a row of dots, or nothing.
Pass a function for anything else:

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress={(current, total) => <ProgressBar value={current / total} />}
/>
```

`"dots"` with `progressPosition="inline"` renders as `counter` instead — a row of
dots has no room beside the buttons.

## Callbacks

Every callback takes `(step, index)`: the `Step` object it concerns and its
0-based position in `steps`. None of them are required, and a throw inside one
never escapes into React.

| Prop | Signature | When |
| --- | --- | --- |
| `onStart` | `(step, index) => void` | Once, when the tour becomes active. Always `(steps[0], 0)`. |
| `onStepChange` | `(step, index) => void` | On every settled step, including the first. |
| `onNext` | `(step, index) => void \| Promise<void>` | Before advancing, with the step you are leaving. |
| `onPrev` | `(step, index) => void \| Promise<void>` | Before going back, with the step you are leaving. |
| `onComplete` | `(step, index) => void` | On the Done button, or ArrowRight on the last step. |
| `onCancel` | `(step, index) => void` | On Skip, Escape, or an outside click when `closeOnClick` is on. |
| `onError` | `(error: unknown) => void` | Any throw or rejection from the callbacks above, or from a step's own. |

`onNext` and `onPrev` are awaited. While the promise is in flight the Back and
Next buttons are disabled and further clicks are dropped, so a double-click
cannot skip a step. Throwing or rejecting aborts the move: the index stays put,
the tour stays on the current step, and the error goes to `onError`. With no
`onError` the error is logged as `[stepflow]`. Reporting an error never ends the
tour — that is what lets an `onNext` validate and reject.

`onComplete` and `onCancel` run *after* the tour has already reached its terminal
state and removed its DOM. A throwing analytics call cannot leave a locked
overlay on the page.

A step's own `onNext` runs before the component-level `onNext` for the same move.

## `Step`

| Field | Type | Notes |
| --- | --- | --- |
| `target` | `StepTarget` | A ref, an element, or a CSS selector. Omit for a centered step. |
| `title` | `ReactNode` | Rendered as the card's `<h3>` and used as the dialog's accessible name. |
| `content` | `ReactNode` | Rendered as the card's body. Any React node — there is no HTML-string escape hatch, so no XSS surface. |
| `onNext` | `(step, index) => void \| Promise<void>` | Runs before advancing past this step. Awaited; throw to abort the move. |
| `onPrev` | `(step, index) => void \| Promise<void>` | Runs before going back from this step. Awaited; throw to abort the move. |

Prefer a ref. It survives renames and refactors, and it is checked by the
compiler; a `"#save-button"` string is not. A selector still works for markup you
do not own. Details in
[Steps and Targets](../core-concepts/steps-and-targets.md).

A target that is absent, or present but not laid out — a collapsed accordion, an
unopened modal — is treated as no target at all: the card centers itself and the
ring collapses to a point at the viewport centre.

## What it renders

One portal into `container ?? document.body`, containing at most three siblings.
Every position is `fixed` and viewport-relative.

```html
<div class="sf-root">
  <div class="sf-overlay" aria-hidden="true"></div>
  <div class="sf-highlight" aria-hidden="true"></div>
  <div class="sf-card sf-tooltip sf-visible sf-arrow-top"
       role="dialog" aria-modal="true" aria-labelledby="sf-title-0" tabindex="-1">
    <div class="sf-card-header">
      <div class="sf-content">
        <h3 id="sf-title-0">Save</h3>
        <div class="sf-body">Or press ⌘S.</div>
      </div>
    </div>
    <div class="sf-card-body">
      <div class="sf-progress">
        <ul class="sf-dots">
          <li class="sf-dot sf-active"></li>
          <li class="sf-dot"></li>
        </ul>
      </div>
    </div>
    <div class="sf-card-footer">
      <div class="sf-controls">
        <div class="sf-left">
          <button type="button" class="sf-btn sf-btn-skip">Skip</button>
          <button type="button" class="sf-btn sf-btn-prev">Back</button>
        </div>
        <div>
          <button type="button" class="sf-btn sf-btn-next">Next</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

What varies:

- `.sf-overlay` is absent when `overlay={false}`. Its inline `background` carries
  the opacity.
- `.sf-highlight` carries the target's box as inline `top` / `left` / `width` /
  `height`, and the ring as an inline `box-shadow` built from `highlightColor`.
  With `overlay={false}` it also gets `sf-no-shadow`.
- The card carries `sf-visible` once it has been measured and placed,
  `sf-arrow-top` when it sits below the target, `sf-arrow-bottom` when it sits
  above, neither when there is no target, `sf-no-body` in the inline layout, and
  your `className` last. Its inline style sets `top`, `left`, and the
  `--sf-arrow-offset` custom property the arrow is drawn from.
- `<h3>` is omitted when the step has no `title`, and `.sf-body` when it has no
  `content`. With no title the dialog has no `aria-labelledby`.
- The title's id is `sf-title-{index}`.
- `.sf-btn-skip` is omitted on the last step, `.sf-btn-prev` on the first, and
  the Next button becomes `.sf-btn-done` on the last.
- `.sf-controls` also gets `sf-controls-inline` in the inline layout, where the
  progress box and the controls share a `.sf-progress-controls` wrapper inside
  the footer.

The three `progressPosition` values shuffle which slot holds what:

| Position | `.sf-card-header` | `.sf-card-body` | `.sf-card-footer` |
| --- | --- | --- | --- |
| `"header"` | progress | title and content | controls |
| `"body"` | title and content | progress | controls |
| `"inline"` | title and content | — | progress and controls together |

The full class list, and what the shipped stylesheet does with it, is in
[Styling and Theming](../guides/styling-and-theming.md).

## Behaviour worth knowing

**Keyboard.** ArrowRight advances, and completes on the last step. ArrowLeft goes
back. Escape cancels. All of it is ignored while the event came from an `input`,
`textarea`, `select`, or `contenteditable` element outside the card, and during
IME composition — a step pointing at a form field is the point of a tour library.

**Focus.** The card takes focus when the tour starts, Tab cycles inside it, and
the element that had focus before is restored on teardown.

**Position.** The card is measured before paint, then re-measured on window
resize and on scroll anywhere in the page — including inside nested scroll
containers. The target is brought into view with `scrollIntoView`, so a target
inside an overflow container is reachable.

**Server rendering.** Safe to import and render in Next.js, Remix, or Astro. With
no `document` there is nothing to portal into, so it renders nothing and reads no
DOM.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="index.md">API Index</a></div>
  <div>Next: <a href="use-tour.md">API: useTour</a></div>
</div>
