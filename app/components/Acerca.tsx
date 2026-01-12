"use client";

import { useRef, useEffect } from "react";
import { useParallax } from "../hooks/useParallax";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import {
  ppNeueCorpNormalMedium,
  ppNeueCorpNormalUltralight,
  ppNeueCorpWideMedium,
} from "../fonts";
import { animatePathStroke } from "../utils/gsapAnimations";

// Generate a hand-drawn style path with messy U-turns (triple line effect)
function generateDoodlePath(width: number): string {
  const segments = Math.max(8, Math.floor(width / 12));
  const segmentWidth = width / segments;
  const baseY = 2;
  const amplitude = 1.2;
  const offsetY = 5;

  const seed = width * 0.123;
  const random = (n: number) => {
    const x = Math.sin(n * 12.9898 + seed) * 43758.5453;
    return x - Math.floor(x);
  };

  const createUTurn = (
    startX: number,
    startY: number,
    direction: "right" | "left",
    turnWidth: number
  ) => {
    const turnSegments = 6;
    let turnPath = "";
    for (let i = 1; i <= turnSegments; i++) {
      const progress = i / turnSegments;
      const angle = progress * Math.PI;
      const radius = 2 + (random(i + 100) - 0.5) * 1.5;
      const centerX = startX;
      const centerY = startY;
      const chaosX = (random(i + 200) - 0.5) * 3;
      const chaosY = (random(i + 300) - 0.5) * 2;

      let x, y;
      if (direction === "right") {
        x = centerX - Math.cos(angle) * radius + chaosX;
        y = centerY + Math.sin(angle) * radius + chaosY;
      } else {
        x = centerX + Math.cos(angle) * radius + chaosX;
        y = centerY + Math.sin(angle) * radius + chaosY;
      }

      const clampedX =
        direction === "right"
          ? Math.max(startX - turnWidth, Math.min(startX + 2, x))
          : Math.max(startX - 2, Math.min(startX + turnWidth, x));
      const clampedY = Math.max(0.5, Math.min(13, y));
      turnPath += ` L ${clampedX},${clampedY}`;
    }
    return turnPath;
  };

  const firstLineStart = width * 0.2;
  const firstLineEnd = width * 0.9;
  const secondLineStart = width * 0.7;
  const secondLineEnd = 0;
  const thirdLineStart = 0;
  const thirdLineEnd = width;

  const firstLineLength = firstLineEnd - firstLineStart;
  const firstLineSegments = Math.max(6, Math.floor(firstLineLength / 12));
  const firstLineSegmentWidth = firstLineLength / firstLineSegments;

  let path = `M ${firstLineStart},${
    baseY + (random(0) - 0.5) * amplitude * 0.3
  }`;

  for (let i = 1; i <= firstLineSegments; i++) {
    const x = firstLineStart + i * firstLineSegmentWidth;
    const progress = i / firstLineSegments;
    const wave = Math.sin(progress * Math.PI * 2) * 0.2;
    const randomOffset = (random(i) - 0.5) * amplitude * 0.3;
    const y = baseY + wave + randomOffset;
    const clampedY = Math.max(0.5, Math.min(13, y));
    path += ` L ${x},${clampedY}`;
  }

  const turnWidth = width * 0.1;
  path += createUTurn(firstLineEnd, baseY + 1, "right", turnWidth);

  const secondLineLength = Math.abs(secondLineEnd - secondLineStart);
  const secondLineSegments = Math.max(6, Math.floor(secondLineLength / 12));
  const secondLineSegmentWidth = secondLineLength / secondLineSegments;

  for (let i = secondLineSegments; i >= 0; i--) {
    const x = secondLineStart - i * secondLineSegmentWidth;
    const progress = i / secondLineSegments;
    const wave = Math.sin(progress * Math.PI * 2) * 0.2;
    const randomOffset = (random(i + 500) - 0.5) * amplitude * 0.3;
    const y = baseY + offsetY + wave + randomOffset;
    const clampedY = Math.max(0.5, Math.min(13, y));
    path += ` L ${x},${clampedY}`;
  }

  path += createUTurn(secondLineEnd, baseY + offsetY + 1, "left", turnWidth);

  const thirdLineLength = thirdLineEnd - thirdLineStart;
  const thirdLineSegments = Math.max(8, Math.floor(thirdLineLength / 12));
  const thirdLineSegmentWidth = thirdLineLength / thirdLineSegments;

  for (let i = 1; i <= thirdLineSegments; i++) {
    const x = thirdLineStart + i * thirdLineSegmentWidth;
    const progress = i / thirdLineSegments;
    const wave = Math.sin(progress * Math.PI * 2) * 0.2;
    const randomOffset = (random(i + 1000) - 0.5) * amplitude * 0.3;
    const y = baseY + offsetY * 2 + wave + randomOffset;
    const clampedY = Math.max(0.5, Math.min(13, y));
    path += ` L ${x},${clampedY}`;
  }

  return path;
}

