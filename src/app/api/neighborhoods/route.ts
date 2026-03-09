import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const { data, error } = await sb().from("neighborhoods").select("*").order("name");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const { name, city_id } = await request.json();
    if (!name?.trim() || !city_id) return NextResponse.json({ error: "الاسم والمدينة مطلوبان" }, { status: 400 });

    const { data, error } = await sb()
        .from("neighborhoods")
        .insert({ name: name.trim(), city_id })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
}
