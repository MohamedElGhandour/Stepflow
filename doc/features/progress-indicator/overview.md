# Progress Indicator: Overview

[Home](../../README.md) → [Features](../steps/overview.md) → [Progress Indicator](overview.md) → Progress Indicator: Overview

The progress indicator tells the user how far into the tour they are. Two props
control it: `progress` picks what is shown, `progressPosition` picks where in
the card it goes.

```tsx
<Stepflow steps={steps} run={run} progress="of" progressPosition="header" />
```

## What can be shown

`progress` takes one of four built-in styles, the string `"none"`, or a render
function. On step 1 of 3 they produce:

| `progress` | Renders |
| --- | --- |
| `"dots"` (default) | A row of three dots, the first one wider and darker |
| `"counter"` | `1 / 3` |
| `"of"` | `1 of 3` |
| `"percentage"` | `33%` — the ratio, rounded |
| `"none"` | Nothing |
| `(current, total) => ReactNode` | Whatever you return |

`current` is 1-based, so the first step is `1` and the last equals `total`.
`total` is `steps.length`.

## Where it goes

`progressPosition` is `"header"`, `"body"` (the default), or `"inline"`, and it
changes the card's three-row layout:

- **`header`** — progress on top, then the title and content, then the buttons.
- **`body`** — title and content on top, progress between them and the buttons.
- **`inline`** — title and content on top, then one footer row holding the
  progress and the buttons side by side. The card gets no middle row, so it is
  the shortest of the three.

## Dots in the inline position

`progress="dots"` with `progressPosition="inline"` renders the counter instead.
A row of dots has no width to spare next to two or three buttons, and a
`1 / 3` counter says the same thing in a fraction of the space. This was v1
behaviour too, and it is worth knowing before you go looking for a bug.

The substitution applies only to the built-in `"dots"`. A render function is
used as-is in every position — if you want dots in the footer, draw them
yourself.

## Styling

Whatever the position, the indicator sits in a `.sf-progress` element. The dots
are a `.sf-dots` list of `.sf-dot` items, with `.sf-active` on the current one.
In the inline layout, `.sf-progress-controls` wraps the progress and the
buttons together. See [Styling and Theming](../../guides/styling-and-theming.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../navigation/examples.md">Navigation: Examples</a></div>
  <div>Next: <a href="options.md">Progress Indicator: Options</a></div>
</div>
