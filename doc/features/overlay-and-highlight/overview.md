# Overlay and Highlight: Overview

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: Overview

The highlight is a ring drawn around the current step's target. The overlay is the dimming layer over everything else. Both come from the `overlay` and `highlightColor` props on `<Stepflow>`, and both are decorative: they are marked `aria-hidden` and they never take a click.

## What renders

While a tour is running, Stepflow portals this into `container` (`document.body` by default):

```html
<div class="sf-root">
  <div class="sf-overlay" aria-hidden="true"></div>
  <div class="sf-highlight" aria-hidden="true"></div>
  <div class="sf-card sf-tooltip sf-visible sf-arrow-top" role="dialog">…</div>
</div>
```

`.sf-overlay` is `position: fixed; inset: 0` and paints a flat `rgba(0, 0, 0, opacity)`. It is dropped from the tree entirely when you pass `overlay={false}`.

`.sf-highlight` is a fixed box positioned on the target's bounding rectangle. It is always rendered while the tour is active, even for a step with no target. Both layers sit at `z-index: 2147483000`; the card sits one above them.

## The cutout

The dimming outside the target does not come from the overlay. It comes from a second, very large box-shadow on `.sf-highlight`:

```
rgba(0, 0, 0, 0.8) 0 0 1px 2px,          /* the ring */
rgba(0, 0, 0, 0.3) 0 0 0 5000px          /* everything around it */
```

The first shadow is the ring, coloured by `highlightColor`. The second spreads 5000px in every direction at the overlay's opacity, which covers the rest of the viewport and leaves the target's own box uncovered. The flat `.sf-overlay` still lies under all of it, so the area around the target is dimmed twice and the target once — that difference is what makes the target read as lit.

With `overlay={false}`, the spread shadow is gone and only the ring is drawn. The highlight also picks up a second class, `sf-no-shadow`, so your CSS can tell the two modes apart. The stylesheet ships no rules for `sf-no-shadow`; it exists for you to hook onto.

The ring's shape is fixed: `.sf-highlight` has `border-radius: 3px` and does not read the target's own radius.

## The overlay never takes clicks

Both `.sf-overlay` and `.sf-highlight` are `pointer-events: none`. The element a step points at stays clickable, hoverable and focusable for as long as the step is on screen. A step that says "click this button" works, because the user can.

This is a deliberate reversal of v1, where the overlay sat on top of the highlighted element and swallowed the click.

## `closeOnClick` defaults to `false`

`overlay={{ closeOnClick: true }}` cancels the tour on any click outside the card. It is implemented as a `document`-level click listener, not as a click on the overlay — the overlay could not receive one. The listener is attached on a zero-delay timeout so the click that started the tour cannot immediately end it.

Because the target is clickable and the listener is global, "outside the card" includes the highlighted element itself. In v1 this was on by default, and clicking the thing a step pointed at silently killed the tour. It is now off by default. Turn it on only when a click anywhere outside the card really should mean "I'm done here".

## Steps with no target

A step with no `target`, or with a target that is not currently laid out (`display: none`, a collapsed accordion, an unopened modal), gets a centered card. The highlight still renders, as a 1×1px box at the centre of the viewport. With the overlay on, the spread shadow from that point dims the whole page — the usual full-screen dim for an intro or outro step — and the 2px ring around one pixel is not visible.

## Staying in sync

The highlight is measured from `getBoundingClientRect()` and positioned in viewport coordinates. Stepflow re-measures on `resize` and on `scroll` (captured, so scrolling inside a nested container counts too), and the box animates to its new position over 0.3s. Under `prefers-reduced-motion: reduce` the stylesheet drops that transition.

Page scroll is locked by default. See [`lockScroll`](options.md#lockscroll).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../tooltip/examples.md">Tooltip: Examples</a></div>
  <div>Next: <a href="options.md">Overlay and Highlight: Options</a></div>
</div>
