"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    const access = localStorage.getItem("storefront_access") === "true";
    setHasAccess(access);

    // If no access and not on the password page, redirect to /password
    if (!access && pathname !== "/password") {
      router.push("/password");
    }
  }, [pathname, router]);

  // Prevent flash of unauthenticated content on protected pages
  if (!mounted || hasAccess === null) {
    return (
      <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C28a5c]/20 border-t-[#C28a5c] rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPasswordPage = pathname === "/password";

  if (isPasswordPage) {
    return (
      <main id="MainContent" className="focus-none min-h-screen bg-[#0F1B2D]">
        {children}
      </main>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="MainContent" className="focus-none">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
