/**
 * Provides a cross-browser way to get the screen dimensions
 *
 */
export function useWindowSize(): { width: number; height: number } {
  if (window.innerWidth !== undefined) {
    return { width: window.innerWidth, height: window.innerHeight };
  } else {
    const D = document.documentElement;
    return { width: D.clientWidth, height: D.clientHeight };
  }
}
