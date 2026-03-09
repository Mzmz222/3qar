"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KeyRound } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin }),
            });
            const data = await res.json();

            if (res.ok) {
                router.push("/admin");
            } else {
                setError(data.error || "الرقم السري خاطئ");
                setPin("");
            }
        } catch {
            setError("حدث خطأ، حاول مجدداً");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/logo.jfif"
                        alt="الشعار"
                        width={100}
                        height={60}
                        className="h-16 w-auto object-contain"
                    />
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-14 h-14 bg-[#EFEBE9] rounded-2xl flex items-center justify-center mb-4">
                            <KeyRound className="w-7 h-7 text-[#5D4037]" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
                        <p className="text-sm text-gray-400 mt-1">أدخل الرقم السري للدخول</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">الرقم السري</label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                required
                                autoFocus
                                className={`w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-widest focus:outline-none transition-colors ${error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-[#5D4037]"
                                    }`}
                                placeholder="••••"
                                maxLength={10}
                            />
                            {error && (
                                <p className="text-red-500 text-xs mt-2 text-center font-medium">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !pin}
                            className="w-full py-3 bg-[#5D4037] text-white rounded-xl font-bold text-sm hover:bg-[#4E342E] disabled:opacity-50 transition-all"
                        >
                            {loading ? "جاري التحقق..." : "دخول"}
                        </button>
                    </form>
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <a href="/" className="text-sm text-gray-400 hover:text-[#5D4037] transition-colors">
                        ← العودة للموقع
                    </a>
                </div>
            </div>
        </div>
    );
}
