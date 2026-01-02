"use client";

import { useEffect, useRef } from "react";
import { ppNeueCorpWideMedium } from "../fonts";
import Wave from "./Wave";
import { useParallax } from "../hooks/useParallax";
import { projects } from "../data/projects";

export default function Projects() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const speedMultiplierRef = useRef(1); // 1 = normal, >1 = faster, <1 = slower
  const directionRef = useRef<"forward" | "backward">("forward");
  const isHoldingRef = useRef(false);
  const accelerationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate projects for seamless loop
  const duplicatedProjects = [...projects, ...projects];

  // Parallax scroll effect for wave
  useParallax({
    elementRef: waveContainerRef,
    containerRef: sectionRef,
    speed: 0.5,
  });

  // Continuous scroll animation
  useEffect(() => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    let rafId: number;

    const animate = () => {
      if (!container) return;

      const scrollWidth = container.scrollWidth;
      const singleSetWidth = scrollWidth / 2;
      const speed =
        (directionRef.current === "forward" ? 1 : -1) *
        speedMultiplierRef.current;
      const scrollAmount = 3 * speed; // Base scroll speed

      // Update scroll position
      container.scrollLeft += scrollAmount;

      // Handle seamless looping
      if (directionRef.current === "forward") {
        if (container.scrollLeft >= singleSetWidth) {
          container.scrollLeft = container.scrollLeft - singleSetWidth;
        }
      } else {
        // For backward scrolling, when we go past 0, loop to the end
        if (container.scrollLeft <= 0) {
          container.scrollLeft = singleSetWidth;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    // Start animation
    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const resetToNormalSpeed = () => {
    speedMultiplierRef.current = 1;
    directionRef.current = "forward";
    isHoldingRef.current = false;

    // Clear acceleration interval
    if (accelerationIntervalRef.current) {
      clearInterval(accelerationIntervalRef.current);
      accelerationIntervalRef.current = null;
    }
  };

  const handlePreviousMouseDown = () => {
    isHoldingRef.current = true;
    directionRef.current = "backward";
    speedMultiplierRef.current = 1.5; // Start with slight acceleration

    // Gradually increase speed while holding
    accelerationIntervalRef.current = setInterval(() => {
      if (isHoldingRef.current && speedMultiplierRef.current < 5) {
        speedMultiplierRef.current = Math.min(
          speedMultiplierRef.current + 0.2,
          5
        );
      }
    }, 50); // Increase speed every 50ms
  };

  const handleNextMouseDown = () => {
    isHoldingRef.current = true;
    directionRef.current = "forward";
    speedMultiplierRef.current = 1.5; // Start with slight acceleration

    // Gradually increase speed while holding
    accelerationIntervalRef.current = setInterval(() => {
      if (isHoldingRef.current && speedMultiplierRef.current < 5) {
        speedMultiplierRef.current = Math.min(
          speedMultiplierRef.current + 0.2,
          5
        );
      }
    }, 50); // Increase speed every 50ms
  };

  const handleMouseUp = () => {
    resetToNormalSpeed();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (accelerationIntervalRef.current) {
        clearInterval(accelerationIntervalRef.current);
      }
    };
  }, []);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="relative bg-white py-16 md:py-24 overflow-hidden"
    >
      {/* Background Wave */}
      <div
        ref={waveContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden w-full"
      >
        <Wave
          className="w-full h-full opacity-100"
          animateOnScroll={true}
          sectionRef={sectionRef}
        />
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-6 mb-12">
          <h2
            className={`${ppNeueCorpWideMedium.variable} font-pp-wide-medium text-black text-4xl md:text-5xl lg:text-6xl text-center`}
          >
            Proyectos
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative w-full">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-hidden items-center w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {duplicatedProjects.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                className="shrink-0 rounded-lg overflow-hidden bg-gray-800"
                style={{
                  width: `${project.width}px`,
                  height: `${project.height}px`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">{project.title}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <button
            onMouseDown={handlePreviousMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/40 active:bg-white/80 text-black p-3 rounded-full transition-colors z-20"
            aria-label="Previous project"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onMouseDown={handleNextMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/40 active:bg-white/80 text-black p-3 rounded-full transition-colors z-20"
            aria-label="Next project"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
