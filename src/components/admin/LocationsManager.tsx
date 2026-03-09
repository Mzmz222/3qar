"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface City { id: number; name: string; }
interface Neighborhood { id: number; name: string; city_id: number; }

interface LocationsManagerProps {
    cities: City[];
    neighborhoods: Neighborhood[];
    onRefresh: () => void;
}

export default function LocationsManager({ cities, neighborhoods, onRefresh }: LocationsManagerProps) {
    const { showToast } = useToast();
    const [newCity, setNewCity] = useState("");
    const [addingCity, setAddingCity] = useState(false);
    const [expandedCity, setExpandedCity] = useState<number | null>(null);
    const [newNeighborhood, setNewNeighborhood] = useState<Record<number, string>>({});

    const addCity = async () => {
        if (!newCity.trim()) return;
        setAddingCity(true);
        try {
            const res = await fetch("/api/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCity.trim() }),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            setNewCity("");
            showToast("تم إضافة المدينة بنجاح", "success");
            onRefresh();
        } catch (err: any) {
            showToast(err.message || "فشل الإضافة", "error");
        } finally {
            setAddingCity(false);
        }
    };

    const deleteCity = async (id: number) => {
        if (!confirm("سيتم حذف المدينة وجميع أحيائها. هل أنت متأكد؟")) return;
        try {
            const res = await fetch(`/api/cities/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showToast("تم حذف المدينة", "success");
            onRefresh();
        } catch {
            showToast("فشل الحذف", "error");
        }
    };

    const addNeighborhood = async (cityId: number) => {
        const name = newNeighborhood[cityId]?.trim();
        if (!name) return;
        try {
            const res = await fetch("/api/neighborhoods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, city_id: cityId }),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            setNewNeighborhood((n) => ({ ...n, [cityId]: "" }));
            showToast("تم إضافة الحي بنجاح", "success");
            onRefresh();
        } catch (err: any) {
            showToast(err.message || "فشل الإضافة", "error");
        }
    };

    const deleteNeighborhood = async (id: number) => {
        try {
            const res = await fetch(`/api/neighborhoods/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            showToast("تم حذف الحي", "success");
            onRefresh();
        } catch {
            showToast("فشل الحذف", "error");
        }
    };

    return (
        <div className="space-y-6">
            {/* Add city */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">إضافة مدينة جديدة</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="اسم المدينة"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCity()}
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]"
                    />
                    <button
                        onClick={addCity}
                        disabled={addingCity || !newCity.trim()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#5D4037] text-white rounded-xl text-sm font-bold hover:bg-[#4E342E] disabled:opacity-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة
                    </button>
                </div>
            </div>

            {/* Cities list */}
            <div className="space-y-3">
                {cities.map((city) => {
                    const cityNeighborhoods = neighborhoods.filter((n) => n.city_id === city.id);
                    const isExpanded = expandedCity === city.id;

                    return (
                        <div key={city.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* City header */}
                            <div className="flex items-center justify-between px-5 py-4">
                                <button
                                    onClick={() => setExpandedCity(isExpanded ? null : city.id)}
                                    className="flex items-center gap-3 text-right flex-1"
                                >
                                    <span className="font-bold text-gray-800">{city.name}</span>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                        {cityNeighborhoods.length} حي
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                <button
                                    onClick={() => deleteCity(city.id)}
                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Neighborhoods */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 px-5 py-4 space-y-2">
                                    {/* Add neighborhood */}
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            placeholder="اسم الحي"
                                            value={newNeighborhood[city.id] || ""}
                                            onChange={(e) => setNewNeighborhood((n) => ({ ...n, [city.id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === "Enter" && addNeighborhood(city.id)}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037]"
                                        />
                                        <button
                                            onClick={() => addNeighborhood(city.id)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-[#EFEBE9] text-[#5D4037] rounded-xl text-sm font-bold hover:bg-[#D7CCC8] transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            إضافة حي
                                        </button>
                                    </div>

                                    {cityNeighborhoods.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-2">لا توجد أحياء بعد</p>
                                    ) : (
                                        cityNeighborhoods.map((n) => (
                                            <div key={n.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                                                <span className="text-sm text-gray-700">• {n.name}</span>
                                                <button
                                                    onClick={() => deleteNeighborhood(n.id)}
                                                    className="p-1 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {cities.length === 0 && (
                    <p className="text-center text-gray-400 py-8">لا توجد مدن بعد</p>
                )}
            </div>
        </div>
    );
}
