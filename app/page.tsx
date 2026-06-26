"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ringerTeeProduct } from "@/data/dummyData";
import { Heart, ShoppingBag } from "lucide-react";

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const getVariantStockCount = (variantId?: string) => {
    if (!variantId) return 0;
    const v = ringerTeeProduct.variants.find((x) => x.id === variantId);
    if (!v || !v.available) return 0;
    if (variantId.endsWith("_s") || variantId.endsWith("_xl")) return 3;
    if (variantId.endsWith("_l")) return 4;
    return 15;
  };

  // Helper to determine color variant stock status and first available variant
  const getColorVariantInfo = (slug: string) => {
    const colorMap: { [key: string]: string } = {
      "black-white": "Black / White",
      "creamy-olive": "Creamy / Olive",
      "creamy-burgundy": "Creamy / Burgundy",
      "olive-white": "Olive / White",
      "rose-white": "Rose / White",
      "army-white": "Army / White",
      "burgundy-white": "Burgundy / White",
    };
    const colorName = colorMap[slug];
    const colorVariants = ringerTeeProduct.variants.filter(
      (v) => v.options.Color === colorName
    );
    const inStock = colorVariants.some((v) => v.available);
    
    // Default to M size if available, otherwise first available size
    const mVariant = colorVariants.find((v) => v.options.Size === "M" && v.available);
    const firstAvailable = mVariant || colorVariants.find((v) => v.available);
    const firstAvailableId = firstAvailable?.id || colorVariants[0]?.id;
    const stockCount = getVariantStockCount(firstAvailableId);
    
    return {
      inStock,
      variantId: firstAvailableId,
      stockCount
    };
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[870px] min-h-[380px] md:min-h-[600px] flex items-end pb-8 md:pb-12 lg:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/home-page-cover-page.jpeg"
            alt="Brutalist streetwear clothing fashion models shot"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-4 md:grid-cols-12 gap-gutter">
          <div className="col-span-4 md:col-span-8 lg:col-span-6 flex flex-col gap-stack-md text-on-primary">
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-primary/80">
              Fall/Winter 2024
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-on-primary">
              ARCHITECTURAL<br />INTEGRITY.
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary/90 max-w-md mt-stack-sm mb-stack-md">
              Redefining modern silhouettes through disciplined design and premium Egyptian textiles.
            </p>
            <div className="flex items-center gap-stack-md">
              <Link 
                href="/products/ringer-tee" 
                className="inline-flex items-center justify-center bg-surface text-primary px-8 py-4 font-label-caps text-label-caps uppercase hover:bg-surface-container-highest transition-colors duration-300 w-max rounded-[8px]"
              >
                Shop Ringer Tee
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Collections Bento Grid */}
      <section id="product-story" className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-0">
        <div className="flex justify-between items-end mb-stack-lg border-b border-outline-variant/20 pb-4">
          <h2 className="font-display-md text-display-md text-primary uppercase">EXPLORE COLLECTIONS</h2>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter md:grid-rows-[400px_400px]">
          
          {/* Card 1: Large Feature (Left) - responsive mobile height fix */}
          <Link 
            href="/products"
            className="group relative col-span-4 md:col-span-5 md:row-span-2 bg-surface-container-low overflow-hidden h-[400px] md:h-auto rounded-[24px] shadow-sm"
          >
            <Image
              src="/assets/BLACK/atef-front.jpg"
              alt="Ringer Tee Hero Image"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors duration-500" />
            <div className="absolute bottom-margin-mobile md:bottom-margin-desktop left-1/2 -translate-x-1/2">
              <div className="bg-primary-container text-on-primary-container px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest backdrop-blur-md whitespace-nowrap rounded-[12px]">
                THE RINGER TEE
              </div>
            </div>
          </Link>

          {/* Card 2: Top Right */}
          <Link 
            href="/products"
            className="group relative col-span-4 md:col-span-7 bg-surface-container-low overflow-hidden h-[350px] md:h-auto rounded-[24px] shadow-sm"
          >
            <Image
              src="/assets/CREAMY-OLIVE/nour-front_1.jpg"
              alt="Premium Cotton Ringer Tee"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors duration-500" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="bg-primary-container text-on-primary-container px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest backdrop-blur-md rounded-[12px]">
                COTTON ESSENTIALS
              </div>
            </div>
          </Link>

          {/* Card 3: Bottom Right Split 1 */}
          <Link 
            href="/products"
            className="group relative col-span-2 md:col-span-4 bg-surface-container-low overflow-hidden h-[280px] md:h-auto rounded-[24px] shadow-sm"
          >
            <Image
              src="/assets/OLIVE-WHITE/gogo-front_1.jpg"
              alt="Relaxed Fit Ringer Tee"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors duration-500" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-primary-container text-on-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest backdrop-blur-md text-[10px] md:text-[12px] rounded-[8px]">
                ARCHITECTURAL FIT
              </div>
            </div>
          </Link>

          {/* Card 4: Bottom Right Split 2 */}
          <Link 
            href="/products"
            className="group relative col-span-2 md:col-span-3 bg-surface-container-low overflow-hidden h-[280px] md:h-auto rounded-[24px] shadow-sm"
          >
            <Image
              src="/assets/ROSE/nour-1.jpg"
              alt="Everyday Essential Ringer Tee"
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors duration-500" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-primary-container text-on-primary-container px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest backdrop-blur-md text-[10px] md:text-[12px] rounded-[8px]">
                NEW ARRIVALS
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Shop All Colors Grid Section */}
      <section id="shop-colors" className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-0 border-t border-outline-variant/10">
        <div className="flex flex-col gap-stack-sm mb-stack-lg text-center md:text-left pb-4 border-b border-outline-variant/20">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px]">
            EXPLORE THE PALETTE
          </span>
          <h2 className="font-display-md text-display-md text-primary uppercase">SHOP ALL COLORS</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-gutter">
          {[
            { name: "BLACK / WHITE", slug: "black-white", image: "/assets/BLACK/atef-front.jpg" },
            { name: "CREAMY / OLIVE", slug: "creamy-olive", image: "/assets/CREAMY-OLIVE/nour-front_1.jpg" },
            { name: "CREAMY / BURGUNDY", slug: "creamy-burgundy", image: "/assets/CREAMY-BURGUNDY/gogo-front.jpg" },
            { name: "OLIVE / WHITE", slug: "olive-white", image: "/assets/OLIVE-WHITE/gogo-front_1.jpg" },
            { name: "ROSE / WHITE", slug: "rose-white", image: "/assets/ROSE/nour-1.jpg" },
            { name: "ARMY / WHITE", slug: "army-white", image: "/assets/ARMY/atef-front_2.jpg" },
            { name: "BURGUNDY / WHITE", slug: "burgundy-white", image: "/assets/BURGUNDY/hana-front_1.jpg" }
          ].map((variant) => {
            const info = getColorVariantInfo(variant.slug);
            return (
              <Link
                key={variant.slug}
                href={`/products/ringer-tee?variant=${variant.slug}`}
                className="group flex flex-col h-full bg-white p-2.5 sm:p-3 rounded-[20px] sm:rounded-[32px] border border-neutral-200/40 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Card Image */}
                <div
                  className="relative overflow-hidden aspect-[3/4] w-full bg-surface-container-low"
                  style={{
                    borderRadius: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  <Image
                    src={variant.image}
                    alt={`THE RINGER TEE - ${variant.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:blur-[2px] ${
                      !info.inStock ? "opacity-60 grayscale-[30%]" : ""
                    }`}
                    loading="lazy"
                  />

                  {/* Top Left Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {!info.inStock && (
                      <span
                        className="font-label-caps text-[9px] px-2.5 py-1 font-bold tracking-widest uppercase text-white animate-fade-in"
                        style={{
                          backdropFilter: "blur(12px)",
                          background: "rgba(15, 27, 45, 0.8)",
                          borderRadius: "999px",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        RESTOCKING
                      </span>
                    )}
                    {info.inStock && info.stockCount <= 5 && (
                      <span
                        className="font-label-caps text-[9px] px-2.5 py-1 font-bold tracking-widest uppercase text-white animate-fade-in"
                        style={{
                          backdropFilter: "blur(12px)",
                          background: "rgba(194, 138, 92, 0.85)",
                          borderRadius: "999px",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        LOW STOCK
                      </span>
                    )}
                  </div>

                  {/* Glass Quick Add overlay (Centered, Desktop only hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto hidden md:flex">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (info.inStock) {
                          addToCart(ringerTeeProduct, info.variantId);
                        }
                      }}
                      disabled={!info.inStock}
                      className="group/btn relative overflow-hidden h-12 w-[140px] hover:w-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-out cursor-pointer pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "rgba(194, 138, 92, 0.4)", // copper frosted glass
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1.5px solid rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 8px 32px rgba(15, 27, 45, 0.15)",
                      }}
                      title="Quick Shop"
                    >
                      {/* Text container */}
                      <span className="font-label-caps text-label-caps text-[11px] tracking-widest font-bold transition-all duration-300 whitespace-nowrap opacity-100 scale-100 group-hover/btn:opacity-0 group-hover/btn:scale-75 absolute">
                        Quick Shop
                      </span>
                      {/* Icon container */}
                      <span className="opacity-0 scale-75 transition-all duration-300 absolute group-hover/btn:opacity-100 group-hover/btn:scale-100 flex items-center justify-center">
                        <ShoppingBag size={18} />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Card Info & CTA Button */}
                <div className="flex flex-col pt-3 px-1 flex-1 justify-between">
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider text-[10px]">
                      THE RINGER TEE
                    </span>
                    <h3 className="font-body-md sm:font-body-lg text-xs sm:text-body-lg text-primary font-bold uppercase mt-1 line-clamp-2">
                      {variant.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="font-label-caps text-label-caps text-primary font-bold">
                        LE 700.00
                      </span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant/40 line-through">
                        LE 875.00
                      </span>
                    </div>
                    <span className="inline-block bg-[#C28a5c]/10 text-[#C28a5c] font-label-caps text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wider mt-0.5">
                      20% OFF
                    </span>
                  </div>

                  {/* CTA Action (Responsive, Add to Cart or View Product) */}
                  <div className="mt-3 w-full flex items-center gap-2">
                    {info.inStock ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(ringerTeeProduct, info.variantId);
                        }}
                        className="flex-1 py-2.5 sm:py-3 bg-[#0F1B2D] hover:bg-[#1C2D42] text-white font-label-caps text-[9px] sm:text-[10.5px] tracking-widest uppercase rounded-[8px] transition-colors font-bold text-center cursor-pointer focus:outline-none flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag size={11} />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <button
                        className="flex-1 py-2.5 sm:py-3 bg-white hover:bg-neutral-50 text-[#0F1B2D] border border-neutral-300 font-label-caps text-[9px] sm:text-[10.5px] tracking-widest uppercase rounded-[8px] transition-all font-bold text-center cursor-pointer focus:outline-none"
                      >
                        View Product
                      </button>
                    )}
                    {/* Wishlist Icon Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const colorMap: { [key: string]: string } = {
                          "black-white": "Black / White",
                          "creamy-olive": "Creamy / Olive",
                          "creamy-burgundy": "Creamy / Burgundy",
                          "olive-white": "Olive / White",
                          "rose-white": "Rose / White",
                          "army-white": "Army / White",
                          "burgundy-white": "Burgundy / White",
                        };
                        const colorName = colorMap[variant.slug];
                        const firstVariantId = ringerTeeProduct.variants.find(
                          (v) => v.options.Color === colorName && v.available
                        )?.id || ringerTeeProduct.variants.find((v) => v.options.Color === colorName)?.id || ringerTeeProduct.variants[0]?.id;
                        toggleWishlist(ringerTeeProduct, firstVariantId, colorName, variant.image);
                      }}
                      aria-label="Add to wishlist"
                      className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-[8px] border border-neutral-200 flex items-center justify-center text-[#0F1B2D] hover:text-[#ba1a1a] hover:border-[#ba1a1a]/40 hover:bg-[#ba1a1a]/5 transition-all duration-200 cursor-pointer focus:outline-none"
                    >
                      {(() => {
                        const colorMap: { [key: string]: string } = {
                          "black-white": "Black / White",
                          "creamy-olive": "Creamy / Olive",
                          "creamy-burgundy": "Creamy / Burgundy",
                          "olive-white": "Olive / White",
                          "rose-white": "Rose / White",
                          "army-white": "Army / White",
                          "burgundy-white": "Burgundy / White",
                        };
                        const colorName = colorMap[variant.slug];
                        const firstVariantId = ringerTeeProduct.variants.find(
                          (v) => v.options.Color === colorName && v.available
                        )?.id || ringerTeeProduct.variants.find((v) => v.options.Color === colorName)?.id;
                        const fav = isInWishlist(ringerTeeProduct.id, firstVariantId);
                        return (
                          <Heart
                            size={14}
                            fill={fav ? "#ba1a1a" : "none"}
                            color={fav ? "#ba1a1a" : "currentColor"}
                            className="transition-colors duration-200"
                          />
                        );
                      })()}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Brand Statement */}
      <section className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap flex flex-col items-center text-center">
        <div className="max-w-3xl flex flex-col gap-stack-md">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary uppercase">
            ARCHITECTURAL INTEGRITY IN EVERY SILHOUETTE.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-stack-sm">
            Jarvis represents the intersection of premium Egyptian heritage and modern architectural streetwear. Every piece is crafted with uncompromising quality and structural discipline, designed for the discerning individual who values silent luxury.
          </p>
        </div>
      </section>
    </div>
  );
}
