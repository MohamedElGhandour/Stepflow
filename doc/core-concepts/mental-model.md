# Mental Model

[Home](../README.md) → [Core Concepts](mental-model.md) → Mental Model

Stepflow is one component you render. `<Stepflow steps={steps} run={run} />` portals an overlay, a highlight ring, and a tooltip card into `document.body`, then keeps them aligned with the current step's target. While `run` is false it renders nothing — no listeners, no DOM, no locked scroll.

## You own `run`, Stepflow owns the index

That split is the whole API. `run` is your state, so starting and stopping a tour is a state change like any other in your app. The step index is Stepflow's state, so you never have to mirror it.

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function Editor() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { title: "Welcome", content: "Let's walk through the editor." },
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

Flip `run` back to false in `onComplete` and `onCancel`. Nothing else closes the tour on your behalf.

Changing `run` resets the tour: the index goes back to 0 and any terminal state clears. So `false` then `true` again restarts from the first step. There is no API for resuming mid-tour, and no API for jumping to a step from outside — if you need either, drive [`useTour`](#the-state-machine-on-its-own) yourself.

## What happens while a tour runs

1. `run` becomes true. The index is 0. `onStart` fires, then `onStepChange` for step 0.
2. The card measures itself and the target, places itself against the target, and fades in. The target is scrolled into view.
3. Next, Back, and the arrow keys move the index. `onStepChange` fires on every settled step.
4. Done on the last step completes. Skip, Escape, or an outside click with `overlay={{ closeOnClick: true }}` cancels.
5. The tour reaches a terminal state, unmounts, restores the scroll lock, and returns focus to the element that had it before the tour started.

Between steps, only the step changes: a new target, new `title` and `content`, recalculated placement, an updated progress indicator. Nothing is torn down and rebuilt.

## Terminal states tear down before your callback runs

A tour has one of four statuses: `idle`, `active`, `completed`, `canceled`. The last two are terminal, and reaching one is what unmounts the UI — not a cleanup routine that runs afterwards.

The order matters. Stepflow sets the terminal state first, so the overlay, the ring, and the card are already gone by the time your `onComplete` or `onCancel` runs. A callback that throws cannot leave a dimmed, click-eating layer on the page:

```tsx
<Stepflow
  steps={steps}
  run={run}
  onComplete={() => {
    track("tour_done"); // if this throws, the tour is already down
    setRun(false);
  }}
  onError={(error) => report(error)}
/>
```

## Errors have one exit

Every callback you pass — per-step and per-tour — is called inside a guard. A throw, or a rejected promise, is handed to `onError`. Without an `onError` it goes to `console.error` with a `[stepflow]` prefix. Nothing escapes into React's render path, so a broken analytics call cannot take down the tree around it.

An error does not end the tour. The index does not advance and the card stays where it is, which is what makes a validating `onNext` work: reject the move, let the user fix the problem, let them press Next again. If a particular failure *should* end the tour, set `run` to `false` in your `onError`.

## One transition at a time

`onNext` and `onPrev` may return a promise, and Stepflow awaits it before changing the index. While one is in flight the tour holds a lock and the controls disable themselves, so a double-click cannot advance twice or fire the same callback twice. `useTour` exposes that as `busy`.

If a callback throws, the move is abandoned and the index stays put — see [Steps and Targets](steps-and-targets.md#per-step-callbacks).

## The state machine on its own

`useTour` is the same state machine with no UI, for a card you render yourself:

```tsx
import { useTour, type Step } from "@mohamedelghandour/stepflow";

function Coachmark({ steps, run, onDone }: { steps: Step[]; run: boolean; onDone: () => void }) {
  const tour = useTour(steps, run, { onComplete: onDone, onCancel: onDone });
  if (tour.status !== "active" || !tour.step) return null;

  return (
    <div className="my-card">
      <h3>{tour.step.title}</h3>
      <div>{tour.step.content}</div>
      <button onClick={tour.cancel}>Skip</button>
      <button onClick={tour.isLast ? tour.complete : tour.next} disabled={tour.busy}>
        {tour.isLast ? "Done" : "Next"}
      </button>
    </div>
  );
}
```

You get `index`, `status`, `step`, `isFirst`, `isLast`, `busy`, and the four actions. You do not get placement, the overlay, the highlight, keyboard navigation, the focus trap, or the scroll lock — those live in `<Stepflow>`, and a headless card has to position itself.

## Coming from 1.x

1.x had a global, imperative tour: you called `start(config)` and got a promise back, one tour per page, its state living outside React. 2.0 has no `start()` and no singleton. The tour is a component, its state is React state, and two tours in two parts of your tree are two independent components.

The rest of the mapping is in [MIGRATION.md](../../MIGRATION.md).

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../getting-started/quick-start.md">Quick Start</a></div>
  <div>Next: <a href="steps-and-targets.md">Steps and Targets</a></div>
</div>
