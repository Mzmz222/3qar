import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عقار",
  description: "منصة عقارية متكاملة",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FAFAFA] text-[#111827] font-[Cairo,Tajawal,system-ui,sans-serif] antialiased">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
