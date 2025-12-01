"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ppNeueCorpWideMedium } from "../fonts";
import Wave from "./Wave";
import { useParallax } from "../hooks/useParallax";

const projects = [
  {
    id: 1,
    title: "Project 1",
    image: "/images/project1.jpg",
    width: 400,
    height: 480,
  },
  {
    id: 2,
    title: "Project 2",
    image: "/images/project2.jpg",
    width: 600,
    height: 320,
  },
];

export default function Projects() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Parallax scroll effect for wave
  useParallax({
    elementRef: waveContainerRef,
    containerRef: sectionRef,
    speed: 0.5,
  });

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !carouselRef.current) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  // Scroll carousel to current index
  useEffect(() => {
    if (!carouselRef.current) return;

    const scrollToIndex = () => {
      const container = carouselRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      const scrollPosition = (scrollWidth / projects.length) * currentIndex;

      gsap.to(container, {
        scrollLeft: scrollPosition,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    scrollToIndex();
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

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
      <div className="container mx-auto px-6 relative z-10">
        <h2
          className={`${ppNeueCorpWideMedium.variable} font-pp-wide-medium text-black text-4xl md:text-5xl lg:text-6xl mb-12 text-center`}
        >
          Proyectos
        </h2>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-hidden scroll-smooth items-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
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
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/20 text-black p-3 rounded-full transition-colors z-20"
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
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/20 text-black p-3 rounded-full transition-colors z-20"
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

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-black w-8"
                    : "bg-black/30 hover:bg-black/50"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
