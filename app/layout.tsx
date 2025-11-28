import type { Metadata } from "next";
import "./globals.css";
import {
  ppNeueCorpNormalMedium,
  ppNeueCorpNormalUltralight,
  ppNeueCorpWideMedium,
  ppNeueCorpWideUltrabold,
} from "./fonts";
import Nav from "./components/Nav";
import Loader from "./components/Loader";

export const metadata: Metadata = {
  title: "Agency.ge",
  description: "Agency.ge - Creating exceptional experiences through innovative design and strategic production. 25 years of producing memorable events and digital solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppNeueCorpNormalMedium.variable} ${ppNeueCorpNormalUltralight.variable} ${ppNeueCorpWideMedium.variable} ${ppNeueCorpWideUltrabold.variable} antialiased`}
      >
        <Loader />
        <Nav />
        {children}
      </body>
    </html>
  );
}
