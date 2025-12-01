"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Frame from "./Frame";

const eventos = [
  {
    id: 1,
    title: "Evento 1",
    image: "/images/evento1.jpg",
  },
  {
    id: 2,
    title: "Evento 2",
    image: "/images/evento2.jpg",
  },
];

export default function Eventos() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animate images on scroll into view
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    // Initialize images as hidden and positioned below
    imageRefs.current.forEach((imageRef) => {
      if (imageRef) {
        gsap.set(imageRef, {
          opacity: 0,
          y: 50,
        });
      }
    });

    // Function to animate images
    const animateImages = () => {
      imageRefs.current.forEach((imageRef, index) => {
        if (imageRef) {
          gsap.to(imageRef, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.2, // Small delay between each image
            ease: "power2.out",
          });
        }
      });
    };

    // Intersection Observer to trigger animation when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and animate
            imageRefs.current.forEach((imageRef) => {
              if (imageRef) {
                gsap.set(imageRef, {
                  opacity: 0,
                  y: 50,
                });
              }
            });
            // Small delay to ensure reset is applied
            requestAnimationFrame(() => {
              animateImages();
            });
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    // Animate on initial mount if already in view
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
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
            <div key={evento.id} className="relative aspect-4/3">
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
                <div className="w-full h-full bg-gray-800 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <span className="text-sm">{evento.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
