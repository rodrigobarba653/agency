"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const navItems = [
  { href: "/acerca", label: "ACERCA" },
  { href: "/servicios", label: "SERVICIOS" },
  { href: "/marcas", label: "MARCAS" },
  { href: "/contacto", label: "CONTACTO" },
];

// Generate a hand-drawn style path with messy U-turns (triple line effect)
function generateDoodlePath(width: number): string {
  const segments = Math.max(8, Math.floor(width / 12)); // More segments for smoother curves
  const segmentWidth = width / segments;
  const baseY = 2; // Starting Y position
  const amplitude = 1.2; // Waviness for doodle effect
  const offsetY = 3; // Vertical offset between lines

  // Create a seed-based random for consistency (using width as seed)
  const seed = width * 0.123;
  const random = (n: number) => {
    const x = Math.sin(n * 12.9898 + seed) * 43758.5453;
    return x - Math.floor(x);
  };

  // Helper function to create messy U-turn
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
      const angle = progress * Math.PI; // Half circle
      const radius = 2 + (random(i + 100) - 0.5) * 1.5; // Messy radius
      const centerX = startX;
      const centerY = startY;

      // Add chaos to the U-turn
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

  // Define line positions as percentages
  const firstLineStart = width * 0.2; // 20%
  const firstLineEnd = width * 0.7; // 70%
  const secondLineStart = width * 0.7; // 70%
  const secondLineEnd = 0; // 0%
  const thirdLineStart = 0; // 0%
  const thirdLineEnd = width; // 100%

  // First line: from 20% to 70%
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

  // First U-turn at 70% (right end of first line)
  const turnWidth = width * 0.1;
  path += createUTurn(firstLineEnd, baseY + 1, "right", turnWidth);

  // Second line: return from 70% to 0%
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

  // Second U-turn at 0% (left end)
  path += createUTurn(secondLineEnd, baseY + offsetY + 1, "left", turnWidth);

  // Third line: from 0% to 100% (full width)
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

export default function Nav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Find active item index
      const activeItemIndex = navItems.findIndex(
        (item) => pathname === item.href || pathname.startsWith(item.href)
      );

      if (activeItemIndex === -1) {
        setActiveIndex(-1);
        if (svgRef.current) {
          svgRef.current.style.display = "none";
        }
        return;
      }

      setActiveIndex(activeItemIndex);
      const activeLink = linkRefs.current[navItems[activeItemIndex].href];

      if (!activeLink || !underlineRef.current || !navRef.current) return;

      // Get position and dimensions of active link
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const left = linkRect.left - navRect.left;
      const width = linkRect.width;
      const bottom = linkRect.bottom - navRect.top + 2; // 2px below text

      // Generate new doodle path for this width
      const path = generateDoodlePath(width);
      underlineRef.current.setAttribute("d", path);

      // Set SVG position and size using CSS (increased height for triple line effect)
      if (svgRef.current) {
        svgRef.current.style.left = `${left}px`;
        svgRef.current.style.top = `${bottom}px`;
        svgRef.current.style.width = `${width}px`;
        svgRef.current.style.height = `14px`;
        svgRef.current.setAttribute("viewBox", `0 0 ${width} 14`);
        svgRef.current.style.display = "block";
      }

      // Animate the path drawing (faster animation)
      const pathLength = underlineRef.current.getTotalLength();
      underlineRef.current.style.strokeDasharray = `${pathLength}`;
      underlineRef.current.style.strokeDashoffset = `${pathLength}`;

      gsap.to(underlineRef.current, {
        strokeDashoffset: 0,
        duration: 0.35,
        ease: "power1.out",
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div
        ref={navRef}
        className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-56 h-12">
            <Image
              src="/images/logo.svg"
              alt="AGENCY"
              width={120}
              height={40}
              priority
              className="h-auto w-full"
            />
          </div>
        </Link>

        {/* Navigation Items - clean, monospaced-like */}
        <div className="flex items-center gap-6 md:gap-10 lg:gap-12">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                ref={(el) => {
                  linkRefs.current[item.href] = el;
                }}
                href={item.href}
                className="font-pp-normal-ultralight relative text-sm uppercase tracking-[0.15em] text-white transition-colors hover:text-white/80"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Animated Doodle Underline */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute"
          style={{ overflow: "visible", display: "none" }}
          viewBox="0 0 100 14"
          preserveAspectRatio="none"
        >
          <path
            ref={underlineRef}
            d=""
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </nav>
  );
}
