/**
 * Utility functions for generating doodle paths
 */

/**
 * Generate a hand-drawn style path with messy U-turns (triple line effect)
 */
export function generateDoodlePath(width: number): string {
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
