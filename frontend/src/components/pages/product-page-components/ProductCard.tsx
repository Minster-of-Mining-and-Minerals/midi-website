"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/redux/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/fileUrl";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCard({ product, locale = "en" }: { product: Product, locale?: string }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 border-green-200';
            case 'Available on Request': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Inquiry Required': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Currently Unavailable': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const imageUrls = product.attachments
        ?.filter((a: any) => a.category === "image" || a.category === "main" || a.category === "gallery")
        .map((a: any) => getImageUrl(a.attachment))
        .filter((url: string) => url !== "") || [];

    if (imageUrls.length === 0) {
        imageUrls.push("/midi-log.png");
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (imageUrls.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(timer);
    }, [imageUrls.length]);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
    };

    return (
        <Card className="group flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-border bg-card pt-0">
            {/* Image Container */}
            <div className="relative w-full h-56 bg-slate-100 overflow-hidden pb-0 -mb-2">
                <Image
                    src={imageUrls[currentIndex]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 m-0 p-0"
                />

                {imageUrls.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {product.categories && product.categories.map((cat: any) => (
                        <Badge key={cat.category_id} variant="secondary" className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm shadow-sm font-semibold pointer-events-none">
                            {cat.name}
                        </Badge>
                    ))}
                </div>
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                    <Badge variant="outline" className={`backdrop-blur-sm shadow-sm ${getStatusColor(product.status)}`}>
                        {product.status}
                    </Badge>
                </div>
            </div>

            {/* Thumbnail Lists */}
            {imageUrls.length > 1 && (
                <div className="flex gap-1 -my-3.5 lg:-mt-1 bg-slate-50 overflow-x-auto hide-scrollbar">
                    {imageUrls.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentIndex(idx);
                            }}
                            className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${currentIndex === idx ? "border-primary shadow-sm" : "border-transparent opacity-70 hover:opacity-100 hover:border-slate-300"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${product.name} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Content Container */}
            <CardContent className="flex flex-col flex-grow p-2 pt-0 lg:pt-2">
                <h3 className="text-xl font-bold text-heading mb-2 line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                    {product.short_description}
                </p>

                {/* Specifications Preview (if any) */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-1 mb-2 pt-4 border-t border-border">
                        {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold">{key}</span>
                                <span className="text-xs font-medium text-heading truncate">{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Actions */}
            <CardFooter className="p-2 pt-0 mt-auto flex gap-2">
                <Button variant="outline" asChild className="w-full text-sm h-10 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors flex-1">
                    <Link href={`/${locale}/products/${product.product_id}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
