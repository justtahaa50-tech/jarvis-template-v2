"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Search,
  X,
  SlidersHorizontal,
  ShoppingBag,
  ArrowRight,
  Clock,
} from "lucide-react";
import { ringerTeeProduct } from "@/data/dummyData";

/* ─────────────────────────────────────────────────────────── */
/*  Catalog – one entry per colorway                          */
/* ─────────────────────────────────────────────────────────── */

interface CatalogEntry {
  id: string;
  color: string;
  image: string;
  inStock: boolean;
  availableSizes: string[];
  defaultVariantId: string;
}

const SEARCH_CATALOG: CatalogEntry[] = [
  {
    id: "black-white",
    color: "Black / White",
    image: "/assets/BLACK/atef-front.jpg",
    inStock: true,
    availableSizes: ["S", "M", "L", "XL"],
    defaultVariantId: "var_black_m",
  },
  {
    id: "creamy-olive",
    color: "Creamy / Olive",
    image: "/assets/CREAMY-OLIVE/nour-front_1.jpg",
    inStock: true,
    availableSizes: ["S", "M", "L", "XL"],
    defaultVariantId: "var_colive_m",
  },
  {
    id: "creamy-burgundy",
    color: "Creamy / Burgundy",
    image: "/assets/CREAMY-BURGUNDY/gogo-front.jpg",
    inStock: true,
    availableSizes: ["S", "M"],
    defaultVariantId: "var_cburg_m",
  },
  {
    id: "olive-white",
    color: "Olive / White",
    image: "/assets/OLIVE-WHITE/gogo-front_1.jpg",
    inStock: true,
    availableSizes: ["S", "M", "L", "XL"],
    defaultVariantId: "var_owhite_m",
  },
  {
    id: "rose-white",
    color: "Rose / White",
    image: "/assets/ROSE/nour-1.jpg",
    inStock: false,
    availableSizes: [],
    defaultVariantId: "var_rose_s",
  },
  {
    id: "army-white",
    color: "Army / White",
    image: "/assets/ARMY/atef-front_2.jpg",
    inStock: true,
    availableSizes: ["S", "M", "L", "XL"],
    defaultVariantId: "var_army_m",
  },
  {
    id: "burgundy-white",
    color: "Burgundy / White",
    image: "/assets/BURGUNDY/hana-front_1.jpg",
    inStock: true,
    availableSizes: ["S", "M", "L", "XL"],
    defaultVariantId: "var_burg_m",
  },
];

const POPULAR_SEARCHES = ["ringer tee", "black", "army", "creamy", "olive"];
const MAX_RECENT = 5;
const SKELETON_DELAY = 400;

/* ─────────────────────────────────────────────────────────── */
/*  Skeleton card                                             */
/* ─────────────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        <div className="absolute inset-0 bg-surface-container-high rounded-sm" />
      </div>
      <div className="h-3 bg-surface-container-high rounded w-1/2" />
      <div className="h-4 bg-surface-container-high rounded w-3/4" />
      <div className="h-4 bg-surface-container-high rounded w-1/3" />
      <div className="h-10 bg-surface-container-high rounded w-full" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Product card                                              */
/* ─────────────────────────────────────────────────────────── */

