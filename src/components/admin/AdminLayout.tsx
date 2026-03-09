"use client";

import React from "react";
import Link from "next/link";
import { Home, Building2, MapPin, Clock, Key, LogOut } from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: "properties" | "locations" | "waiting" | "settings";
    onTabChange: (tab: "properties" | "locations" | "waiting" | "settings") => void;
    onLogout: () => void;
}

const tabs = [
    { id: "properties", label: "العقارات", icon: Building2 },
    { id: "locations", label: "المدن والأحياء", icon: MapPin },
    { id: "waiting", label: "قائمة الانتظار", icon: Clock },
    { id: "settings", label: "الإعدادات", icon: Key },
] as const;

export default function AdminLayout({ children, activeTab, onTabChange, onLogout }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
            {/* Admin Header */}
            <header className="bg-[#5D4037] text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6" />
                    <span className="font-bold text-lg">لوحة الإدارة</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">الموقع الرسمي</span>
                    </Link>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">خروج</span>
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <nav className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === id
                                    ? "border-[#5D4037] text-[#5D4037]"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                {children}
            </main>
        </div>
    );
}
