import { createClient } from "@supabase/supabase-js";

export async function GET() {
    const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: properties } = await sb
        .from("properties")
        .select("id, updated_at")
        .order("created_at", { ascending: false });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  ${properties
            ?.map(
                (p) => `<url>
    <loc>${baseUrl}/property/${p.id}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
            )
            .join("\n  ") || ""
        }
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
