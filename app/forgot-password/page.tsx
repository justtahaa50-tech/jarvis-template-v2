"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Send } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

function EmailField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        Email Address
      </label>
      <div
        className="flex items-center gap-3 rounded-xl px-4 h-12 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: focused ? "1px solid #C28a5c" : "1px solid rgba(255,255,255,0.1)",
          boxShadow: focused ? "0 0 0 3px rgba(194,138,92,0.12)" : "none",
        }}
      >
        <Mail
          size={16}
          style={{
            color: focused ? "#C28a5c" : "rgba(255,255,255,0.35)",
            flexShrink: 0,
            transition: "color 0.2s",
          }}
        />
        <input
          id={id}
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="email"
          required
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
        />
      </div>
    </div>
  );
}

function SuccessState({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-2">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(78,122,99,0.15)",
          border: "1px solid rgba(78,122,99,0.35)",
        }}
      >
        <Send size={28} style={{ color: "#4E7A63" }} />
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-2">Check your inbox</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          We sent a secure reset link to{" "}
          <span className="font-semibold text-white">{email}</span>. The link expires in 30 minutes.
        </p>
      </div>

      <div
        className="w-full rounded-xl px-4 py-3 text-left text-xs leading-relaxed"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        Didn&apos;t receive it? Check your spam folder or{" "}
        <button type="button" className="font-semibold" style={{ color: "#C28a5c" }}>
          resend the email
        </button>
        .
      </div>

      <Link
        href="/reset-password"
        className="h-12 w-full rounded-xl font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: "#C28a5c",
          color: "#0F1B2D",
          boxShadow: "0 4px 20px rgba(194,138,92,0.35)",
        }}
      >
        Continue to Reset <ArrowRight size={15} />
      </Link>

      <Link
        href="/login"
        className="text-xs transition-colors duration-150 hover:text-white/50"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Return to sign in
      </Link>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell
        title="Email sent"
        subtitle="Follow the link in your inbox to create a new password"
      >
        <SuccessState email={email} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter the email linked to your account and we'll send a reset link"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <EmailField id="forgot-email" value={email} onChange={setEmail} />

        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          For security, reset links expire after 30 minutes. You can request a new one at any time.
        </p>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="h-12 rounded-xl font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            background: loading || !email.trim() ? "rgba(194,138,92,0.35)" : "#C28a5c",
            color: "#0F1B2D",
            opacity: loading ? 0.8 : 1,
            boxShadow: loading || !email.trim() ? "none" : "0 4px 20px rgba(194,138,92,0.35)",
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              Sending link...
            </span>
          ) : (
            <>
              Send Reset Link <ArrowRight size={15} />
            </>
          )}
        </button>

        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold transition-colors duration-150"
            style={{ color: "#C28a5c" }}
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
