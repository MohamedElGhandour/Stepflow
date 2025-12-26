# Installation

[Home](../README.md) → [Getting Started](installation.md) → Installation

Stepflow is not published to npm yet. When it is, the expected install command will be:

```bash
npm install stepflow
```

If you are using a local build from this repository, the compiled bundles and CSS live in `dist/`:

- JavaScript bundles: `dist/esm/`, `dist/cjs/`, `dist/iife/`, `dist/umd/`
- Stylesheets: `dist/styles/stepflow.css` or `dist/styles/stepflow.min.css`

Example (local build in a browser page):

```html
<link rel="stylesheet" href="./dist/styles/stepflow.css" />
<script src="./dist/umd/stepflow.umd.js"></script>
<script>
  Stepflow.start({
    steps: [
      {
        target: "#step-1",
        content: { header: "Welcome", body: "This is Stepflow." },
      },
    ],
  });
</script>
```

Notes:

- The public API entry point is `start(config: StepflowConfig)`.
- The CSS file is required for positioning and baseline styling.

---
← Prev: [Doc Home](../README.md) | Next →: [Quick Start](quick-start.md)
