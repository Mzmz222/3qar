import { createClient } from "@/lib/supabase/server";
import { updateSettingsAction } from "./actions";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">إعدادات الموقع</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form action={updateSettingsAction as any} className="space-y-6">
                    <div>
                        <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-2">
                            اسم الموقع (المنصة)
                        </label>
                        <input
                            type="text"
                            id="site_name"
                            name="site_name"
                            defaultValue={settings?.site_name}
                            required
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                            placeholder="مثال: منصة العقارات الأحساء"
                        />
                    </div>

                    <div>
                        <label htmlFor="whatsapp_channel_link" className="block text-sm font-medium text-gray-700 mb-2">
                            رابط قناة الواتساب (اختياري)
                        </label>
                        <input
                            type="url"
                            id="whatsapp_channel_link"
                            name="whatsapp_channel_link"
                            defaultValue={settings?.whatsapp_channel_link || ""}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-left"
                            placeholder="https://whatsapp.com/channel/..."
                            dir="ltr"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            يُستخدم في الرسالة التلقائية كمرجع إضافي.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="default_contact_numbers" className="block text-sm font-medium text-gray-700 mb-2">
                            أرقام التواصل الافتراضية
                        </label>
                        <input
                            type="text"
                            id="default_contact_numbers"
                            name="default_contact_numbers"
                            defaultValue={settings?.default_contact_numbers?.join(", ") || ""}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border text-left font-mono"
                            placeholder="+966500000000, 0550000000"
                            dir="ltr"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            افصل بين الأرقام بفاصلة (,). تُستخدم هذه الأرقام إذا لم يتم تحديد رقم مخصص للعقار.
                        </p>
                    </div>

                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            حفظ الإعدادات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
