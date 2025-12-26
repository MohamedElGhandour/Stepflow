# Styling and Theming

[Home](../README.md) → [Guides](configuration.md) → Styling and Theming

Stepflow ships with a stylesheet built from `src/styles/stepflow.scss`.

<!-- TODO: Replace with a screenshot of a customized Stepflow theme. -->

## Include the stylesheet

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@mohamedelghandour/stepflow@1.0.0/dist/styles/stepflow.css"
/>
```

## Key CSS hooks

- `.sf-root`
- `.sf-overlay`
- `.sf-highlight`
- `.sf-tooltip`
- `.sf-controls`
- `.sf-progress`
- `.sf-dots` / `.sf-dot`

## CSS variables used at runtime

- `--box-shadow` (set on `.sf-highlight`)
- `--arrow-offset` (set on `.sf-tooltip`)

## Button classes

Buttons include a base class and feature-specific classes. Use `buttons.*.className` to add your own classes.

- Cancel: `.sf-btn.sf-btn-skip`
- Prev: `.sf-btn.sf-btn-prev`
- Next: `.sf-btn.sf-btn-next`
- Complete: `.sf-btn.sf-btn-done`

## Example override

```css
.sf-tooltip {
  width: 320px;
  border-radius: 12px;
}

.sf-highlight {
  border-radius: 12px;
}
```

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="configuration.md">Configuration</a></div>
  <div>Next: <a href="accessibility.md">Accessibility</a></div>
</div>
