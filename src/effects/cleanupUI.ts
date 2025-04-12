export async function cleanupUI(
  resizeHandler: () => void,
  keyUpHandler: (e: KeyboardEvent) => void
) {
  document.body.classList.remove("sf-overflow-hidden");
  window.removeEventListener("resize", resizeHandler);
  document.removeEventListener("keyup", keyUpHandler);
  const { destroy } = await import("@stepflow/store/index"); // Dynamic import
  destroy();
}
