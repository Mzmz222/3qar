"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
    const pin = formData.get("pin")?.toString();

    const correctPin = process.env.ADMIN_PIN || "0000";

    if (pin === correctPin) {
        // Session is created and cookie set
        await createSession("admin");
        redirect("/admin");
    } else {
        return { error: "رمز PIN غير صحيح" };
    }
}
