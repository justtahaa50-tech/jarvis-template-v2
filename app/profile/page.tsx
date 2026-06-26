"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  LogOut,
  Edit3,
  ChevronRight,
  CheckCircle2,
  Truck,
  Clock,
  Star,
  Gift,
  Shield,
  Phone,
  Mail,
  Home,
  Copy,
  Eye,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_USER = {
  firstName: "Ahmed",
  lastName: "Taha",
  email: "ahmed.taha@example.com",
  phone: "+20 100 000 0000",
  city: "Cairo",
  address: "123 Tahrir Square, Downtown Cairo",
  memberSince: "January 2024",
  tier: "GOLD",
  points: 1240,
  nextTierPoints: 2000,
  totalOrders: 4,
  totalSpent: 2800,
};

const MOCK_ORDERS = [
  {
    id: "#JRV-0041",
    date: "Jun 20, 2026",
    status: "delivered",
    product: "THE RINGER TEE",
    variant: "Black / White — Size M",
    price: 700,
    image: "/assets/BLACK/atef-front.jpg",
    tracking: "EG123456789",
    steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"],
    currentStep: 3,
  },
  {
    id: "#JRV-0038",
    date: "Jun 10, 2026",
    status: "shipped",
    product: "THE RINGER TEE",
    variant: "Creamy / Olive — Size L",
    price: 700,
    image: "/assets/CREAMY-OLIVE/nour-front_1.jpg",
    tracking: "EG987654321",
    steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"],
    currentStep: 2,
  },
  {
    id: "#JRV-0027",
    date: "Mar 5, 2026",
    status: "delivered",
    product: "THE RINGER TEE",
    variant: "Army / White — Size M",
    price: 700,
    image: "/assets/ARMY/atef-front_2.jpg",
    tracking: "EG111222333",
    steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"],
    currentStep: 3,
  },
  {
    id: "#JRV-0015",
    date: "Jan 18, 2026",
    status: "delivered",
    product: "THE RINGER TEE",
    variant: "Burgundy / White — Size S",
    price: 700,
    image: "/assets/BURGUNDY/hana-front_1.jpg",
    tracking: "EG444555666",
    steps: ["Order Placed", "Confirmed", "Shipped", "Delivered"],
    currentStep: 3,
  },
];

