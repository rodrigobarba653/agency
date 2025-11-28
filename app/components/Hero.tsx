"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { animateSVGPath, animateSVGPaths } from "../utils/animateSVG";
import { useParallax } from "../hooks/useParallax";
import {
  ppNeueCorpNormalMedium,
  ppNeueCorpNormalUltralight,
  ppNeueCorpWideMedium,
} from "../fonts";

interface HeroProps {
  svgContent?: string; // SVG code as string
  svgPath?: string; // Path to SVG file
  className?: string;
  duration?: number;
  delay?: number;
  width?: number;
  height?: number;
}

export default function Hero({
  svgContent,
  svgPath,
  className = "",
  duration = 0.6,
  delay = 0,
  width,
  height,
}: HeroProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowLineRef = useRef<SVGPathElement>(null);
  const arrowHeadRef = useRef<SVGPathElement>(null);
  const arrowSvgRef = useRef<SVGSVGElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const creandoRef = useRef<HTMLSpanElement>(null);
  const realidadesRef = useRef<HTMLSpanElement>(null);
  const anosRef = useRef<HTMLParagraphElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const geIconArrowRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);

  // Load SVG from file if path is provided
  useEffect(() => {
    if (svgPath && !svgContent) {
      fetch(svgPath)
        .then((res) => res.text())
        .then((text) => setSvg(text))
        .catch((err) => console.error("Error loading SVG:", err));
    } else if (svgContent) {
      setSvg(svgContent);
    }
  }, [svgPath, svgContent]);

  // Animate SVG paths once loaded
  useEffect(() => {
    if (!svgRef.current || !svg) return;

    // Small delay to ensure SVG is rendered
    const timer = setTimeout(() => {
      // Don't hide SVG initially - we want to see the green fill
      // if (svgRef.current) {
      //   svgRef.current.style.opacity = "0";
      // }

      // Find all path elements in the SVG
      const paths = Array.from(
        svgRef.current?.querySelectorAll("path") || []
      ) as SVGPathElement[];

      // Also find all other SVG elements that might have fill
      const allElements = Array.from(
        svgRef.current?.querySelectorAll("*") || []
      ) as SVGElement[];

      // Also find groups to potentially hide them
      const groups = Array.from(
        svgRef.current?.querySelectorAll("g") || []
      ) as SVGGElement[];

      // Find and update CSS style tags to change fill to green
      const styleTags = Array.from(
        svgRef.current?.querySelectorAll("style") || []
      ) as HTMLStyleElement[];

      styleTags.forEach((styleTag) => {
        let styleText = styleTag.textContent || styleTag.innerHTML;
        // Replace any white fill values with green in CSS
        styleText = styleText.replace(
          /fill:\s*(#fff|#ffffff|rgb\(255,\s*255,\s*255\)|white)/gi,
          "fill: #000000"
        );
        styleTag.textContent = styleText;
      });

      // Check all elements for white fill and change to green
      allElements.forEach((element) => {
        const fill = element.getAttribute("fill");
        let computedFill = fill;

        if (!fill || fill === "none") {
          const computedStyle = window.getComputedStyle(element);
          computedFill = computedStyle.fill;
        }

        // If element has white fill, change it to green
        if (
          computedFill &&
          computedFill !== "none" &&
          computedFill !== "rgba(0, 0, 0, 0)"
        ) {
          if (
            computedFill === "#fff" ||
            computedFill === "#ffffff" ||
            computedFill === "rgb(255, 255, 255)" ||
            computedFill === "white"
          ) {
            element.setAttribute("fill", "#000000");
          }
        }
      });

      // Don't hide groups - we want to see the green fill
      // groups.forEach((group) => {
      //   group.style.opacity = "0";
      // });

      // Filter paths that have stroke (for drawing animation)
      // If no stroke, we'll convert fill paths to stroke for animation
      const strokePaths: SVGPathElement[] = [];
      const fillPaths: SVGPathElement[] = [];

      paths.forEach((path) => {
        const stroke = path.getAttribute("stroke");
        let fill = path.getAttribute("fill");

        // Check computed style for class-based fills
        if (!fill || fill === "none") {
          const computedStyle = window.getComputedStyle(path);
          fill = computedStyle.fill;
        }

        if (stroke && stroke !== "none") {
          // Change existing stroke to white
          path.setAttribute("stroke", "#ffffff");
          // Hide stroke initially by setting strokeDasharray
          strokePaths.push(path);
        } else if (fill && fill !== "none" && fill !== "rgba(0, 0, 0, 0)") {
          // Set fill to green FIRST so we can see it
          path.setAttribute("fill", "#000000");
          // Convert fill path to stroke for animation - use white
          path.setAttribute("stroke", "#ffffff");
          path.setAttribute("stroke-width", "2");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          // Keep fill visible - don't hide the path, only hide the stroke with dasharray
          fillPaths.push(path);
        }
      });

      const allPaths = [...strokePaths, ...fillPaths];

      if (allPaths.length === 0) {
        console.warn("No paths found in SVG for animation");
        return;
      }

      // Hide all paths' strokes initially by setting strokeDasharray and strokeDashoffset
      // But keep the fill visible (green)
      allPaths.forEach((path) => {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = `${pathLength}`;
        path.style.strokeDashoffset = `${pathLength}`;
        // Keep path visible so we can see the green fill
        path.style.opacity = "1";
        path.style.visibility = "visible";
      });

      // Make SVG visible
      if (svgRef.current) {
        svgRef.current.style.opacity = "1";
      }
      // Keep groups visible to see green fill
      groups.forEach((group) => {
        group.style.opacity = "1";
      });

      // Animate all paths
      if (allPaths.length === 1) {
        animateSVGPath(allPaths[0], duration, delay);
      } else {
        animateSVGPaths(allPaths, duration, 0.1, "power2.out");
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [svg, duration, delay]);

  // Animate arrow path on scroll into view
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let timer: NodeJS.Timeout | null = null;
    let bounceAnimation: gsap.core.Tween | null = null;

    // Wait a bit to ensure the refs are set
    timer = setTimeout(() => {
      if (
        !arrowLineRef.current ||
        !arrowHeadRef.current ||
        !arrowSvgRef.current ||
        !heroSectionRef.current
      ) {
        return;
      }

      const arrowLine = arrowLineRef.current;
      const arrowHead = arrowHeadRef.current;
      const arrowSvg = arrowSvgRef.current;
      const heroSection = heroSectionRef.current;

      // Set up the paths for animation
      const lineLength = arrowLine.getTotalLength();
      const headLength = arrowHead.getTotalLength();

      // Initialize both paths as hidden - set them individually to ensure proper values
      gsap.set(arrowLine, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
      });

      // Hide arrowhead completely - use a slightly larger offset to ensure no dot shows
      gsap.set(arrowHead, {
        strokeDasharray: headLength,
        strokeDashoffset: headLength + 1, // Add 1 to ensure it's completely hidden
        opacity: 0, // Also hide with opacity as backup
      });

      // Function to start continuous bounce
      const startBounce = () => {
        // Kill any existing bounce animation
        if (bounceAnimation) {
          bounceAnimation.kill();
        }

        // Create continuous bounce loop
        bounceAnimation = gsap.to(arrowSvg, {
          y: -8,
          duration: 0.5,
          ease: "power2.out",
          yoyo: true,
          repeat: -1, // Infinite repeat
        });
      };

      // Function to stop bounce
      const stopBounce = () => {
        if (bounceAnimation) {
          bounceAnimation.kill();
          bounceAnimation = null;
        }
        // Reset position
        gsap.set(arrowSvg, {
          y: 0,
        });
      };

      // Function to animate the arrow
      const animateArrow = () => {
        // Create a timeline to animate line first, then arrowhead, then start bounce
        const tl = gsap.timeline({
          onComplete: () => {
            // Start continuous bounce after drawing completes
            startBounce();
          },
        });

        tl.to(arrowLine, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
        }).to(
          arrowHead,
          {
            strokeDashoffset: 0,
            opacity: 1, // Fade in as it draws
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.1"
        ); // Start slightly before line finishes

        return tl;
      };

      // Function to animate text
      const animateText = () => {
        const creando = creandoRef.current;
        const realidades = realidadesRef.current;
        const anos = anosRef.current;

        if (!creando || !realidades || !anos) return;

        // Reset text positions
        gsap.set([creando, realidades], {
          opacity: 0,
          x: 50, // Start from right
        });

        // Reset anos text
        gsap.set(anos, {
          opacity: 0,
        });

        // Animate text
        const tl = gsap.timeline();

        tl.to(creando, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        })
          .to(
            realidades,
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.4" // Start 0.4s after "Creando" starts (delay)
          )
          .to(
            anos,
            {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.2" // Start slightly before realidades finishes
          );

        return tl;
      };

      // Intersection Observer to trigger animation when hero comes into view
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Stop any existing bounce
              stopBounce();

              // Reset both paths completely
              gsap.set(arrowLine, {
                strokeDasharray: lineLength,
                strokeDashoffset: lineLength,
              });
              gsap.set(arrowHead, {
                strokeDasharray: headLength,
                strokeDashoffset: headLength + 1, // Add 1 to ensure it's completely hidden
                opacity: 0, // Also hide with opacity
              });
              gsap.set(arrowSvg, {
                y: 0, // Reset position
              });
              // Small delay to ensure reset is applied
              requestAnimationFrame(() => {
                animateArrow();
                animateText();
              });
            } else {
              // Stop bounce when scrolling out of view
              stopBounce();
            }
          });
        },
        {
          threshold: 0.2, // Trigger when 20% of the section is visible
          rootMargin: "0px",
        }
      );

      observer.observe(heroSection);

      // Animate on initial mount
      animateArrow();
      animateText();
    }, 100);

    return () => {
      if (timer) clearTimeout(timer);
      if (observer) observer.disconnect();
      // Clean up bounce animation
      if (bounceAnimation) {
        bounceAnimation.kill();
      }
    };
  }, []);

  // Parallax scroll effect for logo
  useParallax({
    elementRef: logoContainerRef,
    containerRef: heroSectionRef,
    speed: 0.3,
  });

  // Parallax scroll effect for ge icon with arrow
  useParallax({
    elementRef: geIconArrowRef,
    containerRef: heroSectionRef,
    speed: -0.5,
  });

  if (!svg) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center ${className}`}
      >
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      ref={heroSectionRef}
      className={`flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center px-6 ${className}`}
    >
      {/* Logo Section */}
      <div
        ref={logoContainerRef}
        className="flex items-center justify-center w-full max-w-5xl mb-16"
      >
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          ref={(el) => {
            if (el) {
              const svgElement = el.querySelector("svg");
              if (svgElement) {
                svgRef.current = svgElement;
                if (width) svgElement.setAttribute("width", width.toString());
                if (height)
                  svgElement.setAttribute("height", height.toString());
                svgElement.setAttribute("class", "w-full h-full");
              }
            }
          }}
          className="w-full h-full"
        />
      </div>

      {/* Hero Content Section */}
      <div className="w-full max-w-5xl flex items-start justify-center gap-12 md:gap-16">
        {/* Left: ge icon with arrow */}
        <div
          ref={geIconArrowRef}
          className="flex flex-col items-center gap-4 shrink-0"
        >
          {/* ge circle icon */}
          <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
            <span
              className={`${ppNeueCorpNormalMedium.variable} font-pp-normal-medium text-white text-4xl mb-2`}
            >
              ge
            </span>
          </div>
          {/* Arrow pointing down - much longer */}
          <svg
            ref={arrowSvgRef}
            width="24"
            height="150"
            viewBox="0 0 24 150"
            fill="none"
            className="text-white"
          >
            {/* Vertical line */}
            <path
              ref={arrowLineRef}
              d="M12 0v130"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Arrowhead */}
            <path
              ref={arrowHeadRef}
              d="M20 120l-8 10-8-10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Right: Text content */}
        <div className="flex flex-col gap-2">
          <h2
            className={`${ppNeueCorpWideMedium.variable} font-pp-neue-corp-wide-medium text-white text-3xl md:text-4xl lg:text-7xl`}
          >
            <span ref={creandoRef} className="inline-block">
              Creando
            </span>
            <br />
            <span ref={realidadesRef} className="inline-block">
              Realidades
            </span>
          </h2>
          <p
            ref={anosRef}
            className={`${ppNeueCorpNormalUltralight.variable} font-pp-normal-ultralight text-white text-sm md:text-base uppercase tracking-wider`}
          >
            25 AÑOS PRODUCIENDO EXPERIENCIAS
          </p>
        </div>
      </div>
    </div>
  );
}
