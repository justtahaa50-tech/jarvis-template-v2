"use client";

import React, { useState } from "react";
import Image from "next/image";

/**
 * LogoIcon — Jarvis brand mark with a fluid fill animation on hover.
 *
 * Technique:
 *  - Two layers of the SVG stacked, same position.
 *  - Bottom layer: base (white / dim).
 *  - Top layer: golden/accent tint, clipped with `clip-path: inset(100% 0 0 0)`.
 *  - On hover the clip animates to `inset(0% 0 0 0)`, revealing the fill from bottom → top.
 */
export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={`relative inline-block ${className ?? ""}`}
      style={{ width: 42, height: 42 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Jarvis home"
    >
      {/* ── Base layer (always visible, white) ── */}
      <Image
        src="/assets/header-icon.svg"
        alt="Jarvis logo"
        fill
        sizes="42px"
        style={{
          objectFit: "contain",
          filter: "brightness(0) invert(1)",   /* white */
          opacity: 0.9,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ── Shimmer sweep overlay (masked to SVG shape) ── */}
      <span
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          WebkitMaskImage: "url('/assets/header-icon.svg')",
          maskImage: "url('/assets/header-icon.svg')",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
          style={{
            transform: hovered ? "translateX(100%) skewX(-20deg)" : "translateX(-100%) skewX(-20deg)",
            transition: hovered ? "transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
          }}
        />
      </span>
    </span>
  );
};
