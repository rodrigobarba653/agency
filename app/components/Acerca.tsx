"use client";

import { useRef } from "react";
import { useParallax } from "../hooks/useParallax";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
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
  useScrollAnimation({
    elementRef: doodlePathRef,
    sectionRef,
    initialProps: (element) => {
      const pathLength = (element as SVGPathElement).getTotalLength();
      return {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      };
    },
    animateProps: {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.out",
    },
  });

  // Fade in animation for video (left to right)
  useScrollAnimation({
    elementRef: imageContainerRef,
    sectionRef,
    initialProps: {
      opacity: 0,
      x: -100,
    },
    animateProps: {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power2.out",
    },
  });

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
      {/* Left: Video */}
      <div
        ref={imageContainerRef}
        className="w-full lg:w-1/2 relative h-64 md:h-80 lg:h-auto"
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/aboutus.mp4" type="video/mp4" />
        </video>
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
              Transformamos ideas en experiencias que conectan.
            </h2>
            {/* Doodle - absolutely positioned - zig zag pattern */}
            <svg
              className="absolute lg:top-0 -top-20 sm:mr-0 -mr-16 right-0 text-white"
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
              Somos una agencia creativa y estratégica que combina diseño,
              visión y producción para dar forma a momentos memorables y
              funcionales.
            </p>
            <p>
              Creemos en el poder de una buena idea bien desarrollada: una
              visión que evoluciona, se define y se materializa en un espacio,
              una interacción o una vivencia que permanece en las personas.
            </p>
            <p>
              Nuestro trabajo es acompañar ese proceso de principio a fin,
              integrando claridad, estética y excelencia operativa. Diseñamos
              experiencias que sirven a un propósito, fortalecen marcas y
              generan valor real.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
