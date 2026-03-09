import QRCode from "qrcode";

export async function generateQRCode(url: string): Promise<string> {
    try {
        const dataUrl = await QRCode.toDataURL(url, {
            width: 400,
            margin: 2,
            color: {
                dark: "#5D4037",
                light: "#FFFFFF",
            },
            errorCorrectionLevel: "H",
        });
        return dataUrl;
    } catch {
        throw new Error("فشل في توليد QR Code");
    }
}

export async function generateQRBuffer(url: string): Promise<Buffer> {
    const buffer = await QRCode.toBuffer(url, {
        width: 400,
        margin: 2,
        color: {
            dark: "#5D4037",
            light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
        type: "png",
    });
    return buffer;
}
