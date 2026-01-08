"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Frame from "./Frame";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { isElementInView } from "../utils/viewUtils";

// Helper function to extract and format folder name from image path
const getEventTitle = (imagePath: string): string => {
  const parts = imagePath.split("/");
  const folderName = parts[parts.indexOf("projects") + 1];

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

const eventos = [
  {
    id: 1,
    image: "/images/projects/amazon/amazon_005.jpg",
  },
  {
    id: 2,
    image: "/images/projects/royalcanin/royalcanin_010.jpg",
  },
].map((evento) => ({
  ...evento,
  title: getEventTitle(evento.image),
}));

export default function Eventos() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

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
          {eventos.map((evento, index) => (
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
                    <Image
                      src={evento.image}
                      alt={evento.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
              {/* Event Name */}
              <h3 className="text-white text-xl md:text-2xl mt-6 text-center">
                {evento.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
