"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface WaveProps {
  className?: string;
  animateOnScroll?: boolean;
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export default function Wave({
  className = "",
  animateOnScroll = true,
  sectionRef,
}: WaveProps) {
  const wavePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!wavePathRef.current) return;

    const wavePath = wavePathRef.current;
    let observer: IntersectionObserver | null = null;

    // Wait a bit for SVG to render
    const initAnimation = () => {
      const pathLength = wavePath.getTotalLength();

      if (pathLength === 0) {
        // Retry if path length is 0 (SVG not rendered yet)
        setTimeout(initAnimation, 100);
        return;
      }

      gsap.set(wavePath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        stroke: "#000000",
        strokeWidth: "3",
      });

      const animateWave = () => {
        gsap.to(wavePath, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power2.out",
        });
      };

      if (animateOnScroll && sectionRef?.current) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Reset and animate
                gsap.set(wavePath, {
                  strokeDashoffset: pathLength,
                  stroke: "#000000",
                  strokeWidth: "3",
                });
                requestAnimationFrame(() => {
                  animateWave();
                });
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(sectionRef.current);
      } else if (!animateOnScroll) {
        // Animate immediately if animateOnScroll is false
        animateWave();
      }
    };

    // Small delay to ensure SVG is rendered
    setTimeout(initAnimation, 50);

    return () => {
      if (observer) observer.disconnect();
    };
  }, [animateOnScroll, sectionRef]);

  return (
    <svg
      className={className}
      version="1.1"
      viewBox="-50 0 1970 870.1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <style>
          {`.st0 {
            fill: none;
            stroke: #000000;
            stroke-miterlimit: 10;
            stroke-width: 3px;
          }`}
        </style>
      </defs>
      <path
        ref={wavePathRef}
        fill="none"
        stroke="#000000"
        strokeMiterlimit="10"
        strokeWidth="3"
        style={{ stroke: "#000000", strokeWidth: "3" }}
        d="M-34.5,193.7S245.2-55.4,182.5,56.4-54.8,495.4,119.7,371.7s294.9-244.1,179.7-33.9-266.1,528.8-30.5,250.8-69.5,218.6,88.1,39S829.9,48,668.9,409s-284.7,571.2-5.1,244.1,278-352.7,208.5-220.4-335.6,522.1,39,50.9c374.6-471.2,327.1-325.4,223.7-122s-332.2,603.4-61,193.2c271.2-410.2,489.8-689.8,340.7-389.8s-323.7,630.5-157.6,416.9,498.3-820.3,261-232.2-198.3,506.8,27.1,206.8,210.2-166.4,111.9,71.2-54.2,333.9,110.2,39,118.6-20.3,78,83.1,103.4-108.5,103.4-108.5"
      />
    </svg>
  );
}
