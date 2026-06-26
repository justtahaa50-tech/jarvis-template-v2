"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Home,
  Clock,
  MapPin,
  Phone,
  Copy,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

// ─── Mock order database ────────────────────────────────────────────────────

const MOCK_ORDERS: Record<string, MockOrder> = {
  "JRV-0041": {
    id: "#JRV-0041",
    status: "delivered",
    placedDate: "June 20, 2026",
    deliveredDate: "June 23, 2026",
    estimatedDate: "June 23–24, 2026",
    product: "THE RINGER TEE",
    variant: "Black / White — Size M",
    qty: 1,
    price: 700,
    image: "/assets/BLACK/atef-front.jpg",
    tracking: "EG123456789",
    courier: "Egypt Post / DHL",
    customer: {
      name: "Ahmed Taha",
      address: "123 Tahrir Square, Downtown",
      city: "Cairo",
      phone: "+20 100 000 0000",
    },
    shipping: 0,
    events: [
      { date: "Jun 23, 2026 – 14:32", label: "Delivered", detail: "Package delivered to recipient", done: true, current: false },
      { date: "Jun 23, 2026 – 08:10", label: "Out for Delivery", detail: "Your package is on its way", done: true, current: false },
      { date: "Jun 22, 2026 – 19:45", label: "At Local Facility", detail: "Cairo Distribution Hub", done: true, current: false },
      { date: "Jun 21, 2026 – 11:20", label: "In Transit", detail: "Package in transit to destination city", done: true, current: false },
      { date: "Jun 20, 2026 – 18:00", label: "Shipped", detail: "Package handed to courier", done: true, current: false },
      { date: "Jun 20, 2026 – 14:00", label: "Order Confirmed", detail: "Payment verified and order confirmed", done: true, current: false },
    ],
  },
  "JRV-0038": {
    id: "#JRV-0038",
    status: "in_transit",
    placedDate: "June 10, 2026",
    deliveredDate: null,
    estimatedDate: "June 27–28, 2026",
    product: "THE RINGER TEE",
    variant: "Creamy / Olive — Size L",
    qty: 1,
    price: 700,
    image: "/assets/CREAMY-OLIVE/nour-front_1.jpg",
    tracking: "EG987654321",
    courier: "Egypt Post / DHL",
    customer: {
      name: "Ahmed Taha",
      address: "123 Tahrir Square, Downtown",
      city: "Cairo",
      phone: "+20 100 000 0000",
    },
    shipping: 0,
    events: [
      { date: "Jun 26, 2026 – 09:00", label: "At Local Facility", detail: "Cairo Distribution Hub", done: true, current: true },
      { date: "Jun 24, 2026 – 22:10", label: "In Transit", detail: "Package in transit to destination city", done: true, current: false },
      { date: "Jun 23, 2026 – 11:00", label: "Shipped", detail: "Package handed to courier", done: true, current: false },
      { date: "Jun 10, 2026 – 15:30", label: "Order Confirmed", detail: "Payment verified and order confirmed", done: true, current: false },
    ],
  },
};

interface MockOrder {
  id: string;
  status: string;
  placedDate: string;
  deliveredDate: string | null;
  estimatedDate: string;
  product: string;
  variant: string;
  qty: number;
  price: number;
  image: string;
  tracking: string;
  courier: string;
  customer: { name: string; address: string; city: string; phone: string };
  shipping: number;
  events: { date: string; label: string; detail: string; done: boolean; current: boolean }[];
}

// ─── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType; description: string }> = {
  delivered: {
    label: "Delivered",
    color: "#4E7A63",
    bg: "rgba(78,122,99,0.1)",
    icon: CheckCircle2,
    description: "Your order has been successfully delivered.",
  },
  in_transit: {
    label: "In Transit",
    color: "#C28a5c",
    bg: "rgba(194,138,92,0.1)",
    icon: Truck,
    description: "Your package is on its way and will arrive soon.",
  },
  processing: {
    label: "Processing",
    color: "#0F1B2D",
    bg: "rgba(15,27,45,0.08)",
    icon: Clock,
    description: "We are preparing your order for dispatch.",
  },
  confirmed: {
    label: "Confirmed",
    color: "#0F1B2D",
    bg: "rgba(15,27,45,0.08)",
    icon: Package,
    description: "Order confirmed. Preparing for shipping.",
  },
};

