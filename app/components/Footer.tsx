"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black py-4 md:py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12">
          {/* Logo */}
          <div className="w-56 h-12 md:w-64 md:h-14 lg:w-72 lg:h-16 ">
            <Image
              src="/images/logo.svg"
              alt="AGENCY"
              width={288}
              height={64}
              className="h-auto w-full"
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
              href="mailto:contacto@global-events.net"
              className="hover:text-white/80 transition-colors font-pp-normal-ultralight"
            >
              contacto@global-events.net
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
