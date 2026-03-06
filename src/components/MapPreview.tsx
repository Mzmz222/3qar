"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Leaflet icon fix for Next.js
import L from "leaflet";
import Link from "next/link";
import Image from "next/image";

// Fix default marker icon issue
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapPreviewProps {
    properties: any[];
}

export default function MapPreview({ properties }: MapPreviewProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[400px] w-full bg-gray-100 rounded-xl animate-pulse"></div>;

    const validProperties = properties.filter(p => p.lat && p.lng);

    if (validProperties.length === 0) {
        return null;
    }

    // Default center based on first property or Al-Ahsa rough coordinates
    const center: [number, number] = [
        validProperties[0].lat,
        validProperties[0].lng
    ];

    return (
        <div className="h-full w-full bg-sand/20 z-0 relative">
            <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full z-0 font-sans" style={{ filter: 'sepia(30%) contrast(90%)' }}>
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
                />
                {validProperties.map((prop) => (
                    <Marker key={prop.id} position={[prop.lat, prop.lng]}>
                        <Popup className="cinematic-popup">
                            <div className="w-56 p-1">
                                <h4 className="font-heading font-bold mb-2 text-charcoal leading-tight text-lg">
                                    <Link href={`/property/${prop.id}`} className="hover:text-deep-brown transition-colors">
                                        {prop.title}
                                    </Link>
                                </h4>
                                <p className="text-sm text-deep-brown font-data font-bold mb-4 break-words" dir="ltr">{prop.price}</p>
                                <div className="flex justify-end border-t border-charcoal/10 pt-3">
                                    <Link href={`/property/${prop.id}`} className="text-[10px] uppercase tracking-widest bg-charcoal text-cream font-data px-4 py-2 rounded-full hover:bg-deep-brown transition-colors">
                                        Initialize
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
