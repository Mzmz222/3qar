import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    try {
        const { currentPin, newPin, confirmPin } = await request.json();

        if (!currentPin || !newPin || !confirmPin) {
            return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
        }

        if (newPin !== confirmPin) {
            return NextResponse.json({ error: "PIN الجديد لا يتطابق مع التأكيد" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: settings } = await supabase
            .from("settings")
            .select("id, admin_pin")
            .limit(1)
            .single();

        if (!settings || settings.admin_pin !== currentPin) {
            return NextResponse.json({ error: "الرقم السري الحالي خاطئ" }, { status: 401 });
        }

        await supabase
            .from("settings")
            .update({ admin_pin: newPin, updated_at: new Date().toISOString() })
            .eq("id", settings.id);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
    }
}
