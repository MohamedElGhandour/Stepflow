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

## Usage

```ts
import { start } from "@mohamedelghandour/stepflow";

await start({
  steps: [
    {
      target: "#step-1",
      content: { header: "Welcome", body: "This is Stepflow." },
    },
  ],
});
```

Notes:

- The public API entry point is `start(config: StepflowConfig)`.
- The CSS file is required for positioning and baseline styling.

## Local development

Build output is generated locally into `./dist` and is not committed to git.

```bash
git clone https://github.com/MohamedElGhandour/Stepflow.git
```

```bash
cd Stepflow
```

```bash
pnpm install
```

```bash
pnpm build
```

Running the build produces `./dist` locally.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="../README.md">Doc Home</a></div>
  <div>Next: <a href="quick-start.md">Quick Start</a></div>
</div>
