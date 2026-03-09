"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ExternalLink, Trash2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

function formatPrice(price: number) {
    return price.toLocaleString("ar-SA");
}

interface WaitingItem {
    id: number;
    clicked_at: string;
    property_id: number;
    properties?: {
        id: number;
        cover_image: string;
        offer_type: string;
        property_type: string;
        price: number;
        neighborhoods?: { name: string };
        cities?: { name: string };
    };
}

interface WaitingListProps {
    items: WaitingItem[];
    onRefresh: () => void;
}

export default function WaitingList({ items, onRefresh }: WaitingListProps) {
    const { showToast } = useToast();

    const handleDeleteProperty = async (propertyId: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا العقار؟")) return;
        try {
            const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showToast("تم حذف العقار بنجاح", "success");
            onRefresh();
        } catch {
            showToast("فشل حذف العقار", "error");
        }
    };

    const toTime = (str: string) =>
        new Date(str).toLocaleString("ar-SA", {
            month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="font-bold">لا توجد نقرات واتساب خلال آخر 24 ساعة</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">
                العقارات التي نُقر على واتساب خلال آخر 24 ساعة ({items.length})
            </p>
            {items.map((item) => {
                const p = item.properties;
                if (!p) return null;
                return (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                        {/* Image */}
                        <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={p.cover_image} alt="" fill className="object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm">
                                {p.property_type} {p.offer_type}
                            </p>
                            <p className="text-xs text-gray-500">
                                {[p.neighborhoods?.name, p.cities?.name].filter(Boolean).join("، ")}
                            </p>
                            <p className="text-sm font-bold text-[#5D4037]">{formatPrice(p.price)} ريال</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <Clock className="w-3 h-3" />
                                {toTime(item.clicked_at)}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/property/${p.id}`}
                                target="_blank"
                                className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                title="عرض العقار"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => handleDeleteProperty(p.id)}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                title="حذف العقار"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
