import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
    const urlParams = request.nextUrl.searchParams;
    const link = urlParams.get("url");

    if (!link) {
        return new NextResponse("URL parameter is missing", { status: 400 });
    }

    try {
        const qrBuffer = await QRCode.toBuffer(link, {
            type: "png",
            scale: 10,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
            errorCorrectionLevel: "H"
        });

        return new NextResponse(qrBuffer as any, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=31536000, immutable"
            },
        });
    } catch (error) {
        console.error("QR Generation error", error);
        return new NextResponse("Failed to generate QR Code", { status: 500 });
    }
}
