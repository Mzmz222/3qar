export async function GET() {
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/sitemap.xml`;

    return new Response(robots, {
        headers: { "Content-Type": "text/plain" },
    });
}
