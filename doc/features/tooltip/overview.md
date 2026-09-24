# Tooltip: Overview

[Home](../../README.md) → [Features](../steps/overview.md) → [Tooltip](overview.md) → Tooltip: Overview

The tooltip is the card. One card exists at a time, it shows the current step, and it carries the controls that move the tour.

There is no `<Tooltip>` component to render. `<Stepflow>` renders the card for you, into a portal, and you shape it with props and CSS.

## What the tooltip renders

- The step's `title`, as an `<h3>`
- The step's `content`, as the body
- The progress indicator, wherever `progressPosition` puts it
- The footer controls: Skip, Back, and Next or Done

Empty fields render nothing. A step with no `title` has no heading element at all, rather than an empty one.

## How it is placed

The card is `position: fixed`, measured against the target's own bounding box.

- Below the target when there is room, with a 16px gap and the arrow on top of the card
- Above the target when there is not, with the arrow on the bottom
- Centered with no arrow when the step has no target, or its target is not laid out

The card is clamped 10px inside the viewport on every side, so the footer buttons can never end up off-screen while page scroll is locked. The arrow points at the target's centre and stays inside the card's own edges. Placement is recalculated on step change, on window resize and on scroll — including scroll inside nested containers.

Details and the maths live in [Positioning and Overlay](../../core-concepts/positioning-and-overlay.md).

## Where it renders

The card, the dimming overlay and the highlight ring go through `createPortal` into `document.body`, or into whatever element you pass as `container`. Nothing renders on the server: on a server pass the component returns `null` rather than touching `document`.

## Accessibility

The card is a modal dialog. It sets `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the step's heading. It takes focus when the tour starts, traps Tab inside itself while it is open, and returns focus to the previously focused element when the tour ends. See [Tooltip: API](api.md) for the exact attributes and [Accessibility](../../guides/accessibility.md) for the rest.

## Styling

Import the stylesheet once, then override what you want:

```tsx
import "@mohamedelghandour/stepflow/styles.css";
```

Every element carries an `sf-` class name, and `className` adds your own to the card. The class list is in [Tooltip: API](api.md); the recipes are in [Styling and Theming](../../guides/styling-and-theming.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../steps/examples.md">Steps: Examples</a></div>
  <div>Next: <a href="options.md">Tooltip: Options</a></div>
</div>
