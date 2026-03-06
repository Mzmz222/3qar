import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Pin, PinOff, Printer } from "lucide-react";
import { togglePropertyStatusAction, togglePropertyFeaturedAction, deletePropertyAction } from "./actions";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
    const supabase = await createClient();

    // Fetch properties with district name and view count
    // We can't do aggregate count directly in a standard join easily without RPC in Supabase if we want it alongside all columns,
    // but we can fetch properties and views and map them, or just fetch `properties(*, districts(name))` and views separately.
    const { data: properties } = await supabase
        .from("properties")
        .select(`
      *,
      districts ( name )
    `)
        .order("created_at", { ascending: false });

    // Fetch views count
    const { data: viewsData } = await supabase
        .from("property_views")
        .select("property_id");

    const viewsCountMap = viewsData?.reduce((acc: any, view: any) => {
        acc[view.property_id] = (acc[view.property_id] || 0) + 1;
        return acc;
    }, {}) || {};

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">إدارة العقارات</h1>
                <Link
                    href="/admin/properties/new"
                    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>إضافة عقار</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">العنوان</th>
                                <th className="px-6 py-4 font-semibold">الحي</th>
                                <th className="px-6 py-4 font-semibold">السعر</th>
                                <th className="px-6 py-4 font-semibold text-center">الحالة</th>
                                <th className="px-6 py-4 font-semibold text-center">المشاهدات</th>
                                <th className="px-6 py-4 font-semibold text-center w-48">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!properties || properties.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        لا يوجد عقارات مضافة حتى الآن.
                                    </td>
                                </tr>
                            )}
                            {properties?.map((property) => (
                                <tr key={property.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {property.title}
                                        {property.is_featured && (
                                            <span className="inline-flex items-center mx-2 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                مثبت
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* @ts-ignore */}
                                        {property.districts?.name || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-emerald-600 font-semibold" dir="ltr">
                                        {property.price || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.status === "published"
                                                ? "bg-green-100 text-green-800"
                                                : property.status === "sold"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {property.status === "published"
                                                ? "منشور"
                                                : property.status === "sold"
                                                    ? "مباع"
                                                    : "مسودة"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono">
                                        {viewsCountMap[property.id] || 0}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <form action={togglePropertyStatusAction.bind(null, property.id, property.status) as any}>
                                                <button
                                                    type="submit"
                                                    title={property.status === "published" ? "إخفاء" : "نشر"}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                                                >
                                                    {property.status === "published" ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </form>

                                            <form action={togglePropertyFeaturedAction.bind(null, property.id, property.is_featured) as any}>
                                                <button
                                                    type="submit"
                                                    title={property.is_featured ? "إلغاء التثبيت" : "تثبيت"}
                                                    className={`p-1.5 rounded-md transition-colors ${property.is_featured
                                                        ? "text-yellow-600 hover:bg-yellow-50"
                                                        : "text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                                                        }`}
                                                >
                                                    {property.is_featured ? <PinOff size={18} /> : <Pin size={18} />}
                                                </button>
                                            </form>

                                            <Link
                                                href={`/admin/properties/${property.id}/print`}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                                                title="طباعة"
                                                target="_blank"
                                            >
                                                <Printer size={18} />
                                            </Link>

                                            <Link
                                                href={`/admin/properties/${property.id}/edit`}
                                                className="p-1.5 text-gray-500 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                                                title="تعديل"
                                            >
                                                <Edit size={18} />
                                            </Link>

                                            <form action={deletePropertyAction.bind(null, property.id) as any}>
                                                <DeleteButton />
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
