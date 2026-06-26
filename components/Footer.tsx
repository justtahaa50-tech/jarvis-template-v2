"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  // Premium circular social brand icons (solid/fill icon pack)
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://instagram.com",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "https://tiktok.com",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.78-.22-.22-.43-.46-.62-.71-.02 3.4-.01 6.8-.02 10.2-.01 1.05-.28 2.1-.77 3.02-1.04 1.99-3.24 3.32-5.5 3.3-2.44.02-4.75-1.37-5.78-3.58-1.12-2.38-.61-5.32 1.25-7.18.94-.96 2.22-1.6 3.56-1.77.1-.01.2-.01.3-.02V15.3c-.63.08-1.25.32-1.75.74-.95.81-1.3 2.15-.87 3.33.36.98 1.34 1.67 2.39 1.65 1.44.02 2.65-1.14 2.66-2.58.01-4.27.01-8.54.01-12.81-.97-.04-1.93-.32-2.76-.85-.92-.58-1.63-1.49-1.98-2.52-.39-1.1-.38-2.29-.02-3.38.3-.92.89-1.74 1.63-2.34.8-.65 1.78-1.03 2.8-1.07z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: "https://facebook.com",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#0F1B2D] border-t border-white/10 pt-16 pb-12 w-full mt-auto text-[#F7F6F2]">
      <div className="max-width-container px-margin-mobile md:px-margin-desktop">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-gutter mb-16">
          
          {/* Column 1: JARVIS */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Link href="/" className="inline-block relative w-[260px] h-[80px]" aria-label="Jarvis home">
              <Image
                src="/assets/Jarvis Main Logo.svg"
                alt="JARVIS Logo"
                fill
                className="object-contain object-left"
                style={{ filter: "brightness(0) invert(1)" }}
                priority
              />
            </Link>
            <ul className="flex flex-col gap-3 font-body-md text-body-md">
              <li>
                <Link href="/about" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Shop All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: SUPPORT */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="font-label-caps text-label-caps text-[#F7F6F2] tracking-wider font-bold">
              SUPPORT
            </h3>
            <ul className="flex flex-col gap-3 font-body-md text-body-md">
              <li>
                <Link href="/faqs" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  FAQ's
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/exchange-refund" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Exchange &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/manage-preorders" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Manage Pre-orders
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Delivery info
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/withdraw" className="text-[#F7F6F2]/70 hover:text-[#F7F6F2] transition-colors">
                  Withdraw from Contract
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: SOCIAL */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {/* SOCIAL row */}
            <div className="flex flex-col gap-4">
              <h3 className="font-label-caps text-label-caps text-[#F7F6F2] tracking-wider font-bold">
                SOCIAL
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#C28a5c] text-[#F7F6F2] hover:text-white transition-all duration-300 border border-white/10 shadow-sm hover:scale-105 cursor-pointer"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 4: SIGN UP NOW */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="font-label-caps text-label-caps text-[#F7F6F2] tracking-wider font-bold">
              SIGN UP NOW
            </h3>
            <p className="font-body-md text-body-md text-[#F7F6F2]/70">
              Stay in the loop with exclusive offers and product previews.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-row items-stretch w-full mt-2">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-white/20 bg-white/5 text-[#F7F6F2] font-body-md placeholder:text-[#F7F6F2]/40 focus:outline-none focus:border-[#C28a5c] rounded-none"
              />
              <button
                type="submit"
                className="bg-[#C28a5c] text-[#F7F6F2] font-label-caps text-label-caps px-6 hover:bg-[#C28a5c]/85 transition-colors rounded-none border border-[#C28a5c] border-l-0 cursor-pointer"
              >
                SIGN UP
              </button>
            </form>
          </div>

        </div>

        {/* Copyright Line */}
        <div className="pt-8 border-t border-white/10">
          <p className="font-label-caps text-label-caps text-[#F7F6F2]/50 uppercase tracking-widest text-center md:text-left text-[11px]">
            © {new Date().getFullYear()} JARVIS. ALL RIGHTS RESERVED.{" "}
            <Link href="/business-enquiries" className="underline font-bold text-[#F7F6F2] hover:text-[#C28a5c] transition-colors">
              BUSINESS ENQUIRIES
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

