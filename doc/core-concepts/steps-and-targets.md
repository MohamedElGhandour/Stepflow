# Steps and Targets

[Home](../README.md) → [Core Concepts](mental-model.md) → Steps and Targets

Steps are the input to Stepflow. Each one says what to show and what to point at. The array order is the tour order.

## The step shape

```tsx
import type { ReactNode, RefObject } from "react";

type StepTarget = string | HTMLElement | RefObject<HTMLElement | null>;

interface Step {
  target?: StepTarget;
  title?: ReactNode;
  content?: ReactNode;
  onNext?: (step: Step, index: number) => void | Promise<void>;
  onPrev?: (step: Step, index: number) => void | Promise<void>;
}
```

Every field is optional. A step with no `target` is centered; a step with no `title` and no `content` renders an empty card.

## The three target forms

**A ref.** The default choice in React. It points at the element the component actually rendered, it survives a refactor of your markup, and TypeScript tells you when it is gone.

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function Toolbar() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { target: saveRef, title: "Save", content: "Your work is saved here." },
  ];

  return (
    <>
      <button ref={saveRef}>Save</button>
      <Stepflow steps={steps} run={run} onComplete={() => setRun(false)} onCancel={() => setRun(false)} />
    </>
  );
}
```

Stepflow reads `ref.current` when the step becomes active and again on every re-sync, so the ref only has to be attached by the time you reach that step — not when you build the array.

**A selector string.** For elements you do not render: a third-party widget, a portal, markup owned by another team.

```tsx
const steps: Step[] = [{ target: "#sidebar", title: "Sidebar", content: "Everything else lives here." }];
```

It is passed to `document.querySelector`, so any valid selector works and the first match wins. Nothing warns you when the selector stops matching — that is the cost of a string.

**An `HTMLElement`.** For an element you are already holding: one handed to you by a library callback, or a node you created yourself. `target` takes an element, not `HTMLElement | null`, so narrow it first.

```tsx
const [canvas, setCanvas] = useState<HTMLElement | null>(null);

const steps: Step[] = [
  { title: "Welcome", content: "A quick tour of the chart." },
  ...(canvas ? [{ target: canvas, title: "Chart", content: "Drag to zoom." }] : []),
];
```

## Steps with no target

Leave `target` off and the card sits in the middle of the viewport with no arrow. The highlight collapses to a single pixel at the viewport centre, so there is nothing to see behind the dimming. Use it for the intro and the outro:

```tsx
const steps: Step[] = [
  { title: "Welcome", content: "Three things to see before you start." },
  { target: saveRef, title: "Save", content: "Your work is saved here." },
  { title: "That's it", content: "Everything else is in the help menu." },
];
```

## Missing and hidden targets

A target resolves to nothing in two ways, and both end up centered.

**Missing.** A selector that matches no element, or a ref whose `current` is null.

**Present but not laid out.** Stepflow checks the resolved element with `getClientRects()`. An element inside a collapsed accordion, an unopened modal, or anything with `display: none` has no client rects, so it is treated as absent. Note the boundary: `visibility: hidden` and `opacity: 0` elements *are* laid out, so they still get a ring around empty space.

Either way you get the centered, arrow-less card — not a ring at the viewport origin and not a crash. The step still shows its `title` and `content`, so a tour with one missing target keeps working. If a step only makes sense once something is on screen, open it first in the previous step's `onNext`.

## Title and content

Both are `ReactNode`. Pass a string, JSX, a translated message, or a component:

```tsx
const steps: Step[] = [
  {
    target: exportRef,
    title: <>Export <kbd>⌘E</kbd></>,
    content: (
      <p>
        Downloads a CSV. See <a href="/docs/export">the docs</a> for the column list.
      </p>
    ),
  },
];
```

There is no HTML-string field and no `innerHTML` anywhere in the render path, so user-supplied text in a step cannot become markup.

`title` also gives the dialog its accessible name — the card is `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing at the heading. A step with no `title` has no accessible name. See [Accessibility](../guides/accessibility.md).

## Per-step callbacks

`onNext` and `onPrev` run on the step you are leaving, in the direction you are leaving it. Use them for work that belongs to one step rather than the whole tour — open the panel the next step points at, save a draft, load the data the next card describes.

```tsx
const steps: Step[] = [
  {
    target: filtersRef,
    title: "Filters",
    content: "Narrow the list here.",
    onNext: async () => {
      await openPanel("filters"); // the next step points inside this panel
    },
  },
  { target: "#filter-date", title: "By date", content: "Pick a range." },
];
```

Both are awaited. While one is in flight the controls disable themselves and a second click does nothing, so an async callback cannot be run twice or skip a step.

Order: the step's own callback runs first, then the tour-level `onNext` / `onPrev` prop, then the index changes.

**Throwing aborts the move.** If either callback throws or rejects, the index does not change, the tour stays on the current step, and the error goes to `onError`. Throw when the move should not happen — a validation gate is exactly this — and the user can fix the problem and press Next again:

```tsx
{
  target: filtersRef,
  content: "Narrow the list here.",
  onNext: async () => {
    try {
      await track("saw_filters"); // analytics is not worth killing the tour
    } catch {}
    await openPanel("filters"); // this one has to work
  },
}
```

Handlers are read through a live ref, so re-creating them on every render never restarts the tour. You do not need `useCallback` around them.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="mental-model.md">Mental Model</a></div>
  <div>Next: <a href="positioning-and-overlay.md">Positioning and Overlay</a></div>
</div>
