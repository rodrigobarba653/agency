"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ppNeueCorpWideMedium } from "../fonts";

// Generate an audio waveform-like doodle with tilt and varying wave ranges
function generateBackgroundDoodle(width: number, height: number): string {
  const segments = 60; // More segments for smoother waveform
  const segmentWidth = width / segments;

  // Tilt: start higher on left, end lower on right
  const startY = height * 0.2;
  const endY = height * 0.8;
  const tilt = (endY - startY) / segments;

  // Varying wave ranges (amplitudes)
  const minAmplitude = height * 0.08;
  const maxAmplitude = height * 0.25;

  // Random seed for consistent variation
  const seed = width * 0.789;
  const random = (n: number) => {
    const x = Math.sin(n * 12.9898 + seed) * 43758.5453;
    return x - Math.floor(x);
  };

  // Calculate all points first
  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= segments; i++) {
    const x = i * segmentWidth;
    const progress = i / segments;

    // Base Y with tilt
    const baseY = startY + tilt * i;

    // Varying amplitude based on position
    const amplitudeVariation =
      minAmplitude + (maxAmplitude - minAmplitude) * random(i);

    // Audio waveform pattern - multiple frequencies
    const wave1 = Math.sin(progress * Math.PI * 12) * amplitudeVariation;
    const wave2 = Math.sin(progress * Math.PI * 7) * amplitudeVariation * 0.6;
    const wave3 = Math.sin(progress * Math.PI * 18) * amplitudeVariation * 0.4;

    // Combine waves for audio waveform effect
    const wave = wave1 + wave2 + wave3;

    // Add slight randomness for organic feel
    const randomOffset = (random(i + 100) - 0.5) * amplitudeVariation * 0.2;

    const y = baseY + wave + randomOffset;
    points.push({ x, y });
  }

  // Create smooth curve using quadratic bezier
  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1] || curr;

    // Control point for smooth curve (midpoint between current and next)
    const cpX = (curr.x + next.x) / 2;
    const cpY = (curr.y + next.y) / 2;

    if (i === 1) {
      // First curve: use current point as control
      path += ` Q ${curr.x},${curr.y} ${cpX},${cpY}`;
    } else if (i < points.length - 1) {
      // Middle curves: smooth transition
      path += ` Q ${curr.x},${curr.y} ${cpX},${cpY}`;
    } else {
      // Last point: straight to end
      path += ` Q ${curr.x},${curr.y} ${curr.x},${curr.y}`;
    }
  }

  return path;
}

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
  {
    id: 3,
    title: "Project 3",
    image: "/images/project3.jpg",
    width: 500,
    height: 400,
  },
  {
    id: 4,
    title: "Project 4",
    image: "/images/project4.jpg",
    width: 700,
    height: 360,
  },
  {
    id: 5,
    title: "Project 5",
    image: "/images/project5.jpg",
    width: 450,
    height: 520,
  },
];

export default function Projects() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const doodlePathRef = useRef<SVGPathElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [doodlePath, setDoodlePath] = useState<string>("");

  // Generate doodle path only on client to avoid hydration mismatch
  useEffect(() => {
    setDoodlePath(generateBackgroundDoodle(1200, 800));
  }, []);

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

  // Animate doodle on scroll into view
  useEffect(() => {
    if (!sectionRef.current || !doodlePathRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            const path = doodlePathRef.current;
            if (!path) return;

            const pathLength = path.getTotalLength();
            path.style.strokeDasharray = `${pathLength}`;
            path.style.strokeDashoffset = `${pathLength}`;

            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 2,
              ease: "power2.out",
            });

            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

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
      ref={sectionRef}
      className="relative bg-white py-16 md:py-24 overflow-hidden"
    >
      {/* Background Doodle */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          {doodlePath && (
            <path
              ref={doodlePathRef}
              d={doodlePath}
              stroke="black"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
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
