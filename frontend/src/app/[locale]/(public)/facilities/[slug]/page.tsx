import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFacilityBySlug, getFacilityTypeById } from "@/datas/mockFacilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowRight, MapPin } from "lucide-react";
import FacilityImageGallery from "@/components/pages/facilities-page-components/FacilityImageGallery";
import GridBackground from "@/components/ui/grid-background";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug } = await params;
    const facility = getFacilityBySlug(slug);
    if (!facility) return { title: "Facility Not Found" };
    
    return {
        title: `${facility.name} | MIDI`,
        description: facility.shortDescription
    };
}

export default async function FacilityDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const facility = getFacilityBySlug(slug);
    
    if (!facility) {
        notFound();
    }

    const type = getFacilityTypeById(facility.typeId);

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Minimal Nav */}
            <div className="bg-white border-b border-border py-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Link href={`/${locale}/facilities`} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Return to Facilities
                    </Link>
                </div>
            </div>

            {/* Editorial Header */}
            <GridBackground>
                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center mt-12 mb-8">
                    {type && (
                        <div className="inline-flex items-center space-x-4 mb-8">
                            <div className="w-8 h-px bg-primary" />
                            <span className="text-sm font-bold tracking-widest text-primary uppercase">
                                {type.name} Facility
                            </span>
                            <div className="w-8 h-px bg-primary" />
                        </div>
                    )}
                    
                    <h1 className="text-4xl md:text-7xl font-bold text-primary mb-8 tracking-tight font-serif">
                        {facility.name}
                    </h1>
                    
                    <div className="text-xl md:text-2xl font-light text-primary/80 flex items-center justify-center gap-2 mt-2">
                        <span>{facility.location}</span>
                        {facility.mapUrl && (
                            <a
                                href={facility.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors"
                                title="View on map"
                            >
                                <MapPin className="w-6 h-6 inline" />
                            </a>
                        )}
                    </div>
                </div>
            </GridBackground>

            {/* Editorial Body */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
                <div className="prose prose-xl prose-slate max-w-none text-center mb-20 leading-relaxed font-light text-slate-700">
                    <p>{facility.fullDescription}</p>
                </div>

                {/* Horizontal Characteristics Strip */}
                {facility.characteristics && facility.characteristics.length > 0 && (
                    <div className="mb-24">
                        <div className="border-t border-b border-slate-200 py-12">
                            <div className="text-center mb-10">
                                <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Physical Characteristics</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                                {facility.characteristics.map((char, index) => (
                                    <div key={index} className="px-4 py-4 sm:py-0 flex flex-col items-center justify-center">
                                        <div className="text-primary font-bold text-3xl opacity-20 font-serif mb-2">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <span className="text-sm text-heading font-semibold uppercase">{char}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Editorial Gallery */}
                <div className="mb-24">
                    <div className="text-center mb-10">
                        <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Facility Visuals</h3>
                    </div>
                    <FacilityImageGallery 
                        images={facility.gallery || [facility.image]} 
                        title={facility.name} 
                    />
                </div>

                {/* Corporate Connection Footer */}
                <div className="bg-slate-50 rounded-none border-y border-slate-200 p-12 md:p-20 text-center mt-32">
                    <h2 className="text-3xl md:text-4xl font-bold text-heading mb-6 font-serif">
                        Supported Operations
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
                        This physical infrastructure serves as a core asset supporting MIDI&apos;s wider institutional and technical operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/${locale}/businesses/overview`}>
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto h-14 px-8 text-base shadow-lg">
                                Explore Our Businesses
                                <ArrowRight className="w-5 h-5 ml-3" />
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
