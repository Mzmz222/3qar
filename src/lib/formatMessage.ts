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
    google_maps_link?: string;
    neighborhoods?: { name: string };
    cities?: { name: string };
}

interface Settings {
    site_name: string;
    office_phone_1?: string;
    office_phone_2?: string;
    whatsapp_group_link?: string;
}

export function formatShareMessage(property: Property, settings: Settings, propertyUrl: string): string {
    const lines: string[] = [];

    lines.push(property.direct_or_broker);

    if (property.parcel_number) lines.push(`رقم القطعة: ${property.parcel_number}`);
    if (property.neighborhoods?.name) lines.push(`الحي: ${property.neighborhoods.name}`);
    if (property.length_1 && property.length_2) lines.push(`الأطوال: ${property.length_1}×${property.length_2}`);
    if (property.area_size) lines.push(`المساحة: ${property.area_size}م²`);
    if (property.street_width) lines.push(`عرض الشارع: ${property.street_width}`);
    lines.push(`السعر: ${formatPrice(property.price)} ريال`);

    const phones = [settings.office_phone_1, settings.office_phone_2].filter(Boolean);
    if (phones.length > 0) lines.push(`للتواصل: ${phones.join(' | ')}`);
    if (settings.site_name) lines.push(settings.site_name);
    if (property.google_maps_link) lines.push(`📍الموقع: ${property.google_maps_link}`);
    if (settings.whatsapp_group_link) lines.push(`رابط القروب: ${settings.whatsapp_group_link}`);

    return lines.join('\n');
}

export function formatWhatsAppMessage(property: Property, propertyUrl: string): string {
    const lines: string[] = [];
    lines.push('السلام عليكم،');
    lines.push('أرغب بالاستفسار عن العقار التالي:');
    lines.push(`رقم العقار: ${property.id}`);
    if (property.neighborhoods?.name) lines.push(`الحي: ${property.neighborhoods.name}`);
    if (property.length_1 && property.length_2) lines.push(`الأطوال: ${property.length_1}×${property.length_2}`);
    if (property.area_size) lines.push(`المساحة: ${property.area_size}م²`);
    lines.push(`السعر: ${formatPrice(property.price)} ريال`);
    lines.push(`رابط الإعلان: ${propertyUrl}`);
    lines.push('متوفر؟');
    return lines.join('\n');
}

export function formatPrice(price: number): string {
    return price.toLocaleString('ar-SA');
}
