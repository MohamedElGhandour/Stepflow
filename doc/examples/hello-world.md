# Hello World

[Home](../README.md) → [Examples](hello-world.md) → Hello World

The smallest complete Stepflow app: one file, two steps, no configuration.

```tsx
// src/App.tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function App() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { title: "Hello", content: "Two steps, then you are done." },
    { target: saveRef, title: "Save", content: "Your work is saved here." },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Start tour</button>
      <button ref={saveRef}>Save</button>

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

Paste that into a React 18 or 19 app and click **Start tour**.

## Line by line

`import "@mohamedelghandour/stepflow/styles.css"` pulls in the stylesheet for the
card, the highlight ring and the progress dots. Import it once, anywhere in your
app. Without it the tour still runs, unstyled.

`useRef<HTMLButtonElement>(null)` creates the handle that step two points at.
Pass the ref object itself to `target` — not `saveRef.current`. A ref survives
renames and refactors in a way a `#css-selector` string does not.

`useState(false)` holds `run`, and `run` is yours. Stepflow renders nothing at
all while it is false, so it is safe to leave mounted for the life of the app.

The first step has no `target`. A target-less step gets a centered card with no
ring, which is what you want for an intro or an outro.

The second step sets `target: saveRef`. The card is placed below the button when
there is room and above it when there is not, with the ring drawn around the
button and the page dimmed around that.

`title` becomes the card's heading, `content` becomes its body. Both are React
nodes, so JSX and components go in directly. There is no HTML-string form, so
there is nothing to sanitise.

`onComplete` fires when you press **Done** on the last step, `onCancel` when you
press **Skip** or hit Escape. Both set `run` back to false. Do this even though
the tour has already torn itself down by then: the tour restarts at step one on
the false-to-true edge of `run`, so if `run` stays true you can never start a
second tour.

## What the defaults give you

Nothing above is configured, and you still get: the page dimmed at `0.3`
opacity, a ring in `rgba(0, 0, 0, 0.8)`, progress dots under the body, the
labels **Next**, **Back**, **Skip** and **Done**, **Back** hidden on the first
step and **Skip** hidden on the last, arrow-key navigation, Escape to cancel,
page scroll locked for the duration, smooth scrolling to bring each target into
view, and focus moved into the card, trapped there while it is open, and
restored to where it was when the tour ends.

Every one of those is a prop. See
[Configuration](../guides/configuration.md).

## One note on `steps`

A plain array literal is fine. If the surrounding component re-renders often,
wrap the array in `useMemo` — a new step object makes the card re-measure and
scroll to its target again.

## Next

- [Common Recipes](common-recipes.md) — first-visit tours, route changes,
  translated content, analytics.
- [Advanced Recipes](advanced-recipes.md) — async steps, a custom card with
  `useTour`, tours inside a modal.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../api/use-tour.md">API: useTour</a></div>
  <div>Next: <a href="common-recipes.md">Common Recipes</a></div>
</div>
