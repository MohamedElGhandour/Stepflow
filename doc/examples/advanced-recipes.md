# Advanced Recipes

[Home](../README.md) → [Examples](hello-world.md) → Advanced Recipes

These lean on two things: `onNext` can return a promise, and `useTour` is the
whole state machine with none of the UI.

## Load data between steps

Return a promise from a step's `onNext`. The controls disable themselves until it
settles, and the step does not advance until then.

```tsx
import { useMemo, useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

type Invoice = { id: string; total: string };

export function BillingTour({ run, onDone }: { run: boolean; onDone: () => void }) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const steps = useMemo<Step[]>(
    () => [
      {
        title: "Billing",
        content: "Let's pull up your latest invoice.",
        onNext: async () => {
          const response = await fetch("/api/invoices/latest");
          if (!response.ok) throw new Error(`Invoice request failed: ${response.status}`);
          setInvoice((await response.json()) as Invoice);
        },
      },
      {
        target: invoiceRef,
        title: "Latest invoice",
        content: invoice ? `Invoice ${invoice.id} — ${invoice.total}.` : "Nothing loaded yet.",
      },
    ],
    [invoice]
  );

  return (
    <>
      <div ref={invoiceRef}>{invoice ? `${invoice.id} · ${invoice.total}` : "—"}</div>

      <Stepflow
        steps={steps}
        run={run}
        onComplete={onDone}
        onCancel={onDone}
        onError={(error) => {
          console.error(error);
          onDone();
        }}
      />
    </>
  );
}
```

Three things this buys you. Clicking **Next** three times while the request is in
flight fires the request once, not three times. Rejecting aborts the move — the
index stays on the billing step and the error goes to `onError`, while the tour
stays open so the user can retry. And `steps` depends on `invoice`, so when the
data lands the card re-measures against the element it now describes.

A step's own `onNext` runs first, then the component-level `onNext` prop, and
both are awaited in that order.

## A custom card with `useTour`

Use this when the built-in card is the wrong shape — a docked panel, a sidebar,
a bottom sheet on mobile. `useTour(steps, run, callbacks)` gives you the index,
the status, the transitions and the busy flag. It gives you nothing else: no
portal, no overlay, no ring, no placement, no keyboard handling, no focus trap,
no scroll lock, no scrolling the target into view. All of that lives in
`<Stepflow>`. The stylesheet does not apply either — every rule in it is scoped
under `.sf-root`, which you are not rendering.

```tsx
import { useTour, type Step } from "@mohamedelghandour/stepflow";

export function TourPanel({
  steps,
  run,
  onDone,
}: {
  steps: Step[];
  run: boolean;
  onDone: () => void;
}) {
  const tour = useTour(steps, run, { onComplete: onDone, onCancel: onDone });

  if (tour.status !== "active" || !tour.step) return null;

  return (
    <aside className="tour-panel" role="dialog" aria-modal="true" aria-label="Product tour">
      {tour.step.title != null && <h2>{tour.step.title}</h2>}
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
        {tour.isLast ? (
          <button type="button" onClick={tour.complete} disabled={tour.busy}>
            Done
          </button>
        ) : (
          <button type="button" onClick={tour.next} disabled={tour.busy}>
            Next
          </button>
        )}
      </footer>
    </aside>
  );
}
```

The callbacks argument is required — pass `{}` if you have none. `status` is
`"idle"`, `"active"`, `"completed"` or `"canceled"`; render only while it is
`"active"`. Keep `disabled={tour.busy}` on the buttons: it is how an async
`onNext` stops a double click from skipping a step.

If your card needs to anchor itself to something, `tour.step.target` is the value
you gave it — a selector string, an element or a ref. Resolving it and doing the
placement maths is yours to do; those helpers are internal to the package.

## A custom progress renderer

`progress` also takes a function. It receives the 1-based current step and the
total, and returns a node.

```tsx
<Stepflow
  steps={steps}
  run={run}
  progressPosition="header"
  progress={(current, total) => (
    <div
      className="tour-bar"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <span style={{ width: `${(current / total) * 100}%` }} />
    </div>
  )}
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>;
```

