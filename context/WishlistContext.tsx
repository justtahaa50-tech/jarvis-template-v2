"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/dummyData";

export interface WishlistItem {
  id: string; // unique identifier: variantId or productId
  product: Product;
  selectedColor?: string;
  selectedImage?: string;
  variantId?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "cart" | "wishlist" | "success" | "info";
  image?: string;
  actionLink?: string;
  actionLabel?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  toggleWishlist: (
    product: Product,
    variantId?: string,
    selectedColor?: string,
    selectedImage?: string
  ) => void;
  isInWishlist: (productId: string, variantId?: string) => boolean;
  removeFromWishlist: (itemId: string) => void;
  clearWishlist: () => void;
  importSharedItems: (items: WishlistItem[]) => void;
  toasts: Toast[];
  showToast: (
    message: string,
    type: "cart" | "wishlist" | "success" | "info",
    image?: string,
    actionLink?: string,
    actionLabel?: string
  ) => void;
  dismissToast: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load wishlist from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jarvis_wishlist_v2");
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      } else {
        // Fallback to legacy wishlist structure if present
        const legacy = localStorage.getItem("jarvis_wishlist");
        if (legacy) {
          const parsed = JSON.parse(legacy);
          const converted: WishlistItem[] = parsed.map((p: Product) => ({
            id: p.variants[0]?.id || p.id,
            product: p,
            selectedColor: p.variants[0]?.options?.Color || "",
            selectedImage: p.featuredImage,
            variantId: p.variants[0]?.id || "",
          }));
          setWishlistItems(converted);
          localStorage.setItem("jarvis_wishlist_v2", JSON.stringify(converted));
        }
      }
    } catch (e) {
      console.error("Failed to load wishlist from localStorage", e);
    }
  }, []);

  const saveWishlist = (items: WishlistItem[]) => {
    setWishlistItems(items);
    try {
      localStorage.setItem("jarvis_wishlist_v2", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  };

  // Toast Helpers
  const showToast = (
    message: string,
    type: "cart" | "wishlist" | "success" | "info",
    image?: string,
    actionLink?: string,
    actionLabel?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, image, actionLink, actionLabel };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleWishlist = (
    product: Product,
    variantId?: string,
    selectedColor?: string,
    selectedImage?: string
  ) => {
    // Resolve variant id
    const resolvedVariantId = variantId || product.variants.find((v) => v.available)?.id || product.variants[0]?.id || product.id;
    const resolvedColor = selectedColor || product.variants.find((v) => v.id === resolvedVariantId)?.options?.Color || "";
    const resolvedImage = selectedImage || product.variants.find((v) => v.id === resolvedVariantId)?.image || product.featuredImage;

    const existsIndex = wishlistItems.findIndex((item) => item.variantId === resolvedVariantId);

    if (existsIndex > -1) {
      const removedItem = wishlistItems[existsIndex];
      const newItems = wishlistItems.filter((_, idx) => idx !== existsIndex);
      saveWishlist(newItems);
      showToast(
        `Removed ${product.title} (${resolvedColor}) from Wishlist`,
        "wishlist",
        resolvedImage
      );
    } else {
      const newItem: WishlistItem = {
        id: resolvedVariantId,
        product,
        selectedColor: resolvedColor,
        selectedImage: resolvedImage,
        variantId: resolvedVariantId,
      };
      const newItems = [...wishlistItems, newItem];
      saveWishlist(newItems);
      showToast(
        `Added ${product.title} (${resolvedColor}) to Wishlist`,
        "wishlist",
        resolvedImage,
        "/wishlist",
        "View Wishlist"
      );
    }
  };

  const isInWishlist = (productId: string, variantId?: string) => {
    if (variantId) {
      return wishlistItems.some((item) => item.variantId === variantId);
    }
    return wishlistItems.some((item) => item.product.id === productId);
  };

  const removeFromWishlist = (itemId: string) => {
    const item = wishlistItems.find((i) => i.id === itemId);
    const newItems = wishlistItems.filter((i) => i.id !== itemId);
    saveWishlist(newItems);
    if (item) {
      showToast(
        `Removed ${item.product.title} from Wishlist`,
        "wishlist",
        item.selectedImage
      );
    }
  };

  const clearWishlist = () => {
    if (wishlistItems.length === 0) return;
    saveWishlist([]);
    showToast("Cleared all items from Wishlist", "info");
  };

  const importSharedItems = (items: WishlistItem[]) => {
    // Merge new items in, avoiding duplicate variantIds
    const merged = [...wishlistItems];
    let addedCount = 0;
    items.forEach((item) => {
      if (!merged.some((m) => m.variantId === item.variantId)) {
        merged.push(item);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      saveWishlist(merged);
      showToast(`Imported ${addedCount} shared items to your Wishlist`, "success");
    } else {
      showToast("All shared items are already in your Wishlist", "info");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        importSharedItems,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
