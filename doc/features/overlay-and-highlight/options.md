# Overlay and Highlight: Options

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: Options

Three props on `<Stepflow>` control this: `overlay`, `highlightColor` and `lockScroll`. They apply to the whole tour — there is no per-step override.

## `overlay`

- What it is: the dimming layer, and whether an outside click cancels the tour.
- Signature: `overlay?: boolean | { opacity?: number; closeOnClick?: boolean }`
- Default: `true`, which is the same as `{ opacity: 0.3, closeOnClick: false }`
- Example:

```tsx
<Stepflow steps={steps} run={run} overlay={{ opacity: 0.6 }} onComplete={() => setRun(false)} />
```

Notes:

- Only `overlay={false}` turns the layer off. Any object means on, so `overlay={{}}` is `overlay={true}`.
- `opacity` is used twice: as the alpha of `.sf-overlay`'s background, and as the alpha of the spread shadow that dims the page around the target. It is passed through as given — nothing clamps it, so keep it in `0`–`1`.
- `overlay={{ opacity: 0 }}` still renders `.sf-overlay` and still draws the spread shadow, both fully transparent. If you want the no-dim look, use `overlay={false}`: that removes the element and adds `sf-no-shadow` to the highlight.
- `closeOnClick` cancels on any click outside the card, including a click on the highlighted target. That is why it defaults to `false`. See [the overview](overview.md#closeonclick-defaults-to-false).
- The overlay is `pointer-events: none` in both modes. It cannot block interaction with the page, and it is not what receives the `closeOnClick` click.

## `highlightColor`

- What it is: the colour of the ring drawn around the target.
- Signature: `highlightColor?: string`
- Default: `"rgba(0, 0, 0, 0.8)"`
- Example:

```tsx
<Stepflow steps={steps} run={run} highlightColor="rgba(0, 120, 255, 0.9)" onComplete={() => setRun(false)} />
```

Notes:

- It becomes the first box-shadow on `.sf-highlight`, at `0 0 1px 2px`. Any CSS colour works.
- `highlightColor="transparent"` keeps the dim and drops the ring.
- Because the shadow is an inline style, a stylesheet rule for `box-shadow` will not win against it. Style the ring through this prop, or add an `outline` on `.sf-highlight` instead.

## `lockScroll`

- What it is: whether the page is frozen for the duration of the tour.
- Signature: `lockScroll?: boolean`
- Default: `true`
- Example:

```tsx
<Stepflow steps={steps} run={run} lockScroll={false} onComplete={() => setRun(false)} />
```

Notes:

- It sets `document.body.style.overflow = "hidden"` while the tour is active and puts the previous inline value back on teardown — including when a callback throws.
- It does not stop scrolling inside a nested scroll container. Stepflow re-measures on captured `scroll` events, so the highlight follows the target if the user scrolls one.
- Set it to `false` when a step asks the user to scroll, or when your app already owns `body` overflow and you do not want Stepflow touching it.
- Locking scroll is independent of the overlay. `overlay={false}` still locks; `lockScroll={false}` still dims.

## Related

- `scrollBehavior` controls how Stepflow brings a target into view before it measures it. See [Tooltip: Options](../tooltip/options.md).
- Class names available for theming are listed in [Styling and Theming](../../guides/styling-and-theming.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="overview.md">Overlay and Highlight: Overview</a></div>
  <div>Next: <a href="api.md">Overlay and Highlight: API</a></div>
</div>
