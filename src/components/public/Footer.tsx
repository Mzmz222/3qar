"use client";

import React from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";

interface Settings {
    site_name: string;
    fal_license?: string;
    office_phone_1?: string;
    office_phone_2?: string;
    whatsapp_group_link?: string;
}

export default function Footer({ settings }: { settings: Settings }) {
    return (
        <footer className="bg-white border-t border-gray-100 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                    {/* FAL License */}
                    <div className="font-bold text-gray-700">
                        {settings.fal_license || "رخصة فال : ١١١١١"}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Phone 1 */}
                        {settings.office_phone_1 && (
                            <a
                                href={`tel:${settings.office_phone_1}`}
                                className="flex items-center gap-2 bg-[#EFEBE9] text-[#5D4037] px-4 py-2.5 rounded-xl font-bold hover:bg-[#D7CCC8] transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                <span>اتصل بالمكتب</span>
                            </a>
                        )}

                        {/* WhatsApp group */}
                        {settings.whatsapp_group_link && (
                            <a
                                href={settings.whatsapp_group_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl font-bold hover:bg-green-100 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>قروب واتساب</span>
                            </a>
                        )}
                    </div>

                    {/* Site name */}
                    <div className="text-gray-400 text-xs">
                        {settings.site_name} &copy; {new Date().getFullYear()}
                    </div>
                </div>
            </div>
        </footer>
    );
}
