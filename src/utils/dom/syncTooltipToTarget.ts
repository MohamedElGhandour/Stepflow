export function syncTooltipToTarget(target: Element, tooltipEl: HTMLElement) {
  const targetRect = target.getBoundingClientRect();
  const tooltipPosition = calculateTooltipPosition(targetRect, tooltipEl);
  updateTooltipStyle(tooltipEl, tooltipPosition);
}

// Calculate the tooltip's position, arrow offset, and determine if it appears below or above.
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

function updateTooltipStyle(
  tooltipEl: HTMLElement,
  position: { left: number; top: number; isBelow: boolean; arrowOffset: number }
) {
  // If no-transition is enabled (e.g. during resize), update immediately.
  if (tooltipEl.classList.contains("no-transition")) {
    applyTooltipPosition(tooltipEl, position);
    tooltipEl.classList.add("visible");
    return;
  }

  // Temporarily disable the transition so hiding is immediate.
  const originalTransition = tooltipEl.style.transition;
  tooltipEl.style.transition = "none";
  tooltipEl.classList.remove("visible");

  // Force reflow to immediately apply the removal.
  void tooltipEl.offsetWidth;

  // Update the tooltip's position.
  applyTooltipPosition(tooltipEl, position);

  // Restore the transition property.
  tooltipEl.style.transition = originalTransition;

  // Use requestAnimationFrame to ensure styles are applied, then add the visible class to fade in.
  requestAnimationFrame(() => {
    tooltipEl.classList.add("visible");
  });
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
    dropdownEl.classList.add("arrow-top");
    dropdownEl.classList.remove("arrow-bottom");
  } else {
    dropdownEl.classList.add("arrow-bottom");
    dropdownEl.classList.remove("arrow-top");
  }
}
