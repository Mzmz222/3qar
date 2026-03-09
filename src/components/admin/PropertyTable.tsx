"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, Star, StarOff, QrCode, Eye } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { generateQRCode } from "@/lib/qrGenerator";

function formatPrice(price: number) {
    return price.toLocaleString("ar-SA");
}

function toDate(str: string) {
    return new Date(str).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
}

interface Property { id: number; cover_image: string; offer_type: string; property_type: string; price: number; created_at: string; is_featured: boolean; neighborhoods?: { name: string }; cities?: { name: string }; view_count?: number; qr_token?: string; }

interface PropertyTableProps {
    properties: Property[];
    onEdit: (p: Property) => void;
    onRefresh: () => void;
}

export default function PropertyTable({ properties, onEdit, onRefresh }: PropertyTableProps) {
    const { showToast } = useToast();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [qrImg, setQrImg] = useState<string>("");
    const [qrPropId, setQrPropId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا العقار وجميع صوره؟")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("فشل الحذف");
            showToast("تم حذف العقار والصور المرتبطة", "success");
            onRefresh();
        } catch {
            showToast("فشل حذف العقار", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const handleFeature = async (p: Property) => {
        try {
            const res = await fetch(`/api/properties/${p.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_featured: !p.is_featured }),
            });
            if (!res.ok) throw new Error();
            showToast(p.is_featured ? "تم إلغاء التثبيت" : "تم تثبيت العقار في الأعلى", "success");
            onRefresh();
        } catch {
            showToast("فشل العملية", "error");
        }
    };

    const handleQR = async (p: Property) => {
        const url = `${window.location.origin}/property/${p.id}?utm_source=qr&token=${p.qr_token || ""}`;
        const dataUrl = await generateQRCode(url);
        setQrImg(dataUrl);
        setQrPropId(p.id);
    };

    const downloadQR = () => {
        if (!qrImg) return;
        const a = document.createElement("a");
        a.href = qrImg;
        a.download = `property-qr-${qrPropId}.png`;
        a.click();
    };

    if (properties.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-bold">لا توجد عقارات بعد</p>
                <p className="text-sm mt-1">أضف أول عقار باستخدام الزر أعلاه</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-right px-4 py-3 text-gray-500 font-bold">العقار</th>
                            <th className="text-right px-4 py-3 text-gray-500 font-bold">الموقع</th>
                            <th className="text-right px-4 py-3 text-gray-500 font-bold">السعر</th>
                            <th className="text-right px-4 py-3 text-gray-500 font-bold">التاريخ</th>
                            <th className="text-right px-4 py-3 text-gray-500 font-bold">المشاهدات</th>
                            <th className="text-right px-4 py-3 text-gray-500 font-bold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {properties.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                {/* Property thumbnail + info */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-14 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image src={p.cover_image} alt="" fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                {p.property_type} {p.offer_type}
                                                {p.is_featured && <span className="mr-1 text-amber-500">★</span>}
                                            </p>
                                            <p className="text-xs text-gray-400">#{p.id}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Location */}
                                <td className="px-4 py-3 text-gray-600">
                                    {[p.neighborhoods?.name, p.cities?.name].filter(Boolean).join("، ") || "—"}
                                </td>

                                {/* Price */}
                                <td className="px-4 py-3 font-bold text-[#5D4037]">
                                    {formatPrice(p.price)} ريال
                                </td>

                                {/* Date */}
                                <td className="px-4 py-3 text-gray-500 text-xs">{toDate(p.created_at)}</td>

                                {/* Views */}
                                <td className="px-4 py-3 text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {p.view_count || 0}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => onEdit(p)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors" title="تعديل">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleFeature(p)} className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? "text-amber-500 hover:bg-amber-50" : "text-gray-400 hover:bg-gray-50"}`} title={p.is_featured ? "إلغاء التثبيت" : "تثبيت"}>
                                            {p.is_featured ? <Star className="w-4 h-4 fill-amber-500" /> : <StarOff className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => handleQR(p)} className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-500 transition-colors" title="QR Code">
                                            <QrCode className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors disabled:opacity-50" title="حذف">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* QR Modal */}
            <Modal isOpen={!!qrImg} onClose={() => { setQrImg(""); setQrPropId(null); }} title={`QR Code — العقار #${qrPropId}`}>
                <div className="flex flex-col items-center gap-4">
                    {qrImg && <img src={qrImg} alt="QR Code" className="w-56 h-56" />}
                    <button onClick={downloadQR} className="w-full py-3 bg-[#5D4037] text-white rounded-xl font-bold text-sm hover:bg-[#4E342E] transition-colors">
                        تحميل QR Code بصيغة PNG
                    </button>
                </div>
            </Modal>
        </>
    );
}
