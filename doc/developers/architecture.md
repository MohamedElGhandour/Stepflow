# Architecture

[Home](../README.md) → [Developers](contributing.md) → Architecture

Stepflow 2.0 is one React component, one hook, and one module of placement math. There is no store, no effect registry, no template layer, and no reactive core — those were v1's design and none of them survived. The whole library is six files:

```
src/
├── index.ts          public exports
├── types.ts          the prop contract, types only
├── placement.ts      pure geometry, no DOM
├── useTour.ts        the state machine
├── Stepflow.tsx      the component: effects, DOM, portal
└── styles/
    └── stepflow.scss the default theme
```

Under a thousand lines of source, and about 3.2 kB min+gzip once built. React
and React DOM are peer dependencies; there are no runtime dependencies at all.
(Exact figures deliberately omitted — run `wc -l src/*.ts src/*.tsx src/styles/*.scss`
rather than trusting a number in a doc.)

## What each file does

**`index.ts`** is the public surface, and nothing else. It re-exports `Stepflow`, `useTour`, the `Tour` and `TourCallbacks` types, and everything in `types.ts`. If a symbol is not named here, consumers cannot reach it.

**`types.ts`** holds `Step`, `StepTarget`, `StepflowProps`, `Labels`, `OverlayOptions`, `ProgressType`, `ProgressPosition`, and `Status`. It is types only, so it compiles to nothing — but it is the file to read first, and the file to change first when you add a prop. The doc comments on it are the source the API reference is written from.

