"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Home,
    MapPin,
    Settings,
    LogOut,
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // If we are on login page, don't show the dashboard layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const navItems = [
        { name: "لوحة القيادة", href: "/admin", icon: LayoutDashboard },
        { name: "العقارات", href: "/admin/properties", icon: Home },
        { name: "الأحياء", href: "/admin/districts", icon: MapPin },
        { name: "الإعدادات", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">إدارة العقارات</h2>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span>تسجيل الخروج</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
