import { createClient } from "@/lib/supabase/server";
import { Users, Home, MapPin, Eye } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Basic stats
    const { count: propertiesCount } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

    const { count: publishedCount } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("status", "published");

    const { count: districtsCount } = await supabase
        .from("districts")
        .select("*", { count: "exact", head: true });

    const { count: viewsCount } = await supabase
        .from("property_views")
        .select("*", { count: "exact", head: true });

    const stats = [
        { name: "إجمالي العقارات", value: propertiesCount || 0, icon: Home },
        { name: "العقارات المنشورة", value: publishedCount || 0, icon: Eye },
        { name: "عدد الأحياء", value: districtsCount || 0, icon: MapPin },
        { name: "إجمالي المشاهدات", value: viewsCount || 0, icon: Users },
    ];

    // Recent Inquiries (WhatsApp clicks)
    const { data: recentInquiries } = await supabase
        .from("property_views")
        .select("*, properties(title)")
        .eq("source", "whatsapp")
        .order("created_at", { ascending: false })
        .limit(5);

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">لوحة القيادة</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.name}
                            className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <Users className="text-green-600" size={20} /> طلبات التواصل الأخيرة (في انتظار المعالجة)
                    </h2>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold animate-pulse">Live</span>
                </div>
                <div className="divide-y divide-gray-50">
                    {recentInquiries?.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">لا توجد طلبات تواصل حالية</div>
                    ) : (
                        recentInquiries?.map((inquiry: any) => (
                            <div key={inquiry.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-bold text-gray-900">{inquiry.properties?.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        تم النقر على زر الواتساب {new Date(inquiry.created_at).toLocaleString('ar-SA')}
                                    </p>
                                </div>
                                <div className="text-xs font-data text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    {inquiry.source === 'whatsapp' ? 'تحت المعالجة' : 'مشاهدة'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
