# Tooltip: Options

[Home](../../README.md) → [Features](../steps/overview.md) → [Tooltip](overview.md) → Tooltip: Options

The tooltip has no configuration object of its own. Its content comes from the current step, and two props on `<Stepflow>` are about the card specifically: `className` and `container`. `progressPosition` decides how the card is laid out.

## `className`

- What it is: extra class names added to the card element.
- Signature: `className?: string`
- Example:

```tsx
<Stepflow steps={steps} run={run} className="my-tour" onComplete={() => setRun(false)} />
```

```css
/* Scope overrides under .sf-root — the shipped rules are, so a bare
   .my-tour loses on specificity. */
.sf-root .sf-tooltip.my-tour {
  width: 340px;
  background: #16181d;
  color: #f4f4f5;
}

.sf-root .my-tour .sf-btn {
  background: #6366f1;
}
```

- Notes / Edge cases:
  - It lands on the card only, next to `sf-card sf-tooltip`. The overlay and the highlight ring do not get it.
  - The card's own background is also the arrow's colour, so a themed card needs the arrow recoloured too. See [Tooltip: Examples](examples.md).

## `container`

- What it is: the portal host for the overlay, the highlight and the card.
- Signature: `container?: HTMLElement | null`
- Default: `document.body`
- Example:

```tsx
const [host, setHost] = useState<HTMLElement | null>(null);

return (
  <>
    <div ref={setHost} className="tour-layer" />
    <Stepflow steps={steps} run={run} container={host} onComplete={() => setRun(false)} />
  </>
);
```

- Notes / Edge cases:
  - `null` and `undefined` both fall back to `document.body`, so a host that has not mounted yet is safe to pass straight through.
  - Coordinates stay viewport-relative whatever the host is, because the card is `position: fixed`.
  - A host with a CSS `transform`, `filter` or `backdrop-filter` creates a containing block for fixed positioning, and the card's coordinates will be measured against that box instead of the viewport. Portal into a plain element.

## `progressPosition`

- What it is: which of the card's three regions holds the progress indicator, and therefore how the card is arranged.
- Signature: `progressPosition?: "header" | "body" | "inline"`
- Default: `"body"`
- Example:

```tsx
<Stepflow steps={steps} run={run} progress="of" progressPosition="header" />
```

- Parameters:
  - `"header"`: progress on top, then the title and content, then the controls.
  - `"body"`: title and content on top, progress in the middle, controls at the bottom.
  - `"inline"`: title and content on top, then a single footer row holding the progress and the controls side by side.
- Notes / Edge cases:
  - `progress="dots"` renders as a counter in the `inline` layout. A row of dots has no room beside the buttons.
  - The `inline` layout also adds `sf-no-body` to the card and wraps the footer contents in `sf-progress-controls`, and the controls row gets `sf-controls-inline`. The exact DOM per layout is in [Tooltip: API](api.md).

## What else changes the card

| Prop | Effect on the card |
| --- | --- |
| `steps[].title` | The `<h3>` heading, and the dialog's accessible name. |
| `steps[].content` | The body. |
| `progress` | Which indicator is rendered, or your own render function. |
| `labels` | The button text: `Next` / `Back` / `Skip` / `Done`. |
| `showPrev`, `showCancel` | Whether Back and Skip are rendered at all. |
| `scrollBehavior` | How the page scrolls the target into view before the card is placed. |

`overlay` and `highlightColor` are about the layers behind the card, not the card. They are covered in [Overlay and Highlight: Options](../overlay-and-highlight/options.md).

Card width, padding, colours and the fade are CSS. The source of the shipped stylesheet is `src/styles/stepflow.scss`.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="overview.md">Tooltip: Overview</a></div>
  <div>Next: <a href="api.md">Tooltip: API</a></div>
</div>
