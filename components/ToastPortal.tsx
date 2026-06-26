"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export default function ToastPortal() {
  const { toasts, dismissToast } = useWishlist();

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-3 pointer-events-none w-[calc(100vw-32px)] sm:w-[350px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center gap-3 bg-[#0F1B2D]/95 text-[#F7F6F2] p-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md w-full"
            style={{ boxShadow: "0 12px 40px rgba(15, 27, 45, 0.25)" }}
          >
            {toast.image && (
              <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                <Image src={toast.image} alt="product thumbnail" fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-body-md text-xs text-[#F7F6F2]/90 leading-snug">{toast.message}</p>
              {toast.actionLink && toast.actionLabel && (
                <Link
                  href={toast.actionLink}
                  className="inline-block font-label-caps text-[10px] text-[#C28a5c] hover:text-[#C28a5c]/80 uppercase mt-1 tracking-widest font-bold"
                >
                  {toast.actionLabel}
                </Link>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#F7F6F2]/45 hover:text-white p-1 rounded flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
