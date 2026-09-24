# Steps: Options

[Home](../../README.md) → [Features](overview.md) → [Steps](overview.md) → Steps: Options

This page documents the `steps` prop and the fields of a single step.

## `steps`

- What it is: the ordered list of steps in the tour.
- Signature: `steps: Step[]`
- Example:

```tsx
<Stepflow
  steps={[
    { title: "Welcome", content: "Two things to show you." },
    { target: avatarRef, title: "Profile", content: "Edit your profile here." },
  ]}
  run={run}
  onComplete={() => setRun(false)}
/>
```

- Notes / Edge cases:
  - Required. An empty array means the tour never becomes active, even with `run` true — nothing renders.
  - The array position is the step order. There is no `index` or `order` field.
  - The index resets when `run` flips, not when the array changes.

## `Step.target`

- What it is: the element the card points at and the highlight rings.
- Signature: `target?: string | HTMLElement | RefObject<HTMLElement | null>`
- Example:

```tsx
const saveRef = useRef<HTMLButtonElement>(null);

const steps: Step[] = [
  { target: saveRef, title: "Save", content: "Saves without leaving the page." },
  { target: "#sidebar", title: "Sidebar", content: "Navigation lives here." },
  { title: "That's it", content: "No target, so this one is centered." },
];
```

- Notes / Edge cases:
  - A ref is the idiomatic choice. A selector is resolved with `document.querySelector` each time the step is measured.
  - Omit it for a centered, target-less step.
  - A target that is present but not laid out is treated as missing, and the card is centered.
  - The target stays clickable. The overlay is `pointer-events: none`, so a step can ask you to click the thing it is pointing at.

## `Step.title`

- What it is: the card's heading, rendered into an `<h3>`.
- Signature: `title?: ReactNode`
- Example:

```tsx
{ target: inviteRef, title: "Invite", content: "Add teammates to collaborate." }
```

- Notes / Edge cases:
  - Omit it and no heading element is rendered.
  - The heading also labels the dialog through `aria-labelledby`. A step with no title has no accessible name, so give every step one unless you have a reason not to. See [Tooltip: API](../tooltip/api.md).

## `Step.content`

- What it is: the card's body.
- Signature: `content?: ReactNode`
- Example:

```tsx
{
  target: "#upload",
  title: "Uploads",
  content: (
    <>
      Drop files here, or <button type="button" onClick={pick}>browse</button>.
    </>
  ),
}
```

- Notes / Edge cases:
  - Any React node: strings, JSX, your own components, a `<Trans>` from your i18n library.
  - No HTML strings and no `innerHTML`, so no XSS surface.
  - Interactive content works — focusable elements inside the card join the Tab trap.
  - Omit it and no body element is rendered.

## `Step.onNext` and `Step.onPrev`

- What they are: per-step hooks that run before the tour leaves this step.
- Signature:

```ts
onNext?: (step: Step, index: number) => void | Promise<void>;
onPrev?: (step: Step, index: number) => void | Promise<void>;
```

- Parameters:
  - `step`: the step being left
  - `index`: its zero-based position in `steps`
- Returns: `void` or a promise. A returned promise is awaited before the index moves.
- Example:

```tsx
const steps: Step[] = [
  {
    target: menuRef,
    title: "Menu",
    content: "Open the menu to see the rest.",
    onNext: async () => {
      setMenuOpen(true);
      // Let the menu paint before the next step measures its target.
      await new Promise(requestAnimationFrame);
    },
  },
];
```

- Notes / Edge cases:
  - The step hook runs first, then the matching `onNext` / `onPrev` prop on `<Stepflow>`.
  - Throwing — or rejecting — aborts the move. The index does not change and the tour stays on the current step, so the user can fix whatever the hook objected to and press Next again. The error goes to `onError`.
  - While an awaited hook is in flight the Back, Next and Done buttons are disabled, so a double click cannot skip a step.
  - `onNext` does not run on the last step. Its button is Done, which completes the tour.

---

<div style="display:flex; justify-content:space-between; align-items:center;">
  <div>Prev: <a href="overview.md">Steps: Overview</a></div>
  <div>Next: <a href="api.md">Steps: API</a></div>
</div>
