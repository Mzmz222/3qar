import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabasePublic = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/properties/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data, error } = await supabasePublic()
        .from("properties")
        .select("*, cities(name), neighborhoods(name)")
        .eq("id", id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ data });
}

// PUT /api/properties/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { data, error } = await supabaseAdmin()
            .from("properties")
            .update({ ...body, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        // Revalidate property page
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: `/property/${id}` }),
        }).catch(() => { });

        return NextResponse.json({ data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE /api/properties/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sb = supabaseAdmin();

    try {
        // Get property to find images
        const { data: property } = await sb
            .from("properties")
            .select("cover_image, images_gallery")
            .eq("id", id)
            .single();

        if (property) {
            // Delete all images from Storage
            const filesToDelete: string[] = [];
            const extractPath = (url: string) => {
                try {
                    const u = new URL(url);
                    const parts = u.pathname.split('/object/public/property-images/');
                    return parts[1] || null;
                } catch { return null; }
            };

            if (property.cover_image) {
                const p = extractPath(property.cover_image);
                if (p) filesToDelete.push(p);
            }
            if (property.images_gallery?.length) {
                for (const img of property.images_gallery) {
                    const p = extractPath(img);
                    if (p) filesToDelete.push(p);
                }
            }

            if (filesToDelete.length > 0) {
                await sb.storage.from("property-images").remove(filesToDelete);
            }
        }

        const { error } = await sb.from("properties").delete().eq("id", id);
        if (error) throw error;

        // Revalidate home
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: "/" }),
        }).catch(() => { });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
