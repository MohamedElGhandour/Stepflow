import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Stepflow } from "../src/Stepflow";
import type { Step } from "../src/types";

afterEach(cleanup);

const steps: Step[] = [
  { title: "One", content: "First step" },
  { title: "Two", content: "Second step" },
  { title: "Three", content: "Third step" },
];

const next = () => screen.getByRole("button", { name: "Next" });
const done = () => screen.getByRole("button", { name: "Done" });

describe("Stepflow", () => {
  it("renders nothing until run is true", () => {
    const { rerender } = render(<Stepflow steps={steps} run={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    rerender(<Stepflow steps={steps} run />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("First step")).toBeTruthy();
  });

  it("walks forward and back, and completes on the last step", () => {
    const onComplete = vi.fn();
    render(<Stepflow steps={steps} run onComplete={onComplete} />);

    fireEvent.click(next());
    expect(screen.getByText("Second step")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("First step")).toBeTruthy();

    fireEvent.click(next());
    fireEvent.click(next());
    expect(screen.getByText("Third step")).toBeTruthy();
    fireEvent.click(done());

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0]?.[1]).toBe(2);
    // Terminal state unmounts the UI on its own.
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("cancels from the Skip button", () => {
    const onCancel = vi.fn();
    render(<Stepflow steps={steps} run onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("hides Skip on the last step and Back on the first", () => {
    render(<Stepflow steps={steps} run />);
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
    fireEvent.click(next());
    fireEvent.click(next());
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
  });

  // The v1 bug: two clicks during an awaited onNext advanced twice, skipping a
  // step and firing the same callback twice.
  it("ignores a second click while an async onNext is in flight", async () => {
    let release: () => void = () => {};
    const onNext = vi.fn(() => new Promise<void>((resolve) => (release = resolve)));
    render(<Stepflow steps={steps} run onNext={onNext} />);

    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(next());
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));

    release();
    await waitFor(() => expect(screen.getByText("Second step")).toBeTruthy());
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("disables the controls while a transition is in flight", async () => {
    let release: () => void = () => {};
    const onNext = vi.fn(() => new Promise<void>((resolve) => (release = resolve)));
    render(<Stepflow steps={steps} run onNext={onNext} />);
    fireEvent.click(next());
    await waitFor(() => expect(next()).toHaveProperty("disabled", true));
    release();
    await waitFor(() => expect(next()).toHaveProperty("disabled", false));
  });

  // The v1 wedge: cleanup ran after the host callback inside the same try, so a
  // throwing onComplete left a locked, click-eating overlay on the page forever.
  it("tears down even when onComplete throws", () => {
    const onError = vi.fn();
    render(
      <Stepflow
        steps={[steps[0]!]}
        run
        onError={onError}
        onComplete={() => {
          throw new Error("analytics down");
        }}
      />
    );
    fireEvent.click(done());
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("locks page scroll while running and restores it on teardown", () => {
    document.body.style.overflow = "auto";
    const { rerender } = render(<Stepflow steps={steps} run />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Stepflow steps={steps} run={false} />);
    expect(document.body.style.overflow).toBe("auto");
    document.body.style.overflow = "";
  });

  it("releases its keyboard listener on unmount", () => {
    const onCancel = vi.fn();
    const { unmount } = render(<Stepflow steps={steps} run onCancel={onCancel} />);
    unmount();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("navigates with the arrow keys and cancels on Escape", () => {
    const onCancel = vi.fn();
    render(<Stepflow steps={steps} run onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(screen.getByText("Second step")).toBeTruthy();
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByText("First step")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  // v1 listened on document with no target check, so ArrowLeft to move the
  // caret inside a form field navigated the tour instead.
  it("leaves arrow keys alone when focus is in a text field", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    render(<Stepflow steps={steps} run />);
    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect(screen.getByText("First step")).toBeTruthy();
    input.remove();
  });

  it("renders each progress variant and a custom renderer", () => {
    const { rerender } = render(<Stepflow steps={steps} run progress="of" />);
    expect(screen.getByText("1 of 3")).toBeTruthy();
    rerender(<Stepflow steps={steps} run progress="counter" />);
    expect(screen.getByText("1 / 3")).toBeTruthy();
    rerender(<Stepflow steps={steps} run progress="percentage" />);
    expect(screen.getByText("33%")).toBeTruthy();
    rerender(<Stepflow steps={steps} run progress={(c, t) => `step ${c} of ${t}`} />);
    expect(screen.getByText("step 1 of 3")).toBeTruthy();
    rerender(<Stepflow steps={steps} run progress="dots" />);
    expect(document.querySelectorAll(".sf-dot")).toHaveLength(3);
    expect(document.querySelectorAll(".sf-dot.sf-active")).toHaveLength(1);
  });

  it("renders each progress position without losing the controls", () => {
    for (const position of ["header", "body", "inline"] as const) {
      cleanup();
      render(<Stepflow steps={steps} run progressPosition={position} />);
      expect(screen.getByRole("dialog")).toBeTruthy();
      expect(next()).toBeTruthy();
    }
  });

  it("labels the dialog from the step title", () => {
    render(<Stepflow steps={steps} run />);
    const dialog = screen.getByRole("dialog");
    const id = dialog.getAttribute("aria-labelledby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent).toBe("One");
  });

  it("accepts a ref as a step target", () => {
    const el = document.createElement("button");
    el.textContent = "Save";
    document.body.appendChild(el);
    render(<Stepflow steps={[{ target: { current: el }, content: "Click save" }]} run />);
    expect(screen.getByText("Click save")).toBeTruthy();
    expect(document.querySelector(".sf-highlight")).toBeTruthy();
    el.remove();
  });

  it("omits the overlay and its dimming when overlay is false", () => {
    render(<Stepflow steps={steps} run overlay={false} />);
    expect(document.querySelector(".sf-overlay")).toBeNull();
    expect(document.querySelector(".sf-highlight.sf-no-shadow")).toBeTruthy();
  });

  it("does not cancel on an outside click unless closeOnClick is set", () => {
    const onCancel = vi.fn();
    render(<Stepflow steps={steps} run onCancel={onCancel} />);
    fireEvent.click(document.body);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("reports onStart once and onStepChange on every settled step", () => {
    const onStart = vi.fn();
    const onStepChange = vi.fn();
    render(<Stepflow steps={steps} run onStart={onStart} onStepChange={onStepChange} />);
    fireEvent.click(next());
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStepChange).toHaveBeenCalledTimes(2);
    expect(onStepChange.mock.calls[1]?.[1]).toBe(1);
  });

  // Throwing from onNext is the documented way to abort a move — a validation
  // step that rejects bad input has to leave the user on that step to fix it.
  // Reporting an error must therefore never end the tour.
  it("aborts the move on a throwing step callback and keeps the tour usable", async () => {
    const onError = vi.fn();
    let valid = false;
    render(
      <Stepflow
        steps={[
          {
            content: "First step",
            onNext: () => {
              if (!valid) throw new Error("invalid");
            },
          },
          steps[1]!,
        ]}
        run
        onError={onError}
      />
    );

    fireEvent.click(next());
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("First step")).toBeTruthy();

    // The user fixes the problem and the same button now works.
    valid = true;
    fireEvent.click(next());
    await waitFor(() => expect(screen.getByText("Second step")).toBeTruthy());
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("cancels on an outside click when closeOnClick is set", async () => {
    const onCancel = vi.fn();
    render(<Stepflow steps={steps} run overlay={{ closeOnClick: true }} onCancel={onCancel} />);
    // The listener is attached on a timeout so the click that opened the tour
    // cannot immediately close it.
    await waitFor(() => {
      fireEvent.click(document.body);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  it("ignores a click inside the card when closeOnClick is set", async () => {
    const onCancel = vi.fn();
    render(<Stepflow steps={steps} run overlay={{ closeOnClick: true }} onCancel={onCancel} />);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeTruthy());
    fireEvent.click(screen.getByText("First step"));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("focuses the card on start and restores focus on teardown", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    expect(document.activeElement).toBe(opener);

    const { rerender } = render(<Stepflow steps={steps} run />);
    expect(document.activeElement).toBe(screen.getByRole("dialog"));

    rerender(<Stepflow steps={steps} run={false} />);
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it("traps Tab inside the card", () => {
    render(<Stepflow steps={steps} run />);
    const dialog = screen.getByRole("dialog");
    const buttons = dialog.querySelectorAll("button");
    const first = buttons[0] as HTMLElement;
    const last = buttons[buttons.length - 1] as HTMLElement;

    // Focus starts on the card itself, so Tab moves into the first control.
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  // Hosts pass an inline steps={[...]} array, so every parent render creates new
  // step objects. Keying the effects to the step object re-ran scrollIntoView on
  // each render and fought the user's own scrolling.
  it("does not re-scroll when the parent re-renders with an equal steps array", () => {
    const el = document.createElement("div");
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);
    const ref = { current: el };

    const { rerender } = render(
      <Stepflow steps={[{ target: ref, content: "one" }]} run />
    );
    expect(el.scrollIntoView).toHaveBeenCalledTimes(1);

    // Fresh array, fresh step object, same target.
    rerender(<Stepflow steps={[{ target: ref, content: "one" }]} run />);
    rerender(<Stepflow steps={[{ target: ref, content: "one" }]} run />);
    expect(el.scrollIntoView).toHaveBeenCalledTimes(1);

    el.remove();
  });
});
