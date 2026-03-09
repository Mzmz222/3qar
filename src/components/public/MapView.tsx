"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface MapProperty {
    id: number;
    latitude: number;
    longitude: number;
    price: number;
    property_type: string;
    cover_image: string;
}

interface MapViewProps {
    properties: MapProperty[];
    center?: [number, number];
    isFullscreen?: boolean;
    onClose?: () => void;
}

// Dynamic import wrapper to avoid SSR issues with Leaflet
function LeafletMap({ properties, center, isFullscreen, onClose }: MapViewProps) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Dynamically load leaflet CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
    }, []);

    const validProps = properties.filter(
        (p) => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );
    const mapCenter: [number, number] = center || (
        validProps.length > 0
            ? [validProps[0].latitude, validProps[0].longitude]
            : [24.7136, 46.6753]
    );

    return (
        <div className={`relative ${isFullscreen ? "fixed inset-0 z-[60] bg-black" : "w-full h-[400px] rounded-2xl overflow-hidden"}`}>
            {isFullscreen && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[70] bg-white text-gray-700 rounded-full p-2.5 shadow-lg hover:bg-gray-50"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
            <MapContainer properties={validProps} center={mapCenter} />
        </div>
    );
}

function MapContainer({ properties, center }: { properties: MapProperty[]; center: [number, number] }) {
    const mapRef = React.useRef<any>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !containerRef.current) return;

        let L: any;
        let map: any;

        const init = async () => {
            L = await import("leaflet").then((m) => m.default);

            // Fix Leaflet default icon
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
            if (!containerRef.current) return;

            map = L.map(containerRef.current, { zoomControl: true }).setView(center, 13);
            mapRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            }).addTo(map);

            const brownIcon = L.divIcon({
                className: "",
                html: `<div style="background:#5D4037;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 28],
                popupAnchor: [0, -30],
            });

            properties.forEach((p) => {
                const popup = `
          <div style="direction:rtl;min-width:180px;font-family:Cairo,sans-serif">
            <img src="${p.cover_image}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px"/>
            <p style="font-weight:bold;color:#5D4037;margin-bottom:4px">${p.price.toLocaleString("ar-SA")} ريال</p>
            <p style="font-size:12px;color:#666;margin-bottom:8px">${p.property_type}</p>
            <a href="/property/${p.id}" style="display:block;text-align:center;background:#5D4037;color:white;padding:6px;border-radius:6px;text-decoration:none;font-size:12px">عرض التفاصيل</a>
          </div>
        `;
                L.marker([p.latitude, p.longitude], { icon: brownIcon })
                    .addTo(map)
                    .bindPopup(popup);
            });
        };

        init();

        return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }, [properties, center]);

    return <div ref={containerRef} className="w-full h-full" />;
}

export default LeafletMap;
