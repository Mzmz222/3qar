import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-sans",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-drama",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const ibmPlex = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "عقار الأحساء | العقار في يدٍ أمينة",
  description: "المنصة الرائدة للاستثمار العقاري في الأحساء",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${ibmPlexArabic.variable} ${plusJakarta.variable} ${playfair.variable} ${ibmPlex.variable} antialiased bg-sand text-charcoal font-sans selection:bg-deep-brown selection:text-cream relative`}
      >
        <svg
          className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        {children}
      </body>
    </html>
  );
}
