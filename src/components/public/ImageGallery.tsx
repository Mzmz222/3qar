"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

interface ImageGalleryProps {
    coverImage: string;
    gallery?: string[];
    alt?: string;
}

export default function ImageGallery({ coverImage, gallery = [], alt = "صورة العقار" }: ImageGalleryProps) {
    const allImages = [coverImage, ...gallery].filter(Boolean);
    const [current, setCurrent] = useState(0);
    const [lightbox, setLightbox] = useState(false);
    const touchStart = useRef<number>(0);
    const touchEnd = useRef<number>(0);

    const prev = () => setCurrent((c) => (c - 1 + allImages.length) % allImages.length);
    const next = () => setCurrent((c) => (c + 1) % allImages.length);

    const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEnd.current = e.changedTouches[0].clientX;
        const diff = touchStart.current - touchEnd.current;
        if (Math.abs(diff) > 50) { if (diff > 0) next(); else prev(); }
    };

    if (allImages.length === 0) return null;

    return (
        <>
            {/* Main slider */}
            <div
                className="relative h-72 md:h-96 bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
                onClick={() => setLightbox(true)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Image
                    src={allImages[current]}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority={current === 0}
                />

                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Counter */}
                        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                            {current + 1} / {allImages.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto gallery-slider pb-1">
                    {allImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === current ? "border-[#5D4037]" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <Image src={img} alt={`صورة ${i + 1}`} fill className="object-cover" sizes="64px" />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 bg-black/95 z-[150] flex items-center justify-center"
                    onClick={() => setLightbox(false)}
                >
                    <button
                        className="absolute top-4 left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
                        onClick={() => setLightbox(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh] mx-4">
                        <Image
                            src={allImages[current]}
                            alt={alt}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