function ProductCard({ entry }: { entry: CatalogEntry }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!entry.inStock) return;
    addToCart(ringerTeeProduct, entry.defaultVariantId, 1, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group flex flex-col gap-3 shimmer-card">
      {/* Image */}
      <Link
        href={`/products/ringer-tee?color=${entry.id}`}
        className="relative block overflow-hidden rounded-sm bg-surface-container"
        style={{ paddingBottom: "133.33%" }}
      >
        <div className="absolute inset-0">
          <Image
            src={entry.image}
            alt={`THE RINGER TEE — ${entry.color}`}
            fill
            className={`object-cover object-top transition-transform duration-700 group-hover:scale-105 ${
              !entry.inStock ? "opacity-60 grayscale" : ""
            }`}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {/* 20% OFF badge — always shown */}
          <span
            className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-on-primary rounded-sm"
            style={{ backgroundColor: "#C28a5c" }}
          >
            20% OFF
          </span>

          {!entry.inStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-on-primary rounded-sm bg-secondary">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick view arrow on hover */}
        <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary">
            <ArrowRight size={14} />
          </div>
        </div>
      </Link>

      {/* Meta */}
      <div className="flex flex-col gap-1 px-0.5">
        <span className="font-label-caps text-[10px] text-on-surface/50 tracking-widest">
          THE RINGER TEE
        </span>
        <h3 className="text-sm font-semibold text-on-surface leading-tight">
          {entry.color}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-on-surface">LE 700</span>
          <span className="text-xs text-on-surface/40 line-through">LE 875</span>
        </div>

        {/* Sizes */}
        {entry.inStock && entry.availableSizes.length > 0 && (
          <div className="flex gap-1 mt-1">
            {(["S", "M", "L", "XL"] as const).map((s) => (
              <span
                key={s}
                className={`text-[9px] font-semibold px-1.5 py-0.5 border rounded-sm ${
                  entry.availableSizes.includes(s)
                    ? "border-outline/30 text-on-surface/70"
                    : "border-outline-variant/30 text-on-surface/30 line-through"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!entry.inStock}
        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-sm transition-all duration-300 ${
          !entry.inStock
            ? "bg-surface-container-high text-on-surface/40 cursor-not-allowed"
            : added
            ? "bg-success text-white"
            : "bg-primary text-on-primary hover:bg-primary-hover active:scale-[0.98]"
        }`}
      >
        <ShoppingBag size={13} />
        {!entry.inStock ? "Out of Stock" : added ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main search page (inner – uses useSearchParams)           */
/* ─────────────────────────────────────────────────────────── */

function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "in-stock" | "out-of-stock"
  >("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  /* Load recent searches from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jarvis_recent_searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  /* Skeleton loading on query change */
  useEffect(() => {
    if (debouncedQuery === query) return;
    setLoading(true);
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setLoading(false);
    }, SKELETON_DELAY);
    return () => clearTimeout(t);
  }, [query, debouncedQuery]);

  /* Persist recent search when debouncedQuery changes */
  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    setRecentSearches((prev) => {
      const next = [
        debouncedQuery.trim(),
        ...prev.filter((r) => r !== debouncedQuery.trim()),
      ].slice(0, MAX_RECENT);
      try {
        localStorage.setItem("jarvis_recent_searches", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [debouncedQuery]);

  /* Filter logic */
  const results = SEARCH_CATALOG.filter((entry) => {
    const q = debouncedQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      entry.color.toLowerCase().includes(q) ||
      "ringer tee".includes(q) ||
      "the ringer tee".includes(q) ||
      entry.id.includes(q);

    const matchesSize =
      selectedSizes.length === 0 ||
      selectedSizes.some((s) => entry.availableSizes.includes(s));

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "in-stock" && entry.inStock) ||
      (availabilityFilter === "out-of-stock" && !entry.inStock);

    return matchesQuery && matchesSize && matchesAvailability;
  });

  /* Helpers */
  const toggleSize = useCallback((s: string) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }, []);

  const clearAll = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedSizes([]);
    setAvailabilityFilter("all");
  };

  const applySearch = (term: string) => {
    setQuery(term);
  };

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((r) => r !== term);
      try {
        localStorage.setItem("jarvis_recent_searches", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const activeFilterCount =
    selectedSizes.length + (availabilityFilter !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero search bar ───────────────────────────────────── */}
      <section
        className="w-full py-12 md:py-20"
        style={{ backgroundColor: "#0F1B2D" }}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-16">
          {/* Label */}
          <p className="font-label-caps text-[11px] tracking-[0.2em] text-on-primary/50 mb-4">
            JARVIS STORE
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-primary mb-8 tracking-tight">
            Search
          </h1>

          {/* Search input */}
          <div className="relative max-w-2xl">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-primary/40 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, colours…"
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-white/8 border border-white/15 rounded-sm text-on-primary placeholder-on-primary/30 text-base focus:outline-none focus:border-tertiary transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-primary/40 hover:text-on-primary transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-on-primary/40 font-semibold tracking-widest uppercase">
              Popular:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => applySearch(term)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/15 text-on-primary/70 hover:border-tertiary hover:text-on-primary transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-on-primary/40 font-semibold tracking-widest uppercase flex items-center gap-1">
                <Clock size={11} />
                Recent:
              </span>
              {recentSearches.map((term) => (
                <span
                  key={term}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-on-primary/50"
                >
                  <button
                    onClick={() => applySearch(term)}
                    className="hover:text-on-primary transition-colors"
                  >
                    {term}
                  </button>
                  <button
                    onClick={() => removeRecent(term)}
                    className="text-on-primary/30 hover:text-on-primary/70 transition-colors ml-0.5"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Filters + Results ─────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-16 py-8 md:py-12">
        {/* Results bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            {debouncedQuery ? (
              <p className="text-sm text-on-surface/60">
                {loading ? (
                  "Searching…"
                ) : (
                  <>
                    <span className="font-bold text-on-surface">
                      {results.length}
                    </span>{" "}
                    result{results.length !== 1 ? "s" : ""} for{" "}
                    <span className="font-bold text-on-surface">
                      &ldquo;{debouncedQuery}&rdquo;
                    </span>
                  </>
                )}
              </p>
            ) : (
              <p className="text-sm text-on-surface/60">
                Showing{" "}
                <span className="font-bold text-on-surface">
                  {results.length}
                </span>{" "}
                product{results.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-on-surface/50 hover:text-on-surface underline underline-offset-2 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-sm text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                showFilters || activeFilterCount > 0
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant text-on-surface hover:border-primary"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                  style={{ backgroundColor: "#C28a5c", color: "#0F1B2D" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter chips panel */}
        {showFilters && (
          <div className="mb-8 p-5 border border-outline-variant rounded-sm bg-surface-container-low">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Size filter */}
              <div className="flex-1">
                <p className="font-label-caps text-[10px] tracking-widest text-on-surface/50 mb-3">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["S", "M", "L", "XL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-4 py-2 border rounded-sm text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                        selectedSizes.includes(s)
                          ? "border-primary bg-primary text-on-primary"
                          : "border-outline-variant text-on-surface hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability filter */}
              <div className="flex-1">
                <p className="font-label-caps text-[10px] tracking-widest text-on-surface/50 mb-3">
                  Availability
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(
                    [
                      ["all", "All"],
                      ["in-stock", "In Stock"],
                      ["out-of-stock", "Out of Stock"],
                    ] as const
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setAvailabilityFilter(val)}
                      className={`px-4 py-2 border rounded-sm text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                        availabilityFilter === val
                          ? "border-primary bg-primary text-on-primary"
                          : "border-outline-variant text-on-surface hover:border-primary"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filter chips (compact summary row) */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold"
              >
                Size: {s} <X size={11} />
              </button>
            ))}
            {availabilityFilter !== "all" && (
              <button
                onClick={() => setAvailabilityFilter("all")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold"
              >
                {availabilityFilter === "in-stock" ? "In Stock" : "Out of Stock"}{" "}
                <X size={11} />
              </button>
            )}
          </div>
        )}

        {/* ── Product grid / skeleton / empty state ─────────── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
            {results.map((entry) => (
              <ProductCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: "#C28a5c22" }}
            >
              <Search size={28} style={{ color: "#C28a5c" }} />
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2">
              No results found
            </h2>
            <p className="text-sm text-on-surface/50 max-w-xs mb-8">
              We couldn&apos;t find anything for{" "}
              <span className="font-semibold text-on-surface">
                &ldquo;{debouncedQuery || "your search"}&rdquo;
              </span>
              . Try a different term or browse popular searches below.
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setSelectedSizes([]);
                    setAvailabilityFilter("all");
                  }}
                  className="px-4 py-2 border border-outline-variant rounded-sm text-xs font-semibold tracking-widest uppercase text-on-surface hover:border-primary hover:text-primary transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>

            <Link
              href="/products"
              className="mt-8 flex items-center gap-2 text-sm font-semibold text-on-surface/60 hover:text-on-surface underline underline-offset-4 transition-colors"
            >
              View all products <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Wrapper – required because useSearchParams needs Suspense */
/* ─────────────────────────────────────────────────────────── */

function SearchPageFallback() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#C28a5c", borderTopColor: "transparent" }}
        />
        <p className="text-sm text-on-surface/50 tracking-widest uppercase font-semibold">
          Loading…
        </p>
      </div>
    </div>
  );
}

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPage />
    </Suspense>
  );
}
