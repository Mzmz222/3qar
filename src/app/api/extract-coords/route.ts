import { NextRequest, NextResponse } from "next/server";
import { extractCoordsFromGoogleMaps } from "@/lib/extractCoords";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();
        if (!url) return NextResponse.json({ error: "الرابط مطلوب" }, { status: 400 });

        const result = await extractCoordsFromGoogleMaps(url);
        if (result) {
            return NextResponse.json({ lat: result.lat, lng: result.lng });
        }
        return NextResponse.json({ error: "لم يتم التعرف على الرابط" }, { status: 422 });
    } catch {
        return NextResponse.json({ error: "فشل استخراج الإحداثيات" }, { status: 500 });
    }
}
