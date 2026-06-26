"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/dummyData";
import { X } from "lucide-react";
import CartProgressBar from "@/components/CartProgressBar";

// Helper to create recommended products
const createDummyProduct = (id: string, handle: string, title: string, price: number, image: string, sizes: string[]): Product => {
  return {
    id,
    handle,
    title,
    price,
    description: `Premium ${title}`,
    featuredImage: image,
    images: [image],
    options: [{ name: "Size", values: sizes }],
    variants: sizes.map(size => ({
      id: `var_${id}_${size.toLowerCase().replace("-", "")}`,
      title: size,
      price,
      available: true,
      options: { "Size": size }
    })),
    tags: [title]
  };
};

const recDenimProduct = createDummyProduct("rec_denim", "light-denim", "Light Denim", 899, "/assets/OLIVE-WHITE/gogo-front_1.jpg", ["S-30", "M-32", "L-34", "XL-36"]);
const recPoloProduct = createDummyProduct("rec_polo", "knitted-polo", "Knitted Polo", 879, "/assets/BLACK/atef-front.jpg", ["S", "M", "L", "XL"]);
const recHoodieProduct = createDummyProduct("rec_hoodie", "classic-hoodie", "Classic Hoodie", 999, "/assets/CREAMY-OLIVE/nour-front_1.jpg", ["S", "M", "L", "XL"]);
const recCargoProduct = createDummyProduct("rec_cargo", "cargo-pants", "Cargo Pants", 950, "/assets/ARMY/atef-front_2.jpg", ["S-30", "M-32", "L-34", "XL-36"]);

const recommendedItems = [
  { product: recDenimProduct, compareAtPrice: 1150 },
  { product: recPoloProduct, compareAtPrice: 1100 },
  { product: recHoodieProduct, compareAtPrice: 1300 },
  { product: recCargoProduct, compareAtPrice: 1200 }
];

