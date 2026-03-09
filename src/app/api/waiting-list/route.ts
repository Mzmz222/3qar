import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await sb
        .from("waiting_list")
        .select("*, properties(id, cover_image, offer_type, property_type, price, neighborhoods(name), cities(name))")
        .gte("clicked_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order("clicked_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}
