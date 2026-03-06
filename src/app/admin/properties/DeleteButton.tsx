"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            title="حذف"
            disabled={pending}
            className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
            onClick={(e) => {
                if (!window.confirm("هل أنت متأكد من حذف هذا العقار حقاً؟ هذه الخطوة لا يمكن التراجع عنها وستحذف جميع الصور المتعلقة.")) {
                    e.preventDefault();
                }
            }}
        >
            <Trash2 size={18} />
        </button>
    );
}
