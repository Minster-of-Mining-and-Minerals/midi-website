"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { useGetCareerContentQuery } from "@/redux/api/careerContentApi";
import { getFileUrl } from "@/utils/fileUrl";
export default function PeopleAndCulture() {
    const { data: content, isLoading } = useGetCareerContentQuery();

    if (isLoading) {
        return <div className="py-24 bg-slate-50 min-h-[500px]" />;
    }

    const topTitle = content?.culture_top_title || "Our Culture";
    const titleNormal = content?.culture_title || "People Power Our";
    const titleHighlight = content?.culture_title_highlight || "Progress";
    const description = content?.culture_description || "The strength of a growing multi-sector organization depends on capable, collaborative, and innovative people. Knowledge, competency, and integrity form the foundation of our culture.";
    
    const mainImageUrl = content?.culture_image_main?.file_path ? getFileUrl(content.culture_image_main.file_path) : "/home-4.jpg";
    const subImageUrl = content?.culture_image_sub?.file_path ? getFileUrl(content.culture_image_sub.file_path) : "/home-2.jpg";

    const features = content?.culture_features && content.culture_features.length > 0 
        ? content.culture_features 
        : [
            { icon: "Users", title: "Collaborative Culture", description: "We foster an environment where teamwork and shared goals drive our success across all sectors." },
            { icon: "Lightbulb", title: "Innovative Thinking", description: "Embracing new ideas and creative solutions to overcome challenges and improve our operations." },
            { icon: "ShieldCheck", title: "Integrity & Trust", description: "Operating with the highest ethical standards, building trust with our partners and communities." },
            { icon: "Target", title: "Competency & Excellence", description: "Committing to continuous learning and achieving excellence in everything we do." },
        ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Left Side: Images & Visuals */}
                    <div className="w-full lg:w-1/2 relative h-[500px] md:h-[600px]">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="absolute top-0 left-0 w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <Image
                                src={mainImageUrl}
                                alt="Our People"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute bottom-0 right-0 w-3/5 h-2/3 rounded-3xl overflow-hidden shadow-xl border-8 border-slate-50 z-20"
                        >
                            <Image
                                src={subImageUrl}
                                alt="Company Culture"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Decorative Element */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute top-10 -right-10 w-40 h-40 bg-[#ba8200]/15 rounded-full blur-3xl -z-10" />
                    </div>

                    {/* Right Side: Text & Features */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-sm font-bold text-primary tracking-widest uppercase mb-4 block">{topTitle}</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                {titleNormal} <span className="text-primary">{titleHighlight}</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                                {description}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature, index) => {
                                const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Star;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * index }}
                                        className="flex flex-col gap-3 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
