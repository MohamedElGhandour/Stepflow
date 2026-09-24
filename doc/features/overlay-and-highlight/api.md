# Overlay and Highlight: API

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: API

The types behind these props, and the DOM they produce.

## `OverlayOptions`

- What it is: the object form of the `overlay` prop.
- Signature:

```ts
interface OverlayOptions {
  /** 0–1. Dim level of the page outside the highlight. */
  opacity?: number;
  /** Cancel the tour on a click outside the card. Defaults to false. */
  closeOnClick?: boolean;
}
```

- Import: `import type { OverlayOptions } from "@mohamedelghandour/stepflow";`
- Example:

```tsx
import { Stepflow, type OverlayOptions } from "@mohamedelghandour/stepflow";

const dimmed: OverlayOptions = { opacity: 0.65 };

<Stepflow steps={steps} run={run} overlay={dimmed} onComplete={() => setRun(false)} />;
```

Notes:

- Both fields are optional. A missing `opacity` is `0.3`; a missing `closeOnClick` is `false`.
- The interface has no `enabled` field. Turning the layer off is `overlay={false}` on the prop.

## Props on `StepflowProps`

```ts
interface StepflowProps {
  /** `false` disables the dimming layer and keeps only the highlight ring. */
  overlay?: boolean | OverlayOptions;
  /** Colour of the ring drawn around the target. */
  highlightColor?: string;
  /** Lock page scroll for the duration of the tour. */
  lockScroll?: boolean;
  // …the rest of the props
}
```

Defaults are `overlay = true`, `highlightColor = "rgba(0, 0, 0, 0.8)"`, `lockScroll = true`. Full list in [the API index](../../api/index.md).

## Rendered DOM

| Element | Class | Present when |
| --- | --- | --- |
| Portal root | `sf-root` | The tour is active. |
| Dimming layer | `sf-overlay` | `overlay !== false`. |
| Highlight ring | `sf-highlight` | Always, while the tour is active. |
| Highlight, ring-only | `sf-highlight sf-no-shadow` | `overlay === false`. |

`.sf-overlay` and `.sf-highlight` are both `aria-hidden="true"` and both `pointer-events: none`.

Inline styles Stepflow writes, which your CSS cannot override without `!important`:

- `.sf-overlay` — `background: rgba(0, 0, 0, <opacity>)`
- `.sf-highlight` — `top`, `left`, `width`, `height` from the target's bounding rect, and `box-shadow`

The box-shadow is `<highlightColor> 0 0 1px 2px, rgba(0, 0, 0, <opacity>) 0 0 0 5000px` with the overlay on, and just `<highlightColor> 0 0 1px 2px` with it off.

## Not in v2

There is no imperative overlay API — no object to construct, no method to show or hide a layer. The overlay exists while `<Stepflow>` is rendered with `run` true, and its shape is whatever the `overlay` prop says on that render.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Overlay and Highlight: Options</a></div>
  <div>Next: <a href="examples.md">Overlay and Highlight: Examples</a></div>
</div>
