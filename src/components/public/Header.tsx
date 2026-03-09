"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, X } from "lucide-react";
import PropertyTypePicker from "./PropertyTypePicker";

interface City { id: number; name: string; }
interface Neighborhood { id: number; name: string; city_id: number; }

interface Filters {
    offerType: string;
    propertyType: string;
    constructionStatus: string;
    cityId: string;
    neighborhoodId: string;
    search: string;
}

interface HeaderProps {
    cities: City[];
    neighborhoods: Neighborhood[];
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
}

export default function Header({ cities, neighborhoods, filters, onFiltersChange }: HeaderProps) {
    const [typePickerOpen, setTypePickerOpen] = useState(false);
    const [offerDropOpen, setOfferDropOpen] = useState(false);
    const [cityDropOpen, setCityDropOpen] = useState(false);
    const [neighborDropOpen, setNeighborDropOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const filteredNeighborhoods = filters.cityId
        ? neighborhoods.filter((n) => n.city_id === parseInt(filters.cityId))
        : neighborhoods;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const update = (partial: Partial<Filters>) => onFiltersChange({ ...filters, ...partial });

    const selectedTypeName = filters.propertyType || "نوع العقار";
    const selectedCityName = cities.find((c) => c.id === parseInt(filters.cityId))?.name || "المدينة";
    const selectedNeighName = filteredNeighborhoods.find((n) => n.id === parseInt(filters.neighborhoodId))?.name || "الحي";

    return (
        <>
            <header
                className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"}`}
            >
                <div className="max-w-7xl mx-auto px-4">
                    {/* Top bar: Logo */}
                    <div className="flex items-center justify-center py-3 border-b border-gray-100">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="عقار الأحساء"
                                width={120}
                                height={50}
                                className="h-12 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Row 1: Offer type + Search */}
                    <div className="flex flex-wrap items-center gap-2 py-3 border-b border-gray-100">
                        {/* Offer Type Dropdown */}
                        <div className="relative flex-shrink-0">
                            <button
                                id="offer-type-btn"
                                onClick={() => {
                                    setOfferDropOpen(!offerDropOpen);
                                    setCityDropOpen(false);
                                    setNeighborDropOpen(false);
                                }}
                                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-[#5D4037] text-sm font-semibold text-gray-700 transition-colors whitespace-nowrap"
                            >
                                {filters.offerType || "الكل"}
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            {offerDropOpen && (
                                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-40 w-36 py-1">
                                    {["الكل", "للبيع", "للإيجار"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                update({ offerType: opt === "الكل" ? "" : opt });
                                                setOfferDropOpen(false);
                                            }}
                                            className={`w-full text-right px-4 py-2.5 text-sm hover:bg-[#D7CCC8] hover:text-[#5D4037] transition-colors ${(filters.offerType || "الكل") === opt ? "bg-[#D7CCC8] text-[#5D4037] font-semibold" : "text-gray-700"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search input */}
                        <div className="flex-1 relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ابحث بالوصف أو الحي..."
                                value={filters.search}
                                onChange={(e) => update({ search: e.target.value })}
                                className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#5D4037] focus:ring-1 focus:ring-[#5D4037]/20"
                            />
                        </div>
                    </div>

                    {/* Row 2: Property type + Construction status */}
                    <div className="flex flex-wrap items-center gap-2 py-3 border-b border-gray-100">
                        {/* Property type picker */}
                        <button
                            onClick={() => setTypePickerOpen(true)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-semibold transition-colors whitespace-nowrap ${filters.propertyType
                                ? "bg-[#D7CCC8] text-[#5D4037] border-[#D7CCC8]"
                                : "border-gray-200 text-gray-600 hover:border-[#5D4037]"
                                }`}
                        >
                            {selectedTypeName}
                            <ChevronDown className="w-3.5 h-3.5" />
                            {filters.propertyType && (
                                <span
                                    onClick={(e) => { e.stopPropagation(); update({ propertyType: "" }); }}
                                    className="mr-1 hover:text-red-500"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </span>
                            )}
                        </button>

                        {/* Construction status */}
                        {["الكل", "جاهز", "قيد الانشاء"].map((s) => {
                            const val = s === "الكل" ? "" : s;
                            const active = filters.constructionStatus === val;
                            return (
                                <button
                                    key={s}
                                    onClick={() => update({ constructionStatus: val })}
                                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors whitespace-nowrap ${active
                                        ? "bg-[#D7CCC8] text-[#5D4037] border-[#D7CCC8]"
                                        : "border-gray-200 text-gray-600 hover:border-[#5D4037]"
                                        }`}
                                >
                                    {s}
                                </button>
                            );
                        })}
                    </div>

                    {/* Row 3: City + Neighborhood */}
                    <div className="flex flex-wrap items-center gap-2 py-3">
                        {/* City dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setCityDropOpen(!cityDropOpen);
                                    setNeighborDropOpen(false);
                                    setOfferDropOpen(false);
                                }}
                                className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${filters.cityId
                                    ? "bg-[#D7CCC8] text-[#5D4037] border-[#D7CCC8]"
                                    : "border-gray-200 text-gray-600 hover:border-[#5D4037]"
                                    }`}
                            >
                                {selectedCityName}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {cityDropOpen && (
                                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-40 w-44 py-1 max-h-60 overflow-y-auto">
                                    <button
                                        onClick={() => { update({ cityId: "", neighborhoodId: "" }); setCityDropOpen(false); }}
                                        className={`w-full text-right px-4 py-2.5 text-sm hover:bg-[#D7CCC8] hover:text-[#5D4037] transition-colors ${!filters.cityId ? "bg-[#D7CCC8] text-[#5D4037] font-semibold" : "text-gray-700"}`}
                                    >
                                        الكل
                                    </button>
                                    {cities.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => { update({ cityId: c.id.toString(), neighborhoodId: "" }); setCityDropOpen(false); }}
                                            className={`w-full text-right px-4 py-2.5 text-sm hover:bg-[#D7CCC8] hover:text-[#5D4037] transition-colors ${filters.cityId === c.id.toString() ? "bg-[#D7CCC8] text-[#5D4037] font-semibold" : "text-gray-700"}`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Neighborhood dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setNeighborDropOpen(!neighborDropOpen);
                                    setCityDropOpen(false);
                                    setOfferDropOpen(false);
                                }}
                                disabled={!filters.cityId && filteredNeighborhoods.length === 0}
                                className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${filters.neighborhoodId
                                    ? "bg-[#D7CCC8] text-[#5D4037] border-[#D7CCC8]"
                                    : "border-gray-200 text-gray-600 hover:border-[#5D4037] disabled:opacity-40"
                                    }`}
                            >
                                {selectedNeighName}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {neighborDropOpen && (
                                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-40 w-44 py-1 max-h-60 overflow-y-auto">
                                    <button
                                        onClick={() => { update({ neighborhoodId: "" }); setNeighborDropOpen(false); }}
                                        className={`w-full text-right px-4 py-2.5 text-sm hover:bg-[#D7CCC8] hover:text-[#5D4037] transition-colors ${!filters.neighborhoodId ? "bg-[#D7CCC8] text-[#5D4037] font-semibold" : "text-gray-700"}`}
                                    >
                                        الكل
                                    </button>
                                    {filteredNeighborhoods.map((n) => (
                                        <button
                                            key={n.id}
                                            onClick={() => { update({ neighborhoodId: n.id.toString() }); setNeighborDropOpen(false); }}
                                            className={`w-full text-right px-4 py-2.5 text-sm hover:bg-[#D7CCC8] hover:text-[#5D4037] transition-colors ${filters.neighborhoodId === n.id.toString() ? "bg-[#D7CCC8] text-[#5D4037] font-semibold" : "text-gray-700"}`}
                                        >
                                            {n.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear all filters */}
                        {(filters.offerType || filters.propertyType || filters.constructionStatus || filters.cityId || filters.search) && (
                            <button
                                onClick={() => onFiltersChange({ offerType: "", propertyType: "", constructionStatus: "", cityId: "", neighborhoodId: "", search: "" })}
                                className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <X className="w-4 h-4" />
                                مسح الفلاتر
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <PropertyTypePicker
                isOpen={typePickerOpen}
                selected={filters.propertyType}
                onSelect={(type) => { update({ propertyType: type }); setTypePickerOpen(false); }}
                onClose={() => setTypePickerOpen(false)}
            />

            {/* Close dropdowns on click outside */}
            {(offerDropOpen || cityDropOpen || neighborDropOpen) && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => { setOfferDropOpen(false); setCityDropOpen(false); setNeighborDropOpen(false); }}
                />
            )}
        </>
    );
}
