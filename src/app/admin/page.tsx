import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminPageClient from "./AdminPageClient";

export default async function AdminPage() {
    const authed = await isAuthenticated();
    if (!authed) redirect("/admin/login");

    return <AdminPageClient />;
}
