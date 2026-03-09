"use client";

import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function PinSettings() {
    const { showToast } = useToast();
    const [form, setForm] = useState({ currentPin: "", newPin: "", confirmPin: "" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.newPin !== form.confirmPin) {
            showToast("PIN الجديد لا يتطابق", "error"); return;
        }
        if (form.newPin.length < 4) {
            showToast("يجب أن يكون PIN 4 أرقام على الأقل", "error"); return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/change-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            showToast("تم تغيير الرقم السري بنجاح", "success");
            setForm({ currentPin: "", newPin: "", confirmPin: "" });
        } catch (err: any) {
            showToast(err.message || "فشل تغيير PIN", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-[#EFEBE9] rounded-xl">
                        <KeyRound className="w-5 h-5 text-[#5D4037]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">تغيير الرقم السري</h3>
                        <p className="text-xs text-gray-400 mt-0.5">PIN لوحة الإدارة</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">PIN الحالي</label>
                        <input
                            type="password"
                            value={form.currentPin}
                            onChange={(e) => setForm((f) => ({ ...f, currentPin: e.target.value }))}
                            required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037] tracking-widest"
                            placeholder="••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">PIN الجديد</label>
                        <input
                            type="password"
                            value={form.newPin}
                            onChange={(e) => setForm((f) => ({ ...f, newPin: e.target.value }))}
                            required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037] tracking-widest"
                            placeholder="••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">تأكيد PIN الجديد</label>
                        <input
                            type="password"
                            value={form.confirmPin}
                            onChange={(e) => setForm((f) => ({ ...f, confirmPin: e.target.value }))}
                            required
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#5D4037] tracking-widest"
                            placeholder="••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 bg-[#5D4037] text-white rounded-xl font-bold text-sm hover:bg-[#4E342E] disabled:opacity-50 transition-colors"
                    >
                        {saving ? "جاري الحفظ..." : "تغيير الرقم السري"}
                    </button>
                </form>
            </div>
        </div>
    );
}
