# Styling and Theming

[Home](../README.md) → [Guides](configuration.md) → Styling and Theming

Stepflow ships one stylesheet, compiled from `src/styles/stepflow.scss` to
`dist/styles/stepflow.css`. It is plain CSS with no build step of its own and no
theme system to configure — you override the classes below.

## Load the stylesheet

Import it once, wherever your app's global CSS goes:

```tsx
import "@mohamedelghandour/stepflow/styles.css";
```

`./styles.css` is an exported subpath of the package, so bundlers resolve that
specifier directly. Tools that need a real path instead — a plain `<link>`, a
Sass `@use`, a framework that only takes file paths — want
`node_modules/@mohamedelghandour/stepflow/dist/styles/stepflow.css`.

The stylesheet is not optional in the way an "optional theme" is. The component
sets only geometry inline — the card's `top` and `left`, the ring's box, the
overlay's background — and leaves `position: fixed`, `z-index`, the card width,
and the fade to CSS. Without a stylesheet you get an unpositioned card in the
normal document flow. If you don't want these styles, replace them; don't just
skip them. See [Replace the stylesheet](#replace-the-stylesheet).

The v1 CDN `<link>` pinned to `@1.0.0` is gone. Use the import.

## Class reference

Every element the component renders, in render order:

| Class | Element |
| --- | --- |
| `.sf-root` | The portal wrapper. Everything else is inside it. |
| `.sf-overlay` | The dimming layer. Fixed, full-viewport, `pointer-events: none`. Omitted when `overlay={false}`. |
| `.sf-highlight` | The ring around the target. Fixed, `pointer-events: none`. |
| `.sf-no-shadow` | On the ring when `overlay={false}` — ring without the surrounding dim. |
| `.sf-card` `.sf-tooltip` | The card. Both classes, always. `role="dialog"`, `aria-modal`. |
| `.sf-visible` | On the card once placement has been measured. Drives the fade-in. |
| `.sf-arrow-top` | On the card when it sits below the target, so the arrow points up. |
| `.sf-arrow-bottom` | On the card when it sits above the target. Neither class appears on a centered, target-less step. |
| `.sf-no-body` | On the card when `progressPosition="inline"`. |
| `.sf-card-header` | First region of the card. |
| `.sf-card-body` | Middle region. Absent in the `inline` layout. |
| `.sf-card-footer` | Last region — the controls, and the indicator in the `inline` layout. |
| `.sf-content` | Wraps the step's title and body. The title is an `<h3>` inside it. |
| `.sf-body` | The step's `content`. |
| `.sf-progress` | Wraps the indicator, built-in or your own render function. |
| `.sf-dots` / `.sf-dot` | The dots indicator: a `<ul>` of `<li>`. |
| `.sf-active` | On the current dot. |
| `.sf-controls` | The button row. |
| `.sf-controls-inline` | Added to the button row when `progressPosition="inline"`. |
| `.sf-progress-controls` | Wraps the indicator and the button row together, `inline` layout only. |
| `.sf-left` | The left button group — Skip and Back. |
| `.sf-btn` | Every button. |
| `.sf-btn-skip` / `.sf-btn-prev` / `.sf-btn-next` / `.sf-btn-done` | One per button, alongside `.sf-btn`. |

`.sf-card` carries no rules in the shipped stylesheet; it exists as a hook for
you. `.sf-no-body` is styled by a selector that reads
`.sf-root.sf-no-body .sf-card-header`, and the class is on the card rather than
on the root, so that rule never matches today — treat `.sf-no-body` as a hook
too, not as a rule you need to work around.

Which layout regions appear depends on `progressPosition`:

| `progressPosition` | Header | Body | Footer |
| --- | --- | --- | --- |
| `"header"` | indicator | title and content | controls |
| `"body"` (default) | title and content | indicator | controls |
| `"inline"` | title and content | — | indicator and controls |

## Override the shipped rules

Every rule in the stylesheet is nested under `.sf-root`, so it lands at
two-class specificity. A bare `.sf-tooltip { … }` loses no matter where you put
it. Match the nesting:

```css
.sf-root .sf-tooltip {
  width: 340px;
  border-radius: 12px;
}

.sf-root .sf-highlight {
  border-radius: 12px;
}
```

For a single tour among several, pass `className` and add it to the selector:

```tsx
<Stepflow steps={steps} run={run} className="billing-tour" onComplete={() => setRun(false)} />
```

```css
.sf-root .sf-tooltip.billing-tour {
  width: 420px;
  font-size: 0.9375rem;
}
```

Some values are inline styles and therefore beyond CSS: the card's `top` and
`left`, the ring's `top`/`left`/`width`/`height` and `box-shadow`, and the
overlay's `background`. Change those through props — `highlightColor` for the
ring colour, `overlay={{ opacity }}` for the dim level — not through a
stylesheet.

## The arrow

The arrow is a CSS triangle on `.sf-arrow-top::before` / `.sf-arrow-bottom::before`,
made of transparent left and right borders plus a coloured one on the side facing
the card. Its horizontal position comes from `--sf-arrow-offset`, which the
component sets inline on the card in pixels — the distance from the card's left
edge to the target's centre, clamped to stay on the card.

That means you read the property, you don't set it. It is there so a custom arrow
can line up with the built-in one:

```css
.sf-root .sf-tooltip.sf-arrow-top::after {
  content: "";
  position: absolute;
  top: -14px;
  left: var(--sf-arrow-offset);
  transform: translateX(-50%);
  /* … */
}
```

When you recolour the card, recolour the arrow with it — it has its own colour,
and a white arrow on a dark card is the usual thing people miss:

```css
.sf-root .sf-tooltip {
  background: #1c1c1e;
  color: #f5f5f7;
}

.sf-root .sf-tooltip.sf-arrow-top::before {
  border-bottom-color: #1c1c1e;
}

.sf-root .sf-tooltip.sf-arrow-bottom::before {
  border-top-color: #1c1c1e;
}
```

## Buttons

All four buttons share `.sf-btn` — black background, white text, 4px radius, and
`opacity: 0.5` while disabled. There is no per-button prop for classes; style the
four classes:

```css
.sf-root .sf-btn {
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 500;
}

.sf-root .sf-btn-next,
.sf-root .sf-btn-done {
  background: #2563eb;
}

/* Skip and Back read as secondary. */
.sf-root .sf-btn-skip,
.sf-root .sf-btn-prev {
  background: transparent;
  color: #555;
}
```

Keep the disabled state visible. Both Next and Back disable themselves while an
async `onNext` or `onPrev` is in flight, and that is the only signal the user
gets that something is happening.

## Dots

The dots are 6px circles that grow to 12px and darken on the active one, with a
0.1s transition on width and background:

```css
.sf-root .sf-dot {
  width: 8px;
  height: 8px;
  background: #d4d4d8;
}

.sf-root .sf-dot.sf-active {
  width: 20px;
  background: #2563eb;
}
```

For a progress bar rather than dots, pass a render function instead of restyling
these — `progress={(current, total) => …}` gives you the whole indicator slot.
See [Configuration](configuration.md#appearance).

## Dark mode

There is no dark theme in the package and no `data-theme` hook. Write the
override yourself; six declarations cover it.

```css
@media (prefers-color-scheme: dark) {
  .sf-root .sf-tooltip {
    background: #1c1c1e;
    color: #f5f5f7;
    box-shadow: 0 3px 30px rgba(0, 0, 0, 0.6);
  }

  .sf-root .sf-tooltip.sf-arrow-top::before {
    border-bottom-color: #1c1c1e;
  }

  .sf-root .sf-tooltip.sf-arrow-bottom::before {
    border-top-color: #1c1c1e;
  }

  .sf-root .sf-progress {
    color: #a1a1aa;
  }

  .sf-root .sf-btn {
    background: #f5f5f7;
    color: #111;
  }

  .sf-root .sf-dot.sf-active {
    background: #f5f5f7;
  }
}
```

The ring colour is a prop, not CSS, so pick it in React:

```tsx
import { useEffect, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

export function Tour({ steps, run, onDone }: { steps: Step[]; run: boolean; onDone: () => void }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  return (
    <Stepflow
      steps={steps}
      run={run}
      highlightColor={dark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)"}
      onComplete={onDone}
      onCancel={onDone}
    />
  );
}
```

## Motion

Two transitions carry the tour: the card fades over 0.2s, and the ring slides and
resizes over 0.3s. Both are dropped under `prefers-reduced-motion: reduce`, along
with the dot transition. Scrolling is separate — `scrollBehavior="auto"` hands
the decision to the browser, which respects the same preference.

Slow the ring down, or turn it off:

```css
.sf-root .sf-highlight {
  transition: none;
}
```

## Replace the stylesheet

Drop the import and write your own CSS against the classes above. These are the
rules that carry behaviour rather than looks, so start from them:

```css
.sf-root .sf-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  pointer-events: none; /* the target under the overlay stays clickable */
}

.sf-root .sf-highlight {
  position: fixed;
  box-sizing: border-box; /* the ring's box is the target's own box */
  pointer-events: none;
  z-index: 2147483000;
}

.sf-root .sf-tooltip {
  position: fixed; /* the component's top/left are viewport coordinates */
  z-index: 2147483001; /* above the overlay */
  box-sizing: border-box;
  width: 280px;
  max-width: calc(100vw - 20px);
  opacity: 0;
}

.sf-root .sf-tooltip.sf-visible {
  opacity: 1;
}
```

Two of those matter more than they look. `position: fixed` is what makes the
inline coordinates mean anything; anything else puts the card in the wrong place
on a scrolled page. And the `opacity: 0` / `.sf-visible` pair is what hides the
first frame, before the card has been measured — skip it and the card flashes at
the top-left corner of the viewport on every step.

Copying `src/styles/stepflow.scss` and editing it is the shorter path if you want
most of the look.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="configuration.md">Configuration</a></div>
  <div>Next: <a href="accessibility.md">Accessibility</a></div>
</div>
