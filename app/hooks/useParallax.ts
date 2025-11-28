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

      const handleScroll = () => {
        if (!elementRef.current) return;

        // Re-initialize offset in case layout changed
        initializeOffset();

        const scrollY = window.scrollY || window.pageYOffset;

        // Calculate scroll amount relative to container entry
        // When scrollY equals containerOffsetTop: scrollAmount = 0
        const scrollAmount = Math.max(0, scrollY - containerOffsetTop);

        // Apply transform - starts at 0 when container is at top, moves slower as you scroll
        const transformY = scrollAmount * speed;

        gsap.set(elementRef.current, {
          y: transformY,
        });
      };

      scrollHandler = handleScroll;
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Initial call to set starting position
    };

    // Start setup
    timer = setTimeout(setupParallax, 100);

    return () => {
      if (timer) clearTimeout(timer);
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
    };
  }, [elementRef, containerRef, speed, enabled]);
}

