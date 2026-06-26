"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import PasswordField from "@/components/auth/PasswordField";
import PasswordStrength, { getPasswordStrength } from "@/components/auth/PasswordStrength";

function SuccessState() {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-2">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(78,122,99,0.15)",
          border: "1px solid rgba(78,122,99,0.35)",
        }}
      >
        <CheckCircle2 size={32} style={{ color: "#4E7A63" }} />
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-2">Password updated</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          Your new password is active. Sign in to continue shopping and managing your orders.
        </p>
      </div>

      <Link
        href="/login"
        className="h-12 w-full rounded-xl font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: "#C28a5c",
          color: "#0F1B2D",
          boxShadow: "0 4px 20px rgba(194,138,92,0.35)",
        }}
      >
        Sign In <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { score } = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = score >= 3 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthShell title="All set" subtitle="Your account is secured with your new password">
        <SuccessState />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create new password"
      subtitle="Choose a strong password you haven't used on Jarvis before"
      backHref="/forgot-password"
      backLabel="Request a new link"
    >
      {!token && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-xs leading-relaxed"
          style={{
            background: "rgba(194,138,92,0.1)",
            border: "1px solid rgba(194,138,92,0.25)",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <KeyRound size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#C28a5c" }} />
          <span>
            Demo mode: no reset token required. In production, this page opens from your email link.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <PasswordField
          id="reset-password"
          label="New Password"
          placeholder="Create a strong password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />

        <PasswordStrength password={password} />

        <PasswordField
          id="reset-confirm"
          label="Confirm Password"
          placeholder="Repeat your new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs font-medium" style={{ color: "#E05252" }}>
            Passwords do not match
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="h-12 rounded-xl font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            background: loading || !canSubmit ? "rgba(194,138,92,0.35)" : "#C28a5c",
            color: "#0F1B2D",
            opacity: loading ? 0.8 : 1,
            boxShadow: loading || !canSubmit ? "none" : "0 4px 20px rgba(194,138,92,0.35)",
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
              </svg>
              Updating...
            </span>
          ) : (
            <>
              Update Password <ArrowRight size={15} />
            </>
          )}
        </button>

        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Changed your mind?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold transition-colors duration-150"
            style={{ color: "#C28a5c" }}
          >
            Back to sign in
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
