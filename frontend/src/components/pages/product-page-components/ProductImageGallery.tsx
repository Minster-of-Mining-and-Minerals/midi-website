"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
    images: string[];
    title: string;
    status: string;
}

export default function ProductImageGallery({ images, title, status }: ProductImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const mainImage = images[currentIndex] || images[0];

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 border-green-200';
            case 'Available on Request': return 'bg-[#ba8200]/10 text-[#ba8200] border-[#ba8200]/30';
            case 'Inquiry Required': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Currently Unavailable': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-md group">
                <Image 
                    src={mainImage} 
                    alt={title} 
                    fill 
                    className="object-cover transition-opacity duration-300"
                    priority
                />
                <div className="absolute top-4 right-4 z-10">
                    <Badge variant="outline" className={`px-3 py-1 shadow-sm backdrop-blur-sm ${getStatusColor(status)}`}>
                        {status}
                    </Badge>
                </div>
                
                {images.length > 1 && (
                    <>
                        <button 
                            type="button"
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            type="button"
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs z-10 backdrop-blur-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Slider */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                currentIndex === idx ? "border-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100 hover:border-slate-300"
                            }`}
                        >
                            <Image 
                                src={img} 
                                alt={`${title} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
