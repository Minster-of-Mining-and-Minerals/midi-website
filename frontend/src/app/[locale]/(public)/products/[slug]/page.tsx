import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import InquiryForm from "@/components/pages/product-page-components/InquiryForm";
import ProductImageGallery from "@/components/pages/product-page-components/ProductImageGallery";
import { getImageUrl } from "@/utils/fileUrl";

async function getProduct(slug: string) {
    try {
        // Use internal Docker network URL if available to avoid NAT hairpin issues during SSR
        const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";
        const res = await fetch(`${baseUrl}/products/${slug}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product || (product.publish_status && product.publish_status !== "published")) {
        return { title: "Product Not Found" };
    }
    
    return {
        title: `${product.name} | MIDI`,
        description: product.short_description
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const product = await getProduct(slug);
    
    if (!product || (product.publish_status && product.publish_status !== "published")) {
        notFound();
    }

    // Categories
    const categories = product.categories || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 border-green-200';
            case 'Available on Request': return 'bg-[#ba8200]/10 text-[#ba8200] border-[#ba8200]/30';
            case 'Inquiry Required': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Currently Unavailable': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Filter image attachments and map to URLs
    const imageUrls = product.attachments
        ?.filter((a: any) => a.category === "image" || a.category === "main" || a.category === "gallery")
        .map((a: any) => getImageUrl(a.attachment))
        .filter((url: string) => url !== "") || [];

    // Fallback placeholder if no images
    if (imageUrls.length === 0) {
        imageUrls.push("/midi-log.png");
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Breadcrumb / Back Navigation */}
            <div className="bg-white border-b border-border py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Link href={`/${locale}/products`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Products
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Left Column: Product Info */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        {/* Hero Image / Gallery */}
                        <ProductImageGallery 
                            images={imageUrls} 
                            title={product.name} 
                            status={product.status} 
                        />

                        {/* Title & Description */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
                            <div className="mb-4">
                                {categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {categories.map((cat: any) => (
                                            <Badge key={cat.category_id} variant="secondary">
                                                {cat.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <h1 className="text-3xl md:text-4xl font-bold text-heading">
                                    {product.name}
                                </h1>
                            </div>
                            
                            {product.short_description && (
                                <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-medium">
                                    {product.short_description}
                                </p>
                            )}

                            <div 
                                className="prose prose-slate max-w-none text-muted-foreground leading-relaxed mb-6 break-words overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: product.full_description }}
                            />

                            {/* Specifications */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-heading mb-4">Key Specifications</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                                                    {key}
                                                </div>
                                                <div className="font-medium text-heading">
                                                    {String(value)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>

                    {/* Right Column: Inquiry Form */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <InquiryForm product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
