"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import MapView from "./MapView";

interface MapFABProps {
    properties: Array<{
        id: number;
        latitude: number;
        longitude: number;
        price: number;
        property_type: string;
        cover_image: string;
    }>;
}

export default function MapFAB({ properties }: MapFABProps) {
    const [open, setOpen] = useState(false);
    const hasCoords = properties.filter((p) => p.latitude && p.longitude);

    if (hasCoords.length === 0) return null;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-[#5D4037] text-white px-4 py-3 rounded-2xl shadow-xl hover:bg-[#4E342E] active:scale-95 transition-all"
                aria-label="عرض الخريطة"
            >
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-bold">الخريطة</span>
            </button>

            {open && (
                <MapView
                    properties={hasCoords}
                    isFullscreen
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
