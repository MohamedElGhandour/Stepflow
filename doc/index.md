---
layout: home

hero:
  name: Stepflow
  text: Product tours for React
  tagline: One component, 3.2 kB min+gzip, zero runtime dependencies. You render it and control a run prop.
  image:
    src: /favicon.svg
    alt: Stepflow
  actions:
    - theme: brand
      text: Quick start
      link: /getting-started/quick-start
    - theme: alt
      text: Try the demo
      link: /demo/
      target: _self
    - theme: alt
      text: GitHub
      link: https://github.com/MohamedElGhandour/Stepflow

features:
  - title: Refs, not selectors
    details: Point a step at a React ref and it survives every refactor. Selector strings and elements still work, and a step with no target is centered.
  - title: Content is a React node
    details: Pass JSX, a component, a translated string. There is no HTML-string path, so there is no escaping to get wrong.
  - title: Nothing to clean up
    details: Listeners, the scroll lock, and the portal are tied to the component's lifetime. Unmount mid-tour and everything releases.
  - title: Accessible by default
    details: A labelled dialog with focus-in on start, a Tab trap, focus restore on teardown, arrow-key navigation that leaves your form fields alone, and reduced-motion support.
  - title: Safe to import on the server
    details: Renders null with no DOM present and reads layout only inside effects, so Next.js, Remix, and Astro can import it directly.
  - title: Headless when you need it
    details: useTour is the state machine on its own. Keep the behaviour, draw your own card.
---

## Install

```bash
npm i @mohamedelghandour/stepflow
```

```tsx
import { useRef, useState } from "react";
import { Stepflow, type Step } from "@mohamedelghandour/stepflow";
import "@mohamedelghandour/stepflow/styles.css";

export function App() {
  const saveRef = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    { title: "Welcome", content: "Let's walk through the editor." },
    { target: saveRef, title: "Save", content: "Your work is saved here." },
  ];

  return (
    <>
      <button onClick={() => setRun(true)}>Start tour</button>
      <button ref={saveRef}>Save</button>
      <Stepflow steps={steps} run={run} onComplete={() => setRun(false)} onCancel={() => setRun(false)} />
    </>
  );
}
```

Requires React 18 or 19. React and React DOM are peer dependencies.

Coming from 1.x? The API changed completely — see the [migration guide](../MIGRATION.md).
