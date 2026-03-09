"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Share2, Phone, MessageCircle, X, ChevronDown } from "lucide-react";
import ImageGallery from "./ImageGallery";
import MapView from "./MapView";
import { formatShareMessage, formatWhatsAppMessage } from "@/lib/formatMessage";

function formatPrice(price: number) {
    return price.toLocaleString("ar-SA");
}

function toArabicDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ar-SA", {
        year: "numeric", month: "long", day: "numeric",
    });
}

interface Property {
    id: number;
    offer_type: string;
    property_type: string;
    construction_status: string;
    furnishing: string;
    direct_or_broker: string;
    length_1?: number;
    length_2?: number;
    area_size?: number;
    street_width?: string;
    parcel_number?: string;
    price: number;
    description?: string;
    cover_image: string;
    images_gallery?: string[];
    google_maps_link?: string;
    latitude?: number;
    longitude?: number;
    view_count?: number;
    created_at: string;
    cities?: { name: string };
    neighborhoods?: { name: string };
}

interface Settings {
    site_name: string;
    office_phone_1?: string;
    office_phone_2?: string;
    whatsapp_group_link?: string;
    fal_license?: string;
}

interface PropertyDetailsProps {
    property: Property;
    settings: Settings;
    nearbyProperties: Property[];
}

export default function PropertyDetails({ property, settings, nearbyProperties }: PropertyDetailsProps) {
    const router = useRouter();
    const [showPhone, setShowPhone] = useState(false);
    const [descExpanded, setDescExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const propertyUrl = typeof window !== "undefined" ? window.location.href : "";

    // Increment view count on mount
    useEffect(() => {
        fetch(`/api/properties/${property.id}/view`, { method: "POST" }).catch(() => { });
    }, [property.id]);

    const handleShare = async () => {
        const msg = formatShareMessage(property, settings, propertyUrl);
        try {
            await navigator.clipboard.writeText(msg);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback: open share dialog
            if (navigator.share) {
                navigator.share({ text: msg, url: propertyUrl });
            }
        }
    };

    const handleWhatsApp = async () => {
        // Log click first
        await fetch("/api/whatsapp-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ property_id: property.id }),
        }).catch(() => { });

        const phone = settings.office_phone_1?.replace(/\D/g, "") || "";
        const msg = encodeURIComponent(formatWhatsAppMessage(property, propertyUrl));
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    };

    const infoFields = [
        { label: "نوع العرض", value: property.offer_type },
        { label: "نوع العقار", value: property.property_type },
        { label: "التأثيث", value: property.furnishing },
        { label: "حالة البناء", value: property.construction_status },
        { label: "تاريخ الإضافة", value: toArabicDate(property.created_at) },
        { label: "المباشر/الوسيط", value: property.direct_or_broker },
        property.area_size ? { label: "المساحة", value: `${property.area_size} م²` } : null,
        property.length_1 && property.length_2
            ? { label: "الأطوال", value: `${property.length_1} × ${property.length_2}` }
            : null,
        property.street_width ? { label: "عرض الشارع", value: property.street_width } : null,
        property.parcel_number ? { label: "رقم القطعة", value: property.parcel_number } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    const nearbyWithCoords = nearbyProperties.filter(
        (p) => p.latitude && p.longitude && p.id !== property.id
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Top navigation bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
                    {/* Back */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-[#5D4037] transition-colors text-sm font-medium"
                    >
                        <ArrowRight className="w-5 h-5" />
                        <span className="hidden sm:inline">رجوع</span>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Share */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl border border-gray-200 hover:border-[#5D4037] hover:text-[#5D4037] transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            {copied ? "تم النسخ!" : "مشاركة"}
                        </button>

                        {/* Call dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowPhone(!showPhone)}
                                className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl bg-[#EFEBE9] text-[#5D4037] hover:bg-[#D7CCC8] transition-all"
                            >
                                <Phone className="w-4 h-4" />
                                اتصال
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            {showPhone && (
                                <>
                                    <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-48 p-2">
                                        {settings.office_phone_1 && (
                                            <a
                                                href={`tel:${settings.office_phone_1}`}
                                                className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm font-medium"
                                            >
                                                <Phone className="w-4 h-4 text-[#5D4037]" />
                                                {settings.office_phone_1}
                                            </a>
                                        )}
                                        {settings.office_phone_2 && (
                                            <a
                                                href={`tel:${settings.office_phone_2}`}
                                                className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm font-medium"
                                            >
                                                <Phone className="w-4 h-4 text-[#5D4037]" />
                                                {settings.office_phone_2}
                                            </a>
                                        )}
                                    </div>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowPhone(false)} />
                                </>
                            )}
                        </div>

                        {/* WhatsApp */}
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">واتساب</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Gallery */}
                <ImageGallery
                    coverImage={property.cover_image}
                    gallery={property.images_gallery}
                    alt={`${property.property_type} ${property.offer_type}`}
                />

                {/* Price + Location */}
                <div>
                    <p className="text-3xl font-black text-[#5D4037]">
                        {formatPrice(property.price)}
                        <span className="text-base font-normal text-gray-500 mr-1">ريال</span>
                    </p>
                    <p className="text-gray-500 mt-1 text-sm">
                        {[property.neighborhoods?.name, property.cities?.name].filter(Boolean).join("، ")}
                    </p>
                </div>

                {/* Description */}
                {property.description && (
                    <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-3">الوصف</h2>
                        <p className={`text-gray-600 text-sm leading-relaxed ${!descExpanded ? "line-clamp-3" : ""}`}>
                            {property.description}
                        </p>
                        {property.description.length > 150 && (
                            <button
                                onClick={() => setDescExpanded(!descExpanded)}
                                className="text-[#5D4037] text-sm font-bold mt-2 hover:underline"
                            >
                                {descExpanded ? "اقرأ أقل" : "اقرأ المزيد"}
                            </button>
                        )}
                    </div>
                )}

                {/* Info grid */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <h2 className="font-bold text-gray-900 p-5 border-b border-gray-100">معلومات العقار</h2>
                    <div className="grid grid-cols-2">
                        {infoFields.map((field, i) => (
                            <div
                                key={field.label}
                                className={`p-4 ${i % 2 === 0 ? "border-l border-gray-100" : ""} ${i < infoFields.length - 2 ? "border-b border-gray-100" : ""}`}
                            >
                                <p className="text-xs text-gray-400 mb-1">{field.label}</p>
                                <p className="text-sm font-bold text-gray-800">{field.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map */}
                {(property.latitude && property.longitude) || nearbyWithCoords.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <h2 className="font-bold text-gray-900 p-5 border-b border-gray-100">الموقع</h2>
                        <div className="h-[350px]">
                            <MapView
                                properties={[
                                    ...(property.latitude && property.longitude ? [{
                                        id: property.id,
                                        latitude: property.latitude,
                                        longitude: property.longitude,
                                        price: property.price,
                                        property_type: property.property_type,
                                        cover_image: property.cover_image,
                                    }] : []),
                                    ...nearbyWithCoords.map((p) => ({
                                        id: p.id,
                                        latitude: p.latitude!,
                                        longitude: p.longitude!,
                                        price: p.price,
                                        property_type: p.property_type,
                                        cover_image: p.cover_image,
                                    })),
                                ]}
                                center={property.latitude && property.longitude
                                    ? [property.latitude, property.longitude]
                                    : undefined}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
