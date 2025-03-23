import scrollTo from "./scrollTo.utils";

// Main function that updates both the highlight and the dropdown.
export function updateHighlightAndDropdown(
    highlightRef: HTMLElement | null,
    dropdownRef: HTMLElement | null,
    target: Element | null
) {
    if (!target || !highlightRef || !dropdownRef) return;

    const computedStyle = window.getComputedStyle(target);
    if (computedStyle.position !== "fixed") {
        scrollTo(30, target);
    }

    const absoluteRect = getAbsoluteRect(target);
    updateHighlightStyle(highlightRef, computedStyle, absoluteRect);

    const targetRect = target.getBoundingClientRect();
    const dropdownPosition = calculateDropdownPosition(targetRect, dropdownRef);
    updateDropdownStyle(dropdownRef, dropdownPosition);
}

// Calculate the absolute position and dimensions of the target element.
function getAbsoluteRect(target: Element) {
    const rect = target.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
    };
}

// Update the highlight element's style based on the target's absolute dimensions.
function updateHighlightStyle(
    highlightEl: HTMLElement,
    computedStyle: CSSStyleDeclaration,
    absoluteRect: ReturnType<typeof getAbsoluteRect>
) {
    highlightEl.style.top = `${absoluteRect.top - 3}px`;
    highlightEl.style.left = `${absoluteRect.left - 3}px`;
    highlightEl.style.width = `${absoluteRect.width + 6}px`;
    highlightEl.style.height = `${absoluteRect.height + 6}px`;
    highlightEl.style.borderRadius = computedStyle.borderRadius;
}

// Calculate the dropdown's position, arrow offset, and determine if it appears below or above.
function calculateDropdownPosition(
    targetRect: DOMRect,
    dropdownEl: HTMLElement,
    gap = 16,
    sideMargin = 10
) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dropdownWidth = dropdownEl.offsetWidth;
    const dropdownHeight = dropdownEl.offsetHeight;

    // Horizontal positioning.
    let left = targetRect.left + scrollX;
    if (left + dropdownWidth > scrollX + viewportWidth - sideMargin) {
        left = scrollX + viewportWidth - dropdownWidth - sideMargin;
    }
    if (left < scrollX + sideMargin) {
        left = scrollX + sideMargin;
    }

    // Vertical positioning.
    let top: number;
    let isBelow: boolean;
    if (viewportHeight - targetRect.bottom >= dropdownHeight + gap) {
        top = targetRect.bottom + scrollY + gap;
        isBelow = true;
    } else if (targetRect.top >= dropdownHeight + gap) {
        top = targetRect.top + scrollY - dropdownHeight - gap;
        isBelow = false;
    } else {
        top = targetRect.bottom + scrollY + gap;
        isBelow = true;
    }

    // Calculate the arrow's horizontal offset.
    const targetCenterX = targetRect.left + scrollX + targetRect.width / 2;
    let arrowOffset = targetCenterX - left;

    // Only clamp if the target element is bigger than the dropdown.
    if (targetRect.width > dropdownWidth) {
        const sixthDropdown = dropdownWidth / 10;
        if (arrowOffset > sixthDropdown) {
            arrowOffset = sixthDropdown;
        }
    }
    arrowOffset = Math.max(10, Math.min(arrowOffset, dropdownWidth - 10));

    return { left, top, isBelow, arrowOffset };
}

function updateDropdownStyle(
    dropdownEl: HTMLElement,
    position: { left: number; top: number; isBelow: boolean; arrowOffset: number }
) {
    // If no-transition is enabled (e.g. during resize), update immediately.
    if (dropdownEl.classList.contains("no-transition")) {
        applyDropdownPosition(dropdownEl, position);
        dropdownEl.classList.add("visible");
        return;
    }

    // Temporarily disable the transition so hiding is immediate.
    const originalTransition = dropdownEl.style.transition;
    dropdownEl.style.transition = "none";
    dropdownEl.classList.remove("visible");

    // Force reflow to immediately apply the removal.
    void dropdownEl.offsetWidth;

    // Update the dropdown's position.
    applyDropdownPosition(dropdownEl, position);

    // Restore the transition property.
    dropdownEl.style.transition = originalTransition;

    // Use requestAnimationFrame to ensure styles are applied, then add the visible class to fade in.
    requestAnimationFrame(() => {
        dropdownEl.classList.add("visible");
    });
}

function applyDropdownPosition(
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