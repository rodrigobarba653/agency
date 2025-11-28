"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ppNeueCorpWideMedium } from "../fonts";

// Generate a pixelated Z-shaped doodle pattern
function generateZDoodlePath(width: number): string {
  const height = 20; // Total height for the doodle
  const horizontalY = height * 0.4; // Y position for main horizontal line
  const verticalHeight = height * 0.3; // Height of vertical line
  const zY = height * 0.7; // Y position for Z shape start

  // Main horizontal line (top)
  const horizontalStart = width * 0.05;
  const horizontalEnd = width * 0.95;

  // Vertical line above left end
  const verticalX = horizontalStart;
  const verticalTop = 0;
  const verticalBottom = horizontalY - 2;

  // Z-shaped line below (lightning bolt pattern)
  const zStartX = width * 0.05;
  const zMidX1 = width * 0.4;
  const zMidX2 = width * 0.6;
  const zEndX = width * 0.95;
  const zTopY = zY;
  const zMidY = height * 0.85;
  const zBottomY = height * 0.9;

  // Create the path
  let path = `M ${horizontalStart},${horizontalY} L ${horizontalEnd},${horizontalY}`; // Main horizontal line
  path += ` M ${verticalX},${verticalTop} L ${verticalX},${verticalBottom}`; // Vertical line
  // Z shape: horizontal segment, diagonal down, diagonal up
  path += ` M ${zStartX},${zTopY} L ${zMidX1},${zTopY} L ${zMidX2},${zMidY} L ${zEndX},${zBottomY}`;

  return path;
}

