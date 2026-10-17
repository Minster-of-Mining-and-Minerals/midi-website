"use client";

import React from "react";
import { Building2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import GridBackground from "@/components/ui/grid-background";

export default function FacilitiesHero() {
    const handleScroll = () => {
        const gridElement = document.getElementById("facility-grid");
        if (gridElement) {
            gridElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <GridBackground>
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center mt-10">
                <span className="font-bold border rounded-xl border-gray-500 bg-background-secondary0/40 text-primary w-[72px] h-[72px] flex items-center justify-center mb-6">
                    <Building2 className="w-10 h-10" strokeWidth={1.5} />
                </span>
                
                <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
                    Our Laboratories & <span className="text-primary/70">Workshop Facilities</span>
                </h1>
                
                <p className="text-primary text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
                    MIDI's nationwide operations are anchored by modern mineral testing laboratories, pilot foundries, mold-making tool rooms, and educational centers of excellence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Button 
                        size="lg" 
                        onClick={handleScroll}
                        className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-12 text-base font-semibold shadow-md"
                    >
                        Explore Facilities
                        <ArrowDown className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </GridBackground>
    );
}
