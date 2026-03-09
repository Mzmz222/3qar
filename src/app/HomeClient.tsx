"use client";

import React, { useState } from "react";
import Header from "@/components/public/Header";
import PropertyGrid from "@/components/public/PropertyGrid";
import MapFAB from "@/components/public/MapFAB";
import Footer from "@/components/public/Footer";
import { ToastProvider } from "@/components/ui/Toast";

interface HomeClientProps {
    initialProperties: any[];
    initialCount: number;
    cities: any[];
    neighborhoods: any[];
    settings: any;
}

export default function HomeClient({ initialProperties, initialCount, cities, neighborhoods, settings }: HomeClientProps) {
    const [filters, setFilters] = useState({
        offerType: "",
        propertyType: "",
        constructionStatus: "",
        cityId: "",
        neighborhoodId: "",
        search: "",
    });

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#FAFAFA]">
                <Header
                    cities={cities}
                    neighborhoods={neighborhoods}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <main className="max-w-7xl mx-auto px-4 py-6">
                    <PropertyGrid
                        initialProperties={initialProperties}
                        initialCount={initialCount}
                        filters={filters}
                    />
                </main>

                <MapFAB properties={initialProperties} />

                <Footer settings={settings || { site_name: "عقار" }} />
            </div>
        </ToastProvider>
    );
}
