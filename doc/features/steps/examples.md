# Steps: Examples

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: Examples

## Ref targets, with a centered intro and outro

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function Dashboard() {
  const filtersRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { title: "Your dashboard", content: "Three things, then you're done." },
    { target: filtersRef, title: "Filters", content: "Narrow the data down here." },
    { target: exportRef, title: "Export", content: "Download whatever you filtered." },
    { title: "All set", content: "Reopen this tour from the help menu." },
  ];

  return (
    <>
      <div ref={filtersRef}>…</div>
      <button ref={exportRef}>Export</button>

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

## JSX content

`content` is a React node, so a step can render components, links and your own markup.

```tsx
const steps: Step[] = [
  {
    target: billingRef,
    title: "Billing",
    content: (
      <>
        <p>Invoices and receipts live here.</p>
        <p>
          <a href="/docs/billing" target="_blank" rel="noreferrer">
            Read the billing guide
          </a>
        </p>
      </>
    ),
  },
];
```

Focusable elements inside `content` are part of the card's Tab cycle, so the link above is reachable with the keyboard.

## Preparing the UI before a move

Use a per-step `onNext` when the next step points at something that is not on screen yet. Returning a promise holds the tour until it settles, and the buttons disable themselves while you wait.

```tsx
const steps: Step[] = [
  {
    target: menuButtonRef,
    title: "The menu",
    content: "Everything else hides in here.",
    onNext: async () => {
      setMenuOpen(true);
      await new Promise(requestAnimationFrame); // let the menu paint
    },
  },
  { target: settingsItemRef, title: "Settings", content: "Now you can see it." },
];
```

## Aborting a move

Throwing from `onNext` abandons the move — the index does not advance — and the
error goes to `onError`. The tour stays on the current step, so "fix it and press
Next again" works: this is the mechanism behind a validation gate. Set `run` to
`false` in `onError` if a failure should end the tour instead.

```tsx
<Stepflow
  steps={[
    {
      target: nameRef,
      title: "Name your project",
      content: "Pick something you'll recognise later.",
      onNext: () => {
        if (!name.trim()) throw new Error("name required");
      },
    },
    { title: "Nice", content: `Created ${name}.` },
  ]}
  run={run}
  onError={() => {
    setHint("Enter a name, then start the tour again.");
    setRun(false);
  }}
  onComplete={() => setRun(false)}
/>
```

## Building steps from data

Steps are plain objects, so filter and map them like any other array.

```tsx
const steps: Step[] = [
  { title: "Welcome", content: "Quick tour of the new build." },
  ...(flags.billing
    ? [{ target: billingRef, title: "Billing", content: "New in this release." }]
    : []),
  ...panels.map((panel) => ({
    target: `#panel-${panel.id}`,
    title: panel.name,
    content: panel.hint,
  })),
];
```

Build the list before you set `run` to true. The step index resets when `run` flips, not when the array changes, so growing the array mid-tour leaves the index where it was.

## Translated content

```tsx
import { useTranslation } from "react-i18next";

export function TourSteps() {
  const { t } = useTranslation();
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { target: "#search", title: t("tour.search.title"), content: t("tour.search.body") },
  ];

  return (
    <Stepflow
      steps={steps}
      run={run}
      labels={{ next: t("tour.next"), prev: t("tour.back"), cancel: t("tour.skip"), complete: t("tour.done") }}
      onComplete={() => setRun(false)}
    />
  );
}
```

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Steps: API</a></div>
  <div>Next: <a href="../tooltip/overview.md">Tooltip: Overview</a></div>
</div>
