"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let current = 0;
    let target = 0;
    let ease = 0.06; // Heavy easing - lower value = heavier/more momentum (0.06 = very heavy)
    let rafId: number | null = null;
    let isScrolling = false;

    const html = document.documentElement;
    const body = document.body;

    // Wait for page to be fully loaded
    const init = () => {
      // Set initial styles - don't move DOM nodes, just control overflow
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";

      // Get the actual scroll height
      const getScrollHeight = () => {
        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      };

      // Smooth scroll animation loop
      const lerp = () => {
        if (!isScrolling && Math.abs(target - current) < 0.1) {
          current = target;
          rafId = null;
          return;
        }

        current += (target - current) * ease;

        if (Math.abs(target - current) < 0.05) {
          current = target;
          isScrolling = false;
        } else {
          isScrolling = true;
        }

        // Apply transform to body instead of moving nodes
        body.style.transform = `translate3d(0, ${-current}px, 0)`;
        body.style.willChange = "transform";

        // Dispatch custom event with current scroll position for parallax hooks
        window.dispatchEvent(
          new CustomEvent("smoothscroll", {
            detail: { scrollY: current },
          })
        );

        rafId = requestAnimationFrame(lerp);
      };

      // Update scroll position on wheel
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        isScrolling = true;
        target += e.deltaY;
        target = Math.max(0, Math.min(target, getScrollHeight() - window.innerHeight));

        if (rafId === null) {
          rafId = requestAnimationFrame(lerp);
        }
      };

      // Update scroll position on touch
      let touchStart = 0;
      let touchScroll = 0;

      const handleTouchStart = (e: TouchEvent) => {
        touchStart = e.touches[0].clientY;
        touchScroll = target;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!touchStart) return;
        e.preventDefault();
        isScrolling = true;
        const touchY = e.touches[0].clientY;
        const diff = touchStart - touchY;
        target = touchScroll + diff;
        target = Math.max(0, Math.min(target, getScrollHeight() - window.innerHeight));

        if (rafId === null) {
          rafId = requestAnimationFrame(lerp);
        }
      };

      const handleTouchEnd = () => {
        touchStart = 0;
      };

      // Keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          isScrolling = true;
          target += window.innerHeight * 0.8;
          target = Math.min(target, getScrollHeight() - window.innerHeight);
          if (rafId === null) {
            rafId = requestAnimationFrame(lerp);
          }
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          isScrolling = true;
          target -= window.innerHeight * 0.8;
          target = Math.max(0, target);
          if (rafId === null) {
            rafId = requestAnimationFrame(lerp);
          }
        } else if (e.key === "Home") {
          e.preventDefault();
          isScrolling = true;
          target = 0;
          if (rafId === null) {
            rafId = requestAnimationFrame(lerp);
          }
        } else if (e.key === "End") {
          e.preventDefault();
          isScrolling = true;
          target = getScrollHeight() - window.innerHeight;
          if (rafId === null) {
            rafId = requestAnimationFrame(lerp);
          }
        }
      };

      // Add event listeners
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", handleTouchStart, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("keydown", handleKeyDown);

      // Start initial animation loop
      rafId = requestAnimationFrame(lerp);

      // Cleanup function
      return () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("keydown", handleKeyDown);

        // Clean up styles
        body.style.transform = "";
        body.style.willChange = "";
        body.style.overflow = "";
        html.style.overflow = "";
      };
    };

    // Wait for DOM to be ready
    if (document.readyState === "complete") {
      return init();
    } else {
      window.addEventListener("load", init);
      return () => window.removeEventListener("load", init);
    }
  }, []);

  return null;
}

