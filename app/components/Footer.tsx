"use client";

import Link from "next/link";
import logoASVG from "./LogoA";

export default function Footer() {
  return (
    <footer className="bg-black py-4 md:py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12">
          {/* Logo - "A" from logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-24">
            <div
              dangerouslySetInnerHTML={{ __html: logoASVG }}
              className="w-full h-full text-white"
            />
          </div>

          {/* Social Media Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 md:px-8 md:py-4 rounded-lg border border-white bg-black text-white text-sm md:text-base uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200 font-pp-normal-ultralight"
            >
              Instagram
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 md:px-8 md:py-4 rounded-lg border border-white bg-black text-white text-sm md:text-base uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200 font-pp-normal-ultralight"
            >
              LinkedIn
            </Link>
            <Link
              href="https://vimeo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 md:px-8 md:py-4 rounded-lg border border-white bg-black text-white text-sm md:text-base uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200 font-pp-normal-ultralight"
            >
              Vimeo
            </Link>
          </div>

          {/* Email Addresses */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-white text-sm md:text-base">
            <a
              href="mailto:tzinia@global-events.net"
              className="hover:text-white/80 transition-colors font-pp-normal-ultralight"
            >
              tzinia@global-events.net
            </a>
            <span className="hidden sm:inline text-white/60">|</span>
            <div className="sm:hidden w-8 h-px bg-white/60"></div>
            <a
              href="mailto:mariana@global-events.net"
              className="hover:text-white/80 transition-colors font-pp-normal-ultralight"
            >
              mariana@global-events.net
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
