"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetCareerContentQuery } from "@/redux/api/careerContentApi";
import { getFileUrl } from "@/utils/fileUrl";

export default function Introduction() {
    const { data: content, isLoading } = useGetCareerContentQuery();

    if (isLoading) {
        return <div className="py-24 bg-white min-h-[500px]" />;
    }

    const titleNormal = content?.intro_title || "Build Your Career With";
    const titleHighlight = content?.intro_title_highlight || "Purpose";
    const desc1 = content?.intro_description_1 || "The Mineral Industry Development Institute (MIDI) is the national apex institution under the Ministry of Mines where engineers, scientists, researchers, and technical professionals spearhead Ethiopia's mineral transformation.";
    const desc2 = content?.intro_description_2 || "We believe that national prosperity is driven by building high-level human capital. Through postgraduate fellowships, advanced workshop training, and direct technical mentorship, MIDI empowers professionals in mining engineering, extractive metallurgy, and mineral economics to shape a self-reliant industrial future.";
    
    const imageUrl = content?.intro_image?.file_path ? getFileUrl(content.intro_image.file_path) : "/home-4.jpg";
    
    const cardFocus = content?.intro_card_focus || "MULTI-SECTOR";
    const cardGrowth = content?.intro_card_growth || "GROWTH";

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                                {titleNormal} <span className="text-primary">{titleHighlight}</span>
                            </h2>
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                                <p>{desc1}</p>
                                {desc2 && <p>{desc2}</p>}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content / Image */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl"
                        >
                            {/* Background Image */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url('${imageUrl}')` }}
                            />
                            {/* Fallback color if image not found */}
                            <div className="absolute inset-0 bg-slate-200 -z-10" />
                            
                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-black/60" />
                        </motion.div>

                        {/* Overlapping Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20, y: 20 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="absolute -bottom-8 -left-8 md:bottom-8 md:-left-12 bg-white p-6 md:p-8 rounded-xl shadow-xl border border-slate-100 max-w-[240px]"
                        >
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">Focus</span>
                                <span className="text-2xl font-black text-slate-900 leading-none">{cardFocus}</span>
                                <span className="text-2xl font-black text-primary leading-none">{cardGrowth}</span>
                            </div>
                            <div className="mt-4 h-1 w-12 bg-golden-classic rounded-full" />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
