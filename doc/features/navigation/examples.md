# Navigation: Examples

[Home](../../README.md) → [Features](../steps/overview.md) → [Navigation](overview.md) → Navigation: Examples

## Custom labels

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function SettingsTour() {
  const [run, setRun] = useState(false);
  const settingsRef = useRef<HTMLButtonElement>(null);

  const steps: Step[] = [
    { title: "Settings", content: "Manage your preferences here.", target: settingsRef },
    { title: "That's it", content: "You can reopen this tour from the help menu." },
  ];

  const stop = () => setRun(false);

  return (
    <>
      <button ref={settingsRef}>Settings</button>
      <button onClick={() => setRun(true)}>Take the tour</button>

      <Stepflow
        steps={steps}
        run={run}
        labels={{ cancel: "Not now", prev: "Back", next: "Continue", complete: "Finish" }}
        onComplete={stop}
        onCancel={stop}
      />
    </>
  );
}
```

## Await an API call between steps

Return a promise from `onNext` and the tour waits. The Next and Back buttons
disable themselves while it is in flight, so the user cannot double-click past
the step, and a rejection leaves the index where it was.

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function ProvisioningTour() {
  const [run, setRun] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      title: "Create your workspace",
      content: "We'll set one up before showing you around.",
      // Runs before the move; the tour holds until it resolves.
      onNext: async () => {
        const response = await fetch("/api/workspaces", { method: "POST" });
        if (!response.ok) throw new Error("Could not create the workspace");
      },
    },
    {
      target: workspaceRef,
      title: "Your workspace",
      content: "Everything you create lands here.",
    },
  ];

  const stop = () => setRun(false);

  return (
    <>
      <div ref={workspaceRef}>Workspace</div>
      <button onClick={() => setRun(true)}>Get started</button>
      {error && <p role="alert">{error}</p>}

      <Stepflow
        steps={steps}
        run={run}
        onComplete={stop}
        onCancel={stop}
        onError={(err) => {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setRun(false);
        }}
      />
    </>
  );
}
```

A throw aborts the move and leaves the user on the same step, so they can
correct the problem and press Next again. Set `run` to `false` in `onError` if a
failure should end the tour instead.

Use the `onNext` prop instead of the step's own when the work is the same for
every step — logging, a save, a permission check:

```tsx
<Stepflow
  steps={steps}
  run={run}
  onNext={(step, index) => saveProgress({ tour: "onboarding", index })}
  onComplete={() => setRun(false)}
  onCancel={() => setRun(false)}
/>
```

## Track every step

`onStepChange` fires on each settled step, including the first, whether the user
got there by button or by arrow key.

```tsx
<Stepflow
  steps={steps}
  run={run}
  onStart={(step, index) => analytics.track("tour_started", { index })}
  onStepChange={(step, index) => analytics.track("tour_step", { index })}
  onComplete={() => {
    analytics.track("tour_completed");
    setRun(false);
  }}
  onCancel={(step, index) => {
    analytics.track("tour_abandoned", { index });
    setRun(false);
  }}
/>
```

## One way forward

Hide Skip and Back, and leave the keyboard shortcuts off, for a flow the user
has to walk in order. Escape still cancels unless you turn that off too.

```tsx
<Stepflow
  steps={steps}
  run={run}
  showPrev={false}
  showCancel={false}
  keyboard={false}
  escapeToCancel={false}
  onComplete={() => setRun(false)}
/>
```

## Your own controls

`useTour` gives you the same transitions with no card. Read `busy` to disable
your buttons while an awaited callback runs.

```tsx
import { useState } from "react";
import { useTour, type Step } from "@mohamedelghandour/stepflow";

export function CustomCard({ steps }: { steps: Step[] }) {
  const [run, setRun] = useState(true);
  const tour = useTour(steps, run, { onComplete: () => setRun(false) });

  if (tour.status !== "active" || !tour.step) return null;

  return (
    <div className="my-card">
      <h2>{tour.step.title}</h2>
      <div>{tour.step.content}</div>
      <footer>
        <button onClick={tour.cancel}>Skip</button>
        <button onClick={tour.prev} disabled={tour.busy || tour.isFirst}>
          Back
        </button>
        <button onClick={tour.isLast ? tour.complete : tour.next} disabled={tour.busy}>
          {tour.isLast ? "Done" : "Next"}
        </button>
      </footer>
    </div>
  );
}
```

`useTour` has no opinion about positioning or the overlay — that part is
`<Stepflow>`. See [Positioning and Overlay](../../core-concepts/positioning-and-overlay.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="api.md">Navigation: API</a></div>
  <div>Next: <a href="../progress-indicator/overview.md">Progress Indicator: Overview</a></div>
</div>
