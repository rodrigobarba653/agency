"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ppNeueCorpWideMedium } from "../fonts";
import { fadeIn, fadeOut, slideIn, slideOut, animatePathStroke } from "../utils/gsapAnimations";
import { generateDoodlePath } from "../utils/doodleUtils";

const navItems = [
  { sectionId: "acerca", label: "ACERCA" },
  { sectionId: "clientes", label: "CLIENTES" },
  { sectionId: "servicios", label: "SERVICIOS" },
  { sectionId: "proyectos", label: "PROYECTOS" },
  { sectionId: "eventos", label: "EVENTOS" },
  { sectionId: "contacto", label: "CONTACTO" },
];

export default function Nav() {
  const navRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linkRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const navItemWidths = useRef<{ [key: string]: number }>({});

  // Smooth scroll to section function
  const scrollToSection = (sectionId: string) => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    // Check if smooth scroll is active (content wrapper exists and has transform)
    const contentWrapper = document.getElementById("smooth-scroll-content");
    const isSmoothScrollActive =
      contentWrapper &&
      window.getComputedStyle(contentWrapper).transform !== "none";

    // Get section position - offsetTop works correctly for both cases
    // It gives position relative to offsetParent (contentWrapper in our case)
    const navHeight = 80;
    let targetScroll = section.offsetTop - navHeight;

    // Ensure target is not negative (allow scrolling to top/hero)
    targetScroll = Math.max(0, targetScroll);

    if (isSmoothScrollActive) {
      // Use smooth scroll system - dispatch custom event
      window.dispatchEvent(
        new CustomEvent("smoothscrollto", {
          detail: { targetY: targetScroll },
        })
      );
    } else {
      // Fallback to native smooth scroll
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }

    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  // Update active section based on scroll position
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const updateActiveSection = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const navHeight = 80;

      // Find which section is currently in view
      let activeSectionIndex = -1;
      navItems.forEach((item, index) => {
        const section = document.getElementById(item.sectionId);
        if (section) {
          const sectionTop = section.offsetTop - navHeight;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionBottom) {
            activeSectionIndex = index;
          }
        }
      });

      setActiveIndex(activeSectionIndex);
    };

    // Listen to both native scroll and smooth scroll events
    const handleScroll = () => {
      updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("smoothscroll", handleScroll, { passive: true });
    updateActiveSection(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("smoothscroll", handleScroll);
    };
  }, []);

  // Measure nav item widths with medium font to prevent layout shift
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const measureWidths = () => {
      // Create a temporary hidden element to measure text width with medium font
      const measureElement = document.createElement("span");
      measureElement.style.position = "absolute";
      measureElement.style.visibility = "hidden";
      measureElement.style.whiteSpace = "nowrap";
      measureElement.style.fontSize = "0.875rem"; // text-sm
      measureElement.style.textTransform = "uppercase";
      measureElement.style.letterSpacing = "0.15em"; // tracking-[0.15em]
      measureElement.style.fontVariantNumeric = "tabular-nums";
      measureElement.className = "font-pp-normal-medium";
      document.body.appendChild(measureElement);

      // Measure each nav item's width with medium font
      navItems.forEach((item) => {
        measureElement.textContent = item.label;
        const width = measureElement.offsetWidth;
        navItemWidths.current[item.sectionId] = width;

        // Apply the width to the button
        const button = linkRefs.current[item.sectionId];
        if (button) {
          button.style.minWidth = `${width}px`;
        }
      });

      // Cleanup
      document.body.removeChild(measureElement);
    };

    // Small delay to ensure DOM is ready and refs are populated
    const timer = setTimeout(measureWidths, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update underline animation only when hovered (not when active)
  useEffect(() => {
    if (hoveredIndex === -1) {
      if (svgRef.current) {
        svgRef.current.style.display = "none";
      }
      return;
    }

    const timer = setTimeout(() => {
      const hoveredItem = navItems[hoveredIndex];
      const hoveredLink = linkRefs.current[hoveredItem.sectionId];

      if (!hoveredLink || !underlineRef.current || !navRef.current) return;

      // Get position and dimensions of hovered link
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = hoveredLink.getBoundingClientRect();

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

      // Apply opacity on hover
      if (underlineRef.current) {
        underlineRef.current.style.opacity = "0.8";
      }

      // Animate the path drawing (faster animation)
      const pathLength = underlineRef.current.getTotalLength();
      underlineRef.current.style.strokeDasharray = `${pathLength}`;
      underlineRef.current.style.strokeDashoffset = `${pathLength}`;

      animatePathStroke(underlineRef.current, {
        duration: 0.35,
        ease: "power1.out",
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [hoveredIndex]);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current || !menuOverlayRef.current) return;

    if (isMenuOpen) {
      // Open menu
      gsap.set([menuRef.current, menuOverlayRef.current], {
        display: "block",
      });
      fadeIn(menuOverlayRef.current, {
        duration: 0.3,
        ease: "power2.out",
      });
      slideIn(menuRef.current, {
        from: "right",
        duration: 0.4,
        ease: "power2.out",
      });
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      // Close menu
      fadeOut(menuOverlayRef.current, {
        duration: 0.3,
        ease: "power2.in",
      });
      slideOut(menuRef.current, {
        to: "right",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          if (menuRef.current && menuOverlayRef.current) {
            gsap.set([menuRef.current, menuOverlayRef.current], {
              display: "none",
            });
          }
          document.body.style.overflow = "";
        },
      });
    }
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black">
      <div
        ref={navRef}
        className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-16">
            <Image
              src="/images/iso.png"
              alt="AGENCY"
              width={120}
              height={40}
              priority
              className="h-auto w-full"
            />
          </div>
        </Link>

        {/* Navigation Items - desktop only */}
        <div className="hidden lg:flex items-center gap-6 md:gap-10 lg:gap-12">
          {navItems.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={item.sectionId}
                ref={(el) => {
                  linkRefs.current[item.sectionId] = el;
                }}
                onClick={() => scrollToSection(item.sectionId)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(-1)}
                className={`${
                  isActive
                    ? "font-pp-normal-medium"
                    : "font-pp-normal-ultralight"
                } relative text-sm uppercase tracking-[0.15em] text-white transition-colors hover:text-white/80 cursor-pointer bg-transparent border-none`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Hamburger Menu Button - mobile only */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        {/* Animated Doodle Underline */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute hidden md:block"
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

      {/* Mobile Offcanvas Menu */}
      {/* Overlay */}
      <div
        ref={menuOverlayRef}
        className="md:hidden fixed inset-0 bg-black/80 z-40"
        style={{ display: "none" }}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className="md:hidden fixed top-0 right-0 h-full w-full bg-black z-50 overflow-y-auto"
        style={{ display: "none", transform: "translateX(100%)" }}
      >
        <div className="flex flex-col items-center justify-center min-h-screen px-8 py-20">
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-white text-4xl focus:outline-none"
            aria-label="Close menu"
          >
            ×
          </button>

          {/* Menu Items - Big Fonts */}
          <nav className="flex flex-col items-center gap-8 md:gap-12">
            {navItems.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className={`${
                    ppNeueCorpWideMedium.variable
                  } font-pp-wide-medium text-white text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider transition-opacity hover:opacity-70 cursor-pointer bg-transparent border-none ${
                    isActive ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </nav>
  );
}
