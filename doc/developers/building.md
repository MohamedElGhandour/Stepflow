# Building

[Home](../README.md) → [Developers](contributing.md) → Building

Stepflow uses Rollup to build JavaScript bundles and CSS.

## Build command

```bash
npm run build
```

## Outputs

- JavaScript bundles in `dist/`:
  - `dist/esm/stepflow.esm.js`
  - `dist/cjs/stepflow.js`
  - `dist/iife/stepflow.iife.js`
  - `dist/umd/stepflow.umd.js`
- Stylesheets in `dist/styles/`:
  - `dist/styles/stepflow.css`
  - `dist/styles/stepflow.min.css`
- Type declarations in `dist/types/`

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="contributing.md">Contributing</a></div>
  <div>Next: <a href="architecture.md">Architecture</a></div>
</div>
