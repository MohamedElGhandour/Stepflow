# Common Recipes

[Home](../README.md) → [Examples](hello-world.md) → Common Recipes

Everything here is a variation on one thing: you own `run`, and you build the
`steps` array out of state you already have.

## Start on the first visit only

Read the flag in an effect, not in the `useState` initialiser — the initialiser
also runs on the server, where `localStorage` does not exist.

```tsx
import { useEffect, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

const SEEN = "stepflow:onboarding";

export function Onboarding({ steps }: { steps: Step[] }) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SEEN) !== "1") setRun(true);
  }, []);

  const finish = () => {
    localStorage.setItem(SEEN, "1");
    setRun(false);
  };

  return <Stepflow steps={steps} run={run} onComplete={finish} onCancel={finish} />;
}
```

Mark it seen on cancel as well as on complete. A user who skipped the tour does
not want it again on the next page load.

## A "Start tour" button

```tsx
const [run, setRun] = useState(false);

return (
  <>
    <button type="button" onClick={() => setRun(true)}>
      Start tour
    </button>
    <Stepflow
      steps={steps}
      run={run}
      onComplete={() => setRun(false)}
      onCancel={() => setRun(false)}
    />
  </>
);
```

The tour restarts at step one every time `run` goes from false to true, so the
same button works for the fifth tour as for the first. That is also why the
terminal callbacks have to set `run` back to false.

## A tour that crosses a route change

Two rules. Render `<Stepflow>` in the layout, outside the routed area, so the
navigation does not unmount it. And navigate from the `onNext` of the step
*before* the one on the new page.

```tsx
// src/AppLayout.tsx
import { useMemo, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

export function AppLayout() {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);
  const billingLinkRef = useRef<HTMLAnchorElement>(null);

  const steps = useMemo<Step[]>(
    () => [
      {
        target: billingLinkRef,
        title: "Billing",
        content: "Plans and invoices live behind this link.",
        onNext: () => navigate("/billing"),
      },
      {
        target: "#invoice-table",
        title: "Invoices",
        content: "Every invoice, newest first.",
      },
    ],
    [navigate]
  );

  return (
    <div className="layout">
      <nav>
        <a ref={billingLinkRef} href="/billing">
          Billing
        </a>
      </nav>

      <Outlet />

      <Stepflow
        steps={steps}
        run={run}
        onComplete={() => setRun(false)}
        onCancel={() => setRun(false)}
      />
    </div>
  );
}
```

`#invoice-table` is a selector here because the element belongs to a page
component the layout has no ref to. If your router gives you a way to pass a ref
down, prefer the ref.

If the new route fetches data before it renders the table, the second step will
measure before the table exists and fall back to a centered card. Stepflow
re-measures on the next step change, on resize and on scroll — it does not watch
the DOM for an element appearing. When the target arrives late, wait for it:
[Wait for an element before advancing](advanced-recipes.md#wait-for-an-element-before-advancing).

## Targeting a conditionally rendered element

While the element is not rendered, `ref.current` is null and the step gets a
centered card. Open the thing first, from the previous step's `onNext`.

```tsx
const [run, setRun] = useState(false);
const [filtersOpen, setFiltersOpen] = useState(false);
const toolbarRef = useRef<HTMLDivElement>(null);
const filtersRef = useRef<HTMLDivElement>(null);

const steps = useMemo<Step[]>(
  () => [
    {
      target: toolbarRef,
      title: "Toolbar",
      content: "Sort, filter and export from here.",
      onNext: () => setFiltersOpen(true),
    },
    {
      target: filtersRef,
      title: "Filters",
      content: "Narrow the list down to what you need.",
    },
  ],
  []
);

return (
  <>
    <div ref={toolbarRef}>…</div>
    {filtersOpen && <div ref={filtersRef}>…</div>}

    <Stepflow
      steps={steps}
      run={run}
      onComplete={() => setRun(false)}
      onCancel={() => setRun(false)}
    />
  </>
);
```

The state update in `onNext` commits before the step advances, so the panel is
mounted and its ref is set by the time the card measures. If the panel animates
in or loads its own data, the measurement catches it mid-flight — await it
instead, as in the recipe linked above.

## Skipping steps whose target is not there

A missing target is not an error: the step still renders, centered, with no
ring. That is often fine for a one-off. When the step makes no sense without its
element, leave it out of the array — build the list from the same state that
decides whether the element renders.

```tsx
const steps = useMemo<Step[]>(() => {
  const list: Step[] = [
    { target: inboxRef, title: "Inbox", content: "Everything lands here first." },
  ];

  if (hasProjects) {
    list.push({ target: projectsRef, title: "Projects", content: "Group work by project." });
  }
  if (canInvite) {
    list.push({ target: inviteRef, title: "Invite", content: "Bring your team in." });
  }

  list.push({ title: "That's it", content: "Ask us anything." });
  return list;
}, [hasProjects, canInvite]);
```

Decide the list before you start the tour. The current index only resets when
`run` changes, so a list that shrinks mid-tour leaves the index pointing at a
different step than the user was on.

## Translated content

`title` and `content` are React nodes, so a plain string, a `t()` call and a
`<Trans>` component all work. Translate the four button labels too — they
default to English.

```tsx
import { useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";

export function TranslatedTour() {
  const { t } = useTranslation();
  const [run, setRun] = useState(false);
  const saveRef = useRef<HTMLButtonElement>(null);

  const steps = useMemo<Step[]>(
    () => [
      { title: t("tour.intro.title"), content: t("tour.intro.body") },
      {
        target: saveRef,
        title: t("tour.save.title"),
        content: <Trans i18nKey="tour.save.body" components={{ em: <em /> }} />,
      },
    ],
    [t]
  );

  return (
    <>
      <button ref={saveRef}>{t("common.save")}</button>

      <Stepflow
        steps={steps}
        run={run}
        labels={{
          next: t("common.next"),
          prev: t("common.back"),
          cancel: t("common.skip"),
          complete: t("common.done"),
        }}
        onComplete={() => setRun(false)}
        onCancel={() => setRun(false)}
      />
    </>
  );
}
```

`labels` is a partial — anything you leave out keeps its default. Rich
translations go in as components, not as markup strings, so there is no HTML to
escape.

## Analytics on every step

```tsx
import { track } from "./analytics";

<Stepflow
  steps={steps}
  run={run}
  onStart={() => track("tour_started", { total: steps.length })}
  onStepChange={(_step, index) => track("tour_step", { index, total: steps.length })}
  onComplete={() => {
    track("tour_completed");
    setRun(false);
  }}
  onCancel={(_step, index) => {
    track("tour_skipped", { index });
    setRun(false);
  }}
  onError={(error) => track("tour_error", { message: String(error) })}
/>;
```

`onStepChange` fires on every settled step, including the first — so it fires
once before the user clicks anything, and `onStart` is the one that fires exactly
once per tour. A move that gets aborted produces no `onStepChange`.

Track by index rather than by title: a step has no id, and the title may be a
React node rather than a string.

A throw never escapes into React. Every callback runs inside the same guard: the
error is routed to `onError` (or `console.error` with a `[stepflow]` prefix) and
the tour carries on, so a failed analytics call cannot cut a tour short.
`onComplete` and `onCancel` are safer still — the tour is already in its terminal
state by the time they run, so nothing they throw can strand the overlay on
screen.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="hello-world.md">Hello World</a></div>
  <div>Next: <a href="advanced-recipes.md">Advanced Recipes</a></div>
</div>
