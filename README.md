# stepflow

A lightweight onboarding and user tour library for modern web apps.

## Badges

Add npm and CI badges here if desired.

## Installation

```bash
npm i @mohamedelghandour/stepflow
```

```bash
pnpm add @mohamedelghandour/stepflow
```

```bash
yarn add @mohamedelghandour/stepflow
```

## Quick Start

```ts
import { start } from "@mohamedelghandour/stepflow";

await start({
  steps: [
    {
      target: "#stepflow-target-1",
      content: {
        header: "First step",
        body: "Explain the first UI element.",
      },
    },
  ],
});
```

## Documentation

📚 Full Documentation: [./doc/README.md](./doc/README.md)

Quick links:

- Getting Started: [./doc/getting-started/quick-start.md](./doc/getting-started/quick-start.md)
- Configuration / Options: [./doc/guides/configuration.md](./doc/guides/configuration.md)
- API Reference: [./doc/api/index.md](./doc/api/index.md)
- Examples: [./doc/examples/hello-world.md](./doc/examples/hello-world.md)
- Styling and Theming: [./doc/guides/styling-and-theming.md](./doc/guides/styling-and-theming.md)

## Features

- Step-based tours anchored to DOM targets.
- Tooltip and highlight UI that track the current target.
- Optional overlay with click-to-cancel behavior.
- Built-in navigation buttons with per-step and global callbacks.
- Keyboard controls (ArrowLeft/ArrowRight/Escape) when enabled.
- Progress indicator styles (dots, counter, of, percentage, custom).
- Configurable styling via CSS classes and variables.

## Browser Support / Requirements

- Requires a real browser DOM (uses layout APIs like `getBoundingClientRect` and `scrollBy`).
- Include the Stepflow stylesheet from the published package (see docs).

## Contributing

See [./doc/developers/contributing.md](./doc/developers/contributing.md).

## License

MIT License. See [./licence](./licence).
