"use client";

import React from "react";
import { Check, X } from "lucide-react";

export function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
}

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"] as const;
const STRENGTH_COLORS = ["#E05252", "#E8A838", "#C28a5c", "#4E7A63"];

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, checks } = getPasswordStrength(password);

  if (!password) return null;

  const label = STRENGTH_LABELS[Math.max(0, score - 1)] ?? "Weak";
  const color = STRENGTH_COLORS[Math.max(0, score - 1)] ?? STRENGTH_COLORS[0];

  const requirements = [
    { key: "length", label: "At least 8 characters", met: checks.length },
    { key: "uppercase", label: "One uppercase letter", met: checks.uppercase },
    { key: "number", label: "One number", met: checks.number },
    { key: "special", label: "One special character", met: checks.special },
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1.5 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i < score ? color : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color }}>
          {label}
        </span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {requirements.map(({ key, label: reqLabel, met }) => (
          <li key={key} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
              style={{
                background: met ? "rgba(78,122,99,0.2)" : "rgba(255,255,255,0.06)",
                border: met ? "1px solid rgba(78,122,99,0.4)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {met ? (
                <Check size={9} style={{ color: "#4E7A63" }} />
              ) : (
                <X size={9} style={{ color: "rgba(255,255,255,0.25)" }} />
              )}
            </span>
            <span
              className="text-[11px] transition-colors duration-200"
              style={{ color: met ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)" }}
            >
              {reqLabel}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
