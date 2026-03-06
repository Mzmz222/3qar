import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { MapPin, Maximize, Calendar } from "lucide-react";

interface PropertyCardProps {
    property: any;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const images = property.property_images || [];
    const coverImage = images.find((i: any) => i.is_cover)?.image_url || images[0]?.image_url;

    return (
        <div className="bg-cream rounded-cinematic shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-deep-brown/10 overflow-hidden group hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-2 flex flex-col h-full">
            <Link href={`/property/${property.id}`} className="block relative aspect-[4/3] bg-sand/30 overflow-hidden shrink-0">
                {coverImage ? (
                    <Image
                        src={coverImage}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-deep-brown/40 font-heading font-bold uppercase tracking-widest text-sm">
                        لا يوجد صوّر
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60 mix-blend-multiply pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    {property.is_featured && (
                        <span className="bg-charcoal text-sand text-[10px] font-data tracking-widest uppercase px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                            عرض مميز
                        </span>
                    )}
                    {property.status === "sold" && (
                        <span className="bg-deep-brown text-cream text-[10px] font-data tracking-widest uppercase px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                            تم البيع
                        </span>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                    <span className="text-xl font-heading font-bold text-cream decoration-sand group-hover:underline underline-offset-4 decoration-2" dir="ltr">
                        {property.price ? `${property.price}` : "عند الطلب"}
                    </span>
                </div>
            </Link>

            <div className="p-6 md:p-8 flex flex-col flex-1 bg-cream">
                <Link href={`/property/${property.id}`} className="block mb-4">
                    <h3 className="text-2xl font-bold font-heading text-charcoal line-clamp-2 leading-tight group-hover:text-deep-brown transition-colors">
                        {property.title}
                    </h3>
                </Link>

                <p className="text-charcoal/60 text-sm mb-6 line-clamp-2 leading-relaxed font-sans flex-1">
                    {property.description || "تفاصيل العقار متاحة عند الطلب. فرصة استثمارية مميزة."}
                </p>

                <div className="pt-6 border-t border-charcoal/10 grid grid-cols-2 gap-y-4 gap-x-2 text-xs text-charcoal/70 font-data">
                    {property.districts?.name && (
                        <span className="flex items-center gap-2"><MapPin size={14} className="opacity-50" /> {property.districts.name}</span>
                    )}
                    {property.area_size && (
                        <span className="flex items-center gap-2" dir="ltr"><Maximize size={14} className="opacity-50" /> {property.area_size}</span>
                    )}
                    {property.deal_type && (
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-deep-brown opacity-80" />
                            {property.deal_type === 'direct' ? 'مباشر' : 'غير مباشر'}
                        </span>
                    )}
                    {property.property_type && (
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-deep-brown opacity-80" />
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
            </div>

            <Link href={`/property/${property.id}`} className="btn-cinematic p-4 bg-sand text-charcoal font-heading font-bold uppercase tracking-widest text-[11px] text-center hover:bg-deep-brown hover:text-sand transition-colors block shrink-0">
                <span className="relative z-10">عرض التفاصيل</span>
            </Link>
        </div>
    );
}
