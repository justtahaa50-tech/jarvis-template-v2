"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

export default function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-3 rounded-xl px-4 h-12 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: focused ? "1px solid #C28a5c" : "1px solid rgba(255,255,255,0.1)",
          boxShadow: focused ? "0 0 0 3px rgba(194,138,92,0.12)" : "none",
        }}
      >
        <Lock
          size={16}
          style={{
            color: focused ? "#C28a5c" : "rgba(255,255,255,0.35)",
            flexShrink: 0,
            transition: "color 0.2s",
          }}
        />
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="flex-shrink-0 transition-colors duration-200 hover:text-white/60"
          style={{ color: "rgba(255,255,255,0.35)" }}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
