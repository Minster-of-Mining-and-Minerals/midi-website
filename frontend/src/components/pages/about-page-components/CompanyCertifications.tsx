"use client";

import React from "react";
import Image from "next/image";
import SplitTitle from "@/components/common/SplitTitle";
import { useGetCertificationsQuery } from "@/redux/api/certificationApi";
import { useGetPageHeaderByIdentifierQuery } from "@/redux/api/pageHeaderApi";
import { getImageUrl } from "@/utils/fileUrl";
import { useLocale } from "next-intl";
import { pickLocalized } from "./aboutDefaults";

export default function CompanyCertifications() {
    const { data: response, isLoading, isError } = useGetCertificationsQuery();
    const locale = useLocale();
    const certifications = response?.data || [];
    const { data: headerData } = useGetPageHeaderByIdentifierQuery("about-certifications");

    if (isLoading) {
        return (
            <section className="py-24 bg-slate-50/50 flex justify-center items-center">
                <div className="animate-pulse space-y-8 max-w-7xl w-full px-4 text-center">
                    <div className="h-4 bg-slate-200 rounded w-32 mx-auto mb-4"></div>
                    <div className="h-10 bg-slate-200 rounded w-64 mx-auto mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-slate-200 rounded-3xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || certifications.length === 0) {
        return null; // Don't show the section if there are no certifications
    }

    // Process dynamic header, handling fallback
    const defaultSubtitle = "Certifications";
    const defaultTitle = "Company Certifications";
    const defaultDesc = "Our company operates under strict international guidelines to meet your project's needs, ensuring quality from collaboration meetings all the way to project completion. We believe that maintaining top-tier certifications is vital to delivering excellence.";
    
    // We repurpose the `icon` field for the small Subtitle since PageHeader doesn't have a dedicated subtitle field
    let displaySubtitle = (headerData?.icon && headerData.icon !== "Award") ? headerData.icon : defaultSubtitle;
    let displayTitle = headerData?.title || defaultTitle;
    let displayDesc = headerData?.description || defaultDesc;

    // Backward compatibility if someone had "Certifications" in title and "Company Certifications\n..." in description
    if (displayTitle === "Certifications" && displayDesc.includes("\n")) {
        const parts = displayDesc.split("\n");
        displaySubtitle = "Certifications";
        displayTitle = parts[0];
        displayDesc = parts.slice(1).join("\n");
    }

    return (
        <section className="py-24 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <p className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4">
                        {displaySubtitle}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        <SplitTitle title={displayTitle} />
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                        {displayDesc}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certifications.map((cert) => {
                        const imageUrl = cert.attachments && cert.attachments.length > 0 && cert.attachments[0].attachment 
                            ? getImageUrl(cert.attachments[0].attachment, "medium") 
                            : "/iso.png"; // Fallback image

                        return (
                            <div 
                                key={cert.certification_id} 
                                className="group relative flex flex-col items-center text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Decorative background circle on hover */}
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                                
                                {/* Logo Wrapper */}
                                <div className="relative z-10 mb-8 w-24 h-24 flex items-center justify-center p-4 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                    <Image 
                                        src={imageUrl} 
                                        alt={cert.title}
                                        width={80}
                                        height={80}
                                        className="object-contain w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                </div>
                                
                                {/* Title */}
                                <h3 className="relative z-10 text-xl font-extrabold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300">
                                    {pickLocalized(locale, cert.title, cert.title_am)}
                                </h3>
                                
                                {/* Description */}
                                <p className="relative z-10 text-slate-500 leading-relaxed">
                                    {pickLocalized(locale, cert.description, cert.description_am)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
