/**
 * Synchronizes the tooltip's position to align it with the given target element.
 *
 * This function performs the following steps:
 * 1. Retrieves the bounding rectangle of the target element.
 * 2. If no-transition mode is enabled, it calculates and updates immediately.
 * 3. Otherwise, it temporarily disables transitions and hides the tooltip,
 *    forces a reflow so that the tooltip is fully hidden (opacity 0), then calculates
 *    the tooltip's position once using the updated layout, applies the new position,
 *    restores the original transition, and finally fades the tooltip in.
 *
 * @param target - The DOM element to which the tooltip should be aligned.
 * @param tooltipEl - The tooltip element that needs to be positioned.
 */
export function syncTooltipToTarget(target: Element | null, tooltipEl: HTMLElement) {
  // Fallback when the target element does not exist:
  if (!target) {
    fallback(tooltipEl);
    return;
  }

  const targetRect = target.getBoundingClientRect();

  // If no-transition is enabled (e.g., during resize), calculate and update immediately.
  if (tooltipEl.classList.contains("no-transition")) {
    const position = calculateTooltipPosition(targetRect, tooltipEl);
    applyTooltipPosition(tooltipEl, position);
    tooltipEl.classList.add("sf-visible");
    return;
  }

  // Temporarily disable transitions and hide the tooltip.
  const originalTransition = tooltipEl.style.transition;
  tooltipEl.style.transition = "none";
  tooltipEl.classList.remove("sf-visible");

  // Wait for the next animation frame to ensure the tooltip is fully hidden.
  requestAnimationFrame(() => {
    // Force reflow to ensure the tooltip's layout is updated (opacity 0).
    void tooltipEl.offsetWidth;

    // Now, calculate the tooltip's position only once.
    const position = calculateTooltipPosition(targetRect, tooltipEl);
    applyTooltipPosition(tooltipEl, position);

    // Restore the original transition.
    tooltipEl.style.transition = originalTransition;

    // Fade the tooltip in by adding the "visible" class.
    tooltipEl.classList.add("sf-visible");
  });
}

/**
 * Calculates the tooltip's position, arrow offset, and determines if it appears below or above.
 *
 * @param targetRect - The bounding rectangle of the target element.
 * @param tooltipEl - The tooltip element used to obtain its current dimensions.
 * @param gap - The vertical gap between the target element and tooltip.
 * @param sideMargin - The minimum horizontal margin from the viewport edges.
 * @returns An object with the left and top positions, a flag indicating if the tooltip is below the target, and the arrow offset.
 */
function calculateTooltipPosition(
  targetRect: DOMRect,
  tooltipEl: HTMLElement,
  gap = 16,
  sideMargin = 10
) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipWidth = tooltipEl.offsetWidth;
  const tooltipHeight = tooltipEl.offsetHeight;

  // Horizontal positioning.
  let left = targetRect.left + scrollX;
  if (left + tooltipWidth > scrollX + viewportWidth - sideMargin) {
    left = scrollX + viewportWidth - tooltipWidth - sideMargin;
  }
  if (left < scrollX + sideMargin) {
    left = scrollX + sideMargin;
  }

  // Vertical positioning.
  let top: number;
  let isBelow: boolean;
  if (viewportHeight - targetRect.bottom >= tooltipHeight + gap) {
    top = targetRect.bottom + scrollY + gap;
    isBelow = true;
  } else if (targetRect.top >= tooltipHeight + gap) {
    top = targetRect.top + scrollY - tooltipHeight - gap;
    isBelow = false;
  } else {
    top = targetRect.bottom + scrollY + gap;
    isBelow = true;
  }

  // Calculate the arrow's horizontal offset.
  const targetCenterX = targetRect.left + scrollX + targetRect.width / 2;
  let arrowOffset = targetCenterX - left;

  // Only clamp if the target element is bigger than the tooltip.
  if (targetRect.width > tooltipWidth) {
    const sixthTooltip = tooltipWidth / 10;
    if (arrowOffset > sixthTooltip) {
      arrowOffset = sixthTooltip;
    }
  }
  arrowOffset = Math.max(10, Math.min(arrowOffset, tooltipWidth - 10));

  return { left, top, isBelow, arrowOffset };
}

function applyTooltipPosition(
  dropdownEl: HTMLElement,
  position: { left: number; top: number; isBelow: boolean; arrowOffset: number }
) {
  // Position and display properties are assumed to be set in CSS.
  dropdownEl.style.left = `${position.left}px`;
  dropdownEl.style.top = `${position.top}px`;
  dropdownEl.style.setProperty("--arrow-offset", `${position.arrowOffset}px`);

  if (position.isBelow) {
    dropdownEl.classList.add("sf-arrow-top");
    dropdownEl.classList.remove("sf-arrow-bottom");
  } else {
    dropdownEl.classList.add("sf-arrow-bottom");
    dropdownEl.classList.remove("sf-arrow-top");
  }
}

function fallback(tooltipEl: HTMLElement) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipWidth = tooltipEl.offsetWidth;
  const tooltipHeight = tooltipEl.offsetHeight;

  // Calculate center positions
  const left = scrollX + (viewportWidth - tooltipWidth) / 2;
  const top = scrollY + (viewportHeight - tooltipHeight) / 2;

  // Optionally remove arrow classes since there's no target.
  tooltipEl.classList.remove("sf-arrow-top", "sf-arrow-bottom");
  // Reset any arrow offset if you're using a CSS variable.
  tooltipEl.style.setProperty("--arrow-offset", "0px");

  // Apply positioning immediately if in no-transition mode.
  if (tooltipEl.classList.contains("no-transition")) {
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
    tooltipEl.classList.add("sf-visible");
    return;
  }

  // Temporarily disable transitions and hide the tooltip.
  const originalTransition = tooltipEl.style.transition;
  tooltipEl.style.transition = "none";
  tooltipEl.classList.remove("sf-visible");

  // Wait for the next animation frame to ensure styles are applied.
  requestAnimationFrame(() => {
    // Force reflow to ensure the layout is updated.
    void tooltipEl.offsetWidth;

    // Apply the new center position.
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;

    // Restore the original transition.
    tooltipEl.style.transition = originalTransition;

    // Fade the tooltip in by adding the visible class.
    tooltipEl.classList.add("sf-visible");
  });
}
