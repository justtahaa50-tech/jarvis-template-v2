"use client";

import React, { use, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { dummyProducts } from "@/data/dummyData";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Accordion from "@/components/Accordion";
import { Truck, Minus, Plus, ShoppingBag, Shield, RotateCw, Ruler, X, Heart, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

// ── Sliding roll-up text animation (Lando-store style) ──
const AnimatedLabel = ({ text, className }: { text: string; className?: string }) => (
  <div className={`relative overflow-hidden ${className ?? ""}`} style={{ lineHeight: "1em", height: "1em" }}>
    <span className="sr-only">{text}</span>
    <div className="flex h-full" aria-hidden="true">
      {text.split("").map((char, idx) => (
        <div key={idx} className="relative h-full flex flex-col">
          {/* char that slides OUT (up) */}
          <motion.span
            variants={{ initial: { y: 0 }, hover: { y: "-100%" } }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: idx * 0.025 }}
            className="block"
            style={{ lineHeight: "1em" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
          {/* char that slides IN (from below) */}
          <motion.span
            variants={{ initial: { y: "0%" }, hover: { y: "-100%" } }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: idx * 0.025 }}
            className="absolute top-[100%] block"
            style={{ lineHeight: "1em" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </div>
      ))}
    </div>
  </div>
);

interface PageProps {
  params: Promise<{ id: string }>;
}

// Recommended color variants to surface below the product
const RECOMMENDED_VARIANTS = [
  { name: "BLACK / WHITE",    slug: "black-white",    image: "/assets/BLACK/atef-front.jpg",             discount: "-20%" },
  { name: "CREAMY / OLIVE",   slug: "creamy-olive",   image: "/assets/CREAMY-OLIVE/nour-front_1.jpg",    discount: "-22%" },
  { name: "ROSE / WHITE",     slug: "rose-white",     image: "/assets/ROSE/nour-1.jpg",                  discount: null },
  { name: "ARMY / WHITE",     slug: "army-white",     image: "/assets/ARMY/atef-front_2.jpg",            discount: null },
  { name: "BURGUNDY / WHITE", slug: "burgundy-white", image: "/assets/BURGUNDY/hana-front_1.jpg",        discount: "-15%" },
  { name: "OLIVE / WHITE",    slug: "olive-white",    image: "/assets/OLIVE-WHITE/gogo-front_1.jpg",     discount: null },
];

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { addToCart, setIsCartOpen } = useCart();
  const router = useRouter();

  // Find product by handle, fallback to first product (Gray Camo Jersey) if not found
  let product = dummyProducts.find((p) => p.handle === id);
  if (!product) {
    product = dummyProducts[0];
  }

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Color option state
  const colorOption = product.options.find((o) => o.name === "Color");
  const [selectedColor, setSelectedColor] = useState(colorOption?.values[0] || "");

  // Size option state (default to first available variant, or first option value)
  const sizeOption = product.options.find((o) => o.name === "Size");
  
  const getFirstAvailableSize = (color: string) => {
    return sizeOption?.values.find((val) => {
      const variant = product.variants.find(
        (v) => v.options["Color"] === color && v.options["Size"] === val
      );
      return variant?.available;
    }) || sizeOption?.values[0] || "";
  };

  const [selectedSize, setSelectedSize] = useState(getFirstAvailableSize(colorOption?.values[0] || ""));
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Thumbnails scroll
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
  const scrollThumbnailsDown = () => {
    if (thumbnailsContainerRef.current) {
      thumbnailsContainerRef.current.scrollBy({ top: 130, behavior: "smooth" });
    }
  };

  const currentVariant = product.variants.find(
    (v) => v.options["Color"] === selectedColor && v.options["Size"] === selectedSize
  );

  const activeVariantId = currentVariant?.id || product.variants[0]?.id || product.id;
  const isFavorite = isInWishlist(product.id, activeVariantId);

  const getVariantStockCount = (variantId?: string) => {
    if (!variantId) return 0;
    if (variantId.endsWith("_s") || variantId.endsWith("_xl")) return 3;
    if (variantId.endsWith("_l")) return 4;
    return 15;
  };

  // Helper to determine color variant stock status and first available variant for recommended variants
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
    const colorVariants = product.variants.filter(
      (v) => v.options.Color === colorName
    );
    const firstAvailable = colorVariants.find((v) => v.available);
    const inStock = colorVariants.some((v) => v.available);
    const variantId = firstAvailable ? firstAvailable.id : (colorVariants[0]?.id || "");
    const stockCount = firstAvailable ? getVariantStockCount(variantId) : 0;
    return { inStock, variantId, stockCount };
  };

  // ── Sticky ATC bar ──
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const [stickyShimmer, setStickyShimmer]       = useState(false);
  const [sizeShimmer,   setSizeShimmer]         = useState(false);
  const atcButtonRef      = useRef<HTMLButtonElement>(null);
  const sizeGridRef       = useRef<HTMLDivElement>(null);
  const stickyShimmerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Slower, random-interval shimmer (2.5 – 5 s between sweeps)
  const scheduleStickyShimmer = useCallback(() => {
    const delay = 2500 + Math.random() * 2500; // 2.5–5 s
    stickyShimmerTimer.current = setTimeout(() => {
      setStickyShimmer(true);
      // 1.8 s sweep duration, then reset and schedule next
      setTimeout(() => {
        setStickyShimmer(false);
        scheduleStickyShimmer();
      }, 1800);
    }, delay);
  }, []);

  useEffect(() => {
    const btn = atcButtonRef.current;
    if (!btn) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show the bar when the button is out of view AND user has scrolled past it
        const hidden = !entry.isIntersecting && window.scrollY > 60;
        setStickyBarVisible(hidden);
        if (hidden) {
          scheduleStickyShimmer();
        } else {
          if (stickyShimmerTimer.current) clearTimeout(stickyShimmerTimer.current);
          setStickyShimmer(false);
        }
      },
      { threshold: 0 }
    );
    observer.observe(btn);
    // Also listen to scroll to re-evaluate when scrollY < 60
    const onScroll = () => {
      if (window.scrollY <= 60) setStickyBarVisible(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (stickyShimmerTimer.current) clearTimeout(stickyShimmerTimer.current);
    };
  }, [scheduleStickyShimmer]);

  // Scroll to size grid + flash shimmer on it
  const scrollToSizes = useCallback(() => {
    sizeGridRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      setSizeShimmer(true);
      setTimeout(() => setSizeShimmer(false), 1400);
    }, 500);
  }, []);

  // Get active variant
  const activeVariant = product.variants.find(
    (v) => v.options["Color"] === selectedColor && v.options["Size"] === selectedSize
  );

  const getSwatchImage = (colorName: string) => {
    switch (colorName) {
      case "Black / White": return "/assets/BLACK/atef-front.jpg";
      case "Creamy / Olive": return "/assets/CREAMY-OLIVE/nour-front_1.jpg";
      case "Creamy / Burgundy": return "/assets/CREAMY-BURGUNDY/gogo-front.jpg";
      case "Olive / White": return "/assets/OLIVE-WHITE/gogo-front_1.jpg";
      case "Rose / White": return "/assets/ROSE/nour-1.jpg";
      case "Army / White": return "/assets/ARMY/atef-front_2.jpg";
      case "Burgundy / White": return "/assets/BURGUNDY/hana-front_1.jpg";
      default: return "/assets/BLACK/atef-front.jpg";
    }
  };

  const getDotColorHex = (colorName: string) => {
    switch (colorName) {
      case "Black / White": return "#000000";
      case "Creamy / Olive": return "#556B2F";
      case "Creamy / Burgundy": return "#5C2530";
      case "Olive / White": return "#556B2F";
      case "Rose / White": return "#A37577";
      case "Army / White": return "#4B5320";
      case "Burgundy / White": return "#5C2530";
      default: return "#000000";
    }
  };

  const getButtonColorHex = (colorName: string) => {
    switch (colorName) {
      case "Black / White": return "#000000";
      case "Creamy / Olive": return "#556B2F";
      case "Creamy / Burgundy": return "#5C2530";
      case "Olive / White": return "#556B2F";
      case "Rose / White": return "#A37577";
      case "Army / White": return "#4B5320";
      case "Burgundy / White": return "#5C2530";
      default: return "#0F1B2D";
    }
  };

  const buttonColor = getButtonColorHex(selectedColor);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setActiveImageIndex(0);
    const firstAvailable = getFirstAvailableSize(color);
    setSelectedSize(firstAvailable);

    // Update URL parameter without page reload
    if (typeof window !== "undefined") {
      const urlMap: { [key: string]: string } = {
        "Black / White": "black-white",
        "Creamy / Olive": "creamy-olive",
        "Creamy / Burgundy": "creamy-burgundy",
        "Olive / White": "olive-white",
        "Rose / White": "rose-white",
        "Army / White": "army-white",
        "Burgundy / White": "burgundy-white",
      };
      const slug = urlMap[color];
      if (slug) {
        const newUrl = `${window.location.pathname}?variant=${slug}`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  };

  // Sync selected variant color from URL parameter on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const variantParam = searchParams.get("variant");
      if (variantParam) {
        const colorMap: { [key: string]: string } = {
          "black-white": "Black / White",
          "creamy-olive": "Creamy / Olive",
          "creamy-burgundy": "Creamy / Burgundy",
          "olive-white": "Olive / White",
          "rose-white": "Rose / White",
          "army-white": "Army / White",
          "burgundy-white": "Burgundy / White",
        };
        const mappedColor = colorMap[variantParam];
        if (mappedColor) {
          setSelectedColor(mappedColor);
          const firstAvailable = getFirstAvailableSize(mappedColor);
          setSelectedSize(firstAvailable);
        }
      }
    }
  }, []);

  const handleAddToCart = (openCart = true) => {
    if (!product) return;
    const variantId = activeVariant?.id || product.id;
    addToCart(product, variantId, quantity, openCart);
  };

  const getColorFolder = (colorName: string) => {
    switch (colorName) {
      case "Black / White": return "BLACK";
      case "Creamy / Olive": return "CREAMY-OLIVE";
      case "Creamy / Burgundy": return "CREAMY-BURGUNDY";
      case "Olive / White": return "OLIVE-WHITE";
      case "Rose / White": return "ROSE";
      case "Army / White": return "ARMY";
      case "Burgundy / White": return "BURGUNDY";
      default: return "BLACK";
    }
  };

  const folderName = getColorFolder(selectedColor);
  const filtered = product.images.filter((img) => img.includes(`/${folderName}/`));
  const productImages = filtered.length > 0 ? filtered : [product.featuredImage];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-12">
      <style>{`
        @keyframes periodic-glow-pulse {
          0%, 75%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(15, 27, 45, 0.05);
            filter: brightness(1);
          }
          87.5% {
            transform: scale(1.025);
            box-shadow: 0 12px 28px var(--atc-glow-color, rgba(194, 138, 92, 0.45)), 0 0 0 4px var(--atc-glow-ring, rgba(194, 138, 92, 0.15));
            filter: brightness(1.1);
          }
        }
        .animate-atc-glow {
          animation: periodic-glow-pulse 3s ease-in-out infinite;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, filter 0.3s ease;
        }
        .animate-atc-glow:hover {
          filter: brightness(1.1);
        }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-gutter">
        
        {/* Product Gallery (Left) - exactly 50% width on desktop */}
        <div className="lg:col-span-6 flex flex-col md:flex-row gap-4 h-auto lg:h-[720px] lg:sticky lg:top-[120px]">
          {/* Desktop Thumbnails Column - Styled like the screenshot */}
          <div className="hidden md:flex flex-col gap-4 items-center flex-shrink-0 w-24 h-full pb-4">
            <div
              ref={thumbnailsContainerRef}
              className="flex flex-col gap-4 overflow-y-auto hide-scrollbar scroll-smooth w-full flex-1"
              style={{ maxHeight: "calc(100% - 60px)" }}
            >
              {productImages.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className="w-full aspect-[3/4] relative overflow-hidden transition-all duration-300 rounded-[16px] border-2 bg-surface-container-low"
                    style={{
                      borderColor: isActive ? "#0F1B2D" : "rgba(15, 27, 45, 0.08)",
                      opacity: isActive ? 1 : 0.8,
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
            {productImages.length > 4 && (
              <button
                onClick={scrollThumbnailsDown}
                className="w-10 h-10 rounded-full border border-outline-variant/15 flex items-center justify-center bg-white text-[#0F1B2D] hover:bg-[#F7F6F2] transition-all shadow-sm cursor-pointer mt-2"
                aria-label="Scroll thumbnails down"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </button>
            )}
          </div>

          {/* Main Large Image Wrapper */}
          <div className="flex-1 flex flex-col gap-3 h-full relative">
            <div className="w-full aspect-[3/4] md:aspect-auto md:h-full bg-surface-container relative overflow-hidden flex-1 rounded-[24px] border border-outline-variant/10 shadow-sm group">
              {productImages[activeImageIndex] ? (
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <Image
                    src={productImages[activeImageIndex]}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center font-label-caps text-xs">
                  No Image
                </div>
              )}

              {/* Magnification button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute bottom-4 right-4 z-10 w-11 h-11 rounded-full bg-white text-[#0F1B2D] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
                title="Zoom image"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            {/* Mobile Horizontal Photo Indexing Dots */}
            {productImages.length > 1 && (
              <div className="flex md:hidden justify-center items-center gap-1.5 mt-1 select-none">
                {productImages.map((_, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                        isActive ? "bg-[#0F1B2D] w-4.5" : "bg-neutral-300 w-1.5"
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Product Info & Cart Form (Right) - exactly 50% width on desktop */}
        <div className="lg:col-span-6 px-margin-mobile lg:px-margin-desktop lg:pr-margin-desktop lg:pl-0 pt-8 lg:pt-0 flex flex-col gap-stack-lg">
          
          {/* Header Block */}
          <div className="flex flex-col gap-stack-sm">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-2 w-max">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: buttonColor }} />
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                {product.watchCount || 24} People are watching this right now
              </span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary uppercase mt-4">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="font-display-md text-display-md text-[#0F1B2D]">
                LE {product.price.toFixed(2)}
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant/40 line-through">
                LE {(product.price / 0.8).toFixed(2)}
              </span>
              <span
                className="font-label-caps text-[10px] px-2.5 py-1 rounded-full font-bold tracking-widest"
                style={{
                  background: "rgba(194, 138, 92, 0.12)",
                  color: "#C28a5c",
                }}
              >
                20% OFF
              </span>
            </div>

            {currentVariant && !currentVariant.available && (
              <div className="flex flex-col gap-2 mt-3.5 animate-fade-in w-full max-w-[320px]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#0F1B2D]/35 bg-[#0F1B2D]/10">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#0F1B2D] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0F1B2D]"></span>
                  </span>
                  <span className="font-label-caps text-[11px] text-[#0F1B2D] font-bold tracking-widest uppercase">
                    Sold Out <span className="text-[#0F1B2D]/60 font-medium">— Restocking Soon</span>
                  </span>
                </div>
              </div>
            )}

            {currentVariant && currentVariant.available && getVariantStockCount(currentVariant.id) <= 5 && (
              <div className="flex flex-col gap-2 mt-3.5 animate-fade-in w-full max-w-[320px]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#C28a5c]/35 bg-[#C28a5c]/10">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#C28a5c] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C28a5c]"></span>
                  </span>
                  <span className="font-label-caps text-[11px] text-[#0F1B2D] font-bold tracking-widest uppercase">
                    Low stock <span className="text-[#C28a5c] font-medium">— only {getVariantStockCount(currentVariant.id)} left</span>
                  </span>
                </div>
                {/* Custom shaped segmented progress bar using brand colors */}
                <div className="flex gap-1.5 w-full mt-1.5">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const stock = getVariantStockCount(currentVariant.id);
                    const isActive = idx < stock;
                    return (
                      <div
                        key={idx}
                        className="h-2 flex-1 transform skew-x-[-12deg] rounded-[2px] transition-all duration-500 ease-out"
                        style={{
                          backgroundColor: isActive ? "#C28a5c" : "rgba(15, 27, 45, 0.08)",
                          boxShadow: isActive ? "0 1.5px 4px rgba(194, 138, 92, 0.25)" : "none",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className="font-label-caps text-label-caps text-primary border border-primary px-2 py-1">
                BEST SELLER
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                | Selling fast – only 7 left
              </span>
            </div>
          </div>

          {/* Shipping Estimate Card */}
          <div className="flex flex-col gap-2 p-4 bg-surface-container-low border border-outline-variant/10">
            <div className="flex items-center gap-2" style={{ color: buttonColor }}>
              <Truck size={18} />
              <span className="font-body-md text-body-md font-bold">
                {product.deliveryEstimate || "Estimated delivery : Jun 27 - Jun 29"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <div className="w-3 h-3 rounded-full border-2 border-surface" style={{ backgroundColor: buttonColor }} />
              <span className="font-label-sm text-label-sm uppercase">
                {product.preorderText || "Preorders available | Ships by Jul 2"}
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-stack-lg">
            
            {/* Color Selector */}
            {colorOption && (
              <div className="flex flex-col gap-stack-md">
                <div className="flex justify-between items-end pb-1 border-b border-outline-variant/10">
                  <span className="font-label-caps text-label-caps text-primary tracking-wider">Color</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant text-[11px] font-bold uppercase">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorOption.values.map((color) => {
                    const isSelected = selectedColor === color;
                    const swatchImg = getSwatchImage(color);
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        aria-label={`Select Color ${color}`}
                        className={`w-12 h-12 rounded-full border relative overflow-hidden transition-all duration-300 ${
                          isSelected
                            ? "scale-110 ring-2 ring-offset-2 ring-primary"
                            : "border-outline-variant/50 hover:border-primary hover:scale-105"
                        }`}
                        style={{
                          borderColor: isSelected ? buttonColor : undefined,
                          boxShadow: isSelected ? `0 0 0 2px ${buttonColor}` : undefined
                        }}
                      >
                        <Image
                          src={swatchImg}
                          alt={color}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Color Dot Indicator Display */}
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/10">
              <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-wider">
                SELECTED COLOR
              </span>
              <div className="flex items-center gap-2 font-body-md text-body-md text-primary font-bold">
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border border-primary/10 transition-colors duration-300"
                  style={{ backgroundColor: getDotColorHex(selectedColor) }}
                />
                <span className="uppercase">{selectedColor}</span>
              </div>
            </div>

            {/* Size Selector */}
            {sizeOption && (
              <div ref={sizeGridRef} className="flex flex-col gap-stack-md pt-2">
                <div className="flex justify-between items-end pb-1 border-b border-outline-variant/10">
                  <span className="font-label-caps text-label-caps text-primary tracking-wider">Size</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="font-label-sm text-label-sm text-on-surface-variant underline cursor-pointer hover:text-primary transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sizeOption.values.map((size) => {
                    const variant = product.variants.find(
                      (v) => v.options["Color"] === selectedColor && v.options["Size"] === size
                    );
                    const isAvailable = variant ? variant.available : false;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`h-14 border font-label-caps text-label-caps transition-all duration-300 ${
                          !isAvailable
                            ? "out-of-stock cursor-not-allowed opacity-40"
                            : isSelected
                            ? "bg-surface-container-high text-primary font-bold"
                            : "border-outline-variant/50 text-on-surface-variant hover:border-primary"
                        } ${sizeShimmer && isAvailable ? "shimmer-card" : ""}`}
                        style={{
                          borderColor: isSelected ? buttonColor : sizeShimmer && isAvailable ? `${buttonColor}60` : undefined,
                          boxShadow:   sizeShimmer && isAvailable ? `0 0 0 2px ${buttonColor}30` : undefined,
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ATC / Quantity Panel */}
            <div className="flex flex-col gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex flex-col gap-1.5">
                <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-widest uppercase">Quantity</span>
                <div className="flex items-center border border-outline-variant/20 h-12 w-[140px] bg-surface-container-low rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer"
                    style={{ color: "rgba(15, 27, 45, 0.6)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = buttonColor;
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "rgba(15, 27, 45, 0.6)";
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center font-body-md text-body-md font-semibold select-none text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-full flex items-center justify-center transition-all duration-300 focus:outline-none cursor-pointer"
                    style={{ color: "rgba(15, 27, 45, 0.6)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = buttonColor;
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "rgba(15, 27, 45, 0.6)";
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart & Favorite Button Row */}
              <div className="flex gap-3 items-center">
                <motion.button
                  ref={atcButtonRef}
                  onClick={() => handleAddToCart()}
                  whileHover="hover"
                  initial="initial"
                  className="animate-atc-glow flex-1 h-14 text-white font-label-caps text-label-caps uppercase flex items-center justify-center gap-2 rounded-xl cursor-pointer focus:outline-none border border-transparent"
                  style={{
                    backgroundColor: buttonColor,
                    // @ts-ignore
                    "--atc-glow-color": `${buttonColor}73`,
                    // @ts-ignore
                    "--atc-glow-ring": `${buttonColor}26`,
                  }}
                >
                  <ShoppingBag size={18} />
                  <AnimatedLabel text={`Add to cart — LE ${(product.price * quantity).toLocaleString()}`} />
                </motion.button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const activeImage = currentVariant?.image || productImages[0] || product.featuredImage;
                    toggleWishlist(product, activeVariantId, selectedColor, activeImage);
                  }}
                  className="w-14 h-14 border border-outline-variant/30 rounded-xl flex items-center justify-center bg-surface-container-lowest text-primary hover:text-[#ba1a1a] hover:border-[#ba1a1a]/50 transition-all duration-300 cursor-pointer focus:outline-none"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={20}
                    fill={isFavorite ? "#ba1a1a" : "none"}
                    color={isFavorite ? "#ba1a1a" : "currentColor"}
                    className="transition-colors duration-300"
                  />
                </button>
              </div>
              
              {/* Buy Now - Redirects directly to checkout */}
              <button
                onClick={() => {
                  handleAddToCart(false);
                  router.push("/checkout");
                }}
                className="w-full h-14 font-label-caps text-label-caps uppercase transition-all duration-300 rounded-xl cursor-pointer focus:outline-none border-2"
                style={{
                  borderColor: buttonColor,
                  color: buttonColor,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = buttonColor;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = buttonColor;
                }}
              >
                Buy it now
              </button>
            </div>

          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4 border-y border-outline-variant/20 mt-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Truck size={18} />
              <span className="font-label-caps text-label-caps text-[10px]">On-time delivery</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Shield size={18} />
              <span className="font-label-caps text-label-caps text-[10px]">Secure checkout</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <RotateCw size={18} />
              <span className="font-label-caps text-label-caps text-[10px]">Easy exchange</span>
            </div>
          </div>

          {/* Collapsible Accordions */}
          <div className="flex flex-col border-b border-outline-variant/20">
            <Accordion title="Details" iconName="checkroom" defaultOpen={false} iconColor={buttonColor}>
              <p>{product.description}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 font-label-sm text-label-sm">
                <li>100% Premium Egyptian Cotton</li>
                <li>Relaxed architectural fit</li>
                <li>Reinforced stitching at stress points</li>
                <li>Made in Cairo</li>
              </ul>
            </Accordion>

            <Accordion title="Delivery" iconName="local_shipping" iconColor={buttonColor}>
              <p>Standard delivery within 3-5 business days. Express shipping available at checkout.</p>
            </Accordion>

            <Accordion title="Return & Exchange Policy" iconName="keyboard_return" iconColor={buttonColor}>
              <p>We accept returns within 14 days of delivery. Items must be unworn with original tags attached.</p>
            </Accordion>

            <Accordion title="Washing Instructions" iconName="laundry" iconColor={buttonColor}>
              <p>Machine wash cold with like colors. Do not bleach. Tumble dry low or hang dry to maintain structural integrity.</p>
            </Accordion>
          </div>

        </div>
      </div>

      {/* ─── Sticky ATC Bar ─── */}
      <div
        className={[
          "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          stickyBarVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
        ].join(" ")}
        style={{
          backdropFilter: "blur(24px)",
          borderTop: `1px solid ${buttonColor}22`,
          background: `linear-gradient(135deg, rgba(247,246,242,0.96) 0%, rgba(247,246,242,0.88) 100%)`,
          animation: "stickyBarBreath 4s ease-in-out infinite",
        }}
      >
        {/* Injected keyframes */}
        <style>{`
          @keyframes stickyBarBreath {
            0%,100% { box-shadow: 0 -6px 40px rgba(15,27,45,0.10); filter: brightness(1); }
            50%      { box-shadow: 0 -8px 48px rgba(15,27,45,0.18); filter: brightness(0.97); }
          }
          @keyframes chargeStroke {
            0%   { clip-path: inset(0 100% 0 0); opacity: 0.8; }
            25%  { clip-path: inset(0 0 100% 0); }
            50%  { clip-path: inset(0 0 0 100%); }
            75%  { clip-path: inset(100% 0 0 0); }
            100% { clip-path: inset(0 0% 0 0);   opacity: 1; }
          }
          .sticky-atc-btn { position: relative; overflow: hidden; }
          .sticky-atc-btn::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            border: 1.5px solid rgba(255,255,255,0);
            pointer-events: none;
            transition: border-color 0.2s;
          }
          .sticky-atc-btn:hover::after {
            border-color: rgba(255,255,255,0.55);
            animation: chargeStroke 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
          }
          .sticky-atc-btn:hover {
            box-shadow: 0 0 20px 2px rgba(255,255,255,0.18), inset 0 0 12px rgba(255,255,255,0.08);
          }
        `}</style>

        {/* Shimmer sweep */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: "-60%",
              width: "40%",
              background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
              transform: stickyShimmer ? "translateX(400%) skewX(-12deg)" : "translateX(0%) skewX(-12deg)",
              transition: stickyShimmer ? "transform 1.8s cubic-bezier(0.4,0,0.2,1)" : "none",
              opacity: stickyShimmer ? 1 : 0,
            }}
          />
        </div>

        {/* Inner row */}
        <div
          className="relative w-full max-w-[900px] mx-auto px-4 md:px-8 py-3 md:py-4"
          style={{ zIndex: 2, minHeight: 64 }}
        >
          {/* Mobile Layout: Responsive, simple, no horizontal overflow */}
          <div className="flex md:hidden items-center justify-between gap-3 w-full">
            {/* Size Button */}
            <button
              onClick={scrollToSizes}
              className="flex items-center justify-center gap-1.5 px-3 h-11 font-label-caps text-label-caps text-[11px] tracking-wider transition-all duration-200 cursor-pointer rounded-[8px] border bg-white focus:outline-none"
              style={{
                borderColor: `${buttonColor}50`,
                color: buttonColor,
                background: `${buttonColor}08`,
                minWidth: "75px"
              }}
              title="Change size"
            >
              <Ruler size={15} />
              <span>{selectedSize}</span>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart()}
              className="animate-atc-glow flex-1 h-11 text-white font-label-caps text-label-caps uppercase flex items-center justify-center gap-2 rounded-[8px] cursor-pointer active:scale-95 transition-all text-xs font-bold focus:outline-none"
              style={{
                backgroundColor: buttonColor,
                // @ts-ignore
                "--atc-glow-color": `${buttonColor}73`,
                // @ts-ignore
                "--atc-glow-ring": `${buttonColor}26`,
              }}
            >
              <ShoppingBag size={16} />
              <span>Add to cart</span>
            </button>
          </div>

          {/* Desktop Layout: Full details shown only on desktop */}
          <div className="hidden md:flex items-center justify-center gap-5 w-full">
            {/* Thumbnail + title */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="w-14 h-14 rounded-full overflow-hidden relative flex-shrink-0"
                style={{ border: `2px solid ${buttonColor}40`, boxShadow: `0 0 0 3px ${buttonColor}18` }}
              >
                <Image
                  src={productImages[activeImageIndex] || product.featuredImage}
                  alt={product.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-primary">{product.title}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px] mt-0.5">{selectedColor}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-outline-variant/30 flex-shrink-0" />

            {/* Size chip */}
            <button
              onClick={scrollToSizes}
              className="flex items-center gap-1.5 px-3 h-9 font-label-caps text-label-caps text-[11px] tracking-wider transition-all duration-200 flex-shrink-0 cursor-pointer focus:outline-none"
              style={{
                borderRadius: 6,
                border: `1.5px solid ${buttonColor}50`,
                color: buttonColor,
                background: `${buttonColor}0D`,
              }}
              title="Change size"
            >
              <Ruler size={14} />
              {selectedSize}
            </button>

            {/* Divider */}
            <div className="h-8 w-px bg-outline-variant/30 flex-shrink-0" />

            {/* Quantity */}
            <div
              className="flex items-center h-12 flex-shrink-0"
              style={{
                borderRadius: 8,
                border: `1.5px solid ${buttonColor}30`,
                background: "rgba(255,255,255,0.6)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-full flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none"
                style={{ color: "rgba(15, 27, 45, 0.6)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = buttonColor;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(15, 27, 45, 0.6)";
                }}
              >
                <Minus size={14} />
              </button>
              <span
                className="w-8 text-center font-label-caps text-label-caps text-sm select-none"
                style={{ color: buttonColor }}
              >{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-full flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none"
                style={{ color: "rgba(15, 27, 45, 0.6)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = buttonColor;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(15, 27, 45, 0.6)";
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-outline-variant/30 flex-shrink-0" />

            {/* ATC Button */}
            <motion.button
              onClick={() => handleAddToCart()}
              whileHover="hover"
              initial="initial"
              className="animate-atc-glow sticky-atc-btn h-12 px-8 text-white font-label-caps text-label-caps uppercase flex items-center gap-2 transition-all duration-200 active:scale-95 flex-shrink-0 cursor-pointer focus:outline-none"
              style={{
                backgroundColor: buttonColor,
                borderRadius: 8,
                // @ts-ignore
                "--atc-glow-color": `${buttonColor}73`,
                // @ts-ignore
                "--atc-glow-ring": `${buttonColor}26`,
              }}
            >
              <ShoppingBag size={18} />
              <AnimatedLabel text="Add to cart" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── Recommended Products ─── */}
      <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop mt-16 mb-8">
        {/* Section header */}
        <div className="flex items-end justify-between border-b border-outline-variant/20 pb-4 mb-8">
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-widest">YOU MAY ALSO LIKE</span>
            <h2 className="font-display-md text-display-md text-primary uppercase">Recommended products</h2>
          </div>
          <Link
            href="/products/ringer-tee"
            className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-wider underline underline-offset-4 hover:text-primary transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {RECOMMENDED_VARIANTS.filter((v) => v.slug !== id).slice(0, 6).map((variant) => {
            const info = getColorVariantInfo(variant.slug);
            return (
              <Link
                key={variant.slug}
                href={`/products/ringer-tee?variant=${variant.slug}`}
                className="group flex flex-col"
              >
                {/* Image */}
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low"
                  style={{ borderRadius: "20px" }}
                >
                  <Image
                    src={variant.image}
                    alt={`THE RINGER TEE – ${variant.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:blur-[2px] ${
                      !info.inStock ? "opacity-60 grayscale-[30%]" : ""
                    }`}
                    loading="lazy"
                  />

                  {/* Top Left Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    {!info.inStock && (
                      <span
                        className="font-label-caps text-[8px] px-2.5 py-1 font-bold tracking-widest uppercase text-white animate-fade-in"
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
                        className="font-label-caps text-[8px] px-2.5 py-1 font-bold tracking-widest uppercase text-white animate-fade-in"
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

                  {/* Discount badge */}
                  {variant.discount && (
                    <span
                      className="absolute top-3 right-3 font-label-caps text-[10px] tracking-wider px-2 py-1"
                      style={{
                        background: "rgba(79,120,80,0.88)",
                        color: "#fff",
                        borderRadius: "999px",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {variant.discount}
                    </span>
                  )}

                  {/* Glass Quick Add overlay (Centered, Desktop only hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto hidden md:flex">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (info.inStock) {
                          addToCart(product, info.variantId);
                        }
                      }}
                      disabled={!info.inStock}
                      className="group/btn relative overflow-hidden h-10 w-[120px] hover:w-10 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-out cursor-pointer pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span className="font-label-caps text-label-caps text-[9px] tracking-widest font-bold transition-all duration-300 whitespace-nowrap opacity-100 scale-100 group-hover/btn:opacity-0 group-hover/btn:scale-75 absolute">
                        Quick Shop
                      </span>
                      {/* Icon container */}
                      <span className="opacity-0 scale-75 transition-all duration-300 absolute group-hover/btn:opacity-100 group-hover/btn:scale-100 flex items-center justify-center">
                        <ShoppingBag size={16} />
                      </span>
                    </button>
                  </div>
                </div>

              {/* Info */}
              <div className="flex flex-col pt-2.5 px-0.5">
                <span className="font-label-caps text-[9px] text-on-surface-variant tracking-widest">THE RINGER TEE</span>
                <h3 className="font-body-md text-body-md text-primary font-semibold mt-0.5 truncate text-sm">{variant.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-label-caps text-label-caps text-primary text-[11px]">
                    LE 700.00
                  </span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant/40 line-through">
                    LE 875.00
                  </span>
                  <span className="bg-[#C28a5c]/10 text-[#C28a5c] font-label-caps text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wider">
                    20% OFF
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsSizeGuideOpen(false)}
            className="absolute inset-0 bg-[#0F1B2D]/60 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Content */}
          <div
            className="relative bg-[#F7F6F2] rounded-[32px] border border-white/20 shadow-2xl w-full max-w-2xl overflow-hidden p-6 md:p-8 flex flex-col gap-6 z-10 animate-fade-in-up"
            style={{
              boxShadow: "0 24px 64px rgba(15, 27, 45, 0.25)"
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
              <h3 className="font-label-caps text-md tracking-widest text-[#0F1B2D] font-bold uppercase">
                SIZE GUIDE
              </h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-neutral-500 hover:text-black transition-colors cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-200"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Wrapper */}
            <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-inner border border-outline-variant/10">
              <Image
                src="/assets/BLACK_JERSEY_b292c9fc-840f-4ff0-ad53-a5eeeb4f7c4f.webp"
                alt="Jarvis Size Chart"
                fill
                className="object-contain p-4"
              />
            </div>
            
            <p className="font-label-caps text-[9px] text-neutral-400 tracking-wider uppercase text-center">
              All measurements are in centimeters (cm). If you are between sizes, we recommend sizing up.
            </p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md animate-fade-in">
          {/* Header Controls */}
          <div className="flex justify-between items-center px-6 py-4 z-10 text-white border-b border-white/10">
            <span className="font-label-caps text-xs tracking-widest uppercase">
              Image {activeImageIndex + 1} of {productImages.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLightboxZoom(Math.max(1, lightboxZoom - 0.5))}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-white disabled:opacity-50"
                title="Zoom Out"
                disabled={lightboxZoom === 1}
              >
                <Minus size={20} />
              </button>
              <span className="font-mono text-sm w-12 text-center select-none">
                {Math.round(lightboxZoom * 100)}%
              </span>
              <button
                onClick={() => setLightboxZoom(Math.min(3, lightboxZoom + 0.5))}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-white disabled:opacity-50"
                title="Zoom In"
                disabled={lightboxZoom === 3}
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => {
                  setLightboxZoom(1);
                  setIsLightboxOpen(false);
                }}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-white"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Zoom Area */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
            {/* Left navigation arrow */}
            {productImages.length > 1 && (
              <button
                onClick={() => {
                  setLightboxZoom(1);
                  setActiveImageIndex((activeImageIndex - 1 + productImages.length) % productImages.length);
                }}
                className="absolute left-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Right navigation arrow */}
            {productImages.length > 1 && (
              <button
                onClick={() => {
                  setLightboxZoom(1);
                  setActiveImageIndex((activeImageIndex + 1) % productImages.length);
                }}
                className="absolute right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Interactive Image Container */}
            <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl select-none">
              <motion.div
                className="relative w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                drag={lightboxZoom > 1}
                dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
                style={{ scale: lightboxZoom }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Image
                  src={productImages[activeImageIndex]}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                  draggable={false}
                />
              </motion.div>
            </div>
          </div>

          {/* Thumbnail Strip at bottom */}
          <div className="py-4 bg-black/40 border-t border-white/10 overflow-x-auto flex justify-center gap-3 px-6 hide-scrollbar">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setLightboxZoom(1);
                  setActiveImageIndex(idx);
                }}
                className={`w-14 h-18 relative rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImageIndex === idx ? "border-white scale-105" : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Lightbox thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
