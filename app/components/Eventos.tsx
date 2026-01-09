"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Frame from "./Frame";
import { isElementInView } from "../utils/viewUtils";

// Helper function to extract and format folder name from image path
const getEventTitle = (folderName: string): string => {
  // Format folder names to proper titles
  const titleMap: Record<string, string> = {
    amazon: "Amazon",
    natura: "Natura",
    royalcanin: "Royal Canin",
    talent: "Talent",
  };

  return (
    titleMap[folderName] ||
    folderName.charAt(0).toUpperCase() + folderName.slice(1)
  );
};

// Helper function to get all images for a folder
const getFolderImages = (folderName: string): string[] => {
  const imageCounts: Record<string, number> = {
    amazon: 19,
    natura: 9,
    royalcanin: 16,
    talent: 20,
  };

  const count = imageCounts[folderName] || 0;
  const images: string[] = [];

  for (let i = 1; i <= count; i++) {
    const imageNumber = String(i).padStart(3, "0");
    images.push(
      `/images/projects/${folderName}/${folderName}_${imageNumber}.jpg`
    );
  }

  return images;
};

const eventos = [
  {
    id: 1,
    folder: "amazon",
  },
  {
    id: 2,
    folder: "royalcanin",
  },
].map((evento) => ({
  ...evento,
  title: getEventTitle(evento.folder),
  images: getFolderImages(evento.folder),
}));

export default function Eventos() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentImageIndices, setCurrentImageIndices] = useState<
    Record<number, number>
  >({});

  // Initialize current image indices
  useEffect(() => {
    const initialIndices: Record<number, number> = {};
    eventos.forEach((evento) => {
      initialIndices[evento.id] = 0;
    });
    setCurrentImageIndices(initialIndices);
  }, []);

  // Handle navigation for a specific evento
  const handleNext = (eventoId: number, totalImages: number) => {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [eventoId]: ((prev[eventoId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevious = (eventoId: number, totalImages: number) => {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [eventoId]: ((prev[eventoId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  // Animate images on scroll into view (with staggered delays)
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    let hasAnimated = false;

    // Initialize images as hidden and positioned below
    imageRefs.current.forEach((imageRef) => {
      if (imageRef) {
        gsap.set(imageRef, {
          opacity: 0,
          y: 50,
        });
      }
    });

    // Function to animate images with staggered delays
    const animateImages = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      // Reset first
      imageRefs.current.forEach((imageRef) => {
        if (imageRef) {
          gsap.set(imageRef, {
            opacity: 0,
            y: 50,
          });
        }
      });

      // Animate with staggered delays
      requestAnimationFrame(() => {
        imageRefs.current.forEach((imageRef, index) => {
          if (imageRef) {
            gsap.to(imageRef, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: "power2.out",
            });
          }
        });
      });
    };

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateImages();
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    // Animate on initial mount if already in view
    if (isElementInView(section)) {
      animateImages();
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="eventos" ref={sectionRef} className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl mb-12 text-center">
          Eventos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 max-w-6xl mx-auto">
          {eventos.map((evento, index) => {
            const currentIndex = currentImageIndices[evento.id] || 0;
            const hasMultipleImages = evento.images.length > 1;

            return (
              <div key={evento.id} className="flex flex-col">
                <div className="relative aspect-4/3">
                  {/* Frame SVG - absolutely positioned */}
                  <div className="absolute inset-0 w-full h-full">
                    <Frame
                      className="w-full h-full text-white"
                      animateOnScroll={true}
                      sectionRef={sectionRef}
                      delay={index * 0.3}
                    />
                  </div>
                  {/* Image Container with padding */}
                  <div
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    className="absolute inset-0 p-12"
                  >
                    <div className="w-full h-full bg-gray-800 overflow-hidden relative">
                      {evento.images.length > 0 && (
                        <>
                          <Image
                            src={evento.images[currentIndex]}
                            alt={`${evento.title} - Image ${currentIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />

                          {/* Navigation Arrows */}
                          {hasMultipleImages && (
                            <>
                              <button
                                onClick={() =>
                                  handlePrevious(
                                    evento.id,
                                    evento.images.length
                                  )
                                }
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/40 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-10"
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
                                onClick={() =>
                                  handleNext(evento.id, evento.images.length)
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/40 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm z-10"
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

                          {/* Dots Indicator */}
                          {hasMultipleImages && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                              {evento.images.map((_, imgIndex) => (
                                <button
                                  key={imgIndex}
                                  onClick={() =>
                                    setCurrentImageIndices((prev) => ({
                                      ...prev,
                                      [evento.id]: imgIndex,
                                    }))
                                  }
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    currentIndex === imgIndex
                                      ? "bg-white w-6"
                                      : "bg-white/40 hover:bg-white/60"
                                  }`}
                                  aria-label={`Go to image ${imgIndex + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Event Name */}
                <h3 className="text-white text-xl md:text-2xl mt-6 text-center">
                  {evento.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
