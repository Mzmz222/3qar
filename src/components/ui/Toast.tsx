"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
        error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    };

    const colors = {
        success: "border-green-200 bg-green-50",
        error: "border-red-200 bg-red-50",
        warning: "border-amber-200 bg-amber-50",
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 left-4 z-[200] flex flex-col gap-2 max-w-sm">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast-enter flex items-center gap-3 p-4 rounded-xl border shadow-lg ${colors[t.type]}`}
                    >
                        {icons[t.type]}
                        <p className="text-sm text-gray-800 font-medium flex-1">{t.message}</p>
                        <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
