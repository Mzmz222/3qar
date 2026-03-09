"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import PropertyCard, { Property } from "./PropertyCard";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { Frown } from "lucide-react";
interface Filters {
    offerType: string;
    propertyType: string;
    constructionStatus: string;
    cityId: string;
    neighborhoodId: string;
    search: string;
}

interface PropertyGridProps {
    initialProperties: Property[];
    initialCount: number;
    filters: Filters;
}

export default function PropertyGrid({ initialProperties, initialCount, filters }: PropertyGridProps) {
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialProperties.length < initialCount);
    const [totalCount, setTotalCount] = useState(initialCount);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const prevFilters = useRef(filters);

    const buildQuery = useCallback((filters: Filters, page: number) => {
        const params = new URLSearchParams();
        if (filters.offerType) params.set("offer_type", filters.offerType);
        if (filters.propertyType) params.set("property_type", filters.propertyType);
        if (filters.constructionStatus) params.set("construction_status", filters.constructionStatus);
        if (filters.cityId) params.set("city_id", filters.cityId);
        if (filters.neighborhoodId) params.set("neighborhood_id", filters.neighborhoodId);
        if (filters.search) params.set("search", filters.search);
        params.set("page", page.toString());
        params.set("limit", "12");
        return params.toString();
    }, []);

    // Reset when filters change
    useEffect(() => {
        if (JSON.stringify(prevFilters.current) === JSON.stringify(filters)) return;
        prevFilters.current = filters;

        const fetchFiltered = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/properties?${buildQuery(filters, 1)}`);
                const json = await res.json();
                setProperties(json.data || []);
                setTotalCount(json.count || 0);
                setPage(1);
                setHasMore((json.data || []).length < (json.count || 0));
            } finally {
                setLoading(false);
            }
        };

        fetchFiltered();
    }, [filters, buildQuery]);

    // Load more
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/properties?${buildQuery(filters, nextPage)}`);
            const json = await res.json();
            if (json.data?.length) {
                setProperties((prev) => {
                    const ids = new Set(prev.map((p) => p.id));
                    return [...prev, ...json.data.filter((p: Property) => !ids.has(p.id))];
                });
                setPage(nextPage);
                setHasMore(properties.length + json.data.length < (json.count || 0));
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, filters, buildQuery, properties.length]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore(); },
            { rootMargin: "200px" }
        );
        if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
        return () => observerRef.current?.disconnect();
    }, [loadMore]);

    if (loading && properties.length === 0) {
        return <GridSkeleton count={12} />;
    }

    if (!loading && properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Frown className="w-16 h-16 mb-4 text-gray-200" />
                <p className="text-lg font-bold text-gray-500">لا توجد عقارات تطابق الفلاتر</p>
                <p className="text-sm mt-1">جرّب تغيير خيارات البحث</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-5">
                <p className="text-sm text-gray-500">
                    <span className="font-bold text-gray-700">{totalCount}</span> عقار
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={loadMoreRef} className="h-8" />

            {loading && properties.length > 0 && (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-[#D7CCC8] border-t-[#5D4037] rounded-full animate-spin" />
                </div>
            )}

            {!hasMore && properties.length > 0 && (
                <p className="text-center text-gray-400 text-sm py-6">تم عرض جميع العقارات</p>
            )}
        </div>
    );
}