**`placement.ts`** exports `computePlacement`, `computeHighlight`, `isVisible`, and the `GAP` (16) and `SIDE_MARGIN` (10) constants. It decides where the card goes and how big the highlight ring is. See [Why placement is numbers in and numbers out](#why-placement-is-numbers-in-and-numbers-out).

**`useTour.ts`** is the state machine: which step is current, whether the tour is idle, active, or terminal, whether a transition is in flight, and the four transition functions (`next`, `prev`, `complete`, `cancel`). It touches no DOM. It is exported, so a host can build a card of its own shape and get the same behaviour.

**`Stepflow.tsx`** is everything that has to talk to the browser. It resolves a `target` into an element, measures it, calls into `placement.ts`, and renders the result through a portal. It also owns the seven effects that keep the tour honest: the pre-paint layout pass, `scrollIntoView`, resize and scroll re-measurement, the body scroll lock, the keyboard handler, the focus trap, and the optional outside-click cancel.

**`styles/stepflow.scss`** is the default look. `npm run build:css` compiles it to `dist/styles/stepflow.css`, which consumers import as `@mohamedelghandour/stepflow/styles.css`. Nothing in the TypeScript imports it, so a host that wants to write its own CSS against the class names imports nothing and ships no unused bytes.

## Data flow

One pass, in one direction: props go in at the top, a portal comes out at the bottom.

```
<Stepflow steps run onComplete … />
        │
        │  presentation props stay in the component;
        │  the callbacks are spread into the hook
        ▼
useTour(steps, run, callbacks)
        │  { index, status, step, isFirst, isLast, busy,
        │    next, prev, complete, cancel }
        ▼
resolveTarget(step.target)  ──►  HTMLElement | null
        │  getBoundingClientRect()
        ▼
computePlacement(targetRect, cardSize, viewport)   ──►  { top, left, side, arrowOffset }
computeHighlight(targetRect, viewport)             ──►  { top, left, width, height }
        │  inline style + sf-arrow-top / sf-arrow-bottom / sf-visible
        ▼
createPortal(<div className="sf-root"> … </div>, container ?? document.body)
```

`Stepflow` destructures the props it renders with and spreads the rest — every `onX` — straight into `useTour`. So the hook never sees `overlay` or `progress`, and the component never owns step state. The seam between them is the `Tour` object.

Measuring needs the card's own `offsetWidth` and `offsetHeight`, which means the card has to be in the DOM before it can be placed. It is rendered without a position on the first pass, `sync()` runs in a layout effect, and the `sf-visible` class — the only thing that takes the card's opacity above 0 — is applied only once `placement` is non-null. The card is never visible in the wrong place.

The same `sync()` runs again on window `resize` and on `scroll` with `capture: true`, because the card is `position: fixed` and fixed coordinates go stale the moment anything moves. Capture matters: with `lockScroll` on, the body cannot scroll but an inner container still can, and a scroll event inside a nested container never reaches `window` in the bubble phase.

On the server, `host` resolves to `null` and the component returns `null` before any DOM read. `useIsomorphicLayoutEffect` falls back to `useEffect` when there is no `window`, which is what keeps React from logging a warning during a server render. `tests/ssr.test.tsx` runs in a `node` environment with no DOM globals at all and asserts that importing and rendering the component emits an empty string and no console error.

## Why placement is numbers in and numbers out

`computePlacement` and `computeHighlight` take plain numbers — a target rect, a card size, a viewport — and return plain numbers. They read no DOM, mutate nothing, and hold no state. The component does all the measuring and hands the results over.

That split exists so the geometry can be tested exactly rather than approximately. A jsdom or happy-dom environment reports zero for most layout, so a test that renders a card and asserts where it landed proves very little. A test that calls the function with a 120×40 target at `(100, 300)` in a 1000×800 viewport and asserts `top === 156` proves the whole thing. `tests/placement.test.ts` does exactly that, twelve times, including the case v1 got wrong: a card taller than the space available, where v1 returned a `top` that put the footer buttons below the fold while page scroll was locked. The clamp that fixes it is two lines, and the test pins them to an exact pixel.

`isVisible` lives in the same file and is the one exception — it calls `getClientRects()`, so it needs an element. It is here because it is part of the same question ("is there something to point at?"), and because it is three lines.

## Why the state machine holds the lock and the terminal state

`useTour` enforces two invariants. Both were bugs in v1's store, and most of v1's reported problems were downstream of them.

**One transition at a time.** `lock` is a ref, not state, because it has to be readable synchronously — React batches state updates, so two clicks in the same tick would both see the old value. `move()` sets the lock before awaiting a host callback and clears it in a `finally`. Without it, a double-click during an awaited `onNext` incremented the index twice: one step skipped, one callback fired twice. `busy` is the state mirror of the same fact, and it is what disables the buttons.

Note that a transition with no callback to await does not take the lock and does not go through a microtask. Deferring a plain click would make every consumer's tests async for no reason.

**Terminal state before the host callback.** `finish()` calls `setTerminal(next)` first and runs `onComplete` or `onCancel` after. The tour is already torn down — overlay gone, scroll lock released — by the time host code runs. In v1 the order was reversed inside a single `try`, so a callback that threw skipped the cleanup and left a locked, click-eating overlay on the page with no way to dismiss it. `guard()` also catches whatever the callback throws, sync or async, and routes it to `onError` rather than letting it escape into React. Both are covered: `tests/stepflow.test.tsx` asserts the dialog is gone and `document.body.style.overflow` is back to `""` after a throwing `onComplete`.

The `run` edge reset is worth one more note. When `run` flips, index, terminal, and busy all reset — during render, by comparing `run` against a `lastRun` state value, not in an effect. That is React's own documented answer to "a prop changed, drop the derived state," and it avoids the extra paint an effect would cause.

## Rendered DOM

The portal emits one `sf-root` wrapper holding up to three children: `sf-overlay` (skipped entirely when `overlay={false}`), `sf-highlight`, and the card. The overlay and the highlight are both `pointer-events: none` and `aria-hidden`; the card is `role="dialog"` with `aria-modal` and, when the step has a title, `aria-labelledby` pointing at the heading.

The card is always header / body / footer, but which content lands in which slot depends on `progressPosition`. That is the only structural branch in the render, and `tests/stepflow.test.tsx` walks all three positions asserting the dialog and the Next button survive each one.

Class names are listed in full on the [styling and theming](../guides/styling-and-theming.md) page. They are a public contract — renaming one is a breaking change.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="building.md">Building</a></div>
  <div>Next: <a href="../../MIGRATION.md">Migrating from 1.x</a></div>
</div>
