"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/LogoIcon";
import { Lock, Unlock, Mail, ArrowRight, ShieldAlert, Globe, Sparkles } from "lucide-react";

export default function PasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 4,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "jarvis2026" || password.toLowerCase() === "admin") {
      localStorage.setItem("storefront_access", "true");
      router.push("/");
      // Force reload to update Layout states
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } else {
      setError("INCORRECT DECRYPTION KEY. SECURITY PROTOCOL ENFORCED.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F1B2D] text-[#F7F6F2] font-satoshi flex flex-col justify-between overflow-hidden">
      {/* Repeating geometric grid background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #C28a5c 1px, transparent 1px),
            linear-gradient(to bottom, #C28a5c 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B2D] via-transparent to-[#0F1B2D] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-8 h-8 text-[#C28a5c]" />
          <span className="font-label-caps text-lg tracking-[0.3em] font-bold text-white">JARVIS</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 border border-[#C28a5c]/30 rounded-none bg-[#0f1b2d]/60 backdrop-blur-md text-[#C28a5c] font-label-caps text-xs tracking-widest hover:border-[#C28a5c] hover:bg-[#C28a5c]/10 transition-all cursor-pointer select-none"
        >
          {showForm ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          {showForm ? "CANCEL" : "ENTER STORE"}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl text-center">
          {!showForm ? (
            <div className="space-y-10 animate-fade-in">
              {/* Coming Soon/Launch Visual Details */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C28a5c]/10 border border-[#C28a5c]/30 text-[#C28a5c] text-[10px] tracking-[0.2em] font-bold uppercase rounded-none">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>Next Architecture Drop Brewing</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-[-0.03em] leading-none text-white max-w-xl mx-auto">
                THE STRUCTURE IS <span className="text-[#C28a5c]">EVOLVING</span>
              </h1>

              <p className="text-sm md:text-base text-[#F7F6F2]/60 font-light max-w-md mx-auto leading-relaxed">
                We are currently restructuring our storefront to house Drop 02. Sign up below for early decryption keys.
              </p>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto py-4">
                {[
                  { value: timeRemaining.days, label: "DAYS" },
                  { value: timeRemaining.hours, label: "HOURS" },
                  { value: timeRemaining.minutes, label: "MINUTES" },
                  { value: timeRemaining.seconds, label: "SECONDS" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/[0.03] border border-white/5 backdrop-blur-md p-3 flex flex-col justify-center items-center">
                    <span className="text-2xl md:text-3xl font-mono font-bold text-[#C28a5c] tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] tracking-widest text-[#F7F6F2]/40 mt-1 uppercase font-bold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Newsletter Subscription */}
              <div className="max-w-md mx-auto pt-4">
                {subscribed ? (
                  <div className="p-4 border border-[#C28a5c]/50 bg-[#C28a5c]/10 text-center text-[#F7F6F2]/90 space-y-1">
                    <p className="font-bold text-sm tracking-wider text-[#C28a5c]">DECRYPTION ENROLLED</p>
                    <p className="text-xs text-[#F7F6F2]/60">We will transmit the drop access details to your mail.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex border border-white/10 focus-within:border-[#C28a5c]/50 bg-white/[0.02] transition-colors">
                    <div className="pl-4 flex items-center text-white/40">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="ENTER EMAIL FOR EARLY DROP ACCESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent px-3 py-3.5 text-xs text-[#F7F6F2] focus:outline-none placeholder-white/20 tracking-wider font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-[#C28a5c] text-[#0F1B2D] px-6 text-xs font-bold tracking-widest hover:bg-[#C28a5c]/90 transition-all flex items-center gap-1 cursor-pointer select-none"
                    >
                      NOTIFY <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 animate-fade-in">
              <div className="w-16 h-16 bg-[#C28a5c]/10 border border-[#C28a5c]/30 flex items-center justify-center mx-auto text-[#C28a5c]">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-white">DECRYPT STOREFRONT</h2>
                <p className="text-xs text-[#F7F6F2]/60 max-w-xs mx-auto">
                  Input the security bypass key below to access the architectural interface.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="ENTER PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-[#C28a5c] text-center px-4 py-4 text-sm text-[#F7F6F2] focus:outline-none placeholder-white/20 tracking-[0.2em]"
                  />
                </div>

                {error && (
                  <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 py-2.5 px-3">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#C28a5c] hover:bg-[#b07a4f] text-[#0F1B2D] py-4 text-xs font-bold tracking-[0.2em] transition-colors cursor-pointer select-none"
                >
                  TRANSMIT ACCESS CODE
                </button>
              </form>

              <div className="pt-2 text-xs text-[#F7F6F2]/40">
                <p>Hint: Enter <code className="text-[#C28a5c] font-semibold bg-white/5 px-1.5 py-0.5 rounded font-mono">JARVIS2026</code> or <code className="text-[#C28a5c] font-semibold bg-white/5 px-1.5 py-0.5 rounded font-mono">admin</code> to test storefront access.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#F7F6F2]/40">
        <p>© {new Date().getFullYear()} JARVIS. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C28a5c] transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg> INSTAGRAM
          </a>
          <a href="#" className="hover:text-[#C28a5c] transition-colors flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> OFFICIAL DISTRIBUTOR
          </a>
        </div>
      </footer>
    </div>
  );
}
