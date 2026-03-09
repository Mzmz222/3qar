import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSessionCookieHeader } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { pin } = await request.json();
        if (!pin) return NextResponse.json({ error: "PIN مطلوب" }, { status: 400 });

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: settings } = await supabase
            .from("settings")
            .select("admin_pin")
            .limit(1)
            .single();

        if (!settings || settings.admin_pin !== pin) {
            return NextResponse.json({ error: "الرقم السري خاطئ" }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });
        response.headers.set("Set-Cookie", createSessionCookieHeader());
        return response;
    } catch {
        return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
    }
}
