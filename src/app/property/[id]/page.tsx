import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ViewTracker } from "./ViewTracker";
import { MapPin, Info, ArrowRight, Maximize2, Ruler, Hash, Calendar, BadgeCheck, ShieldCheck } from "lucide-react";
import MapPreviewWrapper from "@/components/MapPreviewWrapper";
import { Metadata, ResolvingMetadata } from "next";
import { ClientContactCard } from "./ClientContactCard";

export const revalidate = 60; // ISR Support

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = await props.params;
    const supabase = await createClient();
    const { data } = await supabase
        .from("properties")
        .select("title, description, property_images(image_url)")
        .eq("id", id)
        .single();

    if (!data) return {};

    const cover = data.property_images?.[0]?.image_url;

    return {
        title: `${data.title} | عقار الأحساء`,
        description: data.description || "استمتع بتملك أفضل الأراضي والعقارات في منطقة الأحساء.",
        openGraph: {
            images: cover ? [cover] : [],
        },
    };
}

export default async function PropertyDetailPage(props: Props) {
    const { id } = await props.params;
    const supabase = await createClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*, districts(name), property_images(*)")
        .eq("id", id)
        .single();

    if (error || !property) {
        notFound();
    }

    // Settings for WhatsApp handling
    const { data: settings } = await supabase.from("site_settings").select("*").limit(1).single();
    const siteName = "عقار الأحساء";
    const defaultNumbers = settings?.default_contact_numbers || [];

    const propertyNumbers = property.contact_numbers && property.contact_numbers.length > 0
        ? property.contact_numbers
        : defaultNumbers;
    const phoneToReach = propertyNumbers[0]?.replace("+", "") || "966591538123";

    // Gallery
    const images = property.property_images?.sort((a: any, b: any) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0)) || [];

    return (
        <div className="min-h-screen bg-cream text-charcoal pb-32 relative font-sans">
            <ViewTracker propertyId={property.id} />

            {/* Cinematic Header Nav */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-cinematic bg-cream/80 backdrop-blur-xl border border-charcoal/10 shadow-2xl px-8 py-4 flex items-center justify-between">
                <a href="/" className="font-heading font-bold text-xl tracking-tight uppercase">عقار الأحساء</a>
                <a href="/" className="flex items-center gap-2 font-data text-xs tracking-widest uppercase hover:text-deep-brown transition-colors">
                    العودة للقائمة
                    <ArrowRight className="w-4 h-4" />
                </a>
            </header>

            {/* 1. HERO - Full width image transition */}
            <section className="relative h-[80dvh] w-full overflow-hidden rounded-b-[4rem] shadow-2xl">
                <div className="absolute inset-0 bg-charcoal/20 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent z-20" />

                {images[0] ? (
                    <Image
                        src={images[0].image_url}
                        alt={property.title}
                        fill
                        priority
                        className="object-cover scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-sand/30 flex items-center justify-center font-heading text-charcoal/20 text-4xl font-bold uppercase tracking-tighter italic">لا تتوفر صور</div>
                )}

                <div className="absolute bottom-12 left-8 md:left-20 z-30 max-w-4xl">
                    <div className="flex gap-2 items-center mb-6">
                        {property.status === "sold" && (
                            <span className="bg-deep-brown text-cream text-[10px] font-data font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">تم البيع</span>
                        )}
                        {property.is_featured && (
                            <span className="bg-sand text-deep-brown text-[10px] font-data font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">عرض مميز</span>
                        )}
                        <span className="bg-white/10 backdrop-blur-md text-cream text-[10px] font-data font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                            {property.deal_type === "direct" ? "مباشر" : "غير مباشر"}
                        </span>
                        {property.property_type && (
                            <span className="bg-white/10 backdrop-blur-md text-cream text-[10px] font-data font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
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
                                        default: return property.property_type;
                                    }
                                })()}
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-cream tracking-tighter leading-[0.9] mb-4">
                        {property.title}
                    </h1>
                    <p className="font-data text-sand/80 uppercase tracking-[0.3em] flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {property.districts?.name || "موقع غير محدد"}
                    </p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-12 mt-20 relative z-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Column - Assets Details */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* Description Section */}
                        <section className="bg-sand/20 p-8 md:p-12 rounded-cinematic border border-charcoal/5">
                            <h2 className="font-heading text-3xl font-bold mb-8 border-b border-charcoal/10 pb-6 uppercase tracking-tight flex items-center gap-4">
                                <Info className="w-8 h-8 opacity-20" /> وصف العقار
                            </h2>
                            <div className="font-sans text-lg text-charcoal/80 leading-relaxed whitespace-pre-wrap max-w-3xl">
                                {property.description || "هذا العقار يمثل فرصة استثمارية مميزة في منطقة الأحساء."}
                            </div>
                        </section>

                        {/* Technical Specs (Grid) */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "المساحة الإجمالية", val: property.area_size, icon: <Maximize2 className="w-5 h-5 opacity-40" /> },
                                { label: "عرض الشارع", val: property.street_width, icon: <Ruler className="w-5 h-5 opacity-40" /> },
                                { label: "الأطوال", val: property.dimensions, icon: <Maximize2 className="w-5 h-5 opacity-40" /> },
                                { label: "رقم القطعة", val: property.parcel_number, icon: <Hash className="w-5 h-5 opacity-40" /> },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-cream p-8 rounded-cinematic border border-charcoal/5 shadow-sm flex flex-col items-center text-center group hover:bg-charcoal hover:text-sand transition-all duration-500">
                                    <div className="mb-4 text-deep-brown group-hover:text-sand transition-colors">{item.icon}</div>
                                    <p className="font-data text-[10px] uppercase tracking-[0.2em] mb-2 opacity-50">{item.label}</p>
                                    <p className="font-heading font-bold text-lg">{item.val || "غير متوفر"}</p>
                                </div>
                            ))}
                        </section>

                        {/* Extended Gallery */}
                        {images.length > 1 && (
                            <section>
                                <h3 className="font-data text-xs uppercase tracking-[0.3em] mb-10 opacity-40 text-center">معرض الصور</h3>
                                <div className="columns-1 md:columns-2 gap-4 space-y-4">
                                    {images.slice(1).map((img: any, idx: number) => (
                                        <div key={idx} className="relative rounded-cinematic overflow-hidden border border-charcoal/5 shadow-xl group cursor-none-cinematic">
                                            <img
                                                src={img.image_url}
                                                alt={`Detail ${idx}`}
                                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Geo-Spatial Pin */}
                        {property.lat && property.lng && (
                            <section className="bg-charcoal text-cream rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                                <div className="p-10 flex justify-between items-end">
                                    <div>
                                        <h3 className="font-heading text-4xl font-bold uppercase tracking-tight mb-2">الموقع الجغرافي</h3>
                                        <p className="font-data text-sand/40 uppercase tracking-widest text-xs">إحداثيات الموقع الدقيقة</p>
                                    </div>
                                    <div className="font-data text-sand font-bold text-lg hidden md:block">{property.lat.toFixed(5)}, {property.lng.toFixed(5)}</div>
                                </div>
                                <div className="h-[400px] w-full relative grayscale contrast-125 sepia-[20%]">
                                    <MapPreviewWrapper properties={[property]} />
                                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] z-20" />
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Transaction Interface */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">

                            <div className="bg-white p-10 rounded-cinematic border border-charcoal/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
                                {/* Price Tag Weighted */}
                                <div className="mb-8 pb-8 border-b border-charcoal/5">
                                    <p className="font-data text-[10px] uppercase tracking-[0.2em] opacity-40 mb-2">السعر المطلوب</p>
                                    <div className="font-heading font-bold text-4xl text-deep-brown" dir="ltr">
                                        {property.price || "تواصل لمعرفة السعر"}
                                    </div>
                                </div>

                                <ClientContactCard property={property} phoneToReach={phoneToReach} siteName={siteName} channelLink={settings?.whatsapp_channel_link} />

                                <div className="mt-10 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 text-charcoal/40 font-data text-[11px] uppercase tracking-wider">
                                        <ShieldCheck className="w-4 h-4 text-green-600 opacity-60" /> موثق من قبل الإدارة
                                    </div>
                                    <div className="flex items-center gap-3 text-charcoal/40 font-data text-[11px] uppercase tracking-wider">
                                        <BadgeCheck className="w-4 h-4 text-blue-600 opacity-60" /> فرصة استراتيجية
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Small Grid */}
                            <div className="bg-sand p-8 rounded-cinematic border border-charcoal/5 space-y-4">
                                <div className="flex justify-between items-center text-charcoal/50 font-data text-xs uppercase tracking-widest">
                                    <span>تاريخ الإضافة</span>
                                    <span className="text-charcoal font-bold">{new Date(property.created_at).toLocaleDateString("ar-SA")}</span>
                                </div>
                                <div className="flex justify-between items-center text-charcoal/50 font-data text-xs uppercase tracking-widest">
                                    <span>حالة العقار</span>
                                    <span className="text-green-600 font-bold whitespace-nowrap">تم الفحص</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

