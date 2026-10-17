"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SustainabilityVision() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 w-full"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <Image 
                                src="/factory.jpg" 
                                alt="Sustainable Business Practices" 
                                fill
                                className="object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent mix-blend-multiply" />
                        </div>
                    </motion.div>

                    {/* Text Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 w-full"
                    >
                        <span className="text-sm font-bold tracking-widest text-golden-dark uppercase mb-4 block">
                            Our Mission
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            Building Sustainable Business Connections
                        </h2>
                        <div className="space-y-6 text-lg text-slate-600">
                            <p>
                                At the Mineral Industry Development Institute (MIDI), our services go beyond technical support. We are committed to sustainable mineral extraction, value addition, import substitution, and creating lasting industrial capability across Ethiopia.
                            </p>
                            <p>
                                By delivering world-class laboratory testing, engineering consultancy, and specialized training, we empower the domestic mining sector, create skilled employment, and drive national socio-economic transformation.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
