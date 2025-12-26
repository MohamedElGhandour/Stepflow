# Accessibility

[Home](../README.md) → [Guides](configuration.md) → Accessibility

Stepflow includes basic accessibility hooks and expects you to supply content and labels that make sense for your users.

![Accessible tooltip example (replace this image)](../assets/placeholders/placeholder-example.png)

TODO: Replace with a screenshot showing accessible tooltip content and labels.

## Built-in attributes

- Tooltip root uses `role="tooltip"` and `aria-modal="true"`.
- Button labels can be provided through `buttons.*.ariaLabel`.

## Recommendations

- Provide short, descriptive `header` and `body` text for each step.
- Always set `ariaLabel` for buttons when the text label is not descriptive.
- Ensure target elements are focusable or adjacent to focusable content.

Notes:

- Keyboard navigation is available via ArrowLeft/ArrowRight and Escape (when enabled).

---
← Prev: [Styling and Theming](styling-and-theming.md) | Next →: [Steps: Overview](../features/steps/overview.md)
