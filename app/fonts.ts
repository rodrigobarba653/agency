import localFont from "next/font/local";

// Robust fallback font stack - must be explicit literals for Next.js
const fallbackFontStack = [
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "sans-serif",
] as const;

// PP Neue Corp Normal Medium
export const ppNeueCorpNormalMedium = localFont({
  src: "../public/fonts/PPNeueCorp-NormalMedium.otf",
  variable: "--font-pp-neue-corp-normal-medium",
  weight: "500",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  preload: true,
});

// PP Neue Corp Normal Ultralight
export const ppNeueCorpNormalUltralight = localFont({
  src: "../public/fonts/PPNeueCorp-NormalUltralight.otf",
  variable: "--font-pp-neue-corp-normal-ultralight",
  weight: "200",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  preload: true,
});

// PP Neue Corp Wide Medium
export const ppNeueCorpWideMedium = localFont({
  src: "../public/fonts/PPNeueCorp-WideMedium.otf",
  variable: "--font-pp-neue-corp-wide-medium",
  weight: "500",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  preload: true,
});

// PP Neue Corp Wide Ultrabold
export const ppNeueCorpWideUltrabold = localFont({
  src: "../public/fonts/PPNeueCorp-WideUltrabold.otf",
  variable: "--font-pp-neue-corp-wide-ultrabold",
  weight: "800",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  preload: true,
});

