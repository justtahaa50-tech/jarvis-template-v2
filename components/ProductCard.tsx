"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/dummyData";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import { Heart, Eye, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variantSlug?: string;
  variantName?: string;
  variantImage?: string;
  isListView?: boolean;
  gridCols?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variantSlug,
  variantName,
  variantImage,
  isListView = false,
  gridCols = 4,
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Find variant color name from variantSlug
  const colorMap: { [key: string]: string } = {
    "black-white": "Black / White",
    "creamy-olive": "Creamy / Olive",
    "creamy-burgundy": "Creamy / Burgundy",
    "olive-white": "Olive / White",
    "rose-white": "Rose / White",
    "army-white": "Army / White",
    "burgundy-white": "Burgundy / White",
  };
  const colorName = variantSlug ? colorMap[variantSlug] : undefined;
  
  const colorVariants = colorName
    ? product.variants.filter((v) => v.options.Color === colorName)
    : product.variants;

  const isAvailable = colorVariants.length > 0
    ? colorVariants.some((v) => v.available)
    : (product.variants.some((v) => v.available) || product.variants.length === 0);

  // Find first variant matching this color
  const matchedVariant = colorName 
    ? product.variants.find((v) => v.options.Color === colorName)
    : undefined;
    
  const activeVariantId = matchedVariant?.id || product.variants.find(v => v.available)?.id || product.variants[0]?.id;
  const activeColor = matchedVariant?.options?.Color || product.variants.find(v => v.id === activeVariantId)?.options?.Color || "";

  const isFavorite = isInWishlist(product.id, activeVariantId);

  // Helper to get stock count
  const getVariantStockCount = (variantId?: string, available?: boolean) => {
    if (!available || !variantId) return 0;
    if (variantId.endsWith("_s") || variantId.endsWith("_xl")) return 3;
    if (variantId.endsWith("_l")) return 4;
    return 15;
  };

  const firstAvailable = colorVariants.find((v) => v.available);
  const activeVariantStock = firstAvailable
    ? getVariantStockCount(firstAvailable.id, firstAvailable.available)
    : 0;

  const href = variantSlug
    ? `/products/${product.handle}?variant=${variantSlug}`
    : `/products/${product.handle}`;

  const displayImage = variantImage || product.featuredImage;
  const displayLabel = variantName || product.title;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product, activeVariantId, activeColor, displayImage);
  };

  const handleQuickShop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const firstAvailableVar = colorVariants.find((v) => v.available) || product.variants.find((v) => v.available);
    const variantId = firstAvailableVar ? firstAvailableVar.id : (product.variants[0]?.id || "");
    if (variantId) {
      addToCart(product, variantId);
    }
  };

  if (isListView) {
    return (
      <div className="group flex flex-col md:flex-row bg-white rounded-[24px] border border-neutral-100 hover:border-[#C28a5c]/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(15,27,45,0.05)] transition-all duration-300 overflow-hidden w-full gap-6 p-6">
        {/* Left Side: Image */}
        <Link href={href} className="relative overflow-hidden bg-surface-container-low aspect-[3/4] w-full md:w-[200px] lg:w-[240px] rounded-[18px] flex-shrink-0 block cursor-pointer">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={displayLabel}
              fill
              sizes="(max-width: 768px) 100vw, 240px"
              className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                !isAvailable ? "opacity-60 grayscale-[30%]" : ""
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center font-label-caps text-xs">
              No Image
            </div>
          )}

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {!isAvailable && (
              <span
                className="font-label-caps text-[8px] px-2.5 py-1 font-bold tracking-widest uppercase text-white"
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
            {isAvailable && activeVariantStock <= 5 && (
              <span
                className="font-label-caps text-[8px] px-2.5 py-1 font-bold tracking-widest uppercase text-white"
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
        </Link>

        {/* Right Side: Details & Actions */}
        <div className="flex flex-col justify-between flex-grow py-2">
          <div>
            {/* Title & Collection Name */}
            <div className="flex flex-col gap-1">
              <span className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] uppercase font-bold">
                RINGER TEE COLORWAY
              </span>
              <Link href={href} className="block cursor-pointer">
                <h3 className="font-display-sm text-xl md:text-2xl font-bold text-[#0F1B2D] uppercase group-hover:text-[#C28a5c] transition-colors leading-tight">
                  {displayLabel}
                </h3>
              </Link>
            </div>

            {/* Prices */}
            <div className="flex items-center gap-3 mt-2">
              <span className="font-label-caps text-base font-bold text-[#0F1B2D]">
                LE {product.price.toFixed(2)}
              </span>
              <span className="font-label-caps text-xs text-on-surface-variant/40 line-through">
                LE {(product.price / 0.8).toFixed(2)}
              </span>
              <span className="bg-[#C28a5c]/10 text-[#C28a5c] font-label-caps text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider">
                20% OFF
              </span>
            </div>

            {/* Description */}
            <p className="font-body-md text-sm text-[#0F1B2D]/70 mt-3 max-w-[600px] leading-relaxed">
              {product.description}
            </p>

            {/* Available Sizes preview */}
            <div className="flex flex-col gap-2 mt-4">
              <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/60 uppercase font-bold">
                Available Sizes
              </span>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((sz) => {
                  // Check if this color + size variant is available
                  const szVariant = product.variants.find(
                    (v) => v.options.Color === colorName && v.options.Size === sz
                  );
                  const isSzAvailable = szVariant?.available;
                  return (
                    <span
                      key={sz}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center font-label-caps text-[11px] font-bold transition-all ${
                        isSzAvailable
                          ? "border-[#0F1B2D]/30 text-[#0F1B2D] bg-[#F7F6F2] hover:border-[#C28a5c] hover:text-[#C28a5c]"
                          : "border-neutral-200 text-neutral-300 line-through bg-neutral-50/50"
                      }`}
                    >
                      {sz}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-neutral-100">
            {/* Quick Add Button */}
            <button
              onClick={handleQuickShop}
              disabled={!isAvailable}
              className="px-6 h-11 bg-[#0F1B2D] text-white font-label-caps text-[11px] tracking-widest font-bold rounded-full hover:bg-[#C28a5c] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ShoppingBag size={14} />
              <span>QUICK ADD TO CART</span>
            </button>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center text-[#0F1B2D] hover:text-[#ba1a1a] hover:border-[#ba1a1a] hover:bg-neutral-50 transition-all duration-200 cursor-pointer"
              title="Add to Wishlist"
            >
              <Heart
                size={18}
                className="transition-colors"
                fill={isFavorite ? "#ba1a1a" : "none"}
                color={isFavorite ? "#ba1a1a" : "currentColor"}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={href} className="group flex flex-col h-full">
      {/* Card Image Container */}
      <div
        className="relative overflow-hidden bg-surface-container-low aspect-[3/4] w-full"
        style={{ borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={displayLabel}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:blur-[2px] ${
              !isAvailable ? "opacity-60 grayscale-[30%]" : ""
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center font-label-caps text-xs">
            No Image
          </div>
        )}

        {/* Top Left Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {!isAvailable && (
            <span
              className="font-label-caps text-[9px] px-2.5 py-1 font-bold tracking-widest uppercase text-white"
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
          {isAvailable && activeVariantStock <= 5 && (
            <span
              className="font-label-caps text-[9px] px-2.5 py-1 font-bold tracking-widest uppercase text-white"
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
        <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto hidden md:flex`}>
          <button
            onClick={handleQuickShop}
            disabled={!isAvailable}
            className={`group/btn relative overflow-hidden h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-out cursor-pointer pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed ${
              gridCols >= 5 ? "w-12" : "w-[140px] hover:w-12"
            }`}
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
            <span className={`font-label-caps text-label-caps text-[11px] tracking-widest font-bold transition-all duration-300 whitespace-nowrap opacity-100 scale-100 group-hover/btn:opacity-0 group-hover/btn:scale-75 absolute ${
              gridCols >= 5 ? "hidden" : "block"
            }`}>
              Quick Shop
            </span>
            {/* Icon container */}
            <span className={`transition-all duration-300 absolute flex items-center justify-center ${
              gridCols >= 5 ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover/btn:opacity-100 group-hover/btn:scale-100"
            }`}>
              <ShoppingBag size={20} />
            </span>
          </button>
        </div>

        {/* Action Buttons Overlay (Centered horizontally near the bottom, shows on hover) */}
        <div className="absolute inset-x-0 bottom-8 flex justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          {/* Favorites Button */}
          <button
            onClick={handleFavorite}
            className={`rounded-full flex items-center justify-center bg-[#0F1B2D]/90 text-[#F7F6F2] hover:bg-[#C28a5c] transition-all duration-200 shadow-lg scale-90 group-hover:scale-100 hover:scale-105 pointer-events-auto cursor-pointer ${
              gridCols >= 5 ? "w-10 h-10" : "w-12 h-12"
            }`}
            aria-label="Add to favorites"
          >
            <Heart 
              size={gridCols >= 5 ? 16 : 20} 
              className="transition-colors" 
              fill={isFavorite ? "#ba1a1a" : "none"} 
              color={isFavorite ? "#ba1a1a" : "#F7F6F2"} 
            />
          </button>

          {/* Quick View Button (Eye) */}
          <div
            className={`rounded-full flex items-center justify-center bg-[#0F1B2D]/90 text-[#F7F6F2] hover:bg-[#C28a5c] transition-all duration-200 shadow-lg scale-90 group-hover:scale-100 hover:scale-105 pointer-events-auto ${
              gridCols >= 5 ? "w-10 h-10" : "w-12 h-12"
            }`}
            aria-label="View product details"
          >
            <Eye size={gridCols >= 5 ? 16 : 20} className="text-[#F7F6F2]" />
          </div>
        </div>

        {/* Subtle hover shadow increase via a pseudo-overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: "inset 0 -60px 40px -20px rgba(0,0,0,0.08)",
          }}
        />
      </div>

      {/* Card Info */}
      <div className="flex flex-col pt-3 px-1">
        <h3 className={`font-body-md text-primary truncate ${
          gridCols >= 5 ? "text-xs" : "text-body-md"
        }`}>
          {displayLabel}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`font-label-caps text-primary font-bold ${
            gridCols >= 5 ? "text-[11px]" : "text-label-caps"
          }`}>
            LE {product.price.toFixed(2)}
          </span>
          <span className={`font-label-caps text-on-surface-variant/40 line-through ${
            gridCols >= 5 ? "text-[9px]" : "text-[10px]"
          }`}>
            LE {(product.price / 0.8).toFixed(2)}
          </span>
          <span className={`bg-[#C28a5c]/10 text-[#C28a5c] font-label-caps font-bold tracking-wider rounded-full ${
            gridCols >= 5 ? "text-[8px] px-1.5 py-0.5" : "text-[9px] px-2 py-0.5"
          }`}>
            20% OFF
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
