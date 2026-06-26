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
      {/* ── Base layer (always visible, slightly dim) ── */}
      <Image
        src="/assets/header-icon.svg"
        alt="Jarvis logo"
        fill
        sizes="42px"
        style={{
          objectFit: "contain",
          filter: "brightness(0) invert(1)",   /* white */
          opacity: 0.75,
          transition: "opacity 0.45s ease",
        }}
      />

      {/* ── Fill layer (golden, revealed bottom-to-top on hover) ── */}
      <Image
        src="/assets/header-icon.svg"
        alt=""
        aria-hidden="true"
        fill
        sizes="42px"
        style={{
          objectFit: "contain",
          filter: "brightness(0) saturate(100%) invert(68%) sepia(30%) saturate(500%) hue-rotate(340deg) brightness(105%)",
          /* clip reveals from the bottom: inset(top right bottom left) */
          clipPath: hovered ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          transition: "clip-path 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </span>
  );
};
