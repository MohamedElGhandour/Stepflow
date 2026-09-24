# Positioning and Overlay

[Home](../README.md) → [Core Concepts](mental-model.md) → Positioning and Overlay

Two things follow the current step's target: the highlight ring, which traces it, and the tooltip card, which anchors to it. The math that places them is pure — it takes the target's box, the card's measured size, and the viewport size, and returns coordinates.

## Everything is viewport coordinates

The overlay, the ring, and the card are all `position: fixed`, and every number in the placement math is viewport-relative. Scroll offsets are never added to anything. That is what makes the card immune to a host page that puts a `transform` or `position: relative` on an ancestor.

Three constants shape every placement:

| | |
| --- | --- |
| Gap between the target and the card | 16px |
| Minimum distance from any viewport edge | 10px |
| Card width | 280px, capped at `100vw - 20px` |

None of them is a prop. The card width is CSS, so you can change it in your own stylesheet — the placement math measures the card before it places it, so a wider card still lands correctly.

## Where the card goes

Horizontally, the card's left edge lines up with the target's left edge, then clamps so it stays 10px inside both viewport edges.

Vertically, Stepflow prefers below. It goes below the target, 16px down, if the space between the target's bottom and the viewport's bottom fits the card plus the gap. If it does not fit below but does fit above, the card flips above the target. If it fits on neither side — a tall card, a short viewport — it stays anchored below and is then clamped into the viewport, which is what keeps the footer buttons on screen while page scroll is locked. A card taller than the viewport pins to the top edge.

The arrow follows from that choice. Card below the target: the arrow sits on the card's top edge (`.sf-arrow-top`). Card above: on the bottom edge (`.sf-arrow-bottom`). Centered with no target: no arrow at all.

The card is `opacity: 0` until the first placement lands, and placement runs in a layout effect before paint, so it fades in where it belongs instead of jumping from the corner.

## Where the arrow points

The arrow points at the horizontal centre of the target, not at the centre of the card. Its distance from the card's left edge is published as the `--sf-arrow-offset` custom property, and the CSS pseudo-element reads it.

Two rules keep it sensible. It is clamped to stay 10px inside the card's own edges, so a target near a viewport edge — where the card has been clamped away from it — still gets an arrow attached to the card instead of floating off it. And when the target is wider than the card, a centre is not worth pointing at: the arrow tucks near the card's leading edge instead, at a tenth of the card's width.

## The highlight ring

The ring is drawn at the target's exact bounding box, with a `box-shadow` in `highlightColor` (default `rgba(0, 0, 0, 0.8)`). When the overlay is on, the same shadow carries a 5000px spread in the overlay's colour — that huge spread is what dims the page right up to the ring's edge.

With no target to trace, the ring collapses to a single pixel at the viewport centre. The dimming still covers the page, so a centered step looks like a plain modal.

`overlay={false}` drops the dimming layer and the spread, and keeps the ring:

```tsx
<Stepflow steps={steps} run={run} overlay={false} highlightColor="#2563eb" />
```

`overlay={{ opacity }}` changes how dark the dimming is. The default is `0.3`.

```tsx
<Stepflow steps={steps} run={run} overlay={{ opacity: 0.6 }} />
```

The ring animates its position and size over 0.3s as the step changes, and the card cross-fades over 0.2s. Under `prefers-reduced-motion: reduce`, both transitions and the progress dots' are switched off.

## The overlay never intercepts clicks

Both the dimming layer and the ring are `pointer-events: none`. The element a step points at stays clickable, hoverable, and focusable through the overlay. A step can say "click Save to continue" and the user can click Save.

That is also why `closeOnClick` defaults to `false`. Turn it on and any click outside the card cancels the tour — including the click on the very element the step is pointing at. Opt in only when the tour is purely informational:

```tsx
<Stepflow steps={steps} run={run} overlay={{ closeOnClick: true }} onCancel={() => setRun(false)} />
```

The outside-click listener is attached one tick after the tour starts, so the click that opened the tour cannot immediately close it.

## Staying in sync

Fixed coordinates go stale the moment anything moves, so Stepflow re-measures and re-places on:

- a step change or tour start, in a layout effect before paint;
- `resize` on the window;
- `scroll`, captured at the window, so scrolling inside a nested container counts too.

The scroll listener matters even with `lockScroll` on. Locking sets `overflow: hidden` on `<body>`, which stops the page — inner scroll containers keep scrolling regardless.

## Scrolling the target into view

When a step becomes active, its target gets `scrollIntoView({ block: "center", inline: "nearest" })`. That is the browser's own implementation, so it walks every scrollable ancestor and brings a target inside a scrolling panel into view, not only one on the page itself.

`scrollBehavior` is passed straight through, and defaults to `"smooth"`:

```tsx
<Stepflow steps={steps} run={run} scrollBehavior="auto" />
```

Use `"auto"` to let the browser follow the user's reduced-motion setting, or `"instant"` to jump. A step with no target, a missing target, or a hidden one has nothing to scroll to, and the card is centered instead.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="steps-and-targets.md">Steps and Targets</a></div>
  <div>Next: <a href="../guides/configuration.md">Configuration</a></div>
</div>
