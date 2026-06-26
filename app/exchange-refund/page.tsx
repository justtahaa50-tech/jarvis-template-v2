"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  RefreshCw,
  Package,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  ArrowRight,
  Info,
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const POLICY_POINTS = [
  {
    icon: Clock,
    title: "14-Day Window",
    body: "All exchange and refund requests must be submitted within 14 days of delivery confirmation.",
  },
  {
    icon: Package,
    title: "Original Condition",
    body: "Items must be unworn, unwashed, and unaltered with all original tags still attached.",
  },
  {
    icon: ShieldCheck,
    title: "Original Packaging",
    body: "Please return the garment in its original Jarvis packaging including the tissue wrap.",
  },
  {
    icon: Truck,
    title: "Return Shipping",
    body: "Return shipping is covered by the customer. Jarvis covers shipping costs for defective items.",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Submit Your Request",
    body: "Fill in the form below with your order number, reason, and preferred resolution.",
  },
  {
    number: "02",
    title: "Team Review",
    body: "Our support team reviews your request within 24 hours and confirms eligibility.",
  },
  {
    number: "03",
    title: "Ship Your Item",
    body: "Pack the garment securely and ship to our Cairo warehouse using the provided address.",
  },
  {
    number: "04",
    title: "Resolution",
    body: "Once received and inspected, your exchange ships out or your refund is processed within 5–10 business days.",
  },
];

const REASONS = [
  "Wrong size — too small",
  "Wrong size — too large",
  "Wrong item received",
  "Defective / damaged item",
  "Color different from photos",
  "Changed my mind",
  "Other",
];

const FAQ_ITEMS = [
  {
    q: "How long do refunds take?",
    a: "Once we receive and inspect your return, approved refunds are credited back to your original payment method within 5–10 business days. Cash on delivery refunds are processed as bank transfers.",
  },
  {
    q: "Can I exchange for a different color?",
    a: "Yes, exchanges are available for different sizes or colors of the same product, subject to stock availability. If the requested color/size is unavailable, we will issue a full refund.",
  },
  {
    q: "What if my item is defective?",
    a: "Defective items are given priority. Please photograph the defect clearly and attach images to your request form. We will cover all return shipping costs and process your resolution within 48 hours of receipt.",
  },
  {
    q: "Can I exchange items bought on discount?",
    a: "Yes, discounted items are eligible for size exchanges. However, sale items are not eligible for refunds unless they arrive defective.",
  },
  {
    q: "I paid with Cash on Delivery — how do I get refunded?",
    a: "COD refunds are issued via bank transfer to an account of your choice. Please include your bank details in the request form and we will process your refund within 5–10 business days.",
  },
];

const EGYPT_CITIES = [
  "Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Luxor",
  "Aswan", "Port Said", "Suez", "Ismailia", "Hurghada",
];

// ─── FAQ Accordion ───────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer focus:outline-none group"
      >
        <span className="font-body-md text-sm font-medium text-[#0F1B2D] group-hover:text-[#C28a5c] transition-colors">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4">
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

type ResolutionType = "exchange" | "refund";

