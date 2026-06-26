"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { ringerTeeProduct } from "@/data/dummyData";
import { SlidersHorizontal, ChevronDown, Check, X, RotateCcw } from "lucide-react";

const allVariants = [
  { name: "BLACK / WHITE", slug: "black-white", image: "/assets/BLACK/atef-front.jpg", color: "Black" },
  { name: "CREAMY / OLIVE", slug: "creamy-olive", image: "/assets/CREAMY-OLIVE/nour-front_1.jpg", color: "Creamy" },
  { name: "CREAMY / BURGUNDY", slug: "creamy-burgundy", image: "/assets/CREAMY-BURGUNDY/gogo-front.jpg", color: "Creamy" },
  { name: "OLIVE / WHITE", slug: "olive-white", image: "/assets/OLIVE-WHITE/gogo-front_1.jpg", color: "Olive" },
  { name: "ROSE / WHITE", slug: "rose-white", image: "/assets/ROSE/nour-1.jpg", color: "Rose" },
  { name: "ARMY / WHITE", slug: "army-white", image: "/assets/ARMY/atef-front_2.jpg", color: "Army" },
  { name: "BURGUNDY / WHITE", slug: "burgundy-white", image: "/assets/BURGUNDY/hana-front_1.jpg", color: "Burgundy" }
];

const colorMap: { [key: string]: string } = {
  "black-white": "Black / White",
  "creamy-olive": "Creamy / Olive",
  "creamy-burgundy": "Creamy / Burgundy",
  "olive-white": "Olive / White",
  "rose-white": "Rose / White",
  "army-white": "Army / White",
  "burgundy-white": "Burgundy / White",
};

const swatchColors: { [key: string]: string } = {
  "Black": "#0F1B2D",
  "Creamy": "#EFECE4",
  "Olive": "#5A614E",
  "Rose": "#D3AFA1",
  "Army": "#45493B",
  "Burgundy": "#642935"
};

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha-asc", label: "Alphabetical: A-Z" },
  { value: "alpha-desc", label: "Alphabetical: Z-A" },
];