const JOURNEY_STEPS = ["Order Placed", "Confirmed", "Shipped", "In Transit", "Delivered"];
const STATUS_TO_STEP: Record<string, number> = {
  confirmed: 1,
  processing: 2,
  in_transit: 3,
  delivered: 4,
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<MockOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    const key = query.trim().replace(/^#?JRV-?/i, "JRV-").replace(/^#/, "");
    const found = MOCK_ORDERS[key] || MOCK_ORDERS[key.replace("JRV-", "")] || null;

    if (found) {
      setResult(found);
    } else {
      setError("No order found with that ID. Please check your order confirmation email and try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.tracking);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusInfo = result ? STATUS_CONFIG[result.status] ?? STATUS_CONFIG["confirmed"] : null;
  const currentStep = result ? STATUS_TO_STEP[result.status] ?? 0 : 0;

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
        <div className="relative max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20 flex flex-col items-center text-center">
          <span className="font-label-caps text-[10px] tracking-widest text-[#C28a5c] font-bold mb-4">
            CUSTOMER SUPPORT
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-white text-2xl md:text-4xl font-bold uppercase leading-tight">
            Track Your Order
          </h1>
          <p className="font-body-md text-white/60 text-sm md:text-base mt-3 max-w-md">
            Enter your order number to get real-time updates on your shipment.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8 w-full max-w-[520px] flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                placeholder="Order ID — e.g. JRV-0041"
                className="w-full bg-white/10 border border-white/15 focus:border-[#C28a5c]/60 focus:bg-white/15 text-white placeholder:text-white/35 rounded-xl pl-11 pr-4 py-3.5 font-body-md text-sm outline-none transition-all duration-200"
                style={{ backdropFilter: "blur(8px)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3.5 bg-[#C28a5c] hover:bg-[#A8743C] text-white font-label-caps text-[11px] tracking-widest font-bold rounded-xl transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              {loading ? "SEARCHING…" : "TRACK"}
            </button>
          </form>

          {/* Demo hint */}
          <p className="font-label-caps text-[9px] text-white/30 tracking-wider mt-3">
            Try: JRV-0041 (delivered) or JRV-0038 (in transit)
          </p>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14">

        {/* Error state */}
        {error && (
          <div className="max-w-[620px] mx-auto mb-8 flex items-start gap-3 bg-[#ba1a1a]/8 border border-[#ba1a1a]/20 rounded-2xl px-5 py-4">
            <AlertCircle size={16} className="text-[#ba1a1a] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-label-caps text-xs font-bold tracking-wider text-[#ba1a1a]">ORDER NOT FOUND</p>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty / default state */}
        {!result && !error && !loading && (
          <div className="max-w-[860px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Search, title: "Find Your Order", body: "Use the order number from your confirmation email or SMS." },
                { icon: Truck, title: "Live Tracking", body: "See exactly where your package is at every step of delivery." },
                { icon: Home, title: "Delivery Updates", body: "Get estimated arrival and courier information instantly." },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="bg-white rounded-2xl border border-neutral-100 p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0F1B2D]/5 flex items-center justify-center">
                      <Icon size={20} className="text-[#0F1B2D]" />
                    </div>
                    <div>
                      <p className="font-label-caps text-xs font-bold tracking-wider text-[#0F1B2D]">{card.title}</p>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1 leading-relaxed">{card.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 mb-3 font-bold">NEED HELP?</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/faqs" className="flex items-center gap-2 font-label-caps text-[11px] font-bold tracking-widest text-[#C28a5c] hover:text-[#0F1B2D] transition-colors">
                  <ArrowRight size={12} /> VIEW FAQS
                </Link>
                <Link href="/exchange-refund" className="flex items-center gap-2 font-label-caps text-[11px] font-bold tracking-widest text-[#C28a5c] hover:text-[#0F1B2D] transition-colors">
                  <ArrowRight size={12} /> EXCHANGES & REFUNDS
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && statusInfo && (
          <div className="max-w-[860px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

            {/* Left: Tracking Card */}
            <div className="flex flex-col gap-5">

              {/* Status Banner */}
              <div
                className="rounded-2xl p-5 flex items-center gap-4 border"
                style={{ background: statusInfo.bg, borderColor: `${statusInfo.color}25` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${statusInfo.color}20` }}>
                  {React.createElement(statusInfo.icon, { size: 20, color: statusInfo.color })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-label-caps text-[10px] font-bold tracking-widest" style={{ color: statusInfo.color }}>
                      {statusInfo.label.toUpperCase()}
                    </span>
                    <span className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-wider">
                      {result.id}
                    </span>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant mt-0.5">{statusInfo.description}</p>
                  {result.deliveredDate ? (
                    <p className="font-label-caps text-[10px] font-bold text-[#4E7A63] tracking-wider mt-1">Delivered {result.deliveredDate}</p>
                  ) : (
                    <p className="font-label-caps text-[10px] font-bold tracking-wider mt-1" style={{ color: statusInfo.color }}>
                      Est. Arrival: {result.estimatedDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Steps */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 font-bold mb-5">DELIVERY PROGRESS</p>
                <div className="flex items-center justify-between gap-1">
                  {JOURNEY_STEPS.map((step, i) => {
                    const isDone = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              isCurrent ? "ring-2 ring-offset-2 ring-[#C28a5c]" : ""
                            }`}
                            style={{
                              background: isDone ? (isCurrent ? "#C28a5c" : "#0F1B2D") : "rgba(15,27,45,0.06)",
                            }}
                          >
                            {isDone ? (
                              <CheckCircle2 size={14} className="text-white" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-neutral-300" />
                            )}
                          </div>
                          <span className={`font-label-caps text-[8px] text-center leading-tight max-w-[52px] tracking-wide ${isDone ? "text-[#0F1B2D] font-bold" : "text-on-surface-variant/40"}`}>
                            {step}
                          </span>
                        </div>
                        {i < JOURNEY_STEPS.length - 1 && (
                          <div
                            className="flex-1 h-0.5 mx-0.5 mb-4 rounded-full"
                            style={{ background: i < currentStep ? "#0F1B2D" : "rgba(15,27,45,0.1)" }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Events */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 bg-[#F9F8F6] border-b border-neutral-100">
                  <p className="font-label-caps text-[10px] tracking-widest font-bold text-on-surface-variant/70">SHIPMENT EVENTS</p>
                </div>
                <div className="flex flex-col divide-y divide-neutral-50">
                  {result.events.map((event, i) => (
                    <div key={i} className={`flex gap-4 px-6 py-4 ${event.current ? "bg-[#C28a5c]/5" : ""}`}>
                      <div className="flex flex-col items-center pt-1 gap-1 flex-shrink-0">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: event.current ? "#C28a5c" : event.done ? "#0F1B2D" : "rgba(15,27,45,0.08)" }}
                        >
                          {event.done ? (
                            <CheckCircle2 size={10} className="text-white" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                          )}
                        </div>
                        {i < result.events.length - 1 && (
                          <div className="w-px flex-1 min-h-[20px] bg-neutral-100" />
                        )}
                      </div>
                      <div className="pb-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-label-caps text-[10px] font-bold tracking-wider ${event.current ? "text-[#C28a5c]" : "text-[#0F1B2D]"}`}>
                            {event.label}
                          </span>
                          {event.current && (
                            <span className="font-label-caps text-[8px] bg-[#C28a5c]/10 text-[#C28a5c] px-2 py-0.5 rounded-full font-bold tracking-wider">CURRENT</span>
                          )}
                        </div>
                        <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{event.detail}</p>
                        <p className="font-label-caps text-[9px] text-on-surface-variant/50 tracking-wider mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order & Courier Info */}
            <div className="flex flex-col gap-5">

              {/* Product Card */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-5 py-4 bg-[#F9F8F6] border-b border-neutral-100">
                  <p className="font-label-caps text-[10px] tracking-widest font-bold text-on-surface-variant/70">ORDER SUMMARY</p>
                </div>
                <div className="p-5 flex gap-4">
                  <div className="w-20 h-24 relative flex-shrink-0 rounded-xl overflow-hidden bg-[#F3F2EE]">
                    <Image src={result.image} alt={result.product} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-caps text-xs font-bold text-[#0F1B2D] tracking-wider">{result.product}</p>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1">{result.variant}</p>
                    <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Qty: {result.qty}</p>
                    <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-between items-center">
                      <span className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-wider">TOTAL</span>
                      <span className="font-mono text-sm font-bold text-[#0F1B2D]">LE {(result.price + result.shipping).toLocaleString()}.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Number */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <p className="font-label-caps text-[10px] tracking-widest font-bold text-on-surface-variant/60 mb-3">TRACKING NUMBER</p>
                <div className="flex items-center justify-between bg-[#F9F8F6] rounded-xl px-4 py-3 border border-neutral-100">
                  <span className="font-mono text-sm font-bold text-[#0F1B2D]">{result.tracking}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 font-label-caps text-[9px] font-bold tracking-wider transition-colors cursor-pointer focus:outline-none"
                    style={{ color: copied ? "#4E7A63" : "#C28a5c" }}
                  >
                    <Copy size={11} />
                    {copied ? "COPIED!" : "COPY"}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Truck size={12} className="text-on-surface-variant/50 flex-shrink-0" />
                  <span className="font-body-md text-xs text-on-surface-variant">{result.courier}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <p className="font-label-caps text-[10px] tracking-widest font-bold text-on-surface-variant/60 mb-3">DELIVERY ADDRESS</p>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0F1B2D]/5 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-[#0F1B2D]" />
                  </div>
                  <div>
                    <p className="font-body-md text-sm font-medium text-[#0F1B2D]">{result.customer.name}</p>
                    <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{result.customer.address}</p>
                    <p className="font-body-md text-xs text-on-surface-variant">{result.customer.city}, Egypt</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Phone size={11} className="text-on-surface-variant/50" />
                      <span className="font-body-md text-xs text-on-surface-variant">{result.customer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/exchange-refund"
                  className="w-full py-3 text-center font-label-caps text-[10px] font-bold tracking-widest text-[#0F1B2D] border border-[#0F1B2D]/20 rounded-xl hover:bg-[#0F1B2D]/5 transition-colors"
                >
                  REQUEST EXCHANGE / REFUND
                </Link>
                <Link
                  href="/products"
                  className="w-full py-3 text-center font-label-caps text-[10px] font-bold tracking-widest text-on-surface-variant border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
