import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PropertyDetails from "@/components/public/PropertyDetails";

export const revalidate = 3600;

const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const { data: property } = await sb
        .from("properties")
        .select("*, cities(name), neighborhoods(name)")
        .eq("id", id)
        .single();

    if (!property) return { title: "العقار غير موجود" };

    const title = `${property.property_type} ${property.offer_type} في ${property.neighborhoods?.name || ""}، ${property.cities?.name || ""}`;
    const description = property.description || `${property.property_type} ${property.offer_type} بسعر ${property.price.toLocaleString("ar-SA")} ريال`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: property.cover_image ? [{ url: property.cover_image }] : [],
            url: `${siteUrl}/property/${id}`,
            type: "website",
        },
        other: {
            "og:locale": "ar_SA",
        },
    };
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [propertyResult, settingsResult] = await Promise.all([
        sb.from("properties").select("*, cities(name), neighborhoods(name)").eq("id", id).single(),
        sb.from("settings").select("*").limit(1).single(),
    ]);

    if (!propertyResult.data) notFound();

    const property = propertyResult.data;

    // Fetch nearby properties (same city, with coordinates)
    let nearbyProperties: any[] = [];
    if (property.city_id) {
        const { data: nearby } = await sb
            .from("properties")
            .select("id, latitude, longitude, price, property_type, cover_image")
            .eq("city_id", property.city_id)
            .not("latitude", "is", null)
            .neq("id", property.id)
            .limit(10);
        nearbyProperties = nearby || [];
    }

    // JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: `${property.property_type} ${property.offer_type}`,
        description: property.description,
        image: property.cover_image,
        price: property.price,
        priceCurrency: "SAR",
        address: {
            "@type": "PostalAddress",
            addressLocality: property.neighborhoods?.name,
            addressRegion: property.cities?.name,
            addressCountry: "SA",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PropertyDetails
                property={property}
                settings={settingsResult.data || { site_name: "عقار" }}
                nearbyProperties={nearbyProperties}
            />
        </>
    );
}
