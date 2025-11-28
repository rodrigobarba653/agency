import { gsap } from "gsap";

/**
 * Animates an SVG path to draw from start to end
 * @param pathElement - The SVG path element to animate
 * @param duration - Animation duration in seconds (default: 0.6)
 * @param delay - Delay before animation starts in seconds (default: 0)
 * @param ease - GSAP easing function (default: "power2.out")
 */
export function animateSVGPath(
  pathElement: SVGPathElement | null,
  duration: number = 0.6,
  delay: number = 0,
  ease: string = "power2.out"
) {
  if (!pathElement) return;

  const pathLength = pathElement.getTotalLength();
  pathElement.style.strokeDasharray = `${pathLength}`;
  pathElement.style.strokeDashoffset = `${pathLength}`;

  gsap.to(pathElement, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease,
  });
}

/**
 * Animates multiple SVG paths sequentially
 * @param pathElements - Array of SVG path elements to animate
 * @param duration - Animation duration per path in seconds (default: 0.6)
 * @param stagger - Delay between each path animation in seconds (default: 0.1)
 * @param ease - GSAP easing function (default: "power2.out")
 */
export function animateSVGPaths(
  pathElements: (SVGPathElement | null)[],
  duration: number = 0.6,
  stagger: number = 0.1,
  ease: string = "power2.out"
) {
  const validPaths = pathElements.filter((p) => p !== null) as SVGPathElement[];

  validPaths.forEach((path, index) => {
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      delay: index * stagger,
      ease,
    });
  });
}

