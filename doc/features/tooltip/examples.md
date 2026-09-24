# Tooltip: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Tooltip](overview.md) → Tooltip: Examples

## Title and body

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function Toolbar() {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { target: toolbarRef, title: "Toolbar", content: "Quick actions live here." },
  ];

  return (
    <>
      <div ref={toolbarRef}>…</div>
      <Stepflow steps={steps} run={run} onComplete={() => setRun(false)} onCancel={() => setRun(false)} />
    </>
  );
}
```

## Rich content in the card

Anything React can render goes in `content`, including interactive elements. They join the card's Tab cycle.

```tsx
const steps: Step[] = [
  {
    target: uploadRef,
    title: "Uploads",
    content: (
      <>
        <p>Drop files here to upload.</p>
        <label>
          <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
          Don't show this tour again
        </label>
      </>
    ),
  },
];
```

## Theming with `className`

`className` lands on the card. The arrow is a `::before` triangle coloured with a border, so a dark card needs both.

```tsx
<Stepflow steps={steps} run={run} className="tour-dark" onComplete={() => setRun(false)} />
```

The shipped rules are all scoped under `.sf-root`, so scope your overrides the same way — otherwise they lose on specificity rather than on order.

```css
.sf-root .sf-tooltip.tour-dark {
  width: 340px;
  background: #16181d;
  color: #f4f4f5;
}

.sf-root .sf-tooltip.tour-dark.sf-arrow-top::before {
  border-bottom-color: #16181d;
}

.sf-root .sf-tooltip.tour-dark.sf-arrow-bottom::before {
  border-top-color: #16181d;
}

.sf-root .tour-dark .sf-btn {
  background: #6366f1;
  color: #fff;
}

.sf-root .tour-dark .sf-btn-skip {
  background: transparent;
  color: #9ca3af;
}

.sf-root .tour-dark .sf-progress {
  color: #9ca3af;
}
```

## The three progress layouts

```tsx
const [position, setPosition] = useState<"header" | "body" | "inline">("body");

<Stepflow
  steps={steps}
  run={run}
  progress="of"
  progressPosition={position}
  onComplete={() => setRun(false)}
/>;
```

`header` puts `1 of 3` above the title. `body` puts it between the content and the buttons. `inline` drops the middle region and sits it in the footer beside the buttons — and if you asked for `dots` there, you get the `1 / 3` counter instead, because a row of dots does not fit.

## A custom progress indicator

`progress` also takes a render function, which is rendered inside `sf-progress` wherever `progressPosition` puts it.

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress={(current, total) => (
    <progress value={current} max={total} aria-label={`Step ${current} of ${total}`} />
  )}
  progressPosition="header"
  onComplete={() => setRun(false)}
/>
```

## Portalling into your own layer

```tsx
export function App() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [run, setRun] = useState(false);

  return (
    <>
      <main>…</main>
      <div ref={setHost} className="tour-layer" />
      <Stepflow steps={steps} run={run} container={host} onComplete={() => setRun(false)} />
    </>
  );
}
```

Keep the host free of `transform`, `filter` and `backdrop-filter`. Any of them makes the host a containing block for fixed positioning, and the card's viewport coordinates stop meaning what they say.

## Replacing the card entirely

There is no prop that swaps the card for your own component. Use `useTour` instead: it is the state machine with no UI, so you render and position whatever you like.

```tsx
import { useTour, type Step } from "@mohamedelghandour/stepflow";

export function MiniTour({ steps, run, onDone }: { steps: Step[]; run: boolean; onDone: () => void }) {
  const tour = useTour(steps, run, { onComplete: onDone, onCancel: onDone });

  if (tour.status !== "active" || !tour.step) return null;

  return (
    <aside className="mini-tour" role="dialog" aria-modal="true" aria-label="Product tour">
      <h2>{tour.step.title}</h2>
      <div>{tour.step.content}</div>
      <footer>
        <span>
          {tour.index + 1} / {steps.length}
        </span>
        <button type="button" onClick={tour.cancel}>
          Skip
        </button>
        <button type="button" onClick={tour.prev} disabled={tour.isFirst || tour.busy}>
          Back
        </button>
        <button
          type="button"
          onClick={tour.isLast ? tour.complete : tour.next}
          disabled={tour.busy}
        >
          {tour.isLast ? "Done" : "Next"}
        </button>
      </footer>
    </aside>
  );
}
```

You get the step, the index, `isFirst`, `isLast`, `busy` and the four actions. You do not get placement, the overlay, the highlight, the Tab trap or the keyboard shortcuts — those live in `<Stepflow>`. A custom card owns its own positioning and its own accessibility.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Tooltip: API</a></div>
  <div>Next: <a href="../overlay-and-highlight/overview.md">Overlay and Highlight: Overview</a></div>
</div>
