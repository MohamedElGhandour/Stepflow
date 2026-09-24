# Migrating from 1.x to 2.0

Stepflow 2.0 is a React library. The vanilla `start()` API, the vendored
reactive core, and the IIFE/UMD script-tag builds are gone.

If you need the vanilla API, stay on `1.0.2`. Be aware that 1.0.2 cannot
actually be imported — every entry path in its manifest pointed at a file the
build never wrote — so in practice there is nothing to stay on. See
[the packaging fixes](#what-else-changed) below.

## The shape of the change

**1.x — imperative, one global tour**

```ts
import { start } from "@mohamedelghandour/stepflow";

await start({
  steps: [{ target: "#save", content: { header: "Save", body: "Click here." } }],
  options: { overlay: { enabled: true, opacity: 0.3, closeOnClick: true } },
  buttons: { next: { label: "Next" } },
  progress: { type: "dots", position: "body" },
  callbacks: { onComplete: () => track("tour_done") },
});
```

**2.0 — a component you render**

```tsx
import { Stepflow } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

<Stepflow
  run={run}
  steps={[{ target: "#save", title: "Save", content: "Click here." }]}
  overlay={{ opacity: 0.3 }}
  labels={{ next: "Next" }}
  progress="dots"
  progressPosition="body"
  onComplete={() => {
    track("tour_done");
    setRun(false);
  }}
/>;
```

## Option-by-option

| 1.x | 2.0 | Notes |
| --- | --- | --- |
| `start(config)` | `<Stepflow run … />` | You own `run`; flip it false in `onComplete` / `onCancel`. |
| `steps[].content.header` | `steps[].title` | |
| `steps[].content.body` | `steps[].content` | Now a `ReactNode`, not an HTML string. |
| `steps[].content.component` | `steps[].content` | Pass a component directly. |
| `steps[].target` | unchanged, plus refs | `string \| HTMLElement \| RefObject`. |
| `callbacks.onX` | `onX` prop | Same `(step, index)` arguments. |
| `buttons.next.label` | `labels.next` | Same for `prev`, `cancel`, `complete`. |
| `buttons.prev.visible` | `showPrev` | Same for `showCancel`. |
| `buttons.*.className` | `className` on the card | Style the buttons via `.sf-btn-next` etc. |
| `options.overlay.enabled` | `overlay={false}` | |
| `options.overlay.opacity` | `overlay={{ opacity }}` | |
| `options.overlay.closeOnClick` | `overlay={{ closeOnClick }}` | **Default is now `false`.** |
| `options.keyboardControls` | `keyboard` | |
| `options.escapeToCancel` | `escapeToCancel` | |
| `options.highlightBorderColor` | `highlightColor` | |
| `options.transitions.scrollBehavior` | `scrollBehavior` | Was a documented no-op in 1.x; now actually wired. |
| `options.transitions.animationDuration` | *removed* | Was a no-op. Override the CSS transition instead. |
| `progress.type` | `progress` | `"none"` is new; a render function replaces `type: "custom"`. |
| `progress.position` | `progressPosition` | |
| `progress.component` | `progress={(current, total) => …}` | |
| CDN `<link>` to the stylesheet | `import "@mohamedelghandour/stepflow/styles.css"` | |

## Behaviour changes you should know about

- **`closeOnClick` now defaults to `false`.** In 1.x it was on, and the overlay
  sat on top of the element each step was pointing at — so clicking the
  highlighted thing cancelled the tour instead of doing the thing. The overlay
  is now `pointer-events: none` and your targets stay interactive.
- **Arrow keys and Escape no longer fire while focus is in a text field.**
  1.x listened on `document` with no target check, so moving the caret inside an
  input navigated the tour.
- **A hidden target falls back to a centered card.** 1.x anchored the highlight
  to `(0, 0)` for a `display: none` target.
- **A throwing `onComplete` / `onCancel` no longer wedges the page.** The tour
  tears itself down before your callback runs, and the error goes to `onError`.
- **Rapid clicks during an async `onNext` no longer skip a step.** The controls
  disable until your promise settles.
- **The card is `position: fixed`.** It no longer breaks when the host page puts
  a `transform` or `position: relative` on `<body>`.
- **Progress `dots` in the `inline` position render as a counter** — a row of
  dots has no room beside the buttons. This was already 1.x behaviour.

## What else changed

The 1.x packaging was broken end to end; all of it is fixed and now verified on
every push by `npm run verify-pack`, which packs the tarball, installs it into a
clean project, and proves `require()`, `import()`, the stylesheet subpath, and
`tsc` all resolve.

- `main`, `module`, `types`, and `exports` now point at files the build emits.
- `exports` has a real `"."` subpath, a `types` condition first, and a `default`.
- `./styles.css` is an exported subpath instead of an unreachable file.
- Type declarations ship and resolve under `node16`, `nodenext`, and `bundler`.
- `@types/postcss-normalize` and `tslib` are no longer runtime dependencies.
- The package now has **no** runtime dependencies at all. React and React DOM are
  peer dependencies.
