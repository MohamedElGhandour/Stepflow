# Navigation: Overview

[Home](../../README.md) → [Features](../steps/overview.md) → [Navigation](overview.md) → Navigation: Overview

Navigation is how the tour moves between steps: three buttons in the card
footer, the arrow keys, and Escape. `<Stepflow>` renders the buttons and owns
the transitions. You choose the labels, decide which buttons appear, and hook
into each move with `onNext`, `onPrev`, and `onStepChange`.

## The buttons

| Button | Class | Default label | Appears |
| --- | --- | --- | --- |
| Skip | `sf-btn sf-btn-skip` | `Skip` | Every step except the last, while `showCancel` is true |
| Back | `sf-btn sf-btn-prev` | `Back` | Every step except the first, while `showPrev` is true |
| Next | `sf-btn sf-btn-next` | `Next` | Every step except the last |
| Done | `sf-btn sf-btn-done` | `Done` | The last step, in place of Next |

Skip and Back share the left group (`.sf-left`); Next or Done sits on the
right. A one-step tour therefore shows a single Done button: the step is both
first and last, so Skip and Back are both hidden.

Rename the buttons with `labels`, and drop Skip or Back with `showCancel={false}`
or `showPrev={false}`. There is no way to hide Next/Done — a card with no way
forward is a dead end.

## Keyboard

While the tour runs, ArrowRight advances (and completes on the last step),
ArrowLeft goes back, and Escape cancels. Arrow keys are `keyboard`, Escape is
`escapeToCancel`, and both default to `true`.

Neither fires while focus is in an `input`, `textarea`, `select`, or
`contenteditable` element outside the card. A step that points at a form field
is the normal case for a tour, and in v1 moving the caret with ArrowLeft
navigated the tour instead.

Tab is handled separately and always: focus moves into the card when the tour
starts, cycles inside it, and returns to the previously focused element on
teardown. `keyboard={false}` does not turn that off.

## What a transition does

Clicking Next runs the step's own `onNext`, then the `onNext` prop, then
advances the index. Back does the same with `onPrev` in reverse. Both may
return a promise; the index moves only after it resolves.

Only one transition runs at a time. While an awaited callback is in flight the
Next and Back buttons are disabled, and every other control — Skip, Done, the
arrow keys, Escape — is ignored until the promise settles. A double-click can
no longer skip a step or fire the same callback twice.

Done and Skip end the tour. Both put it in its terminal state (`completed` or
`canceled`) *before* your `onComplete` / `onCancel` runs, so a callback that
throws cannot leave the overlay stranded on the page. The card unmounts on its
own; flip `run` back to `false` there so the next `false → true` edge starts
again from step 0.

If a callback throws or rejects, the move is abandoned and `onError` fires. The
tour keeps running on the current step — that is what makes a validating
`onNext` useful. If a throw should be fatal, set `run` to `false` in `onError`.
See [Navigation: API](api.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../overlay-and-highlight/examples.md">Overlay and Highlight: Examples</a></div>
  <div>Next: <a href="options.md">Navigation: Options</a></div>
</div>
