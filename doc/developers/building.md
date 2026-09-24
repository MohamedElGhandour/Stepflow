# Building

[Home](../README.md) → [Developers](contributing.md) → Building

Three tools, one for each kind of output. `tsc` emits the type declarations, Rollup emits the JavaScript, and Sass compiles the stylesheet. Nothing in `dist/` is committed.

## Build

```bash
npm run build
```

That is five steps in sequence:

```
rm -rf dist                          start clean
tsc -p tsconfig.build.json           declarations  → dist/types/
rollup -c                            esm + cjs     → dist/esm/, dist/cjs/
npm run build:css                    stylesheet    → dist/styles/
npm run build:demo                   copies the ESM bundle + CSS → public/vendor/
```

The last step is for the demo page only — `public/index.html` runs the real
build, so `public/vendor/` has to be refreshed alongside `dist/`. Nothing in the
published tarball comes from it.

`tsconfig.build.json` extends the root config and flips it to `emitDeclarationOnly` with `declaration` and `declarationMap` on, `rootDir: "src"`, and `declarationDir: "dist/types"`. It narrows `include` to `src` only, so tests and config files never reach the published types. Rollup does not emit declarations — the TypeScript plugin in `rollup.config.mjs` has `declaration: false` — because two tools writing `.d.ts` files into the same tree is a race worth not having.

Rollup builds the same `src/index.ts` twice, once as ESM and once as CJS, both with source maps and both with a version banner read out of `package.json`. React and React DOM are external, matched by `/^react($|\/)/` and `/^react-dom($|\/)/` so subpaths like `react-dom/client` are excluded too. Bundling them would ship a second copy of React into every consumer.

`npm run build:css` runs Sass directly:

```bash
sass src/styles/stepflow.scss dist/styles/stepflow.css --no-source-map --style=expanded
```

Expanded output, not compressed. The stylesheet is meant to be read and overridden, and hosts minify their own CSS anyway.

## What lands in dist

```
dist/
├── esm/stepflow.js         + .map    "module" and the import condition
├── cjs/stepflow.cjs        + .map    "main" and the require condition
├── styles/stepflow.css               the ./styles.css subpath
└── types/                            "types" and the types condition
    ├── index.d.ts          + .map
    ├── Stepflow.d.ts       + .map
    ├── useTour.d.ts        + .map
    ├── placement.d.ts      + .map
    └── types.d.ts          + .map
```

`package.json` sets `"files": ["dist"]`, so the tarball is those fifteen files plus `package.json`, `README.md`, and `LICENSE` — 18 files, about 33 kB packed. Consumers reach all of it through the `exports` map (`.` and `./styles.css`), never through a filesystem path.

## Watch

```bash
npm run dev
```

`rollup -c --watch`, and only that. It rebuilds the ESM and CJS bundles on save; it does not emit declarations and does not compile the stylesheet. If you are changing types or SCSS while linked into a test app, run `npm run build` instead.

## Test

```bash
npm test          # vitest run — one pass, exits
npm run test:watch
npm run coverage
```

Vitest runs in `happy-dom` with `globals: false`, so every test imports `describe`, `it`, and `expect` from `vitest` explicitly. It collects `tests/**/*.test.{ts,tsx}` — three files today: the placement math, the component, and a server-render check that runs in a `node` environment with no DOM.

`npm run coverage` uses the v8 provider, measures `src/**/*.{ts,tsx}` only, and fails below 90% on lines, functions, branches, and statements.

## Lint and types

```bash
npm run lint         # eslint .
npm run type-check   # tsc --noEmit
npm run check        # both, in that order
npm run format       # prettier --write .
```

ESLint runs the recommended JS and TypeScript configs plus `eslint-plugin-react-hooks`, and ignores `dist`, `coverage`, `public`, and `doc`. `type-check` uses the root `tsconfig.json`, which covers `src`, `tests`, `*.mjs`, and `scripts` — so a broken build script or a broken test is a type error, not a surprise in CI. That config runs strict, plus `noUncheckedIndexedAccess`, `noImplicitReturns`, `noUnusedLocals`, and `noUnusedParameters`.

`npm run check` is what the pre-push hook and CI both run.

## verify-pack

```bash
npm run verify-pack
```

Run it after `npm run build` — it inspects and packs whatever is in `dist/` right now.

`scripts/verify-pack.mjs` proves that a real consumer can install this package and use it. It does five things:

1. Walks every `./`-prefixed path in `exports`, `main`, `module`, and `types`, and checks each one exists on disk.
2. Runs `npm pack`, installs the resulting tarball into a fresh temp project alongside React and React DOM, then `require()`s it and asserts `Stepflow` is a function.
3. Does the same through `import()`.
4. Resolves `@mohamedelghandour/stepflow/styles.css` from that project, proving the subpath is exported and not just present in the tarball.
5. Writes a small `.tsx` file that imports `Stepflow` and the `Step` type, and type-checks it with `moduleResolution: "Bundler"`, `strict`, and `skipLibCheck: false`.

It exists because v1.0.2 shipped three times with every entry path in its manifest pointing at a file the build never wrote. Unit tests all passed — they imported from `src/`. Nothing ever consumed the tarball, so nothing caught it, and the package could not be imported at all. Step 1 alone would have caught that; steps 2 through 5 catch the subtler versions, where a path exists but the wrong format or the wrong resolution mode makes it unusable.

`skipLibCheck: false` in step 5 is deliberate. It is the setting that catches a declaration file which references a type it cannot resolve from a consumer's `node_modules`.

## Release

`prepublishOnly` chains the whole thing, so `npm publish` cannot skip it:

```
npm run check && npm run test && npm run build && npm run verify-pack
```

CI runs the same four commands on every push to `main` and every pull request. See [Contributing](contributing.md#ci) for the workflow itself.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="contributing.md">Contributing</a></div>
  <div>Next: <a href="architecture.md">Architecture</a></div>
</div>
