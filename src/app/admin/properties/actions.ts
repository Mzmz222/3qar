"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function togglePropertyStatusAction(id: string, currentStatus: string) {
    const newStatus = currentStatus === "draft" ? "published" : "draft";
    const supabase = await createClient();

    const { error } = await supabase
        .from("properties")
        .update({ status: newStatus })
        .eq("id", id);

    if (error) return { error: "حدث خطأ أثناء تعديل الحالة" };

    revalidatePath("/admin/properties");
    revalidatePath("/");
    return { success: true };
}

export async function togglePropertyFeaturedAction(id: string, isFeatured: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("properties")
        .update({ is_featured: !isFeatured })
        .eq("id", id);

    if (error) return { error: "حدث خطأ" };

    revalidatePath("/admin/properties");
    revalidatePath("/");
    return { success: true };
}

export async function deletePropertyAction(id: string) {
    const supabase = await createClient();

    // The database ON DELETE CASCADE handles removing property_images and views.
    // But we also need to delete the physical files from the storage bucket.
    const { data: images } = await supabase
        .from("property_images")
        .select("image_url")
        .eq("property_id", id);

    if (images && images.length > 0) {
        const paths = images.map(img => {
            // image_url is like: "https://...supabase.co/storage/v1/object/public/images/folder/file.webp"
            // We need just the path inside the 'images' bucket.
            const parts = img.image_url.split("/images/");
            return parts.length > 1 ? parts[1] : null;
        }).filter(Boolean) as string[];

        if (paths.length > 0) {
            await supabase.storage.from("images").remove(paths);
        }
    }

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) return { error: "حدث خطأ أثناء حذف العقار" };

    revalidatePath("/admin/properties");
    revalidatePath("/");
    return { success: true };
}