const TIER_CONFIG = {
  BRONZE: { color: "#B87333", label: "Bronze Member", min: 0, max: 500 },
  SILVER: { color: "#9CA3AF", label: "Silver Member", min: 500, max: 1000 },
  GOLD: { color: "#C28a5c", label: "Gold Member", min: 1000, max: 2000 },
  PLATINUM: { color: "#0F1B2D", label: "Platinum Member", min: 2000, max: Infinity },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  delivered: { label: "Delivered", color: "#4E7A63", bg: "rgba(78, 122, 99, 0.1)", icon: CheckCircle2 },
  shipped: { label: "In Transit", color: "#C28a5c", bg: "rgba(194, 138, 92, 0.1)", icon: Truck },
  confirmed: { label: "Processing", color: "#0F1B2D", bg: "rgba(15, 27, 45, 0.08)", icon: Clock },
  cancelled: { label: "Cancelled", color: "#ba1a1a", bg: "rgba(186, 26, 26, 0.1)", icon: RefreshCw },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function OrderCard({ order }: { order: typeof MOCK_ORDERS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(15,27,45,0.07)] transition-shadow duration-300">
      <div className="flex gap-4 p-4 md:p-5">
        {/* Product image */}
        <div className="w-20 h-24 md:w-24 md:h-28 relative flex-shrink-0 rounded-xl overflow-hidden bg-[#F3F2EE]">
          <Image src={order.image} alt={order.product} fill sizes="96px" className="object-cover" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant/60 tracking-widest">{order.id}</p>
              <h3 className="font-body-md text-sm font-bold text-[#0F1B2D] mt-0.5">{order.product}</h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{order.variant}</p>
            </div>
            <span
              className="flex-shrink-0 flex items-center gap-1 font-label-caps text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full"
              style={{ color: status.color, background: status.bg }}
            >
              <StatusIcon size={10} />
              {status.label}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant/60">{order.date}</p>
              <p className="font-mono text-sm font-bold text-[#0F1B2D]">LE {order.price.toLocaleString()}.00</p>
            </div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 font-label-caps text-[10px] text-[#C28a5c] font-bold tracking-wider hover:text-[#0F1B2D] transition-colors cursor-pointer focus:outline-none"
            >
              {expanded ? "HIDE" : "DETAILS"}
              <ChevronRight size={12} className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded tracking */}
      {expanded && (
        <div className="border-t border-neutral-100 px-4 md:px-5 py-4 bg-[#F9F8F6]">
          {/* Steps */}
          <div className="flex items-center justify-between mb-4">
            {order.steps.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: i <= order.currentStep ? "#0F1B2D" : "rgba(15,27,45,0.08)",
                    }}
                  >
                    {i <= order.currentStep ? (
                      <CheckCircle2 size={12} className="text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-neutral-300" />
                    )}
                  </div>
                  <span className="font-label-caps text-[8px] text-center text-on-surface-variant/70 tracking-wide max-w-[50px] leading-tight">
                    {step}
                  </span>
                </div>
                {i < order.steps.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1"
                    style={{
                      background: i < order.currentStep ? "#0F1B2D" : "rgba(15,27,45,0.12)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Tracking number */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-neutral-100 px-4 py-3">
            <div>
              <p className="font-label-caps text-[9px] text-on-surface-variant/60 tracking-widest">TRACKING NUMBER</p>
              <p className="font-mono text-sm font-bold text-[#0F1B2D] mt-0.5">{order.tracking}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(order.tracking)}
              className="flex items-center gap-1.5 font-label-caps text-[9px] text-[#C28a5c] font-bold tracking-wider hover:text-[#0F1B2D] transition-colors cursor-pointer focus:outline-none"
            >
              <Copy size={12} />
              COPY
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Link
              href={`/products/ringer-tee`}
              className="flex-1 py-2.5 text-center font-label-caps text-[10px] font-bold tracking-widest text-[#0F1B2D] border border-[#0F1B2D]/20 rounded-xl hover:bg-[#0F1B2D]/5 transition-colors"
            >
              BUY AGAIN
            </Link>
            <Link
              href="/returns"
              className="flex-1 py-2.5 text-center font-label-caps text-[10px] font-bold tracking-widest text-on-surface-variant border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              RETURN / EXCHANGE
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountForm() {
  const [form, setForm] = useState({
    firstName: MOCK_USER.firstName,
    lastName: MOCK_USER.lastName,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
    address: MOCK_USER.address,
    city: MOCK_USER.city,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full bg-white border border-neutral-200 focus:border-[#C28a5c] focus:ring-2 focus:ring-[#C28a5c]/15 rounded-xl px-4 py-3 font-body-md text-sm text-[#0F1B2D] outline-none transition-all duration-200 placeholder:text-neutral-400";
  const labelClass = "font-label-caps text-[10px] text-on-surface-variant/70 tracking-widest font-bold mb-1.5 block";

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>FIRST NAME</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} placeholder="First name" />
        </div>
        <div>
          <label className={labelClass}>LAST NAME</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Last name" />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>EMAIL ADDRESS</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`${inputClass} pl-9`}
              placeholder="email@example.com"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>PHONE NUMBER</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={`${inputClass} pl-9`}
              placeholder="+20 1XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className={labelClass}>DELIVERY ADDRESS</label>
        <div className="relative">
          <Home size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className={`${inputClass} pl-9`}
            placeholder="Street address"
          />
        </div>
      </div>

      <div className="sm:w-1/2">
        <label className={labelClass}>CITY</label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <select name="city" value={form.city} onChange={handleChange} className={`${inputClass} pl-9 appearance-none cursor-pointer`}>
            {["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta", "Luxor", "Aswan", "Port Said", "Suez", "Hurghada"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Password change */}
      <div className="border-t border-neutral-100 pt-6">
        <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/70 font-bold mb-4">CHANGE PASSWORD</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>NEW PASSWORD</label>
            <input type="password" className={inputClass} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className={labelClass}>CONFIRM PASSWORD</label>
            <input type="password" className={inputClass} placeholder="Repeat password" />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-8 py-3 bg-[#0F1B2D] hover:bg-[#1C2D42] text-white font-label-caps text-[11px] tracking-widest font-bold rounded-xl transition-colors cursor-pointer focus:outline-none flex items-center gap-2"
        >
          {saved ? <CheckCircle2 size={14} /> : <Edit3 size={14} />}
          {saved ? "SAVED!" : "SAVE CHANGES"}
        </button>
        {saved && (
          <span className="font-label-caps text-[10px] text-[#4E7A63] font-bold tracking-wider flex items-center gap-1">
            <CheckCircle2 size={12} />
            Your details have been updated
          </span>
        )}
      </div>
    </form>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

type Tab = "orders" | "wishlist" | "account" | "notifications";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "account", label: "Account Details", icon: User },
  { id: "notifications", label: "Preferences", icon: Bell },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const { wishlistItems } = useWishlist();

  const tier = MOCK_USER.tier as keyof typeof TIER_CONFIG;
  const tierInfo = TIER_CONFIG[tier];
  const progressPercent = Math.min(
    ((MOCK_USER.points - tierInfo.min) / (tierInfo.max - tierInfo.min)) * 100,
    100
  );

  return (
    <div className="w-full min-h-screen bg-[#F7F6F2]">
      {/* ─── Profile Hero Header ─── */}
      <div className="w-full bg-[#0F1B2D] relative overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #C28a5c 0, #C28a5c 1px, transparent 0, transparent 50%)",
          backgroundSize: "24px 24px"
        }} />

        <div className="relative max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white font-bold text-2xl md:text-3xl select-none"
                style={{
                  background: "linear-gradient(135deg, #C28a5c 0%, #8F623E 100%)",
                  boxShadow: "0 8px 24px rgba(194,138,92,0.4)"
                }}
              >
                {MOCK_USER.firstName[0]}{MOCK_USER.lastName[0]}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4E7A63] rounded-full border-2 border-[#0F1B2D]" />
            </div>

            {/* Name & Tier */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-headline-lg-mobile text-white text-xl md:text-2xl font-bold">
                  {MOCK_USER.firstName} {MOCK_USER.lastName}
                </h1>
                <span
                  className="font-label-caps text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${tierInfo.color}30`, color: tierInfo.color, border: `1px solid ${tierInfo.color}50` }}
                >
                  {tierInfo.label}
                </span>
              </div>
              <p className="font-body-md text-sm text-white/60">{MOCK_USER.email}</p>
              <p className="font-label-caps text-[10px] text-white/40 tracking-widest mt-1">
                MEMBER SINCE {MOCK_USER.memberSince}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 md:gap-8">
              {[
                { label: "ORDERS", value: MOCK_USER.totalOrders },
                { label: "SPENT", value: `LE ${MOCK_USER.totalSpent.toLocaleString()}` },
                { label: "WISHLIST", value: wishlistItems.length },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <span className="font-mono text-xl md:text-2xl font-bold text-white">{stat.value}</span>
                  <span className="font-label-caps text-[9px] text-white/40 tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Loyalty Points Bar */}
          <div className="mt-8 bg-white/5 rounded-2xl p-4 md:p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star size={14} style={{ color: tierInfo.color }} />
                <span className="font-label-caps text-[10px] text-white/70 tracking-widest font-bold">
                  LOYALTY POINTS
                </span>
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: tierInfo.color }}>
                {MOCK_USER.points.toLocaleString()} pts
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, ${tierInfo.color}80, ${tierInfo.color})` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-label-caps text-[9px] text-white/40 tracking-wider">
                {MOCK_USER.points} / {MOCK_USER.nextTierPoints} pts for Platinum
              </span>
              <span className="font-label-caps text-[9px] font-bold tracking-wider" style={{ color: tierInfo.color }}>
                {MOCK_USER.nextTierPoints - MOCK_USER.points} pts away
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tabs Navigation ─── */}
      <div className="w-full bg-white border-b border-neutral-100 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-0 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-5 py-4 font-label-caps text-[10px] md:text-[11px] tracking-widest font-bold whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer focus:outline-none ${
                    isActive
                      ? "border-[#C28a5c] text-[#0F1B2D]"
                      : "border-transparent text-on-surface-variant/60 hover:text-[#0F1B2D] hover:border-neutral-200"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                  {tab.id === "wishlist" && wishlistItems.length > 0 && (
                    <span className="ml-1 min-w-4 h-4 bg-[#C28a5c] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Sign out — pushed to right on desktop */}
            <div className="ml-auto flex-shrink-0 hidden md:flex">
              <button className="flex items-center gap-2 px-5 py-4 font-label-caps text-[10px] tracking-widest font-bold text-neutral-400 hover:text-[#ba1a1a] transition-colors cursor-pointer focus:outline-none">
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        <div className="max-w-[860px]">

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display-md text-display-md text-[#0F1B2D] font-bold">Order History</h2>
                  <p className="font-body-md text-sm text-on-surface-variant mt-1">{MOCK_ORDERS.length} orders placed</p>
                </div>
                <Link
                  href="/products"
                  className="flex items-center gap-2 font-label-caps text-[10px] tracking-widest font-bold text-[#C28a5c] hover:text-[#0F1B2D] transition-colors"
                >
                  SHOP MORE <ArrowRight size={12} />
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {MOCK_ORDERS.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display-md text-display-md text-[#0F1B2D] font-bold">My Wishlist</h2>
                  <p className="font-body-md text-sm text-on-surface-variant mt-1">
                    {wishlistItems.length} saved {wishlistItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 font-label-caps text-[10px] tracking-widest font-bold text-[#C28a5c] hover:text-[#0F1B2D] transition-colors"
                >
                  VIEW ALL <ArrowRight size={12} />
                </Link>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-100 p-12 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-[#F3F2EE] rounded-2xl flex items-center justify-center">
                    <Heart size={28} className="text-neutral-300" />
                  </div>
                  <div>
                    <h3 className="font-label-caps text-sm tracking-widest text-[#0F1B2D] font-bold">YOUR WISHLIST IS EMPTY</h3>
                    <p className="font-body-md text-sm text-on-surface-variant mt-2">Save items you love to your wishlist</p>
                  </div>
                  <Link
                    href="/products"
                    className="px-6 py-3 bg-[#0F1B2D] text-white font-label-caps text-[11px] tracking-widest font-bold rounded-xl hover:bg-[#1C2D42] transition-colors"
                  >
                    BROWSE PRODUCTS
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.product.handle}${item.selectedColor ? `?variant=${item.selectedColor.toLowerCase().replace(/ \/ /g, "-").replace(/ /g, "-")}` : ""}`}
                      className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:border-[#C28a5c]/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative aspect-[3/4] bg-[#F3F2EE]">
                        {item.selectedImage ? (
                          <Image
                            src={item.selectedImage}
                            alt={item.product.title}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={32} className="text-neutral-300" />
                          </div>
                        )}
                        {item.selectedColor && (
                          <div className="absolute top-3 left-3">
                            <span className="font-label-caps text-[8px] px-2 py-0.5 font-bold tracking-widest text-white rounded-full"
                              style={{ background: "rgba(15,27,45,0.75)", backdropFilter: "blur(8px)" }}>
                              {item.selectedColor}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-label-caps text-[10px] font-bold text-[#0F1B2D] truncate">{item.product.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-mono text-xs font-bold text-[#0F1B2D]">LE {item.product.price.toFixed(2)}</span>
                          <span className="font-label-caps text-[8px] bg-[#C28a5c]/10 text-[#C28a5c] px-1.5 py-0.5 rounded-full font-bold">20% OFF</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT DETAILS TAB */}
          {activeTab === "account" && (
            <div>
              <div className="mb-8">
                <h2 className="font-display-md text-display-md text-[#0F1B2D] font-bold">Account Details</h2>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">Update your personal information and delivery preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
                {/* Form */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <AccountForm />
                </div>

                {/* Sidebar: Perks & Security */}
                <div className="flex flex-col gap-4">
                  {/* Member Tier Card */}
                  <div
                    className="rounded-2xl p-5 border text-white"
                    style={{
                      background: "linear-gradient(135deg, #0F1B2D 0%, #1C2D42 100%)",
                      borderColor: `${tierInfo.color}30`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Star size={14} style={{ color: tierInfo.color }} />
                      <span className="font-label-caps text-[10px] tracking-widest font-bold" style={{ color: tierInfo.color }}>
                        {tierInfo.label.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-2xl font-bold">{MOCK_USER.points.toLocaleString()}</p>
                    <p className="font-label-caps text-[9px] text-white/50 tracking-widest mt-0.5">LOYALTY POINTS</p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="font-label-caps text-[9px] text-white/60 tracking-wider leading-relaxed">
                        Earn 1 point per LE 1 spent. Redeem 100 points for LE 10 off your next order.
                      </p>
                    </div>
                  </div>

                  {/* Security Block */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={14} className="text-[#4E7A63]" />
                      <span className="font-label-caps text-[10px] tracking-widest font-bold text-[#0F1B2D]">ACCOUNT SECURITY</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: "Email Verified", done: true },
                        { label: "Phone Confirmed", done: true },
                        { label: "2FA Enabled", done: false },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="font-body-md text-xs text-on-surface-variant">{item.label}</span>
                          <span className={`font-label-caps text-[9px] font-bold tracking-wider ${item.done ? "text-[#4E7A63]" : "text-neutral-400"}`}>
                            {item.done ? "✓ Done" : "Set up"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift size={14} style={{ color: tierInfo.color }} />
                      <span className="font-label-caps text-[10px] tracking-widest font-bold text-[#0F1B2D]">GOLD PERKS</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {["Priority shipping", "Early access to drops", "Exclusive 15% member discount", "Free returns"].map((perk) => (
                        <div key={perk} className="flex items-center gap-2">
                          <CheckCircle2 size={12} style={{ color: tierInfo.color }} className="flex-shrink-0" />
                          <span className="font-body-md text-xs text-on-surface-variant">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS / PREFERENCES TAB */}
          {activeTab === "notifications" && (
            <div>
              <div className="mb-8">
                <h2 className="font-display-md text-display-md text-[#0F1B2D] font-bold">Preferences</h2>
                <p className="font-body-md text-sm text-on-surface-variant mt-1">Manage your notifications and communication settings</p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                {[
                  {
                    section: "EMAIL NOTIFICATIONS",
                    items: [
                      { label: "Order updates & shipping", desc: "Confirmations and tracking updates", on: true },
                      { label: "New drops & releases", desc: "Be first to know about new products", on: true },
                      { label: "Promotions & offers", desc: "Exclusive member discounts", on: false },
                      { label: "Wishlist reminders", desc: "Items back in stock alerts", on: true },
                    ],
                  },
                  {
                    section: "PUSH NOTIFICATIONS",
                    items: [
                      { label: "Order status", desc: "Real-time order tracking", on: true },
                      { label: "Flash sales", desc: "Limited-time offers", on: false },
                    ],
                  },
                ].map((group, gi) => (
                  <div key={gi} className={gi > 0 ? "border-t border-neutral-100" : ""}>
                    <div className="px-6 md:px-8 py-4 bg-[#F9F8F6]">
                      <span className="font-label-caps text-[10px] tracking-widest font-bold text-on-surface-variant/70">{group.section}</span>
                    </div>
                    {group.items.map((item, i) => (
                      <PreferenceRow key={i} label={item.label} desc={item.desc} defaultOn={item.on} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="mt-8 bg-white rounded-2xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 md:px-8 py-4 bg-[#F9F8F6] border-b border-neutral-100">
                  <span className="font-label-caps text-[10px] tracking-widest font-bold text-on-surface-variant/70">ACCOUNT</span>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-4">
                  <button className="flex items-center justify-between w-full group cursor-pointer focus:outline-none">
                    <div className="text-left">
                      <p className="font-body-md text-sm font-medium text-[#0F1B2D] group-hover:text-[#C28a5c] transition-colors">Download my data</p>
                      <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Export all your account data as a file</p>
                    </div>
                    <ChevronRight size={16} className="text-neutral-300 group-hover:text-[#C28a5c] transition-colors" />
                  </button>
                  <div className="border-t border-neutral-100" />
                  <button className="flex items-center justify-between w-full group cursor-pointer focus:outline-none">
                    <div className="text-left">
                      <p className="font-body-md text-sm font-medium text-[#ba1a1a] group-hover:text-[#900000] transition-colors">Delete account</p>
                      <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Permanently delete your account and data</p>
                    </div>
                    <ChevronRight size={16} className="text-neutral-300 group-hover:text-[#ba1a1a] transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Toggle Row Component ────────────────────────────────────────────────────

function PreferenceRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-4 border-b border-neutral-50 last:border-0">
      <div>
        <p className="font-body-md text-sm text-[#0F1B2D] font-medium">{label}</p>
        <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200 cursor-pointer focus:outline-none ${
          on ? "bg-[#C28a5c]" : "bg-neutral-200"
        }`}
        aria-label={on ? "Turn off" : "Turn on"}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
