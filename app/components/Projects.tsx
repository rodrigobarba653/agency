"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
  const isHoveringRef = useRef(false);
  const accelerationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(Date.now());
  const scrollVelocityRef = useRef<number>(0);

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

      // Stop scrolling if hovering
      if (isHoveringRef.current) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      const deltaTime = Math.min(now - lastScrollTimeRef.current, 50) / 16.67; // Normalize to ~60fps
      lastScrollTimeRef.current = now;

      const targetSpeed =
        (directionRef.current === "forward" ? 1 : -1) *
        speedMultiplierRef.current *
        3; // Base scroll speed

      // Smooth ease-in-out: gradually accelerate/decelerate to target speed
      const acceleration = 0.15; // Easing factor (0-1, lower = smoother)
      scrollVelocityRef.current +=
        (targetSpeed - scrollVelocityRef.current) * acceleration;

      // Update scroll position with smooth easing
      container.scrollLeft += scrollVelocityRef.current * deltaTime;

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
    scrollVelocityRef.current = 0; // Reset velocity for smooth restart

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

  const handleCarouselMouseEnter = () => {
    isHoveringRef.current = true;
  };

  const handleCarouselMouseLeave = () => {
    isHoveringRef.current = false;
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
            onMouseEnter={handleCarouselMouseEnter}
            onMouseLeave={handleCarouselMouseLeave}
            className="flex gap-6 overflow-x-hidden items-center w-full"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: "smooth",
            }}
          >
            {duplicatedProjects.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                className="shrink-0 rounded-lg overflow-hidden bg-gray-800 relative group cursor-pointer"
                style={{
                  width: `${project.width}px`,
                  height: `${project.height}px`,
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={`${project.width}px`}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300" />
                {/* Project title */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <h3
                    className={`${ppNeueCorpWideMedium.variable} font-pp-wide-medium text-white text-2xl md:text-3xl text-center px-4`}
                  >
                    {project.title}
                  </h3>
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
