"use client";

import { useEffect } from "react";
import { trackViewAction } from "./actions";
import { useSearchParams } from "next/navigation";

export function ViewTracker({ propertyId }: { propertyId: string }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const utmSource = searchParams.get("utm_source");
        const referrer = document.referrer;

        // Fire and forget
        trackViewAction(propertyId, utmSource, referrer);
    }, [propertyId, searchParams]);

    return null;
}
