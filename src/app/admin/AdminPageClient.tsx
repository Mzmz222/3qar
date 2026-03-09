"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import PropertyTable from "@/components/admin/PropertyTable";
import PropertyForm from "@/components/admin/PropertyForm";
import LocationsManager from "@/components/admin/LocationsManager";
import WaitingList from "@/components/admin/WaitingList";
import PinSettings from "@/components/admin/PinSettings";
import { ToastProvider } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { Plus, RefreshCw } from "lucide-react";

type Tab = "properties" | "locations" | "waiting" | "settings";

export default function AdminPageClient() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("properties");
    const [properties, setProperties] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
    const [waitingList, setWaitingList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProperty, setEditingProperty] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [propsRes, citiesRes, neighRes, waitRes] = await Promise.all([
                fetch("/api/properties?limit=100&page=1"),
                fetch("/api/cities"),
                fetch("/api/neighborhoods"),
                fetch("/api/waiting-list"),
            ]);
            const [propsData, citiesData, neighData, waitData] = await Promise.all([
                propsRes.json(), citiesRes.json(), neighRes.json(), waitRes.json(),
            ]);
            setProperties(propsData.data || []);
            setCities(Array.isArray(citiesData) ? citiesData : []);
            setNeighborhoods(Array.isArray(neighData) ? neighData : []);
            setWaitingList(Array.isArray(waitData) ? waitData : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const openAdd = () => { setEditingProperty(null); setShowForm(true); };
    const openEdit = (p: any) => { setEditingProperty(p); setShowForm(true); };
    const closeForm = () => { setShowForm(false); setEditingProperty(null); };
    const handleFormSuccess = () => { closeForm(); fetchAll(); };

    return (
        <ToastProvider>
            <AdminLayout activeTab={tab} onTabChange={setTab} onLogout={handleLogout}>
                {/* Properties tab */}
                {tab === "properties" && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-800">إدارة العقارات</h2>
                            <button
                                onClick={openAdd}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl font-bold text-sm hover:bg-[#4E342E] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                إضافة عقار
                            </button>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <RefreshCw className="w-8 h-8 text-[#5D4037] animate-spin" />
                            </div>
                        ) : (
                            <PropertyTable
                                properties={properties}
                                onEdit={openEdit}
                                onRefresh={fetchAll}
                            />
                        )}
                    </div>
                )}

                {/* Locations tab */}
                {tab === "locations" && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-5">المدن والأحياء</h2>
                        <LocationsManager
                            cities={cities}
                            neighborhoods={neighborhoods}
                            onRefresh={fetchAll}
                        />
                    </div>
                )}

                {/* Waiting list tab */}
                {tab === "waiting" && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-5">قائمة الانتظار (آخر 24 ساعة)</h2>
                        <WaitingList items={waitingList} onRefresh={fetchAll} />
                    </div>
                )}

                {/* Settings tab */}
                {tab === "settings" && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-5">الإعدادات</h2>
                        <PinSettings />
                    </div>
                )}
            </AdminLayout>

            {/* Property Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={closeForm}
                title={editingProperty ? "تعديل العقار" : "إضافة عقار جديد"}
                maxWidth="max-w-2xl"
            >
                <PropertyForm
                    initialData={editingProperty}
                    cities={cities}
                    allNeighborhoods={neighborhoods}
                    onSuccess={handleFormSuccess}
                    onCancel={closeForm}
                />
            </Modal>
        </ToastProvider>
    );
}
