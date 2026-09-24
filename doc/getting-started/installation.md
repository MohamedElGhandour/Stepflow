# Installation

[Home](../README.md) → [Getting Started](installation.md) → Installation

Install via package manager:

```bash
npm i @mohamedelghandour/stepflow
```

```bash
pnpm add @mohamedelghandour/stepflow
```

```bash
yarn add @mohamedelghandour/stepflow
```

## Requirements

React 18 or 19, and a browser DOM at runtime. React and React DOM are peer dependencies, so you install them yourself; Stepflow adds no runtime dependencies of its own. Node 18 or newer is required for the tooling that consumes the package.

## Stylesheet

The stylesheet carries the positioning rules — `position: fixed`, the z-index, the arrow, the fade. Without it the card renders in the document flow instead of against its target. Import it once, wherever you set up your app:

```tsx
import "@mohamedelghandour/stepflow/styles.css";
```

If your setup cannot import CSS from JavaScript, reference the file directly. It ships at:

```
node_modules/@mohamedelghandour/stepflow/dist/styles/stepflow.css
```

Copy that file into your own assets, or pull it into a global stylesheet with `@import "@mohamedelghandour/stepflow/styles.css";` if your CSS pipeline resolves package names.

To restyle rather than replace, keep the import and override the `sf-` class names on top of it. See [Styling and Theming](../guides/styling-and-theming.md).

## TypeScript

Type declarations ship inside the package. There is no `@types/` package to install and nothing to add to your `tsconfig.json`. Declarations resolve under `moduleResolution` of `node16`, `nodenext`, and `bundler`.

Import the types you need alongside the component:

```tsx
import { Stepflow, useTour, type Step, type StepflowProps } from "@mohamedelghandour/stepflow";
```

`Step`, `StepflowProps`, `Labels`, `OverlayOptions`, `ProgressType`, `ProgressPosition`, `StepTarget`, `Status`, `Tour`, and `TourCallbacks` are all exported.

## Server rendering

`<Stepflow>` is safe to import and render on the server. It reads no DOM at module scope, every measurement happens inside an effect, and there is nothing to portal into on the server, so a server render emits an empty string and logs no warning. That covers Next.js, Remix, and Astro.

It is a client component: it holds state and runs effects. In the Next.js App Router, render it from a file that starts with `"use client"`.

## No CDN or script tag

There is no browser build in 2.0 — no CDN bundle, no `<script>` tag, no UMD or IIFE global. 1.x documented a CDN `<link>` for the stylesheet pinned to `@1.0.0`; that path is gone. Install from npm and import the component and the stylesheet through your bundler.

## Local development

Build output is generated locally into `./dist` and is not committed to git.

```bash
git clone https://github.com/MohamedElGhandour/Stepflow.git
```

```bash
cd Stepflow
```

```bash
npm install
```

```bash
npm run build
```

`npm run build` emits the ESM and CJS bundles, the type declarations, and the compiled stylesheet into `./dist`. See [Building](../developers/building.md) for the rest of the scripts.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../README.md">Doc Home</a></div>
  <div>Next: <a href="quick-start.md">Quick Start</a></div>
</div>
