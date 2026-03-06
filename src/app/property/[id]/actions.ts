"use server";

import { createClient } from "@/lib/supabase/server";

export async function trackViewAction(propertyId: string, utmSource: string | null, referrer: string | null) {
    const supabase = await createClient();

    let source = "unknown";

    if (utmSource === "qr") source = "qr";
    else if (utmSource === "whatsapp") source = "whatsapp";
    else if (utmSource === "social") source = "social";
    else if (referrer && referrer.includes("google")) source = "search";
    else if (!referrer || referrer === "") source = "direct";

    // Note: For 'direct', next.js might not send referrer depending on navigation type.

    await supabase.from("property_views").insert([{
        property_id: propertyId,
        source: source
    }]);
}

export async function trackWhatsappClick(propertyId: string) {
    const supabase = await createClient();

    // Log as a special view source
    await supabase.from("property_views").insert([{
        property_id: propertyId,
        source: "whatsapp"
    }]);

    // Note: To implement the 24-hour "Under Processing" status in Admin, 
    // we would ideally need a processing_until column.
    // For now, we record the intent in the view history.
}
