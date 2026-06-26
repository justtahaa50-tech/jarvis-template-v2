"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/dummyData";

export interface CartItem {
  id: string; // unique item id: variantId
  product: Product;
  variantTitle: string;
  quantity: number;
  price: number;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
  addToCart: (product: Product, variantId: string, quantity?: number, openCart?: boolean) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart items from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jarvis_cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart items to localStorage on changes after initial mount
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("jarvis_cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: Product, variantId: string, quantity = 1, openCart = true) => {
    setCartItems((prevItems) => {
      // Find variant details
      const variant = product.variants.find(v => v.id === variantId);
      const variantTitle = variant ? variant.title : "One Size";
      const price = variant ? variant.price : product.price;

      const existingIndex = prevItems.findIndex(item => item.id === variantId);
      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }
      
      return [...prevItems, {
        id: variantId || product.id,
        product,
        variantTitle,
        quantity,
        price
      }];
    });
    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 1500; // LE 1500

  return (
    <CartContext.Provider value={{
      isCartOpen,
      setIsCartOpen,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartCount,
      cartSubtotal,
      freeShippingThreshold
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
