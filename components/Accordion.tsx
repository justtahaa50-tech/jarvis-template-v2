"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Truck, CornerUpLeft, Droplets, Plus, Minus } from "lucide-react";

interface AccordionProps {
  title: string;
  iconName: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  iconColor?: string;
}

const getLucideIcon = (name: string, color?: string) => {
  const size = 18;
  const style = color ? { color } : undefined;
  switch (name) {
    case "checkroom":
      return <Shirt size={size} style={style} className="shrink-0" />;
    case "local_shipping":
      return <Truck size={size} style={style} className="shrink-0" />;
    case "keyboard_return":
      return <CornerUpLeft size={size} style={style} className="shrink-0" />;
    case "laundry":
      return <Droplets size={size} style={style} className="shrink-0" />;
    default:
      return null;
  }
};

const Accordion: React.FC<AccordionProps> = ({
  title,
  iconName,
  defaultOpen = false,
  children,
  iconColor,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-outline-variant/20 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 font-label-caps text-label-caps text-primary uppercase text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          {getLucideIcon(iconName, iconColor)}
          {title}
        </div>
        <span className="transition-transform duration-200">
          {isOpen ? <Minus size={16} style={{ color: iconColor }} /> : <Plus size={16} style={{ color: iconColor }} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 pt-2 font-body-md text-body-md text-on-surface-variant">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
