"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize2 } from "lucide-react";

export interface Property {
    id: number;
    offer_type: string;
    property_type: string;
    construction_status: string;
    furnishing: string;
    direct_or_broker: string;
    length_1?: number;
    length_2?: number;
    area_size?: number;
    price: number;
    cover_image: string;
    gallery_images?: string[];
    is_featured?: boolean;
    cities?: { name: string };
    neighborhoods?: { name: string };
}

function formatPrice(price: number) {
    return price.toLocaleString("ar-SA");
}

export default function PropertyCard({ property }: { property: Property }) {
    const [imgIdx, setImgIdx] = useState(0);
    const allImages = [property.cover_image, ...(property.gallery_images || [])].filter(Boolean);

    return (
        <Link
            href={`/property/${property.id}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-[#D7CCC8] transition-all duration-300"
        >
            {/* Image */}
            <div className="relative h-52 bg-gray-100 overflow-hidden">
                <Image
                    src={allImages[imgIdx] || "/placeholder.jpg"}
                    alt={`${property.property_type} ${property.offer_type}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <span className="bg-[#5D4037] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {property.offer_type}
                    </span>
                    {property.is_featured && (
                        <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            مثبّت
                        </span>
                    )}
                </div>

                {/* Image count */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        {allImages.length}
                    </div>
                )}

                {/* Image dots navigation */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 right-0 left-0 flex justify-center gap-1">
                        {allImages.slice(0, 5).map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); setImgIdx(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-white w-3" : "bg-white/60"}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Price */}
                <p className="text-xl font-black text-[#5D4037] mb-2">
                    {formatPrice(property.price)}
                    <span className="text-sm font-normal text-gray-500 mr-1">ريال</span>
                </p>

                {/* Dimensions */}
                {property.length_1 && property.length_2 && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="font-bold">{property.length_1}×{property.length_2}</span>
                        <span className="text-gray-300">|</span>
                        {property.area_size && (
                            <span>{property.area_size} م²</span>
                        )}
                    </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#5D4037]" />
                    <span>
                        {[property.cities?.name, property.neighborhoods?.name].filter(Boolean).join(" — ")}
                    </span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        {property.property_type}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        {property.construction_status}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        {property.direct_or_broker}
                    </span>
                </div>
            </div>
        </Link>
    );
}
