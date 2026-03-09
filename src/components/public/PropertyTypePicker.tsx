"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";

const PROPERTY_TYPES = {
    سكني: ["شقة", "فيلا", "عمارة سكنية", "ارض سكنية", "استراحة", "شاليه"],
    تجاري: ["عمارة تجارية", "ارض تجارية", "ارض صناعية", "مستودع", "مزرعة", "ارض زراعية"],
};

interface PropertyTypePickerProps {
    isOpen: boolean;
    selected: string;
    onSelect: (type: string) => void;
    onClose: () => void;
}

export default function PropertyTypePicker({ isOpen, selected, onSelect, onClose }: PropertyTypePickerProps) {
    const [tab, setTab] = useState<"سكني" | "تجاري">("سكني");
    const [localSelected, setLocalSelected] = useState(selected);

    const handleApply = () => {
        onSelect(localSelected);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="نوع العقار" maxWidth="max-w-md">
            {/* Tabs */}
            <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
                {(["سكني", "تجاري"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-[#5D4037] text-white shadow" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Type grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
                {PROPERTY_TYPES[tab].map((type) => {
                    const active = localSelected === type;
                    return (
                        <button
                            key={type}
                            onClick={() => setLocalSelected(active ? "" : type)}
                            className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${active
                                    ? "bg-[#D7CCC8] text-[#5D4037] border-[#5D4037]"
                                    : "border-gray-200 text-gray-600 hover:border-[#5D4037] hover:text-[#5D4037]"
                                }`}
                        >
                            {type}
                        </button>
                    );
                })}
            </div>

            {/* Apply */}
            <button
                onClick={handleApply}
                className="w-full py-3 bg-[#5D4037] text-white rounded-xl font-bold text-sm hover:bg-[#4E342E] transition-colors"
            >
                تم
            </button>
        </Modal>
    );
}
