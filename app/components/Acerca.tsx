"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useParallax } from "../hooks/useParallax";
import {
  ppNeueCorpNormalMedium,
  ppNeueCorpNormalUltralight,
  ppNeueCorpWideMedium,
} from "../fonts";

export default function Acerca() {
  const doodlePathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Animate doodle path on scroll into view
  useEffect(() => {
    if (!doodlePathRef.current || !sectionRef.current) return;

    const doodlePath = doodlePathRef.current;
    const section = sectionRef.current;

    // Set up the path for animation
    const pathLength = doodlePath.getTotalLength();

    // Initialize the path as hidden
    gsap.set(doodlePath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Function to animate the doodle
    const animateDoodle = () => {
      gsap.to(doodlePath, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    // Intersection Observer to trigger animation when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and animate
            gsap.set(doodlePath, {
              strokeDashoffset: pathLength,
            });
            // Small delay to ensure reset is applied
            requestAnimationFrame(() => {
              animateDoodle();
            });
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    // Animate on initial mount if already in view
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
      animateDoodle();
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fade in animation for image (left to right)
  useEffect(() => {
    if (!imageContainerRef.current || !sectionRef.current) return;

    const imageContainer = imageContainerRef.current;
    const section = sectionRef.current;

    // Initialize image as hidden and positioned to the left
    gsap.set(imageContainer, {
      opacity: 0,
      x: -100,
    });

    // Function to animate the image
    const animateImage = () => {
      gsap.to(imageContainer, {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    // Intersection Observer to trigger animation when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and animate
            gsap.set(imageContainer, {
              opacity: 0,
              x: -100,
            });
            // Small delay to ensure reset is applied
            requestAnimationFrame(() => {
              animateImage();
            });
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    // Animate on initial mount if already in view
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
      animateImage();
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Parallax scroll effect for right column text
  useParallax({
    elementRef: textColumnRef,
    containerRef: sectionRef,
    speed: -0.3,
  });

  return (
    <section
      id="acerca"
      ref={sectionRef}
      className="flex flex-col lg:flex-row min-h-screen bg-black"
    >
      {/* Left: Image */}
      <div
        ref={imageContainerRef}
        className="w-full lg:w-1/2 relative h-64 md:h-80 lg:h-auto"
      >
        <div className="w-full h-full bg-gray-800">
          {/* Placeholder for image - replace with actual image */}
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-sm">Image Placeholder</span>
          </div>
        </div>
      </div>

      {/* Right: Text Content */}
      <div
        ref={textColumnRef}
        className="w-full lg:w-1/2 bg-black p-12 md:p-16 lg:p-20 flex flex-col justify-center overflow-hidden"
      >
        <div className="lg:max-w-lg">
          {/* Headline with doodle */}
          <div className="relative mb-8 overflow-visible">
            <h2
              className={`${ppNeueCorpWideMedium.variable} font-pp-neue-corp-wide-medium text-white text-4xl md:text-5xl lg:text-6xl`}
            >
              Ideas Imposibles
            </h2>
            {/* Doodle - absolutely positioned - zig zag pattern */}
            <svg
              className="absolute lg:-top-4 -top-20 sm:mr-0 -mr-16 right-0 text-white"
              width="200"
              height="200"
              viewBox="0 0 120 120"
              fill="none"
              style={{ transform: "translate(0px, -20px) rotate(25deg)" }}
            >
              <defs>
                <filter id="grainy">
                  <feTurbulence
                    type="turbulence"
                    baseFrequency="8"
                    numOctaves="2"
                    result="noise"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
              </defs>

              {/* Subtle imperfect zig-zag path */}
              <path
                ref={doodlePathRef}
                d="
                M10 70
                L50 38.8
                L30 76.2
                L80 33.8
                L65 71.2
                Q90 58.8 100 80
              "
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter="url(#grainy)"
              />
            </svg>
          </div>

          {/* Body Text */}
          <div
            className={`${ppNeueCorpNormalUltralight.variable} font-pp-normal-ultralight text-white space-y-6 text-base md:text-lg leading-relaxed`}
          >
            <p>
              Campañas que conectan a nivel humano, conceptos que se convierten
              en parte de la cultura diseñados para evolucionar con las marcas y
              crecer junto con nuestros clientes.
            </p>
            <p>
              Operamos proyectos nacionales e internacionales, con talleres de
              display in-house y una plataforma audiovisual propia que nos
              permite controlar cada detalle con la calidad que nos distingue.
            </p>
            <p>
              Trabajamos con{" "}
              <span
                className={`${ppNeueCorpNormalMedium.variable} font-pp-normal-medium`}
              >
                marcas de talla internacional
              </span>{" "}
              en diferentes industrias (CPG, lujo, servicios financieros,
              entretenimiento, deportes y más)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
