"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useGetServiceWhyUsQuery } from "@/redux/api/serviceApi";
import { WhyUsSkeleton } from "@/components/skeletons";

export default function WhyMIDI() {
    const { data: whyUs, isLoading } = useGetServiceWhyUsQuery();

    if (isLoading) {
        return <WhyUsSkeleton />;
    }

    if (!whyUs || !whyUs.points || whyUs.points.length === 0) {
        return null;
    }

    const heading = whyUs.heading;
    const subheading = whyUs.subheading;
    const values = whyUs.points;

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {heading && <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">{heading}</h2>}
                    {subheading && (
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            {subheading}
                        </p>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((value, idx) => {
                        const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[value.icon as string] || LucideIcons.CheckCircle;
                        return (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * idx }}
                                className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-golden-classic hover:shadow-lg transition-all duration-300 group flex items-start gap-4"
                            >
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-golden-classic/10 transition-colors">
                                    <IconComponent className="w-6 h-6 text-slate-700 group-hover:text-golden-dark transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