export default function ExchangeRefundPage() {
  const [resolution, setResolution] = useState<ResolutionType>("exchange");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    orderNumber: "",
    email: "",
    phone: "",
    reason: "",
    details: "",
    // Exchange-specific
    exchangeSize: "",
    exchangeColor: "",
    // Refund-specific
    bankName: "",
    accountHolder: "",
    accountNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-white border border-neutral-200 focus:border-[#C28a5c] focus:ring-2 focus:ring-[#C28a5c]/15 rounded-xl px-4 py-3 font-body-md text-sm text-[#0F1B2D] outline-none transition-all duration-200 placeholder:text-neutral-400";
  const labelClass =
    "font-label-caps text-[10px] text-on-surface-variant/70 tracking-widest font-bold mb-1.5 block";

  return (
    <div className="w-full min-h-screen bg-[#F7F6F2]">

      {/* ─── Hero ─── */}
      <div className="w-full bg-[#0F1B2D] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #C28a5c 0, #C28a5c 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20">
          <span className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] font-bold block mb-4">
            CUSTOMER SUPPORT
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-white text-2xl md:text-4xl font-bold uppercase leading-tight">
            Exchange & Refund
          </h1>
          <p className="font-body-md text-white/60 text-sm md:text-base mt-3 max-w-lg">
            Not the right fit? We make it easy. Submit your request and we'll handle the rest within 24 hours.
          </p>
          {/* Quick links */}
          <div className="flex flex-wrap gap-4 mt-6">
            <a href="#request-form" className="flex items-center gap-2 font-label-caps text-[11px] font-bold tracking-widest text-white/70 hover:text-white transition-colors">
              <ArrowRight size={12} /> SUBMIT REQUEST
            </a>
            <a href="#policy" className="flex items-center gap-2 font-label-caps text-[11px] font-bold tracking-widest text-white/70 hover:text-white transition-colors">
              <ArrowRight size={12} /> OUR POLICY
            </a>
            <a href="#faqs" className="flex items-center gap-2 font-label-caps text-[11px] font-bold tracking-widest text-white/70 hover:text-white transition-colors">
              <ArrowRight size={12} /> FAQS
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 xl:gap-16 items-start">

          {/* ─── Left Column ─── */}
          <div className="flex flex-col gap-12">

            {/* Policy Highlights */}
            <section id="policy">
              <p className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] font-bold mb-2">OUR COMMITMENT</p>
              <h2 className="font-display-md text-[#0F1B2D] font-bold text-xl mb-6">Return Policy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {POLICY_POINTS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.title} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0F1B2D]/5 flex items-center justify-center flex-shrink-0">
                        <Icon size={17} className="text-[#0F1B2D]" />
                      </div>
                      <div>
                        <p className="font-label-caps text-[10px] font-bold tracking-wider text-[#0F1B2D]">{p.title}</p>
                        <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">{p.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Non-eligible notice */}
              <div className="mt-4 flex items-start gap-3 bg-[#ba1a1a]/6 border border-[#ba1a1a]/15 rounded-2xl px-5 py-4">
                <AlertCircle size={15} className="text-[#ba1a1a] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-label-caps text-[10px] font-bold tracking-wider text-[#ba1a1a]">NOT ELIGIBLE FOR RETURN</p>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Items that have been worn, washed, or show signs of use. Items returned after the 14-day window. Sale items (eligible for exchange only).
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <p className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] font-bold mb-2">THE PROCESS</p>
              <h2 className="font-display-md text-[#0F1B2D] font-bold text-xl mb-6">How It Works</h2>
              <div className="relative flex flex-col gap-0">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.number} className="flex gap-5 relative">
                    {/* Connector line */}
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-neutral-200" />
                    )}
                    {/* Number badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#0F1B2D] flex items-center justify-center z-10 bg-[#F7F6F2]">
                      <span className="font-mono text-xs font-bold text-[#0F1B2D]">{step.number}</span>
                    </div>
                    <div className={`pb-8 ${i === PROCESS_STEPS.length - 1 ? "pb-0" : ""}`}>
                      <p className="font-label-caps text-xs font-bold tracking-wider text-[#0F1B2D]">{step.title}</p>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Request Form */}
            <section id="request-form">
              <p className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] font-bold mb-2">SUBMIT A REQUEST</p>
              <h2 className="font-display-md text-[#0F1B2D] font-bold text-xl mb-6">Start Your Request</h2>

              {submitted ? (
                // Success state
                <div className="bg-white rounded-2xl border border-neutral-100 p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#4E7A63]/10 flex items-center justify-center">
                    <CheckCircle2 size={30} className="text-[#4E7A63]" />
                  </div>
                  <div>
                    <h3 className="font-label-caps text-sm tracking-widest font-bold text-[#0F1B2D]">REQUEST SUBMITTED</h3>
                    <p className="font-body-md text-sm text-on-surface-variant mt-2 max-w-xs leading-relaxed">
                      We've received your {resolution} request. Our team will review it and contact you within 24 hours.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-2">
                    <button
                      onClick={() => { setSubmitted(false); setForm({ orderNumber: "", email: "", phone: "", reason: "", details: "", exchangeSize: "", exchangeColor: "", bankName: "", accountHolder: "", accountNumber: "" }); }}
                      className="flex-1 py-3 border border-[#0F1B2D]/20 font-label-caps text-[10px] tracking-widest font-bold text-[#0F1B2D] rounded-xl hover:bg-[#0F1B2D]/5 transition-colors cursor-pointer focus:outline-none"
                    >
                      NEW REQUEST
                    </button>
                    <Link href="/track-order" className="flex-1 py-3 text-center bg-[#0F1B2D] text-white font-label-caps text-[10px] tracking-widest font-bold rounded-xl hover:bg-[#1C2D42] transition-colors">
                      TRACK ORDER
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                  {/* Resolution Type Selector */}
                  <div className="p-6 md:p-8 border-b border-neutral-100">
                    <label className={labelClass}>REQUEST TYPE</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {(["exchange", "refund"] as ResolutionType[]).map((type) => {
                        const isActive = resolution === type;
                        const Icon = type === "exchange" ? ArrowLeftRight : RefreshCw;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setResolution(type)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer focus:outline-none text-left ${
                              isActive
                                ? "border-[#0F1B2D] bg-[#0F1B2D]/5"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-[#0F1B2D]" : "bg-neutral-100"}`}>
                              <Icon size={15} className={isActive ? "text-white" : "text-neutral-500"} />
                            </div>
                            <div>
                              <p className={`font-label-caps text-[10px] font-bold tracking-wider capitalize ${isActive ? "text-[#0F1B2D]" : "text-neutral-500"}`}>
                                {type}
                              </p>
                              <p className="font-body-md text-[11px] text-on-surface-variant/70 mt-0.5">
                                {type === "exchange" ? "Swap for another size/color" : "Get your money back"}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col gap-5">
                    {/* Order Details */}
                    <div>
                      <p className={labelClass}>ORDER DETAILS</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className={labelClass}>ORDER NUMBER *</label>
                          <input
                            name="orderNumber"
                            value={form.orderNumber}
                            onChange={handleChange}
                            required
                            placeholder="e.g. JRV-0041"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>EMAIL ADDRESS *</label>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="email@example.com"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className={labelClass}>PHONE NUMBER</label>
                        <input
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+20 1XX XXX XXXX"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className={labelClass}>REASON FOR {resolution.toUpperCase()} *</label>
                      <div className="relative">
                        <select
                          name="reason"
                          value={form.reason}
                          onChange={handleChange}
                          required
                          className={`${inputClass} appearance-none cursor-pointer pr-10`}
                        >
                          <option value="">Select a reason…</option>
                          {REASONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>ADDITIONAL DETAILS</label>
                      <textarea
                        name="details"
                        value={form.details}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Describe the issue, preferred resolution, or any other relevant information…"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Exchange-specific fields */}
                    {resolution === "exchange" && (
                      <div className="bg-[#F9F8F6] rounded-xl border border-neutral-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <ArrowLeftRight size={13} className="text-[#C28a5c]" />
                          <p className="font-label-caps text-[10px] font-bold tracking-wider text-[#0F1B2D]">EXCHANGE FOR</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>PREFERRED SIZE *</label>
                            <div className="relative">
                              <select
                                name="exchangeSize"
                                value={form.exchangeSize}
                                onChange={handleChange}
                                required={resolution === "exchange"}
                                className={`${inputClass} appearance-none cursor-pointer pr-10`}
                              >
                                <option value="">Select size…</option>
                                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label className={labelClass}>PREFERRED COLOR</label>
                            <div className="relative">
                              <select
                                name="exchangeColor"
                                value={form.exchangeColor}
                                onChange={handleChange}
                                className={`${inputClass} appearance-none cursor-pointer pr-10`}
                              >
                                <option value="">Same color</option>
                                {["Black / White", "Creamy / Olive", "Creamy / Burgundy", "Olive / White", "Rose / White", "Army / White", "Burgundy / White"].map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-start gap-2 text-on-surface-variant/60">
                          <Info size={12} className="flex-shrink-0 mt-0.5" />
                          <p className="font-body-md text-xs leading-relaxed">
                            If your preferred option is out of stock, we'll contact you to arrange an alternative or process a full refund.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Refund-specific fields */}
                    {resolution === "refund" && (
                      <div className="bg-[#F9F8F6] rounded-xl border border-neutral-100 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <RefreshCw size={13} className="text-[#C28a5c]" />
                          <p className="font-label-caps text-[10px] font-bold tracking-wider text-[#0F1B2D]">REFUND DETAILS</p>
                          <span className="font-label-caps text-[8px] bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full tracking-wider font-bold">COD ORDERS ONLY</span>
                        </div>
                        <p className="font-body-md text-xs text-on-surface-variant mb-4 leading-relaxed">
                          For bank card / online payments, the refund is returned to the original payment method automatically. For cash on delivery orders, please provide bank details below.
                        </p>
                        <div className="flex flex-col gap-4">
                          <div>
                            <label className={labelClass}>BANK NAME</label>
                            <input
                              name="bankName"
                              value={form.bankName}
                              onChange={handleChange}
                              placeholder="e.g. CIB, NBE, Banque Misr…"
                              className={inputClass}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>ACCOUNT HOLDER NAME</label>
                              <input
                                name="accountHolder"
                                value={form.accountHolder}
                                onChange={handleChange}
                                placeholder="Full name on account"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>ACCOUNT NUMBER / IBAN</label>
                              <input
                                name="accountNumber"
                                value={form.accountNumber}
                                onChange={handleChange}
                                placeholder="Account or IBAN number"
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Return Address */}
                    <div className="bg-[#0F1B2D]/4 rounded-xl border border-[#0F1B2D]/10 p-5">
                      <p className="font-label-caps text-[10px] font-bold tracking-wider text-[#0F1B2D] mb-2">RETURN ADDRESS</p>
                      <p className="font-body-md text-sm text-[#0F1B2D] font-medium">Jarvis Returns Warehouse</p>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Building 14, Industrial Zone, New Cairo, Cairo Governorate, Egypt<br />
                        Tel: +20 2 1234 5678
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#0F1B2D] hover:bg-[#1C2D42] text-white font-label-caps text-[11px] tracking-widest font-bold rounded-xl transition-colors cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          SUBMITTING…
                        </>
                      ) : (
                        <>
                          {resolution === "exchange" ? <ArrowLeftRight size={14} /> : <RefreshCw size={14} />}
                          SUBMIT {resolution.toUpperCase()} REQUEST
                        </>
                      )}
                    </button>
                    <p className="font-body-md text-xs text-on-surface-variant/60 text-center -mt-2">
                      Our team will respond to your request within 24 hours
                    </p>
                  </div>
                </form>
              )}
            </section>

            {/* FAQs */}
            <section id="faqs">
              <p className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] font-bold mb-2">FREQUENTLY ASKED</p>
              <h2 className="font-display-md text-[#0F1B2D] font-bold text-xl mb-6">Common Questions</h2>
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-6 md:px-8">
                {FAQ_ITEMS.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>

          </div>

          {/* ─── Right Sidebar ─── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Eligibility Checker */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-5 py-4 bg-[#0F1B2D]">
                <p className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] font-bold">ELIGIBILITY GUIDE</p>
              </div>
              <div className="p-5 flex flex-col gap-3">
                {[
                  { label: "Within 14 days of delivery", yes: true },
                  { label: "Unworn & unwashed", yes: true },
                  { label: "Tags intact", yes: true },
                  { label: "Original packaging", yes: true },
                  { label: "Worn / washed items", yes: false },
                  { label: "After 14-day window", yes: false },
                  { label: "Custom / personalised items", yes: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{
                        background: item.yes ? "rgba(78,122,99,0.12)" : "rgba(186,26,26,0.08)",
                        color: item.yes ? "#4E7A63" : "#ba1a1a",
                      }}
                    >
                      {item.yes ? "✓" : "✕"}
                    </div>
                    <span className="font-body-md text-xs text-on-surface-variant">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={14} className="text-[#C28a5c]" />
                <p className="font-label-caps text-[10px] tracking-widest font-bold text-[#0F1B2D]">NEED HELP?</p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:support@jarvis.com"
                  className="flex items-center gap-3 p-3 bg-[#F9F8F6] rounded-xl border border-neutral-100 hover:border-[#C28a5c]/30 hover:bg-[#C28a5c]/5 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] flex items-center justify-center flex-shrink-0">
                    <Mail size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="font-label-caps text-[10px] font-bold tracking-wider text-[#0F1B2D] group-hover:text-[#C28a5c] transition-colors">EMAIL SUPPORT</p>
                    <p className="font-body-md text-xs text-on-surface-variant">support@jarvis.com</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-neutral-300 group-hover:text-[#C28a5c] transition-colors" />
                </a>
                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#F9F8F6] rounded-xl border border-neutral-100 hover:border-[#4E7A63]/30 hover:bg-[#4E7A63]/5 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#4E7A63] flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={13} className="text-white" />
                  </div>
                  <div>
                    <p className="font-label-caps text-[10px] font-bold tracking-wider text-[#0F1B2D] group-hover:text-[#4E7A63] transition-colors">WHATSAPP</p>
                    <p className="font-body-md text-xs text-on-surface-variant">+20 100 000 0000</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-neutral-300 group-hover:text-[#4E7A63] transition-colors" />
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="font-body-md text-xs text-on-surface-variant/60 text-center">
                  Support hours: Sun–Thu, 10am–6pm (Cairo time)
                </p>
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
              <p className="font-label-caps text-[10px] tracking-widest font-bold text-on-surface-variant/60 mb-4">QUICK LINKS</p>
              <div className="flex flex-col gap-1">
                {[
                  { label: "Track My Order", href: "/track-order" },
                  { label: "Delivery Information", href: "/delivery" },
                  { label: "Size Guide", href: "/products/ringer-tee" },
                  { label: "FAQ", href: "/faqs" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-2.5 px-1 font-body-md text-sm text-[#0F1B2D] hover:text-[#C28a5c] transition-colors group border-b border-neutral-50 last:border-0"
                  >
                    {link.label}
                    <ChevronRight size={14} className="text-neutral-300 group-hover:text-[#C28a5c] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
