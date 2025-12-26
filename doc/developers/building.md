# Building

[Home](../README.md) → [Developers](contributing.md) → Building

Stepflow uses Rollup to build JavaScript bundles and CSS.

## Build command

```bash
npm run build
```

## Outputs

- Build output is generated locally into `./dist` and is not committed to git.
- JavaScript bundles are produced in ESM, CJS, UMD, and IIFE formats.
- Stylesheets and TypeScript declaration files are generated alongside the bundles.
- Package consumers should rely on the `package.json` exports rather than filesystem paths.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="contributing.md">Contributing</a></div>
  <div>Next: <a href="architecture.md">Architecture</a></div>
</div>
