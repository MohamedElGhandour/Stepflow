# Accessibility

[Home](../README.md) → [Guides](configuration.md) → Accessibility

This page describes what `<Stepflow>` actually does, and what it leaves to you. Where there is a gap, it says so.

## Dialog semantics

The card is a `<div role="dialog" aria-modal="true" tabindex="-1">`. When a step has a `title`, Stepflow renders it as `<h3 id="sf-title-{index}">` and points the card's `aria-labelledby` at that id, so the step title is the dialog's accessible name. A step with no `title` gets no `aria-labelledby` and the dialog has no accessible name — give every step a title.

There is no `aria-describedby`. The `content` node is rendered inside the dialog, so a screen reader reaches it by reading the dialog, not through an explicit association.

The overlay and the highlight ring are both `aria-hidden="true"` and `pointer-events: none`. They are decoration and are never announced.

## Focus

One effect, running when the tour becomes active, handles all of it:

- **Focus in.** The card is focused with `focus({ preventScroll: true })` as the tour starts, so the page does not jump.
- **Tab trap.** A `keydown` listener on `document` intercepts `Tab`. It collects `button:not([disabled])`, `[href]`, `input`, `select`, `textarea` and `[tabindex]:not([tabindex="-1"])` inside the card, wraps from the last to the first (and back with `Shift+Tab`), and pulls focus back in when it is currently outside the card — to the first of them on `Tab`, the last on `Shift+Tab`. Any link or button you put in `content` joins that order.
- **Focus restore.** Whatever was focused when the tour started is focused again on teardown — completing, cancelling, `run` going false, or unmounting.

The card also has a visible focus style of its own: `:focus-visible` draws a 2px outline. The buttons use the browser default.

Focus moves in **once**, at the start of the tour. It is not re-sent on every step change: the card is the same DOM node throughout, so focus stays on the control the user pressed while the title, content and progress swap underneath it.

## Keyboard

With `keyboard` (default `true`):

| Key | Action |
| --- | --- |
| `ArrowRight` | Next step, or complete on the last one |
| `ArrowLeft` | Previous step |
| `Escape` | Cancel, when `escapeToCancel` is `true` (default) |

Both listen on `document`, so they work wherever focus is — with two exemptions.

**Text fields.** If the event target is inside an `input`, `textarea`, `select` or `[contenteditable=true]` that is *not* inside the card, the handler returns immediately. Arrow keys move the caret, `Escape` does whatever your app does with it, and the tour ignores both. This is what makes a step that points at a form field usable.

**IME composition.** Events with `isComposing` are ignored, so composing text does not navigate the tour.

The exemption is scoped to fields outside the card. A field you render inside `content` is not exempt: arrow keys pressed in it will move the tour. Pass `keyboard={false}` for a tour whose card contains its own inputs.

The buttons are real `<button type="button">` elements, so `Enter` and `Space` work on them. Their labels come from the `labels` prop (`Next` / `Back` / `Skip` / `Done` by default) and are the only accessible name they have — there is no `aria-label` prop for them in v2. Keep the labels self-describing. `Back` is hidden on the first step and `Skip` on the last, which leaves `Escape` as the only way to abandon the tour on the final step short of finishing it with `Done`. With `escapeToCancel={false}` as well, `Done` is the only exit.

While an async `onNext` or `onPrev` is in flight the controls are `disabled`, which the stylesheet renders at `opacity: 0.5` — low contrast for as long as your promise takes.

## What v2 does not do

Be aware of these before you promise a compliance level:

