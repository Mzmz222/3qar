import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function PrintPropertyPage(props: Props) {
    const { id } = await props.params;
    const supabase = await createClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*, districts(name)")
        .eq("id", id)
        .single();

    if (error || !property) {
        notFound();
    }

    // Settings
    const { data: settings } = await supabase.from("site_settings").select("*").limit(1).single();
    const siteName = settings?.site_name || "منصة العقارات الأحساء";

    // Public URL for QR
    // Determine base host (fallback to localhost for dev)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const propertyUrl = `${baseUrl}/property/${property.id}?utm_source=qr`;
    const qrCodesrc = `/api/qr?url=${encodeURIComponent(propertyUrl)}`;

    return (
        <div className="bg-white min-h-screen text-gray-900 p-8 font-sans" dir="rtl">
            {/* Hide Print Button during Print */}
            <div className="print:hidden mb-8 text-center">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 shadow-sm"
                >
                    طباعة النموذج
                </button>
            </div>

            <div className="max-w-4xl mx-auto border-2 border-gray-800 p-8 rounded-xl bg-white relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-gray-800 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-900">{siteName}</h1>
                        <p className="text-gray-500 mt-1">رقم المرجع: {property.id.split('-')[0]}</p>
                    </div>
                    <div className="text-left flex flex-col items-center">
                        <Image src={qrCodesrc} alt="QR Code" width={100} height={100} className="border border-gray-200 p-1 rounded-lg shadow-sm" />
                        <p className="text-xs text-gray-500 mt-2">امسح للوصول للموقع</p>
                    </div>
                </div>

                {/* Property Details */}
                <div className="space-y-6">
                    <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h2 className="text-2xl font-bold bg-white inline-block px-4">{property.title}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-lg">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-600">نوع العرض:</span>
                            <span className="font-medium text-blue-800">{property.deal_type === "direct" ? "مباشر" : "غير مباشر"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-600">نوع العقار:</span>
                            <span className="font-medium">
                                {(() => {
                                    switch (property.property_type) {
                                        case 'land': return 'ارض';
                                        case 'apartment': return 'شقه';
                                        case 'building': return 'عمارة';
                                        case 'shop': return 'محل';
                                        case 'house': return 'بيت';
                                        case 'villa': return 'فيلا';
                                        case 'duplex': return 'دبلكس';
                                        case 'farm': return 'مزرعة';
                                        default: return property.property_type || "-";
                                    }
                                })()}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-600">الحي:</span>
                            <span className="font-medium">{property.districts?.name || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-600">رقم القطعة/المخطط:</span>
                            <span className="font-medium">{property.parcel_number || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-600">المساحة:</span>
                            <span className="font-medium">{property.area_size || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-600">عرض الشارع:</span>
                            <span className="font-medium" dir="ltr">{property.street_width || "-"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-bold text-gray-600">الأطوال:</span>
                            <span className="font-medium" dir="ltr">{property.dimensions || "-"}</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl text-center mt-8">
                        <p className="text-gray-600 mb-2">السعر المطلوب</p>
                        <p className="text-4xl font-extrabold text-blue-900" dir="ltr">{property.price}</p>
                    </div>

                    {property.description && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">وصف إضافي</h3>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{property.description}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t-2 border-gray-800 flex justify-between items-center text-sm text-gray-600 font-bold">
                    <p>تاريخ الطباعة: {new Date().toLocaleDateString("ar-SA")}</p>
                    <p>لاتخاذ قرار الشراء نرجو زيارة العقار على أرض الواقع</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body {
            background-color: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page { margin: 1cm; }
        }
      `}} />
        </div>
    );
}
