"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addDistrictAction(formData: FormData) {
    const name = formData.get("name")?.toString().trim();
    if (!name) return { error: "اسم الحي مطلوب" };

    const supabase = await createClient();

    const { error } = await supabase.from("districts").insert([{ name }]);

    if (error) {
        if (error.code === "23505") return { error: "هذا الحي موجود مسبقاً" };
        return { error: "حدث خطأ أثناء الإضافة" };
    }

    revalidatePath("/admin/districts");
    return { success: true };
}

export async function deleteDistrictAction(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("districts").delete().eq("id", id);

    if (error) {
        return { error: "حدث خطأ أثناء الحذف" };
    }

    revalidatePath("/admin/districts");
    return { success: true };
}
