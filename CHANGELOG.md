# Changelog

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-08-24

Stepflow is now a React library. See [MIGRATION.md](./MIGRATION.md) for a
line-by-line upgrade path.

### Breaking

- Replaced the imperative `start(config)` API with a `<Stepflow />` component.
  React 18+ is now a peer dependency.
- Removed the IIFE and UMD builds, and with them the CDN script-tag usage.
- Removed the vendored reactive core; React renders the UI.
- `steps[].content.header` / `.body` / `.component` collapse into
  `steps[].title` and `steps[].content`, both `ReactNode`. HTML strings are no
  longer accepted, which removes the XSS surface they carried.
- Nested `options.*` / `buttons.*` / `callbacks.*` config is now flat props.
- `overlay.closeOnClick` defaults to `false` (was `true`).
- Removed `options.transitions.animationDuration`, which never did anything.
- `Status` no longer has an `"error"` member. Reporting an error is not a
  terminal state — see below.

### Fixed

- **Packaging: the package could not be imported at all.** Every path in
  `main`, `module`, `browser`, `unpkg`, and all eight `exports` conditions
  pointed at a file Rollup never wrote, in every published 1.x version.
- `exports` now has a real `"."` subpath with a `types` condition first and a
  `default` fallback, so `require()`, `import`, Vite, and `tsc` all resolve.
- The stylesheet is reachable as `@mohamedelghandour/stepflow/styles.css`.
  Previously it shipped in the tarball but no `exports` key referenced it.
- Type declarations ship and resolve. 1.x emitted one file that imported an
  unresolvable build alias, so consumers silently got `any`.
- Importing the package no longer throws in SSR. 1.x read `document` at module
  scope.
- Config no longer leaks between tours; per-component state replaced the module
  singleton that mutated its own defaults.
- Removed the prototype-pollution path through the config deep-merge.
- A throwing `onComplete` / `onCancel` can no longer strand a scroll-locked,
  click-eating overlay on the page.
- Rapid clicks during an async `onNext` no longer skip a step or double-fire
  callbacks; the controls disable until the promise settles.
- `complete()` and `cancel()` are idempotent and mutually exclusive.
- A throwing `onNext` / `onPrev` aborts the move and leaves the tour on its
  current step, instead of ending the tour. This is what makes a validating
  `onNext` usable: reject the move, let the user fix the input, let them press
  Next again. Errors from any callback go to `onError` without tearing the tour
  down; set `run` to `false` there if a particular failure should be fatal.
- The overlay is `pointer-events: none`, so the highlighted element stays
  clickable.
- Arrow keys and Escape are ignored while focus is in a text field.
- The card is clamped into the viewport when it fits neither above nor below the
  target — its footer buttons could previously land below the fold while page
  scroll was locked.
- A present-but-hidden target now falls back to a centered card instead of
  anchoring a 0×0 highlight at the viewport origin.
- Position is recomputed on scroll as well as resize, so targets inside scroll
  containers no longer drift.
- Targets inside nested scroll containers are scrolled into view, via native
  `scrollIntoView`.
- `scrollBehavior` is wired through instead of being flattened to a boolean and
  ignored, and animations respect `prefers-reduced-motion`.
- The card is a `role="dialog"` with `aria-modal`, an `aria-labelledby` title,
  focus-in on start, a Tab trap, and focus restore on teardown.
- The card is `position: fixed`, so host CSS on `<body>` no longer offsets it.

### Added

- `useTour` — the state machine without the UI, for a custom card.
- `run` prop for declarative start/stop, plus an `onStepChange` callback.
- Refs as step targets, alongside selectors and elements.
- `progress="none"`, and a render function in place of `progress.type: "custom"`.
- `lockScroll` and `container` props.
- `npm run verify-pack`: packs the tarball, installs it into a clean project,
  and asserts `require()`, `import()`, the stylesheet subpath, and `tsc` all
  resolve. Wired into `prepublishOnly` and CI.
- GitHub Actions CI running lint, type-check, tests, build, and `verify-pack`.

### Removed

- 17 build dependencies: Babel, PostCSS, autoprefixer, postcss-normalize,
  the Rollup alias/commonjs/json/node-resolve/terser plugins, the filesize,
  progress, sass, and visualizer plugins, and ts-node.
- `src/styles/style.scss`, an orphaned stylesheet nothing built.
- The unused type guards in `src/guard/`.
