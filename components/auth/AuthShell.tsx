"use client";

import React from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/LogoIcon";
import { CheckCircle2, Gift, Shield, Star, Truck } from "lucide-react";

function BenefitPoint({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(194,138,92,0.15)", border: "1px solid rgba(194,138,92,0.3)" }}
      >
        <Icon size={16} style={{ color: "#C28a5c" }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white leading-tight">{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

interface AuthShellProps {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  backHref = "/login",
  backLabel = "Back to sign in",
  children,
}: AuthShellProps) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0A1322", fontFamily: "var(--font-satoshi), sans-serif" }}
    >
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: "45%", minWidth: 420, background: "#0F1B2D" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #C28a5c 0, #C28a5c 1px, transparent 0, transparent 50%)",
            backgroundSize: "28px 28px",
            opacity: 0.045,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(194,138,92,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          <Link href="/" className="flex items-center gap-3 mb-auto group">
            <LogoIcon className="opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="text-lg font-bold tracking-[0.18em] text-white uppercase">Jarvis</span>
          </Link>

          <div className="flex flex-col gap-4 my-auto">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: "#C28a5c" }}>
              Secure Access
            </p>
            <h1
              className="font-bold leading-none"
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                color: "white",
                letterSpacing: "-0.03em",
              }}
            >
              Your account,<br />protected.
            </h1>
            <p className="text-base leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Industry-standard encryption keeps your orders, addresses, and personal details safe.
            </p>

            <div className="w-12 h-px mt-2" style={{ background: "linear-gradient(90deg, #C28a5c, transparent)" }} />

            <div className="flex flex-col gap-4 mt-2">
              <BenefitPoint
                icon={Shield}
                title="256-bit SSL Encryption"
                desc="All password operations are transmitted over secure channels."
              />
              <BenefitPoint
                icon={Star}
                title="Gold Member Loyalty"
                desc="Your rewards and order history stay linked to your account."
              />
              <BenefitPoint
                icon={Gift}
                title="Early Access to Drops"
                desc="Recover access quickly and never miss a collection launch."
              />
              <BenefitPoint
                icon={Truck}
                title="Free Shipping Over LE 1500"
                desc="Complimentary nationwide delivery on qualifying orders."
              />
            </div>
          </div>

          <div className="mt-auto pt-12">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} style={{ color: "rgba(255,255,255,0.25)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                SSL secured · Egyptian-made · Est. 2023
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <LogoIcon className="opacity-90" />
          <span className="text-base font-bold tracking-[0.18em] text-white uppercase">Jarvis</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-7 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-1.5">{title}</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {subtitle}
            </p>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            {children}
          </div>

          <p className="text-center mt-5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href={backHref} className="transition-colors duration-150 hover:text-white/50">
              ← {backLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
