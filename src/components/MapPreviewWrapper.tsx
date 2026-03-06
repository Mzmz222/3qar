"use client";

import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("./MapPreview"), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 rounded-2xl w-full h-full min-h-[400px]"></div>
});

export default function MapPreviewWrapper(props: any) {
    return <MapPreview {...props} />;
}
