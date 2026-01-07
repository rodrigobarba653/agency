import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { isElementInView } from "../utils/viewUtils";

interface UseScrollAnimationOptions {
  /**
   * Ref to the element to animate
   */
  elementRef: RefObject<HTMLElement | SVGPathElement | null>;
  /**
   * Ref to the section/container to observe for intersection
   * If not provided, uses elementRef
   */
  sectionRef?: RefObject<HTMLElement | null>;
  /**
   * Initial GSAP properties (before animation)
   * Can be a function that returns props (useful for SVG paths that need pathLength)
   */
  initialProps: gsap.TweenVars | ((element: HTMLElement | SVGPathElement) => gsap.TweenVars);
  /**
   * Animation GSAP properties (target state)
   */
  animateProps: gsap.TweenVars;
  /**
   * IntersectionObserver threshold (0-1)
   * Default: 0.2
   */
  threshold?: number;
  /**
   * Whether to enable the animation
   * Default: true
   */
  enabled?: boolean;
  /**
   * Callback to run when element comes into view
   */
  onAnimate?: () => void;
}

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver
 * Handles the common pattern of resetting and animating elements when they come into view
 * 
 * @example
 * ```tsx
 * const elementRef = useRef<HTMLDivElement>(null);
 * useScrollAnimation({
 *   elementRef,
 *   initialProps: { opacity: 0, x: -100 },
 *   animateProps: { opacity: 1, x: 0, duration: 1.2, ease: "power2.out" }
 * });
 * ```
 */
export function useScrollAnimation({
  elementRef,
  sectionRef,
  initialProps,
  animateProps,
  threshold = 0.2,
  enabled = true,
  onAnimate,
}: UseScrollAnimationOptions) {
  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    const section = sectionRef?.current || element;

    // Get initial props (handle function case for dynamic props like pathLength)
    const getInitialProps = () => {
      if (typeof initialProps === "function") {
        return initialProps(element);
      }
      return initialProps;
    };

    // Initialize element with initial props
    gsap.set(element, getInitialProps());

    // Function to animate the element
    const animate = () => {
      // Reset first
      gsap.set(element, getInitialProps());
      // Small delay to ensure reset is applied
      requestAnimationFrame(() => {
        gsap.to(element, animateProps);
        onAnimate?.();
      });
    };

    // Intersection Observer to trigger animation when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
          }
        });
      },
      {
        threshold,
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    // Animate on initial mount if already in view
    if (isElementInView(section as HTMLElement)) {
      animate();
    }

    return () => {
      observer.disconnect();
    };
  }, [elementRef, sectionRef, threshold, enabled, onAnimate]);
}

