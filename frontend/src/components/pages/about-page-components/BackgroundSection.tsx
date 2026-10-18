"use client";
import React from "react";
import * as Icons from "lucide-react";
import { useGetBackgroundsQuery } from "@/redux/api/backgroundApi";
import SplitTitle from "@/components/common/SplitTitle";

const BackgroundPage = () => {
    const { data: backgrounds = [] } = useGetBackgroundsQuery();

    const title = backgrounds[0]?.title || "Mineral Industry Development Institute (MIDI)";
    const description = backgrounds[0]?.description || "Established under Proclamation No. 1263/2014 and governed by Regulation No. 508/2022 under the Ministry of Mines, the Mineral Industry Development Institute (MIDI) is mandated to support the national mineral industry in applied research & development, technical consultancy, modern laboratory testing, and specialized human capital development to foster production, import substitution, and sustainable economic transformation.";
    const iconName = backgrounds[0]?.icon || "Building2";
    const IconComponent = (Icons as any)[iconName] || Icons.Building2;

    return (
        <div className="h-auto py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            <SplitTitle title={title} />
                        </h1>
                    </div>
                    <p className="text-muted text-lg max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: description }} />
                </div>
            </div>
        </div>
    );
};

export default BackgroundPage;