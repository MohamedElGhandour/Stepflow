# Progress Indicator: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Progress Indicator](overview.md) → Progress Indicator: Examples

## Percentage in the header

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function EditorTour() {
  const [run, setRun] = useState(false);
  const saveRef = useRef<HTMLButtonElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);

  const steps: Step[] = [
    { title: "Welcome", content: "Two things and you're done." },
    { target: saveRef, title: "Save", content: "Your work is saved here." },
    { target: shareRef, title: "Share", content: "Send a link to anyone." },
  ];

  const stop = () => setRun(false);

  return (
    <>
      <button ref={saveRef}>Save</button>
      <button ref={shareRef}>Share</button>
      <button onClick={() => setRun(true)}>Show me around</button>

      <Stepflow
        steps={steps}
        run={run}
        progress="percentage"
        progressPosition="header"
        onComplete={stop}
        onCancel={stop}
      />
    </>
  );
}
```

## A compact card

`progressPosition="inline"` puts the counter on the same row as the buttons and
drops the card's middle row. Asking for `"dots"` here gets you the counter
anyway, so ask for it directly:

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress="counter"
  progressPosition="inline"
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

## No indicator

For a two-step tour the dots are noise:

```tsx
<Stepflow steps={steps} run={run} progress="none" onComplete={() => setRun(false)} />
```

## A progress bar

The render function form takes the 1-based step number and the total, and
returns a node. Here it is a bar built from two divs:

```tsx
<Stepflow
  steps={steps}
  run={run}
  progress={(current, total) => (
    <div className="tour-bar" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <div className="tour-bar-fill" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  )}
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

```css
.tour-bar {
  height: 4px;
  background: #eee;
  border-radius: 999px;
  overflow: hidden;
}
.tour-bar-fill {
  height: 100%;
  background: #000;
  transition: width 0.2s ease-in-out;
}
```

## Words instead of numbers

A render function can return anything, including nothing at all:

```tsx
const titles = ["Basics", "Editing", "Sharing"];

<Stepflow
  steps={steps}
  run={run}
  progress={(current, total) => (current === total ? "Last one" : titles[current - 1])}
  progressPosition="header"
  onComplete={() => setRun(false)}
/>;
```

Unlike the built-in `"dots"`, a render function is never substituted — it is
used verbatim in `"header"`, `"body"`, and `"inline"` alike.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Progress Indicator: API</a></div>
  <div>Next: <a href="../../api/index.md">API Index</a></div>
</div>
