"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingBag, ArrowRight, Share2, Trash2, Check } from "lucide-react";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { dummyProducts } from "@/data/dummyData";

export default function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
    wishlistCount,
    clearWishlist,
    importSharedItems,
    showToast,
  } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const [sharedWishlist, setSharedWishlist] = useState<WishlistItem[] | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Check URL parameters for shared wishlist
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get("shared");
      if (shared) {
        try {
          // Format: handle1:variantId1,handle2:variantId2
          const parts = shared.split(",");
          const matchedItems: WishlistItem[] = [];

          parts.forEach((part) => {
            const [handle, variantId] = part.split(":");
            if (handle) {
              const product = dummyProducts.find((p) => p.handle === handle);
              if (product) {
                const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
                matchedItems.push({
                  id: variant?.id || product.id,
                  product,
                  selectedColor: variant?.options?.Color || "",
                  selectedImage: variant?.image || product.featuredImage,
                  variantId: variant?.id || "",
                });
              }
            }
          });

          if (matchedItems.length > 0) {
            setSharedWishlist(matchedItems);
          }
        } catch (e) {
          console.error("Failed to parse shared wishlist link", e);
        }
      }
    }
  }, []);

  const handleShare = () => {
    if (wishlistItems.length === 0) return;
    const itemsStr = wishlistItems
      .map((item) => `${item.product.handle}:${item.variantId || ""}`)
      .join(",");
    const shareUrl = `${window.location.origin}/wishlist?shared=${encodeURIComponent(itemsStr)}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      showToast("Wishlist link copied to clipboard!", "success");
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const handleMoveAllToCart = () => {
    const activeItems = sharedWishlist || wishlistItems;
    if (activeItems.length === 0) return;

    let count = 0;
    activeItems.forEach((item) => {
      // Find variant details or default to first
      const firstAvailable = item.product.variants.find((v) => v.available);
      const variantId = item.variantId || firstAvailable?.id;
      if (variantId) {
        addToCart(item.product, variantId, 1, false); // add without opening drawer
        count++;
      }
    });

    if (count > 0) {
      showToast(`Added ${count} items to your shopping cart`, "success");
      setIsCartOpen(true);
    }
  };

  const getColorSlug = (color?: string) => {
    if (!color) return "";
    const colorMap: { [key: string]: string } = {
      "Black / White": "black-white",
      "Creamy / Olive": "creamy-olive",
      "Creamy / Burgundy": "creamy-burgundy",
      "Olive / White": "olive-white",
      "Rose / White": "rose-white",
      "Army / White": "army-white",
      "Burgundy / White": "burgundy-white",
    };
    return colorMap[color] || "";
  };

  const handleQuickAdd = (e: React.MouseEvent, item: WishlistItem) => {
    e.preventDefault();
    e.stopPropagation();
    const firstAvailable = item.product.variants.find((v) => v.available);
    const variantId = item.variantId || firstAvailable?.id || "";
    if (variantId) {
      addToCart(item.product, variantId);
    }
  };

  // Determine current active display items
  const displayItems = sharedWishlist || wishlistItems;
  const isSharedMode = sharedWishlist !== null;

  return (
    <div className="w-full bg-[#F7F6F2] min-h-[85vh] py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Shared Banner */}
        {isSharedMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#C28a5c]/10 border border-[#C28a5c]/30 rounded-3xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C28a5c]/20 flex items-center justify-center text-[#C28a5c]">
                <Heart size={20} className="animate-pulse" fill="#C28a5c" />
              </div>
              <div>
                <h4 className="font-label-caps font-bold text-xs tracking-wider text-[#0F1B2D]">
                  SHARED WISHLIST VIEW
                </h4>
                <p className="font-body-md text-xs text-on-surface-variant/80 mt-0.5">
                  You are viewing a shared collection. Save it to your own list or browse their selections.
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap w-full md:w-auto justify-end">
              <button
                onClick={() => {
                  importSharedItems(sharedWishlist);
                  // Clear query param
                  window.history.replaceState({}, "", "/wishlist");
                  setSharedWishlist(null);
                }}
                className="flex-1 md:flex-none bg-[#0F1B2D] hover:bg-[#C28a5c] text-white font-label-caps text-[10px] tracking-widest uppercase px-6 py-3 rounded-xl transition-colors font-bold cursor-pointer text-center"
              >
                Save to My Wishlist
              </button>
              <button
                onClick={() => {
                  // Clear query param
                  window.history.replaceState({}, "", "/wishlist");
                  setSharedWishlist(null);
                }}
                className="flex-1 md:flex-none bg-white hover:bg-neutral-50 border border-neutral-300 text-[#0F1B2D] font-label-caps text-[10px] tracking-widest uppercase px-6 py-3 rounded-xl transition-all font-bold text-center cursor-pointer"
              >
                Go to My Wishlist
              </button>
            </div>
          </motion.div>
        )}

        {/* Wishlist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16 border-b border-outline-variant/20 pb-6">
          <div className="flex flex-col gap-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px] md:text-xs">
              {isSharedMode ? "SHARED PLAYLIST" : "YOUR COLLECTION"}
            </span>
            <div className="flex items-baseline gap-3">
              <h1 className="font-display-md text-display-md text-[#0F1B2D] uppercase font-bold tracking-tight">
                Wishlist
              </h1>
              <span className="font-label-caps text-sm text-on-surface-variant/75 font-semibold">
                ({displayItems.length} {displayItems.length === 1 ? "ITEM" : "ITEMS"})
              </span>
            </div>
          </div>

          {/* Bulk Controls */}
          {displayItems.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              {!isSharedMode && (
                <button
                  onClick={handleShare}
                  disabled={isCopied}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-neutral-300 hover:border-[#C28a5c] hover:text-[#C28a5c] text-[#0F1B2D] font-label-caps text-[10.5px] tracking-widest uppercase rounded-xl font-bold transition-all cursor-pointer focus:outline-none shadow-sm"
                >
                  {isCopied ? <Check size={14} /> : <Share2 size={14} />}
                  <span>{isCopied ? "Copied" : "Share List"}</span>
                </button>
              )}

              <button
                onClick={handleMoveAllToCart}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0F1B2D] hover:bg-[#1C2D42] text-white font-label-caps text-[10.5px] tracking-widest uppercase rounded-xl font-bold transition-colors cursor-pointer focus:outline-none shadow-md"
              >
                <ShoppingBag size={14} />
                <span>Move All to Cart</span>
              </button>

              {!isSharedMode && (
                <button
                  onClick={clearWishlist}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 font-label-caps text-[10.5px] tracking-widest uppercase rounded-xl font-bold transition-colors cursor-pointer focus:outline-none"
                  title="Clear Wishlist"
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Wishlist Grid */}
        <AnimatePresence mode="popLayout">
          {displayItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto"
            >
              <div className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm border border-neutral-200/40 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                  <Heart size={36} className="text-[#C28a5c]" strokeWidth={1.5} />
                </motion.div>
              </div>
              <h2 className="font-label-caps text-md tracking-wider text-[#0F1B2D] font-bold uppercase mb-2">
                Your wishlist is empty
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant/80 mb-8 max-w-sm">
                Explore our collection and add your favorite pieces to save them here for later.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#0F1B2D] hover:bg-[#C28a5c] text-white px-8 py-4 font-label-caps text-label-caps uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter"
            >
              <AnimatePresence>
                {displayItems.map((item) => {
                  const colorVariants = item.selectedColor
                    ? item.product.variants.filter((v) => v.options.Color === item.selectedColor)
                    : item.product.variants;
                  const firstAvailable = colorVariants.find((v) => v.available);
                  const isAvailable = !!firstAvailable || colorVariants.length === 0;

                  const getVariantStockCount = (variantId?: string, available?: boolean) => {
                    if (!available || !variantId) return 0;
                    if (variantId.endsWith("_s") || variantId.endsWith("_xl")) return 3;
                    if (variantId.endsWith("_l")) return 4;
                    return 15;
                  };
                  const stockCount = firstAvailable ? getVariantStockCount(firstAvailable.id, firstAvailable.available) : 0;

                  const colorSlug = getColorSlug(item.selectedColor);
                  const detailHref = colorSlug
                    ? `/products/${item.product.handle}?variant=${colorSlug}`
                    : `/products/${item.product.handle}`;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85, y: 15 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="group flex flex-col h-full bg-white p-3 rounded-[32px] border border-neutral-200/40 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      {/* Remove Button */}
                      {!isSharedMode && (
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-[#ba1a1a] hover:text-white text-[#0F1B2D] border border-neutral-200/40 flex items-center justify-center shadow-sm cursor-pointer transition-all duration-200 focus:outline-none"
                          aria-label="Remove from wishlist"
                        >
                          <X size={15} />
                        </button>
                      )}

                      {/* Image Container */}
                      <Link
                        href={detailHref}
                        className="relative overflow-hidden aspect-[3/4] w-full bg-surface-container-low"
                        style={{
                          borderRadius: "24px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Image
                          src={item.selectedImage || item.product.featuredImage}
                          alt={item.product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={`object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:blur-[2px] ${
                            !isAvailable ? "opacity-60 grayscale-[30%]" : ""
                          }`}
                          loading="lazy"
                        />

                        {/* Top Left Badges */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                          {!isAvailable && (
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
                          {isAvailable && stockCount <= 5 && (
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

                        {/* Quick Add Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto hidden md:flex">
                          <button
                            onClick={(e) => handleQuickAdd(e, item)}
                            disabled={!isAvailable}
                            className="group/btn relative overflow-hidden h-11 w-[120px] hover:w-11 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-out cursor-pointer pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              background: "rgba(194, 138, 92, 0.4)", // copper frosted glass
                              backdropFilter: "blur(12px)",
                              WebkitBackdropFilter: "blur(12px)",
                              border: "1.5px solid rgba(255, 255, 255, 0.25)",
                              boxShadow: "0 8px 32px rgba(15, 27, 45, 0.15)",
                            }}
                            title="Quick Add to Cart"
                          >
                            <span className="font-label-caps text-label-caps text-[10px] tracking-widest font-bold transition-all duration-300 whitespace-nowrap opacity-100 scale-100 group-hover/btn:opacity-0 group-hover/btn:scale-75 absolute">
                              Quick Add
                            </span>
                            <span className="opacity-0 scale-75 transition-all duration-300 absolute group-hover/btn:opacity-100 group-hover/btn:scale-100 flex items-center justify-center">
                              <ShoppingBag size={16} />
                            </span>
                          </button>
                        </div>
                      </Link>

                      {/* Card Info & Actions */}
                      <div className="flex flex-col pt-3 px-1 flex-1 justify-between">
                        <div>
                          <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider text-[10px]">
                            {item.selectedColor || "THE RINGER TEE"}
                          </span>
                          <Link href={detailHref}>
                            <h3 className="font-body-lg text-body-lg text-primary font-bold uppercase mt-1 hover:text-[#C28a5c] transition-colors">
                              {item.product.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="font-label-caps text-label-caps text-primary font-semibold">
                              LE {item.product.price.toFixed(2)}
                            </span>
                            <span className="font-label-caps text-[10px] text-on-surface-variant/40 line-through">
                              LE {(item.product.price / 0.8).toFixed(2)}
                            </span>
                            <span className="bg-[#C28a5c]/10 text-[#C28a5c] font-label-caps text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wider">
                              20% OFF
                            </span>
                          </div>
                        </div>

                        {/* Bottom Action Button (mobile friendly) */}
                        <div className="mt-4 w-full">
                          {isAvailable ? (
                            <button
                              onClick={(e) => handleQuickAdd(e, item)}
                              className="w-full py-3 bg-[#0F1B2D] hover:bg-[#1C2D42] text-white font-label-caps text-[10.5px] tracking-widest uppercase rounded-[8px] transition-colors font-bold text-center cursor-pointer focus:outline-none flex items-center justify-center gap-2"
                            >
                              <ShoppingBag size={14} />
                              <span>Add to Cart</span>
                            </button>
                          ) : (
                            <Link
                              href={detailHref}
                              className="w-full py-3 bg-white hover:bg-neutral-50 text-[#0F1B2D] border border-neutral-300 font-label-caps text-[10.5px] tracking-widest uppercase rounded-[8px] transition-all font-bold text-center block"
                            >
                              View Product
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
