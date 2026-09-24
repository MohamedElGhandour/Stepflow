# Steps: API

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: API

`Step` and `StepTarget` are the types behind the `steps` prop of `<Stepflow>`. Both are exported from the package. For the component's own props, see the [API index](../../api/index.md).

## `Step`

- What it is: one step of the tour.
- Signature:

```ts
interface Step {
  target?: StepTarget;
  title?: ReactNode;
  content?: ReactNode;
  onNext?: (step: Step, index: number) => void | Promise<void>;
  onPrev?: (step: Step, index: number) => void | Promise<void>;
}
```

- Parameters:
  - `target`: what the step points at. Omit for a centered step.
  - `title`: the card's heading.
  - `content`: the card's body.
  - `onNext` / `onPrev`: run before the tour leaves this step, awaited if they return a promise.
- Returns: N/A
- Example:

```tsx
import { useRef } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

const ctaRef = useRef<HTMLButtonElement>(null);

const steps: Step[] = [
  {
    target: ctaRef,
    title: "Call to action",
    content: "Use this button to start.",
    onNext: (step, index) => track("tour_step", { index, title: step.title }),
  },
];
```

- Notes / Edge cases:
  - Every field is optional. `{}` is a valid step: an empty, centered card with working controls.
  - Fields are read on every render, so editing the current step's `title` or `content` updates the card in place.

## `StepTarget`

- What it is: the accepted target forms.
- Signature:

```ts
type StepTarget = string | HTMLElement | RefObject<HTMLElement | null>;
```

- Parameters:
  - `string`: passed to `document.querySelector`.
  - `HTMLElement`: used directly.
  - `RefObject`: `.current` is read at measure time, so a ref that is still `null` on the first render is fine.
- Returns: N/A
- Example:

```tsx
const panelRef = useRef<HTMLDivElement>(null);
// An element handed to you by a non-React library.
const [chartNode, setChartNode] = useState<HTMLElement | null>(null);

const steps: Step[] = [
  { target: panelRef, content: "A ref." },
  { target: "#legacy-widget", content: "A selector, for DOM you do not render." },
  { target: chartNode ?? undefined, content: "An element." },
];
```

- Notes / Edge cases:
  - Resolution runs on every measure — on step change, on window resize, and on scroll — so a target that mounts late is picked up.
  - An unresolvable or unrendered target is treated as no target: centered card, no arrow, and the highlight collapses to a point at the viewport centre.

## Callback order and errors

For a forward move, the step's own `onNext` is awaited first, then the `onNext` prop on `<Stepflow>`. Backwards is the same with `onPrev`. Only after both settle does the index change, and `onStepChange` then fires for the step you landed on.

If either one throws or rejects, the move is abandoned: the index does not change, the tour stays on the current step, and the error is handed to `onError` — or logged with a `[stepflow]` prefix when you have no `onError`. The user can fix the problem and press Next again.

```tsx
<Stepflow
  steps={[
    {
      target: formRef,
      title: "Save first",
      content: "We'll save before moving on.",
      onNext: async () => {
        const res = await fetch("/api/draft", { method: "POST" });
        if (!res.ok) throw new Error("draft failed"); // aborts the move, ends the tour
      },
    },
    { title: "Done", content: "Saved." },
  ]}
  run={run}
  onError={(error) => console.warn("tour aborted", error)}
  onComplete={() => setRun(false)}
/>
```

While an awaited hook is in flight, `useTour` reports `busy` and the card's buttons are disabled. Repeated clicks are dropped rather than queued.

## Removed from 1.x

`StepContent` and `StepCallbacks` no longer exist. `content.header` is now `title`, `content.body` is now `content`, `content.component` is now just a React node in `content`, and the `callbacks` object is flattened onto the step itself. The [migration guide](../../../MIGRATION.md) has the full mapping.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="options.md">Steps: Options</a></div>
  <div>Next: <a href="examples.md">Steps: Examples</a></div>
</div>
