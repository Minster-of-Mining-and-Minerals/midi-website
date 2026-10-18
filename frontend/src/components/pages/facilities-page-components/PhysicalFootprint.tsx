"use client";

import React from "react";
import Image from "next/image";
import { useGetFacilityFootprintQuery } from "@/redux/api/facilityApi";
import { PhysicalFootprintSkeleton } from "@/components/skeletons";

export default function PhysicalFootprint() {
    const { data: footprint, isLoading } = useGetFacilityFootprintQuery();

    if (isLoading) {
        return <PhysicalFootprintSkeleton />;
    }

    if (!footprint) return null;

    const heading = footprint.heading;
    const description = footprint.description;
    const cardHeading = footprint.card_heading;
    const cardDescription = footprint.card_description;
    
    // Sort locations by order
    const locations = footprint?.locations 
        ? [...footprint.locations].sort((a, b) => a.order - b.order) 
        : [];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="mb-16 md:mb-24 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold text-heading mb-6 whitespace-pre-line">
                        {heading}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl whitespace-pre-line">
                        {description}
                    </p>
                </div>

                <div className="relative w-full rounded-3xl bg-slate-900 p-8 md:p-16 overflow-hidden flex flex-col md:flex-row gap-12 items-center">
                    {/* Background Map Image Overlay */}
                    <Image
                        src="/map.jpg"
                        alt="Geographic Footprint"
                        fill
                        className="object-cover opacity-30 mix-blend-overlay"
                    />

                    {/* Locations List */}
                    <div className="relative z-10 w-full md:w-1/2 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <div className="space-y-6">
                            {locations.length > 0 ? (
                                locations.map((loc) => (
                                    <div key={loc.id} className="flex items-center space-x-4 border-b border-white/20 pb-4">
                                        <div className="w-2 h-2 rounded-full bg-[#ba8200] shrink-0" />
                                        <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
                                            {loc.name}
                                        </h3>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white/70">No locations added yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Stats or text */}
                    <div className="relative z-10 w-full md:w-1/2">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-white">
                            <h4 className="text-xl font-bold mb-4 text-[#ba8200]">{cardHeading}</h4>
                            <p className="leading-relaxed opacity-90 whitespace-pre-line">
                                {cardDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
