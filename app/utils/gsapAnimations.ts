import { gsap } from "gsap";
import { animateSVGPath } from "./animateSVG";

/**
 * Common GSAP animation utilities for reusable patterns
 */

/**
 * Fade in animation with optional transform
 */
export function fadeIn(
  element: HTMLElement | null,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    x?: number;
    y?: number;
    opacity?: number;
  } = {}
) {
  if (!element) return;

  const {
    duration = 0.8,
    delay = 0,
    ease = "power2.out",
    x = 0,
    y = 0,
    opacity = 1,
  } = options;

  gsap.to(element, {
    opacity,
    x,
    y,
    duration,
    delay,
    ease,
  });
}

/**
 * Fade out animation
 */
export function fadeOut(
  element: HTMLElement | null,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    onComplete?: () => void;
  } = {}
) {
  if (!element) return;

  const {
    duration = 0.3,
    delay = 0,
    ease = "power2.in",
    onComplete,
  } = options;

  gsap.to(element, {
    opacity: 0,
    duration,
    delay,
    ease,
    onComplete,
  });
}

/**
 * Slide in animation (from side)
 */
export function slideIn(
  element: HTMLElement | null,
  options: {
    from?: "left" | "right" | "top" | "bottom";
    duration?: number;
    delay?: number;
    ease?: string;
  } = {}
) {
  if (!element) return;

  const {
    from = "right",
    duration = 0.4,
    delay = 0,
    ease = "power2.out",
  } = options;

  const transforms: Record<string, { x?: string; y?: string }> = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  gsap.fromTo(
    element,
    transforms[from],
    {
      x: "0%",
      y: "0%",
      duration,
      delay,
      ease,
    }
  );
}

/**
 * Slide out animation (to side)
 */
export function slideOut(
  element: HTMLElement | null,
  options: {
    to?: "left" | "right" | "top" | "bottom";
    duration?: number;
    delay?: number;
    ease?: string;
    onComplete?: () => void;
  } = {}
) {
  if (!element) return;

  const {
    to = "right",
    duration = 0.4,
    delay = 0,
    ease = "power2.in",
    onComplete,
  } = options;

  const transforms: Record<string, { x?: string; y?: string }> = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  gsap.to(element, {
    ...transforms[to],
    duration,
    delay,
    ease,
    onComplete,
  });
}

/**
 * Animate SVG path stroke (draw effect)
 * Re-exports animateSVGPath from animateSVG.ts for consistency in naming
 */
export function animatePathStroke(
  pathElement: SVGPathElement | null,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
  } = {}
) {
  const {
    duration = 0.5,
    delay = 0,
    ease = "power2.out",
  } = options;

  animateSVGPath(pathElement, duration, delay, ease);
}

/**
 * Set initial state for fade in animation
 */
export function setFadeInInitial(
  element: HTMLElement | null,
  options: {
    opacity?: number;
    x?: number;
    y?: number;
  } = {}
) {
  if (!element) return;

  const { opacity = 0, x = 0, y = 0 } = options;

  gsap.set(element, {
    opacity,
    x,
    y,
  });
}

