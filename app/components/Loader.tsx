"use client";

import { useEffect, useState } from "react";
import { fadeOut } from "../utils/gsapAnimations";

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
      // Also wait for video to load (if on desktop)
      const waitForVideo = () => {
        return new Promise<void>((resolve) => {
          // Check if we're on desktop
          const isDesktop = window.innerWidth >= 768;
          
          if (!isDesktop) {
            // On mobile, don't wait for video (video won't show)
            resolve();
            return;
          }

          // Listen for custom event from HeroVideo when video is loaded
          const handleVideoLoaded = () => {
            window.removeEventListener("hero-video-loaded", handleVideoLoaded);
            resolve();
          };

          // Check if video is already loaded
          const video = document.querySelector('video[src="/videos/logo.mp4"]') as HTMLVideoElement;
          if (video && video.readyState >= 3) {
            // Video is already loaded enough (HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA)
            resolve();
            return;
          }

          // Set a timeout fallback (max 5 seconds) to prevent indefinite waiting
          const timeout = setTimeout(() => {
            window.removeEventListener("hero-video-loaded", handleVideoLoaded);
            console.warn("Video load timeout - proceeding without video");
            resolve();
          }, 5000);

          window.addEventListener("hero-video-loaded", () => {
            clearTimeout(timeout);
            handleVideoLoaded();
          });
        });
      };

      // Wait for video, then fade out loader
      waitForVideo().then(() => {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          // Fade out loader
          const loaderElement = document.querySelector(".loader-container") as HTMLElement;
          fadeOut(loaderElement, {
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
    <div className="loader-container fixed inset-0 z-[99999] bg-black flex items-center justify-center">
      <div className="text-white text-2xl md:text-4xl font-pp-normal-ultralight tracking-wider">
        Agency.ge
      </div>
    </div>
  );
}

