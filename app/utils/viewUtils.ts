/**
 * Utility functions for checking element visibility and viewport position
 */

/**
 * Checks if an element is currently in the viewport
 * @param element - The element to check
 * @returns true if element is in viewport, false otherwise
 */
export function isElementInView(element: HTMLElement | null): boolean {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  return rect.top < windowHeight && rect.bottom > 0;
}

/**
 * Gets the bounding rectangle and viewport info for an element
 * @param element - The element to check
 * @returns Object with rect and viewport info, or null if element doesn't exist
 */
export function getElementViewInfo(element: HTMLElement | null) {
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  return {
    rect,
    isInView: rect.top < windowHeight && rect.bottom > 0,
    isAboveView: rect.bottom < 0,
    isBelowView: rect.top > windowHeight,
    isFullyInView: rect.top >= 0 && rect.bottom <= windowHeight,
    viewportHeight: windowHeight,
    viewportWidth: windowWidth,
  };
}

