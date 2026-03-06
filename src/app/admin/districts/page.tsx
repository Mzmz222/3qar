import { createClient } from "@/lib/supabase/server";
import { addDistrictAction, deleteDistrictAction } from "./actions";
import { Trash2 } from "lucide-react";

export default async function DistrictsPage() {
    const supabase = await createClient();
    const { data: districts } = await supabase
        .from("districts")
        .select("*")
        .order("name", { ascending: true });

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">إدارة الأحياء</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add District Form */}
                <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-semibold mb-4">إضافة حي جديد</h2>
                    <form action={addDistrictAction as any} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                اسم الحي
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                placeholder="مثال: حي السلمانية"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            إضافة
                        </button>
                    </form>
                </div>

                {/* Districts List */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-right text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">اسم الحي</th>
                                <th className="px-6 py-4 font-semibold w-24">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {districts?.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                        لا يوجد أحياء مضافة حالياً
                                    </td>
                                </tr>
                            )}
                            {districts?.map((district) => (
                                <tr key={district.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-medium">
                                        {district.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <form action={deleteDistrictAction.bind(null, district.id) as any}>
                                            <button
                                                type="submit"
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
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
