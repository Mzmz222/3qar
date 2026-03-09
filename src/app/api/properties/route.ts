import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabasePublic = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/properties — fetch with filters, pagination
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const offerType = searchParams.get("offer_type");
    const propertyType = searchParams.get("property_type");
    const constructionStatus = searchParams.get("construction_status");
    const cityId = searchParams.get("city_id");
    const neighborhoodId = searchParams.get("neighborhood_id");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    try {
        let query = supabasePublic()
            .from("properties")
            .select(
                `*, cities(name), neighborhoods(name)`,
                { count: "exact" }
            )
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (offerType) query = query.eq("offer_type", offerType);
        if (propertyType) query = query.eq("property_type", propertyType);
        if (constructionStatus) query = query.eq("construction_status", constructionStatus);
        if (cityId) query = query.eq("city_id", cityId);
        if (neighborhoodId) query = query.eq("neighborhood_id", neighborhoodId);
        if (search) query = query.ilike("description", `%${search}%`);

        const { data, count, error } = await query;
        if (error) throw error;

        return NextResponse.json({ data, count, page, limit });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/properties — create property (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { data, error } = await supabaseAdmin()
            .from("properties")
            .insert(body)
            .select()
            .single();

        if (error) throw error;

        // Revalidate pages
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: "/" }),
        }).catch(() => { });

        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
