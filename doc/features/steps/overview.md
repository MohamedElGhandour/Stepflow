# Steps: Overview

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: Overview

Steps define the tour sequence: what to say and where to point. You pass them to `<Stepflow>` as the `steps` prop, in the order you want them visited.

A step is a plain object. Every field is optional.

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function Editor() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { title: "Welcome", content: "Let's walk through the editor." },
    { target: saveRef, title: "Save", content: "Your work is saved here." },
    { target: "#sidebar", title: "Sidebar", content: "Everything else lives here." },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Start tour</button>
      <button ref={saveRef}>Save</button>
      <aside id="sidebar">…</aside>

      <Stepflow
        steps={steps}
        run={run}
        onComplete={() => setRun(false)}
        onCancel={() => setRun(false)}
      />
    </>
  );
}
```

## What a step includes

- `target`: a ref, a CSS selector, an `HTMLElement`, or nothing
- `title`: rendered as the card's heading
- `content`: rendered as the card's body
- `onNext` / `onPrev`: per-step hooks that run before the move

See [Steps: API](api.md) for the exact type and [Steps: Options](options.md) for each field.

## Targets

Prefer a ref. It survives re-renders and refactors, and it points at the element React actually rendered — a `#css-selector` string only points at whatever happens to match at that moment.

```tsx
const saveRef = useRef<HTMLButtonElement>(null);
const steps: Step[] = [{ target: saveRef, title: "Save", content: "Click to save." }];
```

Selectors and raw elements still work, so a step can point at DOM you do not own — a third-party widget, or a node rendered outside React.

## When a target is missing

Omit `target` and the card is centered in the viewport with no arrow. That is what you want for an intro or an outro.

The same fallback covers a target that resolves but is not laid out — a collapsed accordion, an unopened modal, anything `display: none`. Stepflow checks for client rects before it measures, so a hidden target gets the centered card instead of a zero-size ring in the corner.

## Content is a React node

`content` and `title` are both `ReactNode`. Pass a string, JSX, a component, a translated message — anything React can render.

```tsx
const steps: Step[] = [
  {
    target: "#billing",
    title: <>Billing <span aria-hidden="true">💳</span></>,
    content: (
      <p>
        Invoices live here. <a href="/docs/billing">Read the guide</a>.
      </p>
    ),
  },
];
```

There is no HTML-string path any more. v1 assigned content with `innerHTML` and accepted `HTMLElement` values whose behaviour was never pinned down; both are gone, along with the XSS surface that came with them. React renders and escapes the node for you.

## Changing the array

`steps` is read on every render, so the card follows edits to the current step's `title` or `content` immediately. The step index resets only when `run` flips — replacing the array mid-tour keeps the current index, so build the list before you start the tour rather than during it.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../../guides/accessibility.md">Accessibility</a></div>
  <div>Next: <a href="options.md">Steps: Options</a></div>
</div>