export default function Acerca() {
  const doodlePathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const transformamosDoodleSvgRef = useRef<SVGSVGElement>(null);
  const transformamosDoodlePathRef = useRef<SVGPathElement>(null);

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

  // Position and animate doodle under "Transformamos"
  const positionTransformamosDoodle = () => {
    const titleEl = titleRef.current;
    const svgRef = transformamosDoodleSvgRef.current;
    const pathRef = transformamosDoodlePathRef.current;

    if (!titleEl || !svgRef || !pathRef) return;

    const titleText = titleEl.textContent || "";
    const targetWord = "Transformamos";

    // Find the exact position of "Transformamos" in the rendered text using Range API
    const textNode = titleEl.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const textContent = textNode.textContent || "";
    const wordIndex = textContent.indexOf(targetWord);

    if (wordIndex === -1) return;

    // Create a range to get the exact bounding box of the word
    const range = document.createRange();
    range.setStart(textNode, wordIndex);
    range.setEnd(textNode, wordIndex + targetWord.length);

    const wordRect = range.getBoundingClientRect();
    const titleRect = titleEl.getBoundingClientRect();

    // Calculate position relative to the title element (not viewport)
    const wordLeft = wordRect.left - titleRect.left;
    const wordWidth = wordRect.width;
    const wordTop = wordRect.bottom - titleRect.top - 24; // Position closer below the word

    const path = generateDoodlePath(wordWidth);
    pathRef.setAttribute("d", path);

    svgRef.style.left = `${wordLeft}px`;
    svgRef.style.top = `${wordTop}px`;
    svgRef.style.width = `${wordWidth}px`;
    svgRef.style.height = `14px`;
    svgRef.setAttribute("viewBox", `0 0 ${wordWidth} 14`);
    svgRef.style.display = "block";

    animatePathStroke(pathRef, {
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // Animate doodle when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small delay to ensure layout is stable
            setTimeout(() => {
              positionTransformamosDoodle();
            }, 200);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle window resize to reposition doodle
  useEffect(() => {
    const handleResize = () => {
      if (transformamosDoodleSvgRef.current?.style.display === "block") {
        positionTransformamosDoodle();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              ref={titleRef}
              className={`${ppNeueCorpWideMedium.variable} font-pp-neue-corp-wide-medium text-white text-4xl md:text-5xl lg:text-6xl relative`}
            >
              Transformamos ideas en experiencias que conectan.
            </h2>
            <svg
              ref={transformamosDoodleSvgRef}
              className="absolute pointer-events-none"
              style={{ display: "none" }}
            >
              <path
                ref={transformamosDoodlePathRef}
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Body Text */}
          <div
            className={`${ppNeueCorpNormalUltralight.variable} font-pp-neue-corp-normal-medium text-white space-y-6 text-base md:text-lg leading-relaxed`}
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
