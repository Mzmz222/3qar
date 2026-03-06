"use client";

import { useState } from "react";
import { Copy, MessageCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { trackWhatsappClick } from "./actions";

export function ClientContactCard({ property, phoneToReach, siteName, channelLink }: any) {
    const [copied, setCopied] = useState(false);

    const getShareText = () => {
        const parts = [
            property.deal_type === "direct" ? "مباشر ✨" : "غير مباشر ✨",
            property.property_type ? `🏡 نوع العقار: ${(() => {
                switch (property.property_type) {
                    case 'land': return 'ارض';
                    case 'apartment': return 'شقه';
                    case 'building': return 'عمارة';
                    case 'shop': return 'محل';
                    case 'house': return 'بيت';
                    case 'villa': return 'فيلا';
                    case 'duplex': return 'دبلكس';
                    case 'farm': return 'مزرعة';
                    default: return property.property_type;
                }
            })()}` : "",
            property.parcel_number ? `📜 رقم القطعة: ${property.parcel_number}` : "",
            property.districts?.name ? `📍 الحي: ${property.districts.name}` : "",
            property.area_size ? `📐 المساحة: ${property.area_size}` : "",
            property.street_width ? `🛣 عرض الشارع: ${property.street_width}` : "",
            property.dimensions ? `📏 الأطوال: ${property.dimensions}` : "",
            property.price ? `💰 السعر: ${property.price}` : "",
            `📞 للتواصل: ${property.contact_numbers?.length ? property.contact_numbers.join(" - ") : phoneToReach}`,
            siteName,
            `🔗 رابط العقار: ${window.location.href}`,
            channelLink ? `📢 مجموعة العروض:\n${channelLink}` : ""
        ];
        return parts.filter(Boolean).join("\n\n");
    };

    const handleWhatsapp = async () => {
        // Track the click server-side
        await trackWhatsappClick(property.id);

        let message = "";
        if (property.status === "sold") {
            message = `السلام عليكم،\nأرغب في الاستفسار عن عقار تم بيعه مسبقاً برقم مرجع: ${property.id.split('-')[0]}.\nهل يتوفر لديكم عروض مشابهة؟\n\nرابط العقار:\n${window.location.href}`;
        } else {
            message = `السلام عليكم،\nأرغب في الاستفسار عن العقار التالي:\nرقم المرجع: ${property.id.split('-')[0]}\nالحي: ${property.districts?.name || "-"}\nالمساحة: ${property.area_size || "-"}\nالسعر: ${property.price || "-"}\n\nرابط العقار:\n${window.location.href}`;
        }
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneToReach}?text=${encodedMessage}`, "_blank");
    };

    const handleCopy = async () => {
        const text = getShareText();
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="font-data text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">إجراءات التواصل</h3>

            <div className="space-y-3">
                <button
                    onClick={handleWhatsapp}
                    className="btn-cinematic w-full flex items-center justify-between bg-charcoal text-cream py-5 px-8 rounded-cinematic group"
                >
                    <span className="flex items-center gap-4 font-heading font-bold uppercase tracking-widest text-sm relative z-10">
                        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        {property.status === "sold" ? "طلب عروض مشابهة" : "تواصل عبر الواتساب"}
                    </span>
                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity relative z-10" />
                </button>

                <button
                    onClick={handleCopy}
                    className="btn-cinematic w-full flex items-center justify-between border border-charcoal/10 bg-sand/5 text-charcoal py-5 px-8 rounded-cinematic group"
                >
                    <span className="flex items-center gap-4 font-heading font-bold uppercase tracking-widest text-sm relative z-10">
                        {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        {copied ? "تم نسخ البيانات" : "نسخ بيانات العرض"}
                    </span>
                </button>
            </div>

            <div className="pt-4 flex justify-between items-center opacity-30 font-data text-[9px] uppercase tracking-[0.2em] px-2">
                <span>رقم المرجع</span>
                <span>{property.id.split('-')[0]}</span>
            </div>
        </div>
    );
}

