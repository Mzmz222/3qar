"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface City { id: number; name: string; }
interface Neighborhood { id: number; name: string; city_id: number; }

interface PropertyFormProps {
    initialData?: any;
    cities: City[];
    allNeighborhoods: Neighborhood[];
    onSuccess: (property: any) => void;
    onCancel: () => void;
}

const OFFER_TYPES = ["للبيع", "للإيجار"];
const PROPERTY_TYPES = [
    "شقة", "فيلا", "عمارة سكنية", "ارض سكنية", "استراحة", "شاليه",
    "عمارة تجارية", "ارض تجارية", "ارض صناعية", "مستودع", "مزرعة", "ارض زراعية",
];
const CONSTRUCTION_STATUSES = ["جاهز", "قيد الانشاء"];
const FURNISHINGS = ["مفروش", "غير مفروش"];
const DIRECT_OR_BROKER = ["مباشر", "غير مباشر"];

export default function PropertyForm({ initialData, cities, allNeighborhoods, onSuccess, onCancel }: PropertyFormProps) {
    const { showToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [coverImage, setCoverImage] = useState<string>(initialData?.cover_image || "");
    const [gallery, setGallery] = useState<string[]>(initialData?.images_gallery || []);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [mapsWarning, setMapsWarning] = useState(false);

    const [form, setForm] = useState({
        offer_type: initialData?.offer_type || "",
        property_type: initialData?.property_type || "",
        city_id: initialData?.city_id || "",
        neighborhood_id: initialData?.neighborhood_id || "",
        length_1: initialData?.length_1 || "",
        length_2: initialData?.length_2 || "",
        parcel_number: initialData?.parcel_number || "",
        street_width: initialData?.street_width || "",
        price: initialData?.price || "",
        construction_status: initialData?.construction_status || "",
        furnishing: initialData?.furnishing || "",
        direct_or_broker: initialData?.direct_or_broker || "",
        description: initialData?.description || "",
        google_maps_link: initialData?.google_maps_link || "",
        latitude: initialData?.latitude || "",
        longitude: initialData?.longitude || "",
    });

    const neighborhoods = form.city_id
        ? allNeighborhoods.filter((n) => n.city_id === parseInt(form.city_id.toString()))
        : allNeighborhoods;

    const areaSize = form.length_1 && form.length_2
        ? (parseFloat(form.length_1) * parseFloat(form.length_2)).toFixed(2)
        : "";

    const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

    const handleMapsLinkChange = async (url: string) => {
        update("google_maps_link", url);
        setMapsWarning(false);
        if (!url) return;

        try {
            const res = await fetch("/api/extract-coords", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            if (data.lat && data.lng) {
                update("latitude", data.lat);
                update("longitude", data.lng);
            } else {
                setMapsWarning(true);
            }
        } catch {
            setMapsWarning(true);
        }
    };

    const uploadFile = async (file: File, type: "cover" | "gallery") => {
        if (file.size > 5 * 1024 * 1024) {
            showToast("حجم الصورة يتجاوز 5MB", "error");
            return;
        }

        const fd = new FormData();
        fd.append("file", file);

        if (type === "cover") setUploadingCover(true);
        else setUploadingGallery(true);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                if (type === "cover") setCoverImage(data.url);
                else setGallery((g) => [...g, data.url]);
            } else {
                showToast(data.error || "فشل رفع الصورة", "error");
            }
        } catch {
            showToast("فشل رفع الصورة", "error");
        } finally {
            if (type === "cover") setUploadingCover(false);
            else setUploadingGallery(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverImage) { showToast("صورة الغلاف مطلوبة", "error"); return; }
        if (!form.offer_type || !form.property_type) { showToast("نوع العرض والعقار مطلوبان", "error"); return; }
        if (!form.price) { showToast("السعر مطلوب", "error"); return; }
        if (!form.construction_status || !form.furnishing || !form.direct_or_broker) {
            showToast("جميع الحقول الأساسية مطلوبة", "error"); return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                city_id: form.city_id ? parseInt(form.city_id) : null,
                neighborhood_id: form.neighborhood_id ? parseInt(form.neighborhood_id) : null,
                length_1: form.length_1 ? parseFloat(form.length_1) : null,
                length_2: form.length_2 ? parseFloat(form.length_2) : null,
                price: parseFloat(form.price),
                latitude: form.latitude ? parseFloat(form.latitude) : null,
                longitude: form.longitude ? parseFloat(form.longitude) : null,
                cover_image: coverImage,
                images_gallery: gallery,
            };

            const url = initialData?.id ? `/api/properties/${initialData.id}` : "/api/properties";
            const method = initialData?.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            showToast(initialData?.id ? "تم تحديث العقار بنجاح" : "تم إضافة العقار بنجاح", "success");
            onSuccess(data.data);
        } catch (err: any) {
            showToast(err.message || "حدث خطأ", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover image */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">صورة الغلاف <span className="text-red-500">*</span></label>
                {coverImage ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                        <Image src={coverImage} alt="الغلاف" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => setCoverImage("")}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#5D4037] transition-colors bg-gray-50">
                        {uploadingCover ? (
                            <RefreshCw className="w-8 h-8 text-[#5D4037] animate-spin" />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">انقر لرفع صورة الغلاف</span>
                                <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — حد أقصى 5MB</span>
                            </>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "cover")}
                        />
                    </label>
                )}
            </div>

            {/* Gallery */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                    صور المعرض ({gallery.length}/10)
                </label>
                <div className="flex gap-2 flex-wrap mb-2">
                    {gallery.map((img, i) => (
                        <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden border border-gray-200">
                            <Image src={img} alt={`gallery-${i}`} fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))}
                                className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {gallery.length < 10 && (
                        <label className="flex items-center justify-center w-24 h-20 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#5D4037] transition-colors bg-gray-50">
                            {uploadingGallery ? <RefreshCw className="w-5 h-5 text-[#5D4037] animate-spin" /> : <Upload className="w-5 h-5 text-gray-400" />}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={async (e) => {
                                    const files = Array.from(e.target.files || []);
                                    for (const f of files.slice(0, 10 - gallery.length)) {
                                        await uploadFile(f, "gallery");
                                    }
                                }}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Form fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Offer type */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">نوع العرض <span className="text-red-500">*</span></label>
                    <select value={form.offer_type} onChange={(e) => update("offer_type", e.target.value)} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]">
                        <option value="">اختر...</option>
                        {OFFER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Property type */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">نوع العقار <span className="text-red-500">*</span></label>
                    <select value={form.property_type} onChange={(e) => update("property_type", e.target.value)} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]">
                        <option value="">اختر...</option>
                        {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* City */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">المدينة</label>
                    <select value={form.city_id} onChange={(e) => { update("city_id", e.target.value); update("neighborhood_id", ""); }}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]">
                        <option value="">اختر المدينة</option>
                        {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* Neighborhood */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">الحي</label>
                    <select value={form.neighborhood_id} onChange={(e) => update("neighborhood_id", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]">
                        <option value="">اختر الحي</option>
                        {neighborhoods.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
                    </select>
                </div>

                {/* Length 1 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">الطول الأول</label>
                    <input type="number" placeholder="مثال: 20" value={form.length_1} onChange={(e) => update("length_1", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]" />
                </div>

                {/* Length 2 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">الطول الثاني</label>
                    <input type="number" placeholder="مثال: 15" value={form.length_2} onChange={(e) => update("length_2", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]" />
                </div>

                {/* Auto area size */}
                {areaSize && (
                    <div className="sm:col-span-2">
                        <div className="bg-[#EFEBE9] text-[#5D4037] px-4 py-2.5 rounded-xl text-sm font-bold">
                            المساحة المحسوبة: {areaSize} م²
                        </div>
                    </div>
                )}

                {/* Parcel number */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">رقم القطعة</label>
                    <input type="text" placeholder="اختياري" value={form.parcel_number} onChange={(e) => update("parcel_number", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]" />
                </div>

                {/* Street width */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">عرض الشارع</label>
                    <input type="text" placeholder="مثال: 15م" value={form.street_width} onChange={(e) => update("street_width", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]" />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">السعر (ريال) <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="مثال: 500000" required value={form.price} onChange={(e) => update("price", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]" />
                </div>

                {/* Construction status */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">حالة البناء <span className="text-red-500">*</span></label>
                    <select value={form.construction_status} onChange={(e) => update("construction_status", e.target.value)} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]">
                        <option value="">اختر...</option>
                        {CONSTRUCTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* Furnishing */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">التأثيث <span className="text-red-500">*</span></label>
                    <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]">
                        <option value="">اختر...</option>
                        {FURNISHINGS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>

                {/* Direct or broker */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">مباشر/وسيط <span className="text-red-500">*</span></label>
                    <select value={form.direct_or_broker} onChange={(e) => update("direct_or_broker", e.target.value)} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]">
                        <option value="">اختر...</option>
                        {DIRECT_OR_BROKER.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="وصف اختياري..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037] resize-none" />
            </div>

            {/* Maps link */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">رابط Google Maps</label>
                <input type="url" placeholder="https://maps.google.com/..." value={form.google_maps_link}
                    onChange={(e) => handleMapsLinkChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]" />
                {form.latitude && form.longitude && (
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ تم استخراج الإحداثيات: {form.latitude}, {form.longitude}</p>
                )}
                {mapsWarning && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ لم يتم التعرف على رابط الخريطة، سيُحفظ العقار بدون موقع</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-[#5D4037] text-white rounded-xl font-bold text-sm hover:bg-[#4E342E] disabled:opacity-50 transition-colors"
                >
                    {saving ? "جاري الحفظ..." : initialData?.id ? "حفظ التعديلات" : "إضافة العقار"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                    إلغاء
                </button>
            </div>
        </form>
    );
}