const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    addToCart,
    freeShippingThreshold,
    discountThreshold,
  } = useCart();

  // Carousel State
  const [activeRecIndex, setActiveRecIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [selectedRecSizes, setSelectedRecSizes] = useState<{ [key: string]: string }>({
    rec_denim: "S-30",
    rec_polo: "M",
    rec_hoodie: "M",
    rec_cargo: "M-32"
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedRecSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddRecommendation = (product: Product) => {
    const size = selectedRecSizes[product.id] || product.options[0].values[0];
    const variant = product.variants.find(v => v.options["Size"] === size) || product.variants[0];
    addToCart(product, variant.id);
  };

  const handlePrevRec = () => {
    setDirection(-1);
    setActiveRecIndex((prev) => (prev === 0 ? recommendedItems.length - 1 : prev - 1));
  };

  const handleNextRec = () => {
    setDirection(1);
    setActiveRecIndex((prev) => (prev === recommendedItems.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = (price: number) => {
    return `LE ${price.toLocaleString("en-EG", { minimumFractionDigits: 2 })}`;
  };

  const getSizeLabel = (variantTitle: string) => {
    const parts = variantTitle.split("/");
    return parts[parts.length - 1].trim();
  };

  // Motion variants for concurrent slide transition (using absolute positioning inside container)
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0
    })
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] z-50 flex flex-col bg-[#F9F8F6] border-l border-neutral-200 shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-200/60 flex justify-between items-center bg-[#F9F8F6]">
              <h2 className="font-sans text-lg font-medium text-neutral-800 tracking-normal capitalize flex items-center gap-2.5">
                Shopping cart
                {cartCount > 0 && (
                  <span className="bg-[#C28a5c]/10 text-[#C28a5c] text-[11px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 font-mono">
                    {cartCount}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-500 hover:text-black transition-colors p-1"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* If cart is empty, show empty state ONLY */}
            {cartCount === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center px-8 text-center bg-[#F9F8F6]">
                <h3 className="font-label-caps text-md tracking-widest text-[#1b1c1c] font-bold mb-8 uppercase">
                  YOUR CART IS EMPTY
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#1b1c1c] text-white font-label-caps text-xs py-4 uppercase tracking-widest hover:bg-neutral-800 transition-colors font-bold"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <>
                <CartProgressBar
                  cartSubtotal={cartSubtotal}
                  freeShippingThreshold={freeShippingThreshold}
                  discountThreshold={discountThreshold}
                />

                {/* Scrollable Content (Cart Items & Recommendations Card) */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 custom-scrollbar bg-[#F9F8F6]">

                  {/* Cart Items List */}
                  <div className="flex flex-col gap-6">
                    {cartItems.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        {idx > 0 && <div className="border-t border-neutral-200/40 my-1" />}
                        <div className="flex gap-3 group item-fade-in">
                          {/* Image */}
                          <div className="w-20 h-24 bg-[#F3F2EE] shrink-0 relative overflow-hidden rounded-[4px]">
                            <Image
                              src={item.product.featuredImage}
                              alt={item.product.title}
                              fill
                              sizes="80px"
                              className="object-cover mix-blend-multiply"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-col justify-between flex-1 py-0.5">
                            <div>
                              <h3 className="font-sans text-[13.5px] font-semibold text-neutral-900 leading-tight">
                                {item.product.title}
                              </h3>

                              {/* Size Badge */}
                              <div className="mt-1">
                                <span className="bg-black text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase">
                                  {getSizeLabel(item.variantTitle)}
                                </span>
                              </div>

                              {/* Price */}
                              <div className="flex gap-2 items-baseline mt-1">
                                <span className="text-[10.5px] text-neutral-400 line-through font-mono">
                                  {formatPrice(item.price * 1.25 * item.quantity)}
                                </span>
                                <span className="text-[12.5px] font-bold text-neutral-900 font-mono">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                                <span className="bg-[#C28a5c]/10 text-[#C28a5c] font-label-caps text-[7.5px] px-1 py-0.5 rounded-full font-bold tracking-wider">
                                  20% OFF
                                </span>
                              </div>
                            </div>

                            {/* Quantity Selector & Remove Link */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center bg-black text-white rounded-[4px] overflow-hidden h-[25px]">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 h-full hover:bg-neutral-800 transition-colors text-[10px] font-bold focus:outline-none"
                                >
                                  —
                                </button>
                                <span className="font-mono text-xs px-1 w-6 text-center text-white select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 h-full hover:bg-neutral-800 transition-colors text-[10px] font-bold focus:outline-none"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-[11px] text-neutral-500 hover:text-black underline transition-colors focus:outline-none cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Thin Separation Line */}
                  <div className="border-t border-[#0E2225]/20 my-2" />

                  {/* Complete Your Order With Carousel */}
                  <div className="bg-[#F3F2EE]/70 border border-neutral-200/50 rounded-2xl p-3.5 select-none">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-sans text-[13px] font-semibold text-neutral-900">
                        Complete Your Order With
                      </h4>

                      {/* Navigation Controls (Dots & Arrows) */}
                      <div className="flex items-center gap-1.5">
                        {/* Prev Arrow */}
                        <button
                          onClick={handlePrevRec}
                          className="group w-5 h-5 rounded-full border border-neutral-300 bg-white hover:bg-[#0F1B2D] hover:border-[#0F1B2D] flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                          aria-label="Previous recommendation"
                        >
                          <svg className="w-2.5 h-2.5 text-neutral-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>

                        {/* Dots */}
                        <div className="flex items-center gap-1">
                          {recommendedItems.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setDirection(idx > activeRecIndex ? 1 : -1);
                                setActiveRecIndex(idx);
                              }}
                              className="focus:outline-none transition-all duration-300 p-0.5"
                              aria-label={`Go to slide ${idx + 1}`}
                            >
                              {idx === activeRecIndex ? (
                                <span className="flex items-center justify-center w-3 h-3 rounded-full border border-[#0F1B2D]">
                                  <span className="w-1.5 h-1.5 bg-[#0F1B2D] rounded-full" />
                                </span>
                              ) : (
                                <span className="block w-1.25 h-1.25 bg-[#0F1B2D]/20 hover:bg-[#0F1B2D]/60 rounded-full" />
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Next Arrow */}
                        <button
                          onClick={handleNextRec}
                          className="group w-5 h-5 rounded-full border border-neutral-300 bg-white hover:bg-[#0F1B2D] hover:border-[#0F1B2D] flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                          aria-label="Next recommendation"
                        >
                          <svg className="w-2.5 h-2.5 text-neutral-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Product Carousel Slide Container */}
                    <div className="relative h-[80px] overflow-hidden w-full">
                      <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                          key={activeRecIndex}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
                          className="flex gap-3 w-full absolute inset-0"
                        >
                          {/* Recommended Product Image */}
                          <div className="w-[64px] h-[80px] bg-[#F3F2EE] shrink-0 relative overflow-hidden rounded-[6px]">
                            <Image
                              src={recommendedItems[activeRecIndex].product.featuredImage}
                              alt={recommendedItems[activeRecIndex].product.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          {/* Recommended Product Details */}
                          <div className="flex flex-col justify-between flex-1 py-0.5">
                            <div>
                              <h5 className="font-sans text-[12.5px] font-semibold text-neutral-900 leading-tight">
                                {recommendedItems[activeRecIndex].product.title}
                              </h5>

                              {/* Recommended Product Price */}
                              <div className="flex gap-2 items-baseline mt-1">
                                <span className="text-[10.5px] text-neutral-400 line-through font-mono">
                                  {formatPrice(recommendedItems[activeRecIndex].compareAtPrice)}
                                </span>
                                <span className="text-[12.5px] font-bold text-neutral-900 font-mono">
                                  {formatPrice(recommendedItems[activeRecIndex].product.price)}
                                </span>
                                <span className="bg-[#C28a5c]/10 text-[#C28a5c] font-label-caps text-[7.5px] px-1 py-0.5 rounded-full font-bold tracking-wider">
                                  20% OFF
                                </span>
                              </div>
                            </div>

                            {/* Sizes & Add Button Controls */}
                            <div className="flex items-center gap-1.5 mt-2">
                              {/* Premium Styled Select Dropdown (Native pop-up avoids clipping, styled custom) */}
                              <div className="relative">
                                <select
                                  value={selectedRecSizes[recommendedItems[activeRecIndex].product.id] || ""}
                                  onChange={(e) => handleSizeChange(recommendedItems[activeRecIndex].product.id, e.target.value)}
                                  className="appearance-none bg-black text-white text-[10.5px] font-semibold rounded-[4px] pl-2 px-6 py-1 focus:outline-none cursor-pointer border border-transparent hover:bg-neutral-900 transition-colors select-none font-sans"
                                >
                                  {recommendedItems[activeRecIndex].product.options[0].values.map((size) => (
                                    <option key={size} value={size} className="bg-black text-white text-[11px]">
                                      {size}
                                    </option>
                                  ))}
                                </select>
                                <svg
                                  className="w-2 h-2 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/80"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              </div>

                              {/* Add Button */}
                              <button
                                onClick={() => handleAddRecommendation(recommendedItems[activeRecIndex].product)}
                                className="bg-[#0F1B2D] hover:bg-[#1C2D42] text-white text-[11px] font-bold rounded-[4px] px-5 py-1.5 transition-colors cursor-pointer focus:outline-none"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Subtotal & Checkout Footer */}
                <div className="p-6 bg-[#F9F8F6] border-t border-neutral-200/60 mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-sans text-[17px] text-neutral-800">Subtotal</span>
                    <span className="font-sans text-[17px] font-bold text-black font-mono">
                      LE {cartSubtotal.toLocaleString("en-EG", { minimumFractionDigits: 2 })} <span className="font-normal text-neutral-500 text-[14px] font-sans">EGP</span>
                    </span>
                  </div>

                  <p className="text-[12px] text-neutral-500 font-sans mb-6">
                    Tax included. <Link href="/delivery" className="underline hover:text-black">Shipping</Link> calculated at checkout.
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="flex-1 py-3.5 border border-[#0F1B2D] text-[#0F1B2D] hover:bg-[#0F1B2D]/5 font-sans text-[13px] font-bold rounded-[6px] transition-colors text-center cursor-pointer focus:outline-none"
                    >
                      View cart
                    </button>
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="flex-1 py-3.5 bg-[#0E2225] hover:bg-[#132E32] text-white font-sans text-[13px] font-bold rounded-[6px] transition-colors text-center flex justify-center items-center"
                    >
                      Check out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
