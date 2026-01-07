"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Project } from "../data/projects";
import { ppNeueCorpWideMedium } from "../fonts";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure portals only render on the client
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Get all images for the project
  useEffect(() => {
    if (!project) {
      setImages([]);
      return;
    }

    // Generate image paths based on folder name
    const imageCounts: Record<string, number> = {
      amazon: 19,
      natura: 9,
      royalcanin: 16,
      talent: 20,
    };

    const count = imageCounts[project.folder] || 0;
    const projectImages: string[] = [];

    for (let i = 1; i <= count; i++) {
      const imageNumber = String(i).padStart(3, "0");
      projectImages.push(
        `/images/projects/${project.folder}/${project.folder}_${imageNumber}.jpg`
      );
    }

    setImages(projectImages);
    setCurrentImageIndex(0);
  }, [project]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, images, currentImageIndex, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!project) return;

    // Save current scroll position
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Get all elements that might scroll
    const body = document.body;
    const html = document.documentElement;

    // Mark modal as open (for SmoothScroll to detect)
    html.classList.add("modal-open");

    // Save original values
    const originalBodyStyle = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      height: body.style.height,
      touchAction: body.style.touchAction,
    };

    const originalHtmlStyle = {
      overflow: html.style.overflow,
      height: html.style.height,
      touchAction: html.style.touchAction,
    };

    // Lock scrolling - use position fixed approach
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.touchAction = "none"; // Prevent touch scrolling on body

    html.style.overflow = "hidden";
    html.style.height = "100%";
    html.style.touchAction = "none"; // Prevent touch scrolling on html

    // Prevent scroll events - but allow scrolling within modal's scrollable areas
    const preventScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow scrolling only within elements with overflow-y-auto class
      const scrollableParent = target.closest(".overflow-y-auto");
      if (!scrollableParent) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const preventWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest(".overflow-y-auto");
      if (!scrollableParent) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const preventTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest(".overflow-y-auto");
      if (!scrollableParent) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Add event listeners - use capture phase to catch early
    const options = { passive: false, capture: true };
    window.addEventListener("scroll", preventScroll, options);
    window.addEventListener("wheel", preventWheel, options);
    window.addEventListener("touchmove", preventTouchMove, options);
    document.addEventListener("scroll", preventScroll, options);
    document.addEventListener("wheel", preventWheel, options);
    document.addEventListener("touchmove", preventTouchMove, options);

    // Cleanup
    return () => {
      // Remove all event listeners
      window.removeEventListener("scroll", preventScroll, { capture: true });
      window.removeEventListener("wheel", preventWheel, { capture: true });
      window.removeEventListener("touchmove", preventTouchMove, {
        capture: true,
      });
      document.removeEventListener("scroll", preventScroll, { capture: true });
      document.removeEventListener("wheel", preventWheel, { capture: true });
      document.removeEventListener("touchmove", preventTouchMove, {
        capture: true,
      });

      // Restore original styles
      body.style.overflow = originalBodyStyle.overflow;
      body.style.position = originalBodyStyle.position;
      body.style.top = originalBodyStyle.top;
      body.style.left = originalBodyStyle.left;
      body.style.width = originalBodyStyle.width;
      body.style.height = originalBodyStyle.height;
      body.style.touchAction = originalBodyStyle.touchAction;

      html.style.overflow = originalHtmlStyle.overflow;
      html.style.height = originalHtmlStyle.height;
      html.style.touchAction = originalHtmlStyle.touchAction;

      // Remove modal-open class
      html.classList.remove("modal-open");

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [project]);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!project || !isMounted) return null;

  return createPortal(
    <div
      id="project-modal-root"
      className="fixed inset-0 z-9999 overflow-hidden bg-black"
      style={{
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
        aria-label="Close modal"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Vertical Stack Layout - Mobile Version */}
      <div className="flex flex-col h-full md:hidden bg-black">
        {/* Top - Title and Description */}
        <div className="p-8 overflow-y-auto" style={{ touchAction: "pan-y" }}>
          <h2
            className={`${ppNeueCorpWideMedium.variable} font-pp-wide-medium text-white text-3xl mb-6`}
          >
            {project.title}
          </h2>
          <div className="text-white/70 text-base leading-relaxed space-y-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
        </div>

        {/* Bottom - Image Carousel */}
        <div className="flex-1 relative">
          {images.length > 0 && (
            <>
              <div className="relative w-full h-full">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/40 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-10"
                    aria-label="Previous image"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/40 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-10"
                    aria-label="Next image"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-3 py-1.5 rounded-full backdrop-blur-sm text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout: 50/50 Split */}
      <div className="hidden md:flex h-full">
        {/* Left Side - Image Carousel */}
        <div className="w-1/2 relative">
          {images.length > 0 && (
            <>
              <div className="relative w-full h-full">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-10"
                    aria-label="Previous image"
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
                    onClick={handleNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-10"
                    aria-label="Next image"
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
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side - Title and Description */}
        <div
          className="w-1/2 p-12 md:p-16 lg:p-20 flex flex-col justify-center overflow-y-auto"
          style={{ touchAction: "pan-y" }}
        >
          <h2
            className={`${ppNeueCorpWideMedium.variable} font-pp-wide-medium text-white text-4xl md:text-5xl lg:text-6xl mb-8`}
          >
            {project.title}
          </h2>
          <div className="text-white/70 text-lg md:text-xl leading-relaxed space-y-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

