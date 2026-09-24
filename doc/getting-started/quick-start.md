# Quick Start

[Home](../README.md) → [Getting Started](installation.md) → Quick Start

A three-step tour, built up from an empty React app. Each stage below adds one thing; the whole file is at the end.

## 1) Install and import the stylesheet

```bash
npm i @mohamedelghandour/stepflow
```

```tsx
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";
```

The stylesheet is not optional — it positions the card. See [Installation](installation.md) for the details.

## 2) Own the `run` flag

Stepflow renders nothing while `run` is false. You decide when it flips, so the tour starts from a button, a first-login check, or a feature flag — whatever your app already knows.

```tsx
const [run, setRun] = useState(false);

return <button onClick={() => setRun(true)}>Start tour</button>;
```

## 3) Point at the UI with refs

A step's `target` takes a ref, an element, a CSS selector string, or nothing at all. Reach for a ref: it survives renames and refactors, and TypeScript tells you when it goes stale. A selector only fails at runtime.

```tsx
const saveRef = useRef<HTMLButtonElement>(null);
const sidebarRef = useRef<HTMLElement>(null);

return (
  <>
    <button ref={saveRef}>Save</button>
    <aside ref={sidebarRef}>Projects</aside>
  </>
);
```

## 4) Write the steps

`title` is the card's heading, `content` is its body. Both are React nodes, so you can pass JSX, a component, or a translated string. There is no HTML-string path and therefore no escaping to worry about.

Leave `target` off for a step that should sit in the middle of the screen. That is what you want for an intro or a sign-off.

```tsx
const steps: Step[] = [
  { title: "Welcome", content: "Two minutes, three stops. Here we go." },
  { target: saveRef, title: "Save", content: "Your work lands here." },
  { target: sidebarRef, title: "Projects", content: "Everything else lives in the sidebar." },
];
```

## 5) Render the component

Pass the steps and the flag, and flip the flag back when the tour ends. `onComplete` fires when someone reaches the end and presses **Done**; `onCancel` fires on **Skip** and on Escape. Handle both, or a cancelled tour leaves `run` true and never restarts.

```tsx
<Stepflow
  steps={steps}
  run={run}
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

## The whole thing

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function App() {
  const [run, setRun] = useState(false);
  const saveRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const steps: Step[] = [
    { title: "Welcome", content: "Two minutes, three stops. Here we go." },
    { target: saveRef, title: "Save", content: "Your work lands here." },
    { target: sidebarRef, title: "Projects", content: "Everything else lives in the sidebar." },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Start tour</button>
      <button ref={saveRef}>Save</button>
      <aside ref={sidebarRef}>Projects</aside>

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

## What you get without configuring anything

The defaults are the common case, so the code above is already a finished tour.

The card lands below its target, or above it when there is no room below, and stays inside the viewport either way. The page dims to 30% behind it and a ring is drawn around the target — the dimming layer does not intercept clicks, so the highlighted element stays usable. Off-screen targets are scrolled into view, and page scroll is locked for the duration.

The buttons read **Skip**, **Back**, **Next**, and **Done**; **Skip** disappears on the last step and **Back** on the first. Arrow keys move between steps and Escape cancels, except while focus is in a text field. Progress shows as a row of dots under the body. Focus moves into the card on start, cycles inside it on Tab, and returns where it was on teardown.

Every one of those is a prop. Rename the buttons with `labels`, drop the dimming with `overlay={false}`, switch the indicator with `progress="of"`. See [Configuration](../guides/configuration.md).

## Where to go next

- [Mental Model](../core-concepts/mental-model.md) — how `run`, steps, and the terminal states fit together.
- [Steps and Targets](../core-concepts/steps-and-targets.md) — refs, selectors, hidden targets, per-step `onNext` and `onPrev`.
- [Configuration](../guides/configuration.md) — every prop and its default.
- [Styling and Theming](../guides/styling-and-theming.md) — the `sf-` class names and how to override them.
- [`useTour`](../api/use-tour.md) — the state machine on its own, when you want to draw the card yourself.
- [Common Recipes](../examples/common-recipes.md) — run-once-per-user, tours across route changes, async steps.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="installation.md">Installation</a></div>
  <div>Next: <a href="../core-concepts/mental-model.md">Mental Model</a></div>
</div>
