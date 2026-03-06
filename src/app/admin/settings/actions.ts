"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(formData: FormData) {
    const site_name = formData.get("site_name")?.toString().trim();
    const whatsapp_channel_link = formData.get("whatsapp_channel_link")?.toString().trim();
    const default_contact_numbers_str = formData.get("default_contact_numbers")?.toString().trim();

    if (!site_name) return { error: "اسم الموقع مطلوب" };

    const default_contact_numbers = default_contact_numbers_str
        ? default_contact_numbers_str.split(",").map(n => n.trim()).filter(Boolean)
        : [];

    const supabase = await createClient();

    // Assuming there is only one row in site_settings
    const { data: existing } = await supabase.from("site_settings").select("id").limit(1).single();

    if (existing?.id) {
        const { error } = await supabase
            .from("site_settings")
            .update({ site_name, whatsapp_channel_link, default_contact_numbers })
            .eq("id", existing.id);

        if (error) return { error: "حدث خطأ أثناء التحديث" };
    } else {
        const { error } = await supabase
            .from("site_settings")
            .insert([{ site_name, whatsapp_channel_link, default_contact_numbers }]);

        if (error) return { error: "حدث خطأ أثناء الإضافة" };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/"); // Update public pages layout
    return { success: true, message: "تم تحديث الإعدادات بنجاح" };
}