export default function ProductsPage() {
  const [gridCols, setGridCols] = useState<number>(4);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  
  // Filter states
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>("default");

  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // List of colors for swatches
  const colors = ["Black", "Creamy", "Olive", "Rose", "Army", "Burgundy"];

  // Filter and Sort variants
  const filteredVariants = useMemo(() => {
    let items = [...allVariants];
    
    // 1. Color Filter (Multi-select)
    if (selectedColors.length > 0) {
      items = items.filter(v => selectedColors.includes(v.color));
    }

    // 2. Size Filter (Multi-select)
    if (selectedSizes.length > 0) {
      items = items.filter(v => {
        const colorName = colorMap[v.slug];
        return ringerTeeProduct.variants.some(sv => 
          sv.options["Color"] === colorName && 
          selectedSizes.includes(sv.options["Size"]) &&
          (!inStockOnly || sv.available)
        );
      });
    }

    // 3. Stock Filter
    if (inStockOnly && selectedSizes.length === 0) {
      items = items.filter(v => {
        const colorName = colorMap[v.slug];
        return ringerTeeProduct.variants.some(sv => 
          sv.options["Color"] === colorName && sv.available
        );
      });
    }

    // 4. Price Filter
    if (priceRange < 1000) {
      items = items.filter(v => {
        const colorName = colorMap[v.slug];
        return ringerTeeProduct.variants.some(sv => 
          sv.options["Color"] === colorName && sv.price <= priceRange
        );
      });
    }

    // Sort
    if (sortBy === "alpha-asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "alpha-desc") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price-asc") {
      items.sort((a, b) => {
        const pA = ringerTeeProduct.variants.find(sv => sv.options["Color"] === colorMap[a.slug])?.price || 0;
        const pB = ringerTeeProduct.variants.find(sv => sv.options["Color"] === colorMap[b.slug])?.price || 0;
        return pA - pB;
      });
    } else if (sortBy === "price-desc") {
      items.sort((a, b) => {
        const pA = ringerTeeProduct.variants.find(sv => sv.options["Color"] === colorMap[a.slug])?.price || 0;
        const pB = ringerTeeProduct.variants.find(sv => sv.options["Color"] === colorMap[b.slug])?.price || 0;
        return pB - pA;
      });
    }

    return items;
  }, [selectedColors, selectedSizes, inStockOnly, priceRange, sortBy]);

  const hasActiveFilters = selectedColors.length > 0 || selectedSizes.length > 0 || inStockOnly || priceRange < 1000;
  
  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setPriceRange(1000);
  };

  const getGridClass = () => {
    if (gridCols === 1) return "flex flex-col gap-6";
    if (gridCols === 2) return "grid grid-cols-2 gap-gutter";
    if (gridCols === 3) return "grid grid-cols-2 md:grid-cols-3 gap-gutter";
    if (gridCols === 4) return "grid grid-cols-2 md:grid-cols-4 gap-gutter";
    if (gridCols === 5) return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-gutter";
    return "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter"; // 6 cols
  };

  return (
    <div className="w-full bg-[#F7F6F2] min-h-[85vh] py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header section */}
        <div className="flex flex-col gap-2 mb-10 md:mb-12 border-b border-outline-variant/20 pb-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-[10px] md:text-xs">
            COLLECTIONS
          </span>
          <h1 className="font-display-md text-display-md text-[#0F1B2D] uppercase font-bold tracking-tight">
            All Products
          </h1>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between bg-white border border-neutral-100 p-4 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            
            {/* Filter Toggle (Left) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-label-caps text-xs tracking-widest font-bold transition-all border cursor-pointer ${
                isFilterOpen
                  ? "bg-[#0F1B2D] text-[#F7F6F2] border-[#0F1B2D]"
                  : "bg-white text-[#0F1B2D] border-neutral-200 hover:border-[#C28a5c] hover:text-[#C28a5c]"
              }`}
            >
              <SlidersHorizontal size={14} className={isFilterOpen ? "text-[#C28a5c]" : "text-current"} />
              <span>FILTER</span>
            </button>

            {/* Grid Switchers (Center) */}
            <div className="flex items-center gap-1.5 bg-[#F7F6F2] p-1.5 rounded-full border border-neutral-200/50">
              {/* 1 Column (List View) */}
              <button
                onClick={() => setGridCols(1)}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  gridCols === 1
                    ? "bg-white text-[#C28a5c] shadow-sm ring-1 ring-black/5"
                    : "text-[#0F1B2D]/40 hover:text-[#0F1B2D]"
                }`}
                title="List View"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <rect x="3" y="5" width="2" height="2" rx="0.5" fill="currentColor"></rect>
                  <rect x="3" y="11" width="2" height="2" rx="0.5" fill="currentColor"></rect>
                  <rect x="3" y="17" width="2" height="2" rx="0.5" fill="currentColor"></rect>
                </svg>
              </button>

              {/* 2 Columns */}
              <button
                onClick={() => setGridCols(2)}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  gridCols === 2
                    ? "bg-white text-[#C28a5c] shadow-sm ring-1 ring-black/5"
                    : "text-[#0F1B2D]/40 hover:text-[#0F1B2D]"
                }`}
                title="2 Columns"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="8" height="18" rx="1.5" />
                  <rect x="13" y="3" width="8" height="18" rx="1.5" />
                </svg>
              </button>

              {/* 3 Columns */}
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded-full transition-all cursor-pointer hidden md:block ${
                  gridCols === 3
                    ? "bg-white text-[#C28a5c] shadow-sm ring-1 ring-black/5"
                    : "text-[#0F1B2D]/40 hover:text-[#0F1B2D]"
                }`}
                title="3 Columns"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="4.8" height="18" rx="1" />
                  <rect x="9.6" y="3" width="4.8" height="18" rx="1" />
                  <rect x="16.2" y="3" width="4.8" height="18" rx="1" />
                </svg>
              </button>

              {/* 4 Columns */}
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded-full transition-all cursor-pointer hidden lg:block ${
                  gridCols === 4
                    ? "bg-white text-[#C28a5c] shadow-sm ring-1 ring-black/5"
                    : "text-[#0F1B2D]/40 hover:text-[#0F1B2D]"
                }`}
                title="4 Columns"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="3.5" height="18" rx="0.75" />
                  <rect x="8" y="3" width="3.5" height="18" rx="0.75" />
                  <rect x="13" y="3" width="3.5" height="18" rx="0.75" />
                  <rect x="18" y="3" width="3.5" height="18" rx="0.75" />
                </svg>
              </button>

              {/* 5 Columns */}
              <button
                onClick={() => setGridCols(5)}
                className={`p-2 rounded-full transition-all cursor-pointer hidden lg:block ${
                  gridCols === 5
                    ? "bg-white text-[#C28a5c] shadow-sm ring-1 ring-black/5"
                    : "text-[#0F1B2D]/40 hover:text-[#0F1B2D]"
                }`}
                title="5 Columns"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="2.6" height="18" rx="0.5" />
                  <rect x="7.1" y="3" width="2.6" height="18" rx="0.5" />
                  <rect x="11.2" y="3" width="2.6" height="18" rx="0.5" />
                  <rect x="15.3" y="3" width="2.6" height="18" rx="0.5" />
                  <rect x="19.4" y="3" width="2.6" height="18" rx="0.5" />
                </svg>
              </button>

              {/* 6 Columns */}
              <button
                onClick={() => setGridCols(6)}
                className={`p-2 rounded-full transition-all cursor-pointer hidden lg:block ${
                  gridCols === 6
                    ? "bg-white text-[#C28a5c] shadow-sm ring-1 ring-black/5"
                    : "text-[#0F1B2D]/40 hover:text-[#0F1B2D]"
                }`}
                title="6 Columns"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="2" height="18" rx="0.5" />
                  <rect x="6.4" y="3" width="2" height="18" rx="0.5" />
                  <rect x="9.8" y="3" width="2" height="18" rx="0.5" />
                  <rect x="13.2" y="3" width="2" height="18" rx="0.5" />
                  <rect x="16.6" y="3" width="2" height="18" rx="0.5" />
                  <rect x="20" y="3" width="2" height="18" rx="0.5" />
                </svg>
              </button>
            </div>

            {/* Custom Sort Select (Right) */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between gap-3 px-5 py-2.5 bg-white border border-neutral-200 hover:border-[#C28a5c] text-[#0F1B2D] font-label-caps text-xs tracking-widest font-bold rounded-full transition-all cursor-pointer"
              >
                <span>SORT: {sortOptions.find(opt => opt.value === sortBy)?.label.toUpperCase()}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-neutral-100 rounded-2xl shadow-xl z-20 py-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-left font-label-caps text-[10px] tracking-wider text-[#0F1B2D] hover:bg-[#0F1B2D] hover:text-white transition-colors cursor-pointer uppercase font-bold"
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <Check size={12} className="text-[#C28a5c]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Collapsible Filter Panel */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden bg-white border border-neutral-100 rounded-3xl p-6 ${
          isFilterOpen 
            ? "max-h-[800px] opacity-100 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]" 
            : "max-h-0 opacity-0 mb-0 pointer-events-none p-0 border-none"
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Color swatches */}
            <div className="flex flex-col gap-3">
              <span className="font-label-caps text-xs tracking-wider text-[#0F1B2D]/60 uppercase font-bold border-b pb-2 border-neutral-100">
                Colors
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {colors.map((color) => {
                  const isChecked = selectedColors.includes(color);
                  const hex = swatchColors[color];
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedColors(selectedColors.filter(c => c !== color));
                        } else {
                          setSelectedColors([...selectedColors, color]);
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-left font-label-caps text-[10px] tracking-wider uppercase font-bold transition-all cursor-pointer ${
                        isChecked
                          ? "border-[#0F1B2D] bg-[#0F1B2D]/5"
                          : "border-neutral-100 hover:border-neutral-300"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0 flex items-center justify-center animate-pulse-subtle"
                        style={{ backgroundColor: hex }}
                      >
                        {isChecked && (
                          <Check size={8} className={color === "Creamy" ? "text-[#0F1B2D]" : "text-white"} />
                        )}
                      </span>
                      <span className="text-[#0F1B2D]">{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size filters */}
            <div className="flex flex-col gap-3">
              <span className="font-label-caps text-xs tracking-wider text-[#0F1B2D]/60 uppercase font-bold border-b pb-2 border-neutral-100">
                Sizes
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {["S", "M", "L", "XL"].map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedSizes(selectedSizes.filter(s => s !== sz));
                        } else {
                          setSelectedSizes([...selectedSizes, sz]);
                        }
                      }}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-label-caps text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? "bg-[#0F1B2D] text-white border-[#0F1B2D]"
                          : "bg-white text-[#0F1B2D] border-neutral-200 hover:border-[#C28a5c]"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter slider */}
            <div className="flex flex-col gap-3">
              <span className="font-label-caps text-xs tracking-wider text-[#0F1B2D]/60 uppercase font-bold border-b pb-2 border-neutral-100">
                Max Price
              </span>
              <div className="flex flex-col gap-2 mt-2 px-1">
                <input
                  type="range"
                  min="500"
                  max="1000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C28a5c] cursor-pointer bg-neutral-200 h-1 rounded-lg"
                />
                <div className="flex justify-between font-label-caps text-[10px] tracking-wider font-bold mt-1 text-[#0F1B2D]">
                  <span>LE 500</span>
                  <span className="text-[#C28a5c] text-xs">LE {priceRange}</span>
                  <span>LE 1000</span>
                </div>
              </div>
            </div>

            {/* Availability (Stock) */}
            <div className="flex flex-col gap-3">
              <span className="font-label-caps text-xs tracking-wider text-[#0F1B2D]/60 uppercase font-bold border-b pb-2 border-neutral-100">
                Availability
              </span>
              <div className="mt-2 flex items-center">
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-full border font-label-caps text-[10px] tracking-wider uppercase font-bold transition-all cursor-pointer ${
                    inStockOnly
                      ? "bg-[#0F1B2D] text-white border-[#0F1B2D]"
                      : "bg-white text-[#0F1B2D] border-neutral-200 hover:border-[#C28a5c]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                    inStockOnly ? "bg-white border-white text-[#0F1B2D]" : "border-neutral-300"
                  }`}>
                    {inStockOnly && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span>In Stock Only</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Active Filters Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white border border-neutral-100 px-5 py-3 rounded-2xl animate-in fade-in duration-300">
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 uppercase font-bold mr-2">
              Active Filters:
            </span>
            
            {/* Color tags */}
            {selectedColors.map(color => (
              <span
                key={color}
                className="flex items-center gap-1 bg-[#F7F6F2] border border-neutral-200 text-[#0F1B2D] font-label-caps text-[9px] tracking-wider uppercase font-bold pl-3 pr-1.5 py-1 rounded-full"
              >
                <span>Color: {color}</span>
                <button
                  onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                  className="hover:bg-neutral-200 rounded-full p-0.5 cursor-pointer text-neutral-400 hover:text-black"
                >
                  <X size={10} />
                </button>
              </span>
            ))}

            {/* Size tags */}
            {selectedSizes.map(sz => (
              <span
                key={sz}
                className="flex items-center gap-1 bg-[#F7F6F2] border border-neutral-200 text-[#0F1B2D] font-label-caps text-[9px] tracking-wider uppercase font-bold pl-3 pr-1.5 py-1 rounded-full"
              >
                <span>Size: {sz}</span>
                <button
                  onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== sz))}
                  className="hover:bg-neutral-200 rounded-full p-0.5 cursor-pointer text-neutral-400 hover:text-black"
                >
                  <X size={10} />
                </button>
              </span>
            ))}

            {/* Price tag */}
            {priceRange < 1000 && (
              <span className="flex items-center gap-1 bg-[#F7F6F2] border border-neutral-200 text-[#0F1B2D] font-label-caps text-[9px] tracking-wider uppercase font-bold pl-3 pr-1.5 py-1 rounded-full">
                <span>Max Price: LE {priceRange}</span>
                <button
                  onClick={() => setPriceRange(1000)}
                  className="hover:bg-neutral-200 rounded-full p-0.5 cursor-pointer text-neutral-400 hover:text-black"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {/* In stock only tag */}
            {inStockOnly && (
              <span className="flex items-center gap-1 bg-[#F7F6F2] border border-neutral-200 text-[#0F1B2D] font-label-caps text-[9px] tracking-wider uppercase font-bold pl-3 pr-1.5 py-1 rounded-full">
                <span>In Stock Only</span>
                <button
                  onClick={() => setInStockOnly(false)}
                  className="hover:bg-neutral-200 rounded-full p-0.5 cursor-pointer text-neutral-400 hover:text-black"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Reset All */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[#C28a5c] font-label-caps text-[10px] tracking-wider uppercase font-bold hover:underline cursor-pointer ml-auto"
            >
              <RotateCcw size={12} />
              <span>Reset All</span>
            </button>

          </div>
        )}

        {/* Count display */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-body-md text-xs text-on-surface-variant/80">
            Showing {filteredVariants.length} products
          </span>
        </div>

        {/* Products Grid */}
        <div className={getGridClass()}>
          {filteredVariants.map((variant) => (
            <ProductCard
              key={variant.slug}
              product={ringerTeeProduct}
              variantSlug={variant.slug}
              variantName={variant.name}
              variantImage={variant.image}
              isListView={gridCols === 1}
              gridCols={gridCols}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

