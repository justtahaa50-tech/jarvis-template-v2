"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/LogoIcon";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Star,
  Truck,
  Gift,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Tab = "login" | "signup";

// ─── Benefit Point Component ─────────────────────────────────────────────────

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

// ─── Input Field Component ────────────────────────────────────────────────────

function InputField({
  id,
  label,
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
  suffix,
}: {
  id: string;
  label: string;
  type?: string;
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
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
        <Icon size={16} style={{ color: focused ? "#C28a5c" : "rgba(255,255,255,0.35)", flexShrink: 0, transition: "color 0.2s" }} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          style={{ fontFamily: "var(--font-satoshi), sans-serif" }}
        />
        {suffix}
      </div>
    </div>
  );
}

// ─── Password Field Component ─────────────────────────────────────────────────

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <InputField
      id={id}
      label={label}
      type={show ? "text" : "password"}
      icon={Lock}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      suffix={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="flex-shrink-0 transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.35)" }}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

// ─── Social Button ────────────────────────────────────────────────────────────

function SocialButton({ label, logo }: { label: string; logo: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2.5 h-11 rounded-xl text-sm font-medium flex-1 transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.8)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.22)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
      }}
    >
      {logo}
      <span>{label}</span>
    </button>
  );
}

// ─── Google SVG ───────────────────────────────────────────────────────────────

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.311 0-9.823-3.41-11.387-8.172l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
    </svg>
  );
}

// ─── Apple SVG ────────────────────────────────────────────────────────────────

function AppleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 814 1000" fill="white">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-150.3-87.8C36.5 738.3 1 610.6 1 484.5 1 216.3 177.6 76.3 347.4 76.3c104.2 0 190.3 68.1 247.7 68.1 55.5 0 158.5-72.6 278-72.6zm-12.7-219.5c0 97.3-71.2 163.5-152.7 163.5-79.9 0-144.5-61.6-144.5-163.5 0-96.8 67.1-163.4 146.8-163.4 79 0 150.4 65.8 150.4 163.4z" />
    </svg>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ switchToSignUp }: { switchToSignUp: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        id="login-email"
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
      />
      <PasswordField
        id="login-password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={setPassword}
      />

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer group" htmlFor="remember-me">
          <div className="relative">
            <input
              id="remember-me"
              type="checkbox"
              className="sr-only"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <div
              className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
              style={{
                background: remember ? "#C28a5c" : "transparent",
                border: remember ? "1px solid #C28a5c" : "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {remember && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Remember me</span>
        </label>
        <button
          type="button"
          className="text-xs font-medium transition-colors duration-150"
          style={{ color: "#C28a5c" }}
        >
          Forgot password?
        </button>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-xl font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: loading ? "rgba(194,138,92,0.6)" : "#C28a5c",
          color: "#0F1B2D",
          opacity: loading ? 0.8 : 1,
          boxShadow: loading ? "none" : "0 4px 20px rgba(194,138,92,0.35)",
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
            Signing in...
          </span>
        ) : (
          <>
            Sign In <ArrowRight size={15} />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* Social Buttons */}
      <div className="flex gap-3">
        <SocialButton label="Google" logo={<GoogleLogo />} />
        <SocialButton label="Apple" logo={<AppleLogo />} />
      </div>

      {/* Switch to Sign Up */}
      <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={switchToSignUp}
          className="font-semibold transition-colors duration-150"
          style={{ color: "#C28a5c" }}
        >
          Create one
        </button>
      </p>
    </form>
  );
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────

function SignUpForm({ switchToLogin }: { switchToLogin: () => void }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <InputField
          id="signup-first"
          label="First Name"
          icon={User}
          placeholder="Ahmed"
          value={firstName}
          onChange={setFirstName}
        />
        <InputField
          id="signup-last"
          label="Last Name"
          icon={User}
          placeholder="Taha"
          value={lastName}
          onChange={setLastName}
        />
      </div>

      <InputField
        id="signup-email"
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
      />
      <InputField
        id="signup-phone"
        label="Phone Number"
        type="tel"
        icon={Phone}
        placeholder="+20 100 000 0000"
        value={phone}
        onChange={setPhone}
      />
      <PasswordField
        id="signup-password"
        label="Password"
        placeholder="Create a strong password"
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        id="signup-confirm"
        label="Confirm Password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />

      {/* Terms Checkbox */}
      <label className="flex items-start gap-2.5 cursor-pointer" htmlFor="terms">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            id="terms"
            type="checkbox"
            className="sr-only"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <div
            className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
            style={{
              background: agreed ? "#C28a5c" : "transparent",
              border: agreed ? "1px solid #C28a5c" : "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {agreed && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          I agree to the{" "}
          <span className="font-semibold" style={{ color: "#C28a5c" }}>Terms &amp; Privacy Policy</span>
        </span>
      </label>

      {/* Create Account Button */}
      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-xl font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 mt-1"
        style={{
          background: loading ? "rgba(194,138,92,0.6)" : "#C28a5c",
          color: "#0F1B2D",
          opacity: loading ? 0.8 : 1,
          boxShadow: loading ? "none" : "0 4px 20px rgba(194,138,92,0.35)",
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
            Creating Account...
          </span>
        ) : (
          <>
            Create Account <ArrowRight size={15} />
          </>
        )}
      </button>

      {/* Switch to Login */}
      <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="font-semibold transition-colors duration-150"
          style={{ color: "#C28a5c" }}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0A1322", fontFamily: "var(--font-satoshi), sans-serif" }}
    >
      {/* ── Left Panel (desktop only) ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: "45%",
          minWidth: 420,
          background: "#0F1B2D",
        }}
      >
        {/* Geometric pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #C28a5c 0, #C28a5c 1px, transparent 0, transparent 50%)",
            backgroundSize: "28px 28px",
            opacity: 0.045,
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(194,138,92,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          {/* Brand Mark */}
          <div className="flex items-center gap-3 mb-auto">
            <LogoIcon className="opacity-90" />
            <span className="text-lg font-bold tracking-[0.18em] text-white uppercase">Jarvis</span>
          </div>

          {/* Center Content */}
          <div className="flex flex-col gap-4 my-auto">
            <p
              className="text-xs font-semibold tracking-[0.22em] uppercase"
              style={{ color: "#C28a5c" }}
            >
              Architectural Streetwear
            </p>
            <h1
              className="font-bold leading-none"
              style={{
                fontSize: "clamp(48px, 5.5vw, 72px)",
                color: "white",
                letterSpacing: "-0.03em",
              }}
            >
              JARVIS
            </h1>
            <p
              className="text-base leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Redefining modern silhouettes through disciplined design and premium Egyptian textiles.
            </p>

            {/* Separator */}
            <div
              className="w-12 h-px mt-2"
              style={{ background: "linear-gradient(90deg, #C28a5c, transparent)" }}
            />

            {/* Benefit points */}
            <div className="flex flex-col gap-4 mt-2">
              <BenefitPoint
                icon={Star}
                title="Gold Member Loyalty"
                desc="Earn points on every purchase and unlock exclusive rewards."
              />
              <BenefitPoint
                icon={Gift}
                title="Early Access to Drops"
                desc="Be the first to shop new collections before public release."
              />
              <BenefitPoint
                icon={Truck}
                title="Free Shipping Over LE 1500"
                desc="Complimentary nationwide delivery on qualifying orders."
              />
            </div>
          </div>

          {/* Footer */}
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

      {/* ── Right Panel (form) ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <LogoIcon className="opacity-90" />
          <span className="text-base font-bold tracking-[0.18em] text-white uppercase">Jarvis</span>
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-7 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-1.5">
              {tab === "login" ? "Welcome back" : "Join Jarvis"}
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {tab === "login"
                ? "Sign in to your account to continue"
                : "Create your account and start your journey"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div
            className="flex rounded-xl p-1 mb-7"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex-1 h-9 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-200"
                style={{
                  background: tab === t ? "#C28a5c" : "transparent",
                  color: tab === t ? "#0F1B2D" : "rgba(255,255,255,0.4)",
                  boxShadow: tab === t ? "0 2px 10px rgba(194,138,92,0.3)" : "none",
                }}
              >
                {t === "login" ? "Login" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form Container */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            {tab === "login" ? (
              <LoginForm switchToSignUp={() => setTab("signup")} />
            ) : (
              <SignUpForm switchToLogin={() => setTab("login")} />
            )}
          </div>

          {/* Back to home link */}
          <p className="text-center mt-5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link
              href="/"
              className="transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
