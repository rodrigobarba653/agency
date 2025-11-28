"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock body scroll while loading
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalHeight = document.body.style.height;
    
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    // Wait for fonts to load
    const checkFontsLoaded = () => {
      if (document.fonts && document.fonts.ready) {
        return document.fonts.ready;
      }
      // Fallback: wait a bit for fonts to load
      return new Promise((resolve) => setTimeout(resolve, 500));
    };

    // Wait for GSAP to be ready
    const checkGSAPReady = () => {
      return new Promise((resolve) => {
        if (typeof gsap !== "undefined") {
          resolve(true);
        } else {
          // Wait a bit for GSAP to load
          setTimeout(resolve, 100);
        }
      });
    };

    // Wait for both fonts and GSAP
    Promise.all([checkFontsLoaded(), checkGSAPReady()]).then(() => {
      // Small delay to ensure everything is ready
      setTimeout(() => {
        // Fade out loader
        gsap.to(".loader-container", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            setIsLoading(false);
            // Restore body scroll
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.width = originalWidth;
            document.body.style.height = originalHeight;
          },
        });
      }, 300);
    });

    // Cleanup function in case component unmounts
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loader-container fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-white text-2xl md:text-4xl font-pp-normal-ultralight tracking-wider">
        Agency.ge
      </div>
    </div>
  );
}

