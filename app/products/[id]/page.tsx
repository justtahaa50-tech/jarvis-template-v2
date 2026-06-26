"use client";

import React, { use, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { dummyProducts } from "@/data/dummyData";
import { useCart } from "@/context/CartContext";
import Accordion from "@/components/Accordion";

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

  const handleAddToCart = () => {
    if (!product) return;
    const variantId = activeVariant?.id || product.id;
    addToCart(product, variantId, quantity);
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-gutter">
        
        {/* Product Gallery (Left) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 h-[614px] lg:h-[870px] lg:sticky lg:top-[120px]">
          {/* Desktop Vertical Photo Indexing (Next to thumbnails on the left) */}
          {productImages.length > 1 && (
            <div className="hidden md:flex flex-col gap-4 items-center justify-center py-5 px-3 rounded-full select-none h-fit my-auto"
              style={{
                backdropFilter: "blur(20px)",
                background: "rgba(15, 27, 45, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)"
              }}
            >
              {productImages.map((_, idx) => {
                const isActive = activeImageIndex === idx;
                const numStr = (idx + 1).toString().padStart(2, '0');
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`font-mono transition-all duration-300 ${
                      isActive
                        ? "text-[#F7F6F2] text-sm font-bold scale-110"
                        : "text-[#F7F6F2]/50 text-[10px] hover:text-[#F7F6F2]"
                    }`}
                  >
                    {numStr}
                  </button>
                );
              })}
            </div>
          )}

          {/* Desktop Thumbnails */}
          <div className="hidden md:flex flex-col gap-4 overflow-y-auto hide-scrollbar w-24 flex-shrink-0">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-full aspect-[3/4] relative overflow-hidden transition-all duration-300 rounded-2xl border ${
                  activeImageIndex === idx ? "opacity-100" : "border-white/20 opacity-70 hover:opacity-100 bg-white/5 backdrop-blur-sm"
                }`}
                style={
                  activeImageIndex === idx
                    ? {
                        borderColor: buttonColor,
                        backgroundColor: `${buttonColor}12`,
                        boxShadow: `0 4px 12px ${buttonColor}40`
                      }
                    : {}
                }
              >
                <Image
                  src={img}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="w-full h-full bg-surface-container relative overflow-hidden flex-1 rounded-[24px] border border-outline-variant/10 shadow-sm">
            {productImages[activeImageIndex] ? (
              <Image
                src={productImages[activeImageIndex]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-label-caps text-xs">
                No Image
              </div>
            )}
            
            {/* Mobile Vertical Photo Indexing Overlay */}
            {productImages.length > 1 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 items-center justify-center py-4 px-3 rounded-full select-none md:hidden"
                style={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(15, 27, 45, 0.45)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)"
                }}
              >
                {productImages.map((_, idx) => {
                  const isActive = activeImageIndex === idx;
                  const numStr = (idx + 1).toString().padStart(2, '0');
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`font-mono transition-all duration-300 ${
                        isActive
                          ? "text-[#F7F6F2] text-sm font-bold scale-110"
                          : "text-[#F7F6F2]/50 text-[10px] hover:text-[#F7F6F2]"
                      }`}
                    >
                      {numStr}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Product Info & Cart Form (Right) */}
        <div className="lg:col-span-5 px-margin-mobile lg:px-margin-desktop lg:pr-margin-desktop lg:pl-0 pt-8 lg:pt-0 flex flex-col gap-stack-lg">
          
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
            <div className="font-display-md text-display-md text-primary mt-2">
              LE {product.price}
            </div>
            <div className="flex items-center gap-2 mt-2">
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
              <span className="material-symbols-outlined">local_shipping</span>
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
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-outline-variant/30 h-14 w-1/3 bg-surface-container-lowest">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-full text-center font-label-caps text-label-caps">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                {/* Add To Cart */}
                <motion.button
                  ref={atcButtonRef}
                  onClick={handleAddToCart}
                  whileHover="hover"
                  initial="initial"
                  style={{ borderColor: buttonColor, color: buttonColor }}
                  className="flex-1 h-14 bg-surface-container-lowest border font-label-caps text-label-caps uppercase flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all duration-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <AnimatedLabel text="Add to Cart" />
                </motion.button>
              </div>
              
              {/* Buy Now */}
              <button
                onClick={() => {
                  handleAddToCart();
                  setIsCartOpen(true);
                }}
                style={{ backgroundColor: buttonColor }}
                className="w-full h-14 text-white font-label-caps text-label-caps uppercase hover:opacity-90 transition-all duration-300"
              >
                Buy it now
              </button>
            </div>

          </div>

          {/* Trust Strip */}
          <div className="flex justify-center gap-6 py-4 border-y border-outline-variant/20 mt-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
              <span className="font-label-caps text-label-caps text-[10px]">On-time delivery</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">shield</span>
              <span className="font-label-caps text-label-caps text-[10px]">Secure checkout</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">sync</span>
              <span className="font-label-caps text-label-caps text-[10px]">Easy exchange</span>
            </div>
          </div>

          {/* Collapsible Accordions */}
          <div className="flex flex-col border-b border-outline-variant/20">
            <Accordion title="Details" iconName="checkroom" defaultOpen={true} iconColor={buttonColor}>
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
          className="relative w-full max-w-[900px] mx-auto px-margin-mobile md:px-8 flex items-center justify-center gap-5 py-4"
          style={{ zIndex: 2, minHeight: 72 }}
        >
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
          <div className="h-8 w-px bg-outline-variant/30 flex-shrink-0 hidden sm:block" />

          {/* Size chip */}
          <button
            onClick={scrollToSizes}
            className="flex items-center gap-1.5 px-3 h-9 font-label-caps text-label-caps text-[11px] tracking-wider transition-all duration-200 flex-shrink-0 cursor-pointer"
            style={{
              borderRadius: 6,
              border: `1.5px solid ${buttonColor}50`,
              color: buttonColor,
              background: `${buttonColor}0D`,
            }}
            title="Change size"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>straighten</span>
            {selectedSize}
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-outline-variant/30 flex-shrink-0 hidden sm:block" />

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
              className="w-11 h-full flex items-center justify-center font-bold text-lg transition-all duration-200 cursor-pointer"
              style={{ color: "rgba(15,27,45,0.45)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${buttonColor}18`; e.currentTarget.style.color = buttonColor; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(15,27,45,0.45)"; }}
            >−</button>
            <span
              className="w-8 text-center font-label-caps text-label-caps text-sm select-none"
              style={{ color: buttonColor }}
            >{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-11 h-full flex items-center justify-center font-bold text-lg transition-all duration-200 cursor-pointer"
              style={{ color: "rgba(15,27,45,0.45)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${buttonColor}18`; e.currentTarget.style.color = buttonColor; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(15,27,45,0.45)"; }}
            >+</button>
          </div>

          {/* ATC Button */}
          <motion.button
            onClick={handleAddToCart}
            whileHover="hover"
            initial="initial"
            className="sticky-atc-btn h-12 px-8 text-white font-label-caps text-label-caps uppercase flex items-center gap-2 transition-all duration-200 active:scale-95 flex-shrink-0 cursor-pointer"
            style={{
              backgroundColor: buttonColor,
              borderRadius: 8,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_bag</span>
            <AnimatedLabel text="Add to cart" />
          </motion.button>
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
          {RECOMMENDED_VARIANTS.filter((v) => v.slug !== id).slice(0, 6).map((variant) => (
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
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />

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

                {/* Hover quick-shop pill */}
                <div className="absolute inset-x-3 bottom-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250 ease-out pointer-events-none group-hover:pointer-events-auto">
                  <div
                    className="w-full py-2 text-center font-label-caps text-primary text-[10px] tracking-widest"
                    style={{
                      backdropFilter: "blur(20px)",
                      background: "rgba(255,255,255,0.80)",
                      border: "1px solid rgba(255,255,255,0.50)",
                      borderRadius: "12px",
                    }}
                  >
                    QUICK SHOP
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col pt-2.5 px-0.5">
                <span className="font-label-caps text-[9px] text-on-surface-variant tracking-widest">THE RINGER TEE</span>
                <h3 className="font-body-md text-body-md text-primary font-semibold mt-0.5 truncate text-sm">{variant.name}</h3>
                <span className="font-label-caps text-label-caps text-primary mt-1 text-[11px]">LE 700</span>
              </div>
            </Link>
          ))}
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
                <span className="material-symbols-outlined text-[20px]">close</span>
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
    </div>
  );
}
