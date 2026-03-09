import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "لم يتم إرسال ملف" }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "حجم الصورة يتجاوز 5MB" }, { status: 400 });
        }

        if (!ACCEPTED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "صيغة الصورة غير مدعومة" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Process with sharp: convert to WebP, aim for 150-300KB
        const processed = await sharp(buffer)
            .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        const sb = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        const { error: uploadError } = await sb.storage
            .from("property-images")
            .upload(filename, processed, {
                contentType: "image/webp",
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: urlData } = sb.storage
            .from("property-images")
            .getPublicUrl(filename);

        return NextResponse.json({ url: urlData.publicUrl, filename });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
