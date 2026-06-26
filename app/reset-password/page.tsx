import React, { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

function ResetPasswordFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0A1322", fontFamily: "var(--font-satoshi), sans-serif" }}
    >
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#C28a5c" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
        </svg>
        <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
          Loading...
        </span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
