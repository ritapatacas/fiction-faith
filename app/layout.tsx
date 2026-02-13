import React from "react"
import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Cormorant_Garamond, Inter } from "next/font/google";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const faviconUrl = `${basePath}/favicon.ico`;

export const metadata: Metadata = {
  title: "Fiction Faith - a tarot bible",
  description:
    "A minimalist tarot card reference app with meanings, keywords, and interpretations.",
  icons: { icon: faviconUrl },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${bebas.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
