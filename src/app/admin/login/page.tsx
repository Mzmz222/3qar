"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول الإداري</h1>
                    <p className="mt-2 text-sm text-gray-500">منصة العقارات - الأحساء</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                            رمز الدخول (PIN)
                        </label>
                        <input
                            type="password"
                            id="pin"
                            name="pin"
                            maxLength={4}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center text-2xl tracking-[0.5em] p-3 border"
                            placeholder="••••"
                            dir="ltr"
                        />
                    </div>

                    {state?.error && (
                        <p className="text-red-500 text-sm text-center">{state.error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                        {isPending ? "جاري الدخول..." : "دخول"}
                    </button>
                </form>
            </div>
        </div>
    );
}