// Generate a hand-drawn style path with messy U-turns (triple line effect)
function generateDoodlePath(width: number): string {
  const segments = Math.max(8, Math.floor(width / 12));
  const segmentWidth = width / segments;
  const baseY = 2;
  const amplitude = 1.2;
  const offsetY = 5;

  const seed = width * 0.123;
  const random = (n: number) => {
    const x = Math.sin(n * 12.9898 + seed) * 43758.5453;
    return x - Math.floor(x);
  };

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
      const angle = progress * Math.PI;
      const radius = 2 + (random(i + 100) - 0.5) * 1.5;
      const centerX = startX;
      const centerY = startY;
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

  const firstLineStart = width * 0.2;
  const firstLineEnd = width * 0.9;
  const secondLineStart = width * 0.7;
  const secondLineEnd = 0;
  const thirdLineStart = 0;
  const thirdLineEnd = width;

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

  const turnWidth = width * 0.1;
  path += createUTurn(firstLineEnd, baseY + 1, "right", turnWidth);

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

  path += createUTurn(secondLineEnd, baseY + offsetY + 1, "left", turnWidth);

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

const servicios = [
  {
    id: "experiencia",
    title: "Experiencia de Marca",
    services: [
      "Activaciones → Lanzamientos → Sampling → Punto de venta",
      "→ Estrategias de engagement → Conceptualización",
    ],
  },
  {
    id: "produccion",
    title: "Producción de Eventos",
    services: [
      "Eventos corporativos → Conferencias → Lanzamientos de producto",
      "→ Producción audiovisual → Diseño de espacios",
    ],
  },
  {
    id: "logistica",
    title: "Logística y Operación",
    services: [
      "Coordinación de eventos → Gestión de proveedores → Transporte",
      "→ Almacenamiento → Montaje y desmontaje",
    ],
  },
];

export default function Servicios() {
  const [openSection, setOpenSection] = useState<string>("experiencia");
  const titleRefs = useRef<{ [key: string]: HTMLHeadingElement | null }>({});
  const svgRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const pathRefs = useRef<{ [key: string]: SVGPathElement | null }>({});

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };

  const positionDoodle = (servicio: (typeof servicios)[0]) => {
    const titleRef = titleRefs.current[servicio.id];
    const svgRef = svgRefs.current[servicio.id];
    const pathRef = pathRefs.current[servicio.id];

    if (!titleRef || !svgRef || !pathRef) return;

    // Split title into words
    const words = servicio.title.split(" ");
    let selectedWord = "";
    let wordIndex = 0;
    let wordWidth = 0;

    // For "Producción de Eventos", target "Eventos" specifically
    if (servicio.id === "produccion") {
      wordIndex = words.findIndex((word) => word.toLowerCase() === "eventos");
      if (wordIndex !== -1) {
        selectedWord = words[wordIndex];
        // Measure the word
        const tempSpan = document.createElement("span");
        tempSpan.textContent = selectedWord;
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.fontSize = window.getComputedStyle(titleRef).fontSize;
        tempSpan.style.fontFamily =
          window.getComputedStyle(titleRef).fontFamily;
        tempSpan.style.fontWeight =
          window.getComputedStyle(titleRef).fontWeight;
        document.body.appendChild(tempSpan);
        wordWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
      }
    }

    // For "Logística y Operación", target "Logística" specifically
    if (servicio.id === "logistica") {
      wordIndex = words.findIndex((word) => word.toLowerCase() === "logística");
      if (wordIndex !== -1) {
        selectedWord = words[wordIndex];
        // Measure the word
        const tempSpan = document.createElement("span");
        tempSpan.textContent = selectedWord;
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.fontSize = window.getComputedStyle(titleRef).fontSize;
        tempSpan.style.fontFamily =
          window.getComputedStyle(titleRef).fontFamily;
        tempSpan.style.fontWeight =
          window.getComputedStyle(titleRef).fontWeight;
        document.body.appendChild(tempSpan);
        wordWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
      }
    }

    // For other sections, find the longest word
    if (wordWidth === 0) {
      let longestWord = "";
      let longestWordIndex = 0;
      let longestWordWidth = 0;

      words.forEach((word, index) => {
        const tempSpan = document.createElement("span");
        tempSpan.textContent = word;
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.fontSize = window.getComputedStyle(titleRef).fontSize;
        tempSpan.style.fontFamily =
          window.getComputedStyle(titleRef).fontFamily;
        tempSpan.style.fontWeight =
          window.getComputedStyle(titleRef).fontWeight;
        document.body.appendChild(tempSpan);
        const wWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        if (wWidth > longestWordWidth) {
          longestWordWidth = wWidth;
          longestWord = word;
          longestWordIndex = index;
        }
      });

      selectedWord = longestWord;
      wordIndex = longestWordIndex;
      wordWidth = longestWordWidth;
    }

    // Find the position of the selected word in the title
    // Since text is centered, we need to calculate relative to the title center
    const titleRect = titleRef.getBoundingClientRect();
    const titleWidth = titleRect.width;

    // Measure text before the word (including spaces)
    const textBeforeWord = words.slice(0, wordIndex).join(" ");
    const tempSpan2 = document.createElement("span");
    tempSpan2.textContent = textBeforeWord;
    tempSpan2.style.visibility = "hidden";
    tempSpan2.style.position = "absolute";
    tempSpan2.style.fontSize = window.getComputedStyle(titleRef).fontSize;
    tempSpan2.style.fontFamily = window.getComputedStyle(titleRef).fontFamily;
    tempSpan2.style.fontWeight = window.getComputedStyle(titleRef).fontWeight;
    document.body.appendChild(tempSpan2);
    const textBeforeWidth = tempSpan2.offsetWidth;
    document.body.removeChild(tempSpan2);

    // Measure full title width
    const tempSpan3 = document.createElement("span");
    tempSpan3.textContent = servicio.title;
    tempSpan3.style.visibility = "hidden";
    tempSpan3.style.position = "absolute";
    tempSpan3.style.fontSize = window.getComputedStyle(titleRef).fontSize;
    tempSpan3.style.fontFamily = window.getComputedStyle(titleRef).fontFamily;
    tempSpan3.style.fontWeight = window.getComputedStyle(titleRef).fontWeight;
    document.body.appendChild(tempSpan3);
    const fullTitleWidth = tempSpan3.offsetWidth;
    document.body.removeChild(tempSpan3);

    // Calculate position relative to centered text
    const titleLeftOffset = (titleWidth - fullTitleWidth) / 2;
    const wordLeft = titleLeftOffset + textBeforeWidth;
    const width = wordWidth;
    const top = titleRect.height * 0.95; // Position lower below the text

    const path = generateDoodlePath(width);
    pathRef.setAttribute("d", path);

    svgRef.style.left = `${wordLeft}px`;
    svgRef.style.top = `${top}px`;
    svgRef.style.width = `${width}px`;
    svgRef.style.height = `14px`;
    svgRef.setAttribute("viewBox", `0 0 ${width} 14`);
    svgRef.style.display = "block";

    const pathLength = pathRef.getTotalLength();
    pathRef.style.strokeDasharray = `${pathLength}`;
    pathRef.style.strokeDashoffset = `${pathLength}`;

    gsap.to(pathRef, {
      strokeDashoffset: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      servicios.forEach((servicio) => {
        const isOpen = openSection === servicio.id;
        const svgRef = svgRefs.current[servicio.id];

        if (isOpen) {
          positionDoodle(servicio);
        } else {
          if (svgRef) {
            svgRef.style.display = "none";
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [openSection]);

  // Handle window resize to reposition doodles
  useEffect(() => {
    const handleResize = () => {
      servicios.forEach((servicio) => {
        const isOpen = openSection === servicio.id;
        if (isOpen) {
          positionDoodle(servicio);
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openSection]);

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto text-center">
          {servicios.map((servicio, index) => {
            const isOpen = openSection === servicio.id;

            return (
              <div key={servicio.id}>
                {index > 0 && (
                  <div className="border-t border-white/20 my-4"></div>
                )}
                <div className="relative">
                  <button
                    onClick={() => toggleSection(servicio.id)}
                    className="w-full"
                  >
                    <h3
                      ref={(el) => {
                        titleRefs.current[servicio.id] = el;
                      }}
                      className={`${
                        ppNeueCorpWideMedium.variable
                      } font-pp-wide-medium text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 transition-colors duration-300 relative whitespace-nowrap ${
                        isOpen ? "text-white" : "text-white/40"
                      }`}
                    >
                      {servicio.title}
                    </h3>
                  </button>
                  <svg
                    ref={(el) => {
                      svgRefs.current[servicio.id] = el;
                    }}
                    className="absolute pointer-events-none"
                    style={{ display: "none" }}
                  >
                    <path
                      ref={(el) => {
                        pathRefs.current[servicio.id] = el;
                      }}
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {servicio.services.length > 0 && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "max-h-96 opacity-100 mb-6"
                        : "max-h-0 opacity-0 mb-0"
                    }`}
                  >
                    <div className="space-y-3">
                      {servicio.services.map((service, serviceIndex) => {
                        const items = service
                          .split("→")
                          .map((item) => item.trim())
                          .filter((item) => item);
                        return (
                          <p
                            key={serviceIndex}
                            className={`text-white text-lg md:text-xl lg:text-2xl transition-opacity duration-500 flex items-center justify-center flex-wrap gap-2 ${
                              isOpen ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {items.map((item, itemIndex) => (
                              <span
                                key={itemIndex}
                                className="flex items-center"
                              >
                                {item}
                                {itemIndex < items.length - 1 && (
                                  <span className="mx-2 w-1.5 h-1.5 rounded-full bg-white"></span>
                                )}
                              </span>
                            ))}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