Your node is rendered inside `.sf-progress`, in the slot `progressPosition`
picks — `"header"` above the text, `"body"` below it, `"inline"` beside the
buttons. The built-in `"dots"` silently become a counter in the `"inline"`
position because a row of dots has no room there; a render function is used
as-is, so keep it narrow if you put it inline.

## Driving a tour from app state

More than one tour, at most one running: keep the name of the active tour in
state and derive each `run` from it.

```tsx
import { useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

type TourName = "onboarding" | "billing" | null;

export function Tours({
  onboarding,
  billing,
}: {
  onboarding: Step[];
  billing: Step[];
}) {
  const [active, setActive] = useState<TourName>(null);
  const stop = () => setActive(null);

  return (
    <>
      <button type="button" onClick={() => setActive("onboarding")}>
        Show me around
      </button>
      <button type="button" onClick={() => setActive("billing")}>
        Explain billing
      </button>

      <Stepflow steps={onboarding} run={active === "onboarding"} onComplete={stop} onCancel={stop} />
      <Stepflow steps={billing} run={active === "billing"} onComplete={stop} onCancel={stop} />
    </>
  );
}
```

Both components stay mounted; the one whose `run` is false renders nothing, so
this costs you a pair of null renders. Swap `useState` for your reducer, store or
URL state and nothing else changes — `run` is just a boolean.

One trap. Do not try to restart a tour by setting the state to `null` and back in
the same handler: React batches both updates, `run` never actually becomes false,
and the tour keeps its current index. You do not need to — turning the tour off
in `onComplete` / `onCancel` already gave you the false edge, so the next
`setActive("onboarding")` starts from step one.

## Wait for an element before advancing

When the next target mounts asynchronously — a lazy route, a panel that fetches
first — hold the transition open until it exists. This is the fix for the
centered-card fallback you get when a step measures too early.

```tsx
function waitForElement(selector: string, timeout = 3000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) return resolve();

    let timer = 0;
    const observer = new MutationObserver(() => {
      if (!document.querySelector(selector)) return;
      observer.disconnect();
      window.clearTimeout(timer);
      resolve();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    timer = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timed out waiting for ${selector}`));
    }, timeout);
  });
}
```

```tsx
const steps = useMemo<Step[]>(
  () => [
    {
      target: navRef,
      title: "Reports",
      content: "Everything you can export lives here.",
      onNext: async () => {
        setReportsOpen(true);
        await waitForElement("#report-table");
      },
    },
    { target: "#report-table", title: "Your reports", content: "Newest first." },
  ],
  []
);
```

**Next** and **Back** stay disabled while you wait, so nobody clicks past the
element they are about to be shown. Always pass a timeout: a rejection aborts the
move and routes to `onError`, which is a far better outcome than a tour frozen on
a spinner.

## A tour inside a modal

The card is `position: fixed` at a very high z-index, so it draws above a modal
without any help. You need `container` for the other problems: a modal that
traps focus will fight the card for it, and a modal that marks the rest of the
document `aria-hidden` or `inert` hides a card portalled into `document.body`
from assistive technology. Portalling into the modal solves both.

`container` is read during render, so a plain `useRef` is too late: it is still
null on the render where the tour turns on, and a null `container` falls back to
`document.body` — which is the thing you were trying to avoid. Hold the host in
state with a callback ref instead.

```tsx
import { useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

export function SettingsModal({ steps, run, onDone }: {
  steps: Step[];
  run: boolean;
  onDone: () => void;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);

  return (
    <div className="modal" role="dialog" aria-modal="true" ref={setHost}>
      <h2>Settings</h2>
      {/* … */}

      <Stepflow
        steps={steps}
        run={run}
        container={host}
        lockScroll={false}
        onComplete={onDone}
        onCancel={onDone}
      />
    </div>
  );
}
```

`lockScroll={false}` because the modal already owns `document.body`'s overflow.
Two owners of one style is a bug waiting for a race.

One CSS caveat. The card's coordinates are viewport-relative. Portal into an
element with a `transform`, `filter`, `perspective` or `contain` on it or above
it and `position: fixed` starts resolving against that box instead of the
viewport, which puts the card in the wrong place. Pick a plain host, or leave
`container` alone and let it portal to `document.body`.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="common-recipes.md">Common Recipes</a></div>
  <div>Next: <a href="../developers/contributing.md">Contributing</a></div>
</div>