- **No step-change announcement.** There is no live region. A screen reader user who has moved past the title hears nothing when the step advances; they have to re-read the dialog.
- **The rest of the page is not inert.** `aria-modal="true"` is set, but nothing outside the card is marked `inert` or `aria-hidden`. That is deliberate — the whole point is that the highlighted element stays clickable — but it means only `Tab` is contained. A screen reader's own browse mode, and any mouse click, can leave the card. Do not read `aria-modal` here as a promise that the background is unreachable.
- **Dots progress has no text alternative.** `progress="dots"` renders an empty `<ul>` of `<li>` elements with no labels. Use `progress="of"` (`"1 of 3"`), `"counter"`, `"percentage"`, or a render function that returns text if the count matters to a screen reader user.
- **Focus is never sent to the target.** The card does not point at the highlighted element with `aria-controls`, and the element is not focused. The relationship between the ring and the card is visual only.
- **No forced-colors or high-contrast rules** in the shipped stylesheet. The default card is `#111` on `#fff`, the buttons `#fff` on `#000`, and the progress text `#666` on `#fff`; anything else is yours to add.
- **No RTL mirroring.** The card is anchored to the target's left edge and `ArrowRight` always means forward, regardless of `dir`.
- **A hidden or missing target degrades silently.** The card centres itself and the tour continues, with nothing said about the thing the step meant to point at.

If step-change announcements matter, `useTour` gives you the state machine without the card, and you own the semantics:

```tsx
import { useTour, type Step } from "@mohamedelghandour/stepflow";

export function AnnouncedTour({
  steps,
  run,
  onDone,
}: {
  steps: Step[];
  run: boolean;
  onDone: () => void;
}) {
  const tour = useTour(steps, run, { onComplete: onDone, onCancel: onDone });
  if (tour.status !== "active" || !tour.step) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Product tour">
      {/* Mounted for the life of the tour, so each step change updates it. */}
      <p aria-live="polite">
        Step {tour.index + 1} of {steps.length}: {tour.step.title}
      </p>
      <div>{tour.step.content}</div>
      <button onClick={tour.prev} disabled={tour.isFirst || tour.busy}>
        Back
      </button>
      <button onClick={tour.isLast ? tour.complete : tour.next} disabled={tour.busy}>
        {tour.isLast ? "Done" : "Next"}
      </button>
    </div>
  );
}
```

`useTour` is state only. Positioning, the overlay, the focus trap and the keyboard bindings all live in `<Stepflow>`; taking the headless route means writing them yourself.

## Reduced motion

The stylesheet drops the transitions on `.sf-highlight`, `.sf-tooltip` and `.sf-dot` under `prefers-reduced-motion: reduce`, so the ring and card move instantly instead of animating.

Scrolling a target into view is separate. `scrollBehavior` defaults to `"smooth"` and is passed straight to `scrollIntoView`; pass `scrollBehavior="auto"` to hand the decision to the browser and the user's motion preference.

## Writing accessible step content

- Give every step a `title`. It is the dialog's accessible name, and it is the one thing a screen reader user is guaranteed to hear.
- Keep the title short and specific — "Save your draft", not "Step 3".
- `content` is a `ReactNode`, so use real markup: paragraphs, lists, a `<kbd>`, a labelled link. There is no HTML-string escape hatch to get wrong.
- Do not describe a target by colour or position alone ("the blue button on the right"). Name it the way its own label reads.
- Any interactive element you put in `content` lands in the Tab order inside the card. Keep it to one or two, and put the important one first.
- Set `labels` to wording that stands alone. "Skip" reads fine in a tour; "Next" and "Back" do not need help; a bare arrow or icon would.
- Long content grows the card, and the card is width-capped at `280px` (`calc(100vw - 20px)` on narrow screens). Two or three sentences is the practical ceiling before the card starts covering the thing it points at.

## Portals

The card is portalled into `container`, which defaults to `document.body`. If you pass a `container` that lives inside an `aria-hidden` or `inert` subtree, the card inherits that and disappears from assistive technology. Portal into the body, or into a wrapper you know is exposed.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="styling-and-theming.md">Styling and Theming</a></div>
  <div>Next: <a href="../features/steps/overview.md">Steps: Overview</a></div>
</div>
