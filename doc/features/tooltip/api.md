# Tooltip: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Tooltip](overview.md) → Tooltip: API

The tooltip has no public methods. What is stable is the DOM it renders: the class names, the accessibility attributes and one CSS custom property. Everything below is what `<Stepflow>` actually puts on the page.

## Tooltip DOM

- What it is: the portal contents, in render order.
- Signature:

```html
<div class="sf-root">
  <div class="sf-overlay" aria-hidden="true"></div>
  <div class="sf-highlight" aria-hidden="true"></div>
  <div class="sf-card sf-tooltip sf-visible sf-arrow-top"
       role="dialog" aria-modal="true" aria-labelledby="sf-title-0" tabindex="-1">
    <div class="sf-card-header">
      <div class="sf-content">
        <h3 id="sf-title-0">Save</h3>
        <div class="sf-body">Your work is saved here.</div>
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

- Notes / Edge cases:
  - This is the default `progressPosition="body"` layout. The other two rearrange the same pieces — see below.
  - `sf-btn-skip` is dropped on the last step, `sf-btn-prev` on the first, and `sf-btn-next` becomes `sf-btn-done` on the last.
  - `sf-body` and the `<h3>` appear only when the step sets `content` and `title`.
  - The overlay and the highlight ring are `pointer-events: none` and `aria-hidden`. They are documented in [Overlay and Highlight: API](../overlay-and-highlight/api.md).

## Card classes

- What it is: the classes on the card, and when each one is present.
- Signature: `.sf-card`, `.sf-tooltip`, `.sf-visible`, `.sf-arrow-top`, `.sf-arrow-bottom`, `.sf-no-body`
- Parameters:
  - `sf-card sf-tooltip`: always. Both are on the same element; the shipped styles hang off `sf-tooltip`.
  - `sf-visible`: added once placement has been measured. It is what fades the card in, so an unmeasured card is `opacity: 0` rather than mispositioned.
  - `sf-arrow-top`: the card sits below its target, so the arrow is on the card's top edge.
  - `sf-arrow-bottom`: the card sits above its target, arrow on the bottom edge.
  - `sf-no-body`: added in the `inline` layout, where the card has no middle region.
  - Neither arrow class is present for a centered, target-less step, and no arrow is drawn.
- Example:

```css
.sf-root .sf-tooltip {
  width: 320px;
}
```

- Notes / Edge cases:
  - Your `className` is appended after these, on the same element.
  - The shipped rules are scoped under `.sf-root`, so match that depth in your own or they lose on specificity.
  - The arrow is a `::before` triangle whose colour is set with `border-bottom` / `border-top`. Recolour the card and you have to recolour those too.

## `--sf-arrow-offset`

- What it is: the arrow's distance from the card's left edge, in pixels.
- Signature: `--sf-arrow-offset: <length>` — set inline on the card.
- Example:

```css
/* The shipped arrow already uses it. Read it when you draw your own. */
.sf-root .sf-tooltip.sf-arrow-top::after {
  content: "";
  position: absolute;
  top: -14px;
  left: var(--sf-arrow-offset);
  transform: translateX(-50%);
}
```

- Notes / Edge cases:
  - Stepflow writes it on every measure. Read it, do not set it.
  - It defaults to `50%` in the stylesheet, which is what a card with no measurement yet uses.
  - The offset is clamped 10px inside the card's edges. For a target wider than the card, the arrow tucks near the leading edge instead of pointing at a centre that means nothing.

## Layout by `progressPosition`

- What it is: how the three card regions are filled.
- Signature:

| `progressPosition` | `sf-card-header` | `sf-card-body` | `sf-card-footer` |
| --- | --- | --- | --- |
| `"header"` | `sf-progress` | `sf-content` | `sf-controls` |
| `"body"` (default) | `sf-content` | `sf-progress` | `sf-controls` |
| `"inline"` | `sf-content` | — | `sf-progress-controls` wrapping `sf-progress` and `sf-controls sf-controls-inline` |

- Notes / Edge cases:
  - All three keep the same footer controls. Only the progress moves.
  - `inline` renders no `sf-card-body` at all, and adds `sf-no-body` to the card.
  - `progress="dots"` with `progressPosition="inline"` renders the counter instead — `1 / 3` — because a row of dots does not fit beside the buttons.
  - `progress="none"` leaves `sf-progress` in place with nothing inside it.

## Accessibility attributes

- What it is: what the card sets, and the behaviour attached to it.
- Signature: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `tabindex="-1"`
- Parameters:
  - `role="dialog"` with `aria-modal="true"`: the card is a modal dialog. The page behind it is dimmed and, by default, scroll-locked.
  - `aria-labelledby`: points at the heading's id, `sf-title-{index}`. It is omitted when the step has no `title`, which leaves the dialog with no accessible name — give your steps titles.
  - `tabindex="-1"`: the card is not in the tab order but can be focused programmatically, which is how the tour hands it focus on start.
- Notes / Edge cases:
  - Focus moves to the card when the tour becomes active, with `preventScroll: true` so focusing does not fight the target's own `scrollIntoView`.
  - Tab and Shift+Tab are trapped inside the card. Tab from the last control wraps to the first, Shift+Tab from the first wraps to the last, and a Tab pressed while focus is outside the card pulls it back in. Focusable elements you put in `content` are part of that cycle.
  - When the tour ends — completed, cancelled or unmounted — focus returns to whatever was focused before it started.
  - Arrow keys move the tour and Escape cancels it, unless focus is inside an `input`, `textarea`, `select` or `contenteditable` outside the card. Those keys belong to your form.

## Changed from 1.x

The card used to be documented as `role="tooltip"` with `aria-modal="true"`, a combination that says two different things. It is a `dialog` now, and it backs that up with real focus management: focus in on start, a Tab trap while open, focus restored on teardown.

There is no longer a way to render the card's content from an HTML string or a `component` factory. A step's `title` and `content` are React nodes, and a card you want to build yourself is a `useTour` job — see [Tooltip: Examples](examples.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Tooltip: Options</a></div>
  <div>Next: <a href="examples.md">Tooltip: Examples</a></div>
</div>
