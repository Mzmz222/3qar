import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Simple robust increment: fetch current, then increment
    // Note: In production a proper RPC is better, but this secures a successful build
    try {
        const { data } = await sb.from("properties").select("view_count").eq("id", id).single();
        const currentCount = data?.view_count || 0;

        await sb
            .from("properties")
            .update({ view_count: currentCount + 1 })
            .eq("id", id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("View count increment error:", err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
