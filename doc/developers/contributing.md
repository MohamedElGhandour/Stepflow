# Contributing

[Home](../README.md) → [Developers](contributing.md) → Contributing

Contributions are welcome. Open an issue or a discussion before starting anything large — a new prop, a change to the rendered DOM, a change to a class name — so the design gets settled before you write code. Small fixes can go straight to a pull request.

## Local setup

```bash
git clone https://github.com/MohamedElGhandour/Stepflow.git
cd Stepflow
npm install
```

Node 18 or newer. CI runs Node 20.

`npm install` also runs `prepare`, which installs the Husky hooks. If you cloned before the hooks existed, `npm run prepare` installs them without a reinstall.

Then confirm the checkout is clean:

```bash
npm run check   # eslint + tsc --noEmit
npm test        # vitest run
```

## npm only

This repository uses npm, and `package-lock.json` is the only lockfile. Do not commit a `yarn.lock` or a `pnpm-lock.yaml` — CI runs `npm ci` against `package-lock.json`, so a second lockfile means two different dependency graphs and a build that passes locally and fails in CI.

If you add or bump a dependency, commit the `package-lock.json` change in the same commit.

## Hooks

Two Husky hooks, both cheap enough to leave on:

| Hook | Runs | Why |
| --- | --- | --- |
| `pre-commit` | `npx lint-staged` | `eslint --fix` on staged `.js`, `.mjs`, `.ts`, `.tsx` files. Fixes what it can, blocks on what it cannot. |
| `pre-push` | `npm run check && npm run test` | Catches in ten seconds what CI would tell you about in two minutes. |

If a hook blocks a push, fix the code. Do not reach for `--no-verify`; CI runs the same commands and will stop the pull request anyway.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every pull request. One job, Ubuntu, Node 20, npm cache on:

```
npm ci
npm run check
npm test
npm run build
npm run verify-pack
```

Those are the same five commands you can run locally, in the same order. The last one is the important one — it packs the tarball, installs it into a clean project, and proves `require()`, `import()`, the stylesheet subpath, and `tsc` all resolve. It is the step that would have caught the v1 packaging bugs. See [Building](building.md#verify-pack) for what it checks and why.

## Adding a test

Tests live in `tests/`, are named `*.test.ts` or `*.test.tsx`, and import from `../src/` directly. Three files, split by what they can prove:

- **`tests/placement.test.ts`** — geometry. `computePlacement` and `computeHighlight` take numbers and return numbers, so these tests assert exact pixel values. Any change to positioning belongs here first.
- **`tests/stepflow.test.tsx`** — behaviour, through Testing Library. Rendering, navigation, callbacks, keyboard, progress variants, the transition lock, teardown.
- **`tests/ssr.test.tsx`** — the server path. It carries a `// @vitest-environment node` comment, so it runs with no DOM globals at all.

`globals` is off in the Vitest config, so import what you use. There is no `jest-dom`, so assert with `toBeTruthy()`, `toBeNull()`, and `toHaveProperty` rather than `toBeInTheDocument()`. A behaviour test looks like this:

```tsx
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Stepflow } from "../src/Stepflow";
import type { Step } from "../src/types";

afterEach(cleanup);

describe("labels", () => {
  it("renders a custom next label and still advances", () => {
    const steps: Step[] = [{ content: "First step" }, { content: "Second step" }];
    render(<Stepflow steps={steps} run labels={{ next: "Onward" }} />);

    fireEvent.click(screen.getByRole("button", { name: "Onward" }));
    expect(screen.getByText("Second step")).toBeTruthy();
  });
});
```

Run it with `npm test`. That is a single pass that exits with a status code, which is what you want while iterating and what CI runs. `npm run test:watch` is there if you want it, but a watcher that never exits will not tell you whether the suite passes.

Two things worth knowing when you write these:

- Anything awaited — an async `onNext` or `onPrev` — needs `waitFor`. A transition with no callback to await is synchronous by design, so those assertions need no wrapping.
- happy-dom reports zero for most layout, so do not assert where the card landed in a component test. Assert the geometry in `tests/placement.test.ts` instead, where the inputs are plain numbers.

If you fix a bug, add the test that fails without your fix. The existing suite carries the v1 regressions as named cases — the double-click that skipped a step, the throwing `onComplete` that wedged the page, the arrow key that moved a caret and navigated the tour. Keep that pattern: the test says what went wrong, not only that something works.

## Touching the public surface

`src/types.ts` is the contract. A new prop starts there, with a doc comment, because the API reference is written from those comments. Then wire it in `src/Stepflow.tsx`, give it a default in the destructuring so the default is visible in one place, and add it to the props table in `README.md` and to [Configuration](../guides/configuration.md).

The CSS class names in `src/styles/stepflow.scss` are public too. Hosts style against `.sf-card`, `.sf-btn-next`, `.sf-dot`, and the rest. Renaming one is a breaking change, so treat it like an API change.

## Release

Releases go out from a clean `main` with CI green.

1. Bump the version in `package.json`.
2. Add the entry to `CHANGELOG.md`.
3. `npm publish`.

`prepublishOnly` runs `npm run check && npm run test && npm run build && npm run verify-pack` before the tarball is uploaded, so a publish cannot go out with a failing check, a stale `dist/`, or a manifest pointing at a file that does not exist. That failure mode is exactly what shipped as v1.0.2, three times.

Do not publish from a branch, and do not skip the hook.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../examples/advanced-recipes.md">Advanced Recipes</a></div>
  <div>Next: <a href="building.md">Building</a></div>
</div>
