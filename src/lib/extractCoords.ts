/**
 * Extracts latitude and longitude from a Google Maps URL
 * Supports:
 * - https://maps.google.com/?q=24.7136,46.6753
 * - https://www.google.com/maps/place/.../@24.7136,46.6753,...
 * - https://goo.gl/maps/... and https://maps.app.goo.gl/...
 */
export async function extractCoordsFromGoogleMaps(
    url: string
): Promise<{ lat: number; lng: number } | null> {
    if (!url) return null;

    try {
        // Pattern 1: ?q=lat,lng
        const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
        if (qMatch) {
            return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
        }

        // Pattern 2: /@lat,lng,zoom
        const atPattern = /\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
        const atMatch = url.match(atPattern);
        if (atMatch) {
            return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
        }

        // Pattern 3: !3d lat !4d lng (embedded in URL)
        const embedMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
        if (embedMatch) {
            return { lat: parseFloat(embedMatch[1]), lng: parseFloat(embedMatch[2]) };
        }

        // Pattern 4: Shortened URL (goo.gl/maps or maps.app.goo.gl) - follow redirect
        if (url.includes("goo.gl") || url.includes("maps.app.goo.gl")) {
            try {
                const res = await fetch(url, { method: "HEAD", redirect: "follow" });
                const finalUrl = res.url;
                if (finalUrl !== url) {
                    return extractCoordsFromGoogleMaps(finalUrl);
                }
            } catch {
                return null;
            }
        }

        return null;
    } catch {
        return null;
    }
}
