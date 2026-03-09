import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSessionCookieHeader } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { pin } = await request.json();
        if (!pin) return NextResponse.json({ error: "الرقم السري مطلوب" }, { status: 400 });

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Try DB settings
        const { data: settings } = await supabase
            .from("settings")
            .select("admin_pin")
            .limit(1)
            .single();

        let isValid = false;
        if (settings?.admin_pin === pin) {
            isValid = true;
        } else if (process.env.ADMIN_PIN === pin) {
            // 2. Fallback to ENV
            isValid = true;
        }

        if (!isValid) {
            return NextResponse.json({ error: "الرقم السري غير صحيح. حاول مرة أخرى." }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });
        response.headers.set("Set-Cookie", createSessionCookieHeader());
        return response;
    } catch (err) {
        console.error("Login trace:", err);
        return NextResponse.json({ error: "فشل تسجيل الدخول. تأكد من اتصال الإنترت." }, { status: 500 });
    }
}
