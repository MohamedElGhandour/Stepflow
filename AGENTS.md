# Stepflow

React-only product-tour library. `<Stepflow />` renders a portal into
`document.body` with an overlay, a highlight ring, and a positioned card.

## Source map

Six files. Keep it that way — resist adding a directory per concept.

| File | Job |
| --- | --- |
| `src/index.ts` | Public exports. Nothing else. |
| `src/types.ts` | Every public type. The prop docs live here as doc comments. |
| `src/placement.ts` | Pure geometry. No DOM, no mutation, numbers in and out. |
| `src/useTour.ts` | State machine: index, status, navigation, callbacks. |
| `src/Stepflow.tsx` | Everything that touches the DOM. |
| `src/styles/stepflow.scss` | All `sf-` classes. |

## Invariants — do not break these

1. **`placement.ts` stays pure.** It is the only part that can be tested
   exactly, and `tests/placement.test.ts` asserts real pixel values. If you need
   a DOM read, do it in `Stepflow.tsx` and pass numbers in.
2. **Terminal state before the host callback.** `useTour`'s `finish()` sets the
   terminal status *first*, then runs `onComplete`/`onCancel`. v1 ran cleanup
   after the callback in the same `try`, so a throwing callback left a
   scroll-locked, click-eating overlay on the page forever.
3. **One transition at a time.** `lock` is a ref, not state, because it must be
   readable synchronously — state batches, and a double-click during an awaited
   `onNext` used to advance twice.
4. **Effects key on `step?.target`, never on `step`.** Hosts pass an inline
   `steps={[...]}` array, so step objects are new on every parent render.
   Keying on the object re-ran `scrollIntoView` continuously.
5. **The overlay is `pointer-events: none`.** The highlighted element has to stay
   clickable. `closeOnClick` defaults to `false` for the same reason.
6. **`content` and `title` are `ReactNode`.** Never reintroduce an HTML-string
   path; that was v1's XSS surface.
7. **Coordinates are viewport-relative (`position: fixed`).** No `scrollX`/
   `scrollY` arithmetic — v1 positioned absolutely and broke under any host
   `transform` on `<body>`.

## Packaging — the historical trap

Every published 1.x version was **unimportable**: `main`, `module`, `browser`,
`unpkg` and all eight `exports` conditions pointed at files Rollup never wrote.
Rollup derived its output names *from* those manifest fields, so both sides
stayed wrong in agreement, and nothing consumed the tarball to notice.

`npm run verify-pack` is the guard: it packs, installs into a temp project, and
proves `require()`, `import()`, the `./styles.css` subpath, and
`tsc --moduleResolution Bundler` all resolve. It runs in `prepublishOnly` and in
CI. **Never change `package.json` paths, `exports`, or `rollup.config.mjs`
without running it.**

Related: keep runtime `dependencies` empty. React and React DOM are peers.
`tslib` is a devDependency because `@rollup/plugin-typescript` wants it at build
time — it was wrongly a runtime dep in v1.

## Conventions

- `npm run check` = lint + type-check. Both must be clean; `eslint-plugin-react-hooks`
  is on and its errors are real (no render-time ref writes, no `setState` in an
  effect body — use the render-time reset pattern in `useTour` as the model).
- Tests are Vitest + `@testing-library/react` on happy-dom. Coverage thresholds
  are 90%. SSR tests need `// @vitest-environment node` at the top of the file —
  happy-dom provides a `document`, which makes an SSR test meaningless and makes
  `renderToString` throw on the portal.
- happy-dom has no layout engine: `getBoundingClientRect` returns zeros. Assert
  positioning in `tests/placement.test.ts` against numbers, not through the DOM.
  v1's positioning tests were vacuous for exactly this reason.
- Comments explain *why*, especially where the code guards against a specific
  past bug. Keep those.
- The demo in `public/` loads `public/vendor/stepflow.js`, copied there by
  `npm run build:demo` (part of `npm run build`). `public/vendor/` is force-added
  past the `dist/` gitignore so GitHub Pages works without a CDN or a version
  pin. Rebuild it when the bundle changes.

## Docs

`doc/` mirrors the API and is expected to stay accurate — the feature sections
follow a four-page shape (`overview` / `options` / `api` / `examples`). If you
change a prop or a default, update `doc/guides/configuration.md`, the relevant
`doc/features/*/options.md`, `doc/api/`, `README.md`'s props table, and
`CHANGELOG.md`. README and `doc/guides/configuration.md` must not contradict
each other.
