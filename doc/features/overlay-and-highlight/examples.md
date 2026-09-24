# Overlay and Highlight: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Overlay and Highlight](overview.md) → Overlay and Highlight: Examples

## Ring only, no dimming

`overlay={false}` removes `.sf-overlay` and the spread shadow. The target keeps its ring, and the rest of the page looks untouched — useful on a dense dashboard where dimming hides context the user still needs.

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function ChartTour() {
  const filtersRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    {
      target: filtersRef,
      title: "Filters",
      content: "Narrow the chart down to one region or one quarter.",
    },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Show me around</button>
      <button ref={filtersRef}>Filters</button>

      <Stepflow
        steps={steps}
        run={run}
        overlay={false}
        onComplete={() => setRun(false)}
        onCancel={() => setRun(false)}
      />
    </>
  );
}
```

## A darker dim and a branded ring

```tsx
<Stepflow
  steps={steps}
  run={run}
  overlay={{ opacity: 0.7 }}
  highlightColor="rgba(0, 120, 255, 0.9)"
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

## Dim the page, drop the ring

The dim comes from the highlight's spread shadow, so it survives a transparent ring colour.

```tsx
<Stepflow
  steps={steps}
  run={run}
  highlightColor="transparent"
  overlay={{ opacity: 0.5 }}
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

## A step the user has to interact with

Nothing extra is needed to make the highlighted element clickable — the overlay never intercepts pointer events. Leave `closeOnClick` at its default so the click does not cancel the tour, and unlock scroll if the interaction needs the page to move.

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function FilterTour() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [run, setRun] = useState(false);
  const [query, setQuery] = useState("");

  const steps: Step[] = [
    {
      target: searchRef,
      title: "Search",
      content: "Type a customer name here, then press Done.",
    },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Start</button>
      <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} />

      <Stepflow
        steps={steps}
        run={run}
        lockScroll={false}
        onComplete={() => setRun(false)}
        onCancel={() => setRun(false)}
      />
    </>
  );
}
```

Arrow-key navigation is ignored while focus is in that input, so typing and moving the caret behave normally.

## Opting into click-to-cancel

Turn it on when the tour is an aside the user should be able to dismiss by getting on with their work. Remember that a click on the highlighted target also counts as outside the card, so do not pair this with a step that asks for a click.

```tsx
<Stepflow
  steps={steps}
  run={run}
  overlay={{ opacity: 0.3, closeOnClick: true }}
  onCancel={() => setRun(false)}
  onComplete={() => setRun(false)}
/>
```

## Styling the ring-only variant

`.sf-highlight` carries `sf-no-shadow` whenever `overlay={false}`, which gives you a hook for CSS that should only apply in that mode. The box-shadow is an inline style, so reach for `outline` rather than fighting it.

```css
.sf-root .sf-highlight.sf-no-shadow {
  outline: 2px dashed rgba(0, 120, 255, 0.9);
  outline-offset: 4px;
}
```

## What you cannot do

`overlay`, `highlightColor` and `lockScroll` are tour-level props. There is no per-step overlay, and no per-step highlight colour. If one part of a flow needs a different treatment, render it as a second `<Stepflow>` with its own `run` state and hand off in `onComplete`.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Overlay and Highlight: API</a></div>
  <div>Next: <a href="../navigation/overview.md">Navigation: Overview</a></div>
</div>
