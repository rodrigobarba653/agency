import { useEffect, RefObject } from "react";
import { gsap } from "gsap";

interface UseParallaxOptions {
  /**
   * Ref to the element that should have parallax effect
   */
  elementRef: RefObject<HTMLElement | null>;
  /**
   * Speed factor for parallax (0.3 = moves 30% slower than scroll, 0.5 = 50% slower, etc.)
   * Default: 0.3
   */
  speed?: number;
  /**
   * Optional ref to a container/section to calculate scroll relative to it
   * If not provided, uses document scroll
   */
  containerRef?: RefObject<HTMLElement | null>;
  /**
   * Whether the parallax effect is enabled
   * Default: true
   */
  enabled?: boolean;
}

/**
 * Custom hook for parallax scroll effect
 * 
 * @example
 * ```tsx
 * const logoRef = useRef<HTMLDivElement>(null);
 * useParallax({ elementRef: logoRef, speed: 0.3 });
 * ```
 * 
 * @example With container
 * ```tsx
 * const heroRef = useRef<HTMLDivElement>(null);
 * const logoRef = useRef<HTMLDivElement>(null);
 * useParallax({ 
 *   elementRef: logoRef, 
 *   containerRef: heroRef,
 *   speed: 0.3 
 * });
 * ```
 */
export function useParallax({
  elementRef,
  speed = 0.3,
  containerRef,
  enabled = true,
}: UseParallaxOptions) {
  useEffect(() => {
    if (!enabled) return;

    let scrollHandler: (() => void) | null = null;
    let timer: NodeJS.Timeout | null = null;

    // Wait a bit for element to be available (especially for SVGs that load async)
    const setupParallax = () => {
      if (!elementRef.current) {
        // Retry if element isn't ready yet
        timer = setTimeout(setupParallax, 100);
        return;
      }

      let containerOffsetTop = 0;

      // Initialize container offset
      const initializeOffset = () => {
        if (containerRef?.current) {
          containerOffsetTop = containerRef.current.offsetTop;
        } else {
          containerOffsetTop = elementRef.current?.offsetTop || 0;
        }
      };

      initializeOffset();

      const handleScroll = (event?: Event | CustomEvent) => {
        if (!elementRef.current) return;

        // Re-initialize offset in case layout changed
        initializeOffset();

        // Get scroll position from smooth scroll event or fallback to window.scrollY
        let scrollY = window.scrollY || window.pageYOffset;
        if (event && "detail" in event && event.detail?.scrollY !== undefined) {
          scrollY = event.detail.scrollY;
        }

        // Calculate scroll amount relative to container entry
        // When scrollY equals containerOffsetTop: scrollAmount = 0
        // Allow negative values so parallax continues smoothly when scrolling above section
        const scrollAmount = scrollY - containerOffsetTop;

        // Apply transform - starts at 0 when container is at top, moves slower as you scroll
        // Negative values will move element up, positive values move it down
        const transformY = scrollAmount * speed;

        gsap.set(elementRef.current, {
          y: transformY,
        });
      };

      scrollHandler = handleScroll as () => void;
      
      // Listen to both native scroll and smooth scroll custom event
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("smoothscroll", handleScroll as EventListener, { passive: true });
      handleScroll(); // Initial call to set starting position
    };

    // Start setup
    timer = setTimeout(setupParallax, 100);

    return () => {
      if (timer) clearTimeout(timer);
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
        window.removeEventListener("smoothscroll", scrollHandler as EventListener);
      }
    };
  }, [elementRef, containerRef, speed, enabled]);
}

