"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white py-3 px-8 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
            {pending ? "جاري الإضافة والمعالجة..." : "إضافة العقار"}
        </button>
    );
}
