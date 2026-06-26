import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ToastPortal from "@/components/ToastPortal";

import Preloader from "@/components/Preloader";

const satoshi = localFont({
  src: "../public/assets/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 900",
});

export const metadata: Metadata = {
  title: "JARVIS - Architectural Streetwear",
  description: "Redefining modern silhouettes through disciplined design and premium Egyptian textiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />
      <body
        className={`${satoshi.variable} bg-surface text-on-surface antialiased`}
        style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
      >
        <Preloader />

        <CartProvider>
          <WishlistProvider>
            <AnnouncementBar />
            <Header />
            <main id="MainContent" className="focus-none">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <ToastPortal />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
