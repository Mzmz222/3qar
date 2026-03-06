import { createClient } from "@/lib/supabase/server";
import { Copy, Plus, MapPin } from "lucide-react";
import { addPropertyAction } from "./actions";
import { SubmitButton } from "./SubmitButton";

export default async function NewPropertyPage() {
    const supabase = await createClient();
    const { data: districts } = await supabase.from("districts").select("*").order("name");

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">إضافة عقار جديد</h1>

            <form action={addPropertyAction as any} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">عنوان العقار <span className="text-red-500">*</span></label>
                        <input type="text" name="title" required className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="مثال: فيلا فاخرة للبيع..." />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                        <textarea name="description" rows={4} className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="تفاصيل إضافية عن العقار..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع العرض <span className="text-red-500">*</span></label>
                        <select name="deal_type" required className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500">
                            <option value="direct">مباشر</option>
                            <option value="indirect">غير مباشر</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نوع العقار <span className="text-red-500">*</span></label>
                        <select name="property_type" required className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500">
                            <option value="land">ارض</option>
                            <option value="apartment">شقه</option>
                            <option value="building">عمارة</option>
                            <option value="shop">محل</option>
                            <option value="house">بيت</option>
                            <option value="villa">فيلا</option>
                            <option value="duplex">دبلكس</option>
                            <option value="farm">مزرعة</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الحي <span className="text-red-500">*</span></label>
                        <select name="district_id" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500">
                            <option value="">-- اختر الحي --</option>
                            {districts?.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">يمكنك إضافة حي جديد من <a href="/admin/districts" className="text-blue-600 underline">إدارة الأحياء</a>.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم القطعة / المخطط</label>
                        <input type="text" name="parcel_number" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المساحة</label>
                        <input type="text" name="area_size" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="مثال: 450 م²" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">عرض الشارع</label>
                        <input type="text" name="street_width" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="مثال: 15 م" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الأطوال</label>
                        <input type="text" name="dimensions" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="مثال: 15x30" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">السعر <span className="text-red-500">*</span></label>
                        <input type="text" name="price" required className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="مثال: 1,500,000 ريال" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">أرقام التواصل (اختياري)</label>
                        <input type="text" name="contact_numbers" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="افصل بينها بفاصلة" dir="ltr" />
                    </div>

                    <div className="md:col-span-2 border-t pt-6 mt-2">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">الموقع الجغرافي (اختياري)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">رابط الموقع (Google Maps)</label>
                                <input type="url" name="location_url" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="https://www.google.com/maps?q=..." dir="ltr" />
                                <p className="mt-1 text-xs text-gray-400">إذا أضفت الرابط، سيتم استخراج الإحداثيات تلقائياً إن أمكن.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">أو أدخل خط العرض (Lat)</label>
                                    <input type="text" name="lat" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="25.3..." dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">و خط الطول (Lng)</label>
                                    <input type="text" name="lng" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500" placeholder="49.5..." dir="ltr" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 border-t pt-6 mt-2">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">الصور</h3>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4 text-sm text-blue-800">
                            <ul className="list-disc list-inside space-y-1">
                                <li>الحد الأقصى لكل صورة هو 5MB.</li>
                                <li>الصورة الأولى ستكون هي صورة الغلاف (Cover).</li>
                                <li>يُسمح بحد أقصى 11 صورة (1 غلاف، 10 معرض).</li>
                                <li>سيتم ضغط الصور وتحويلها إلى WebP تلقائياً لضمان سرعة الموقع.</li>
                            </ul>
                        </div>
                        <input type="file" name="images" multiple accept="image/*" className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>

                <div className="pt-6 border-t flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
