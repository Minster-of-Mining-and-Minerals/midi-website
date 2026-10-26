"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import PublicVacancyList from "@/features/vacancies/PublicVacancyList";

export default function CurrentOpportunities() {
    return (
        <section id="opportunities" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Current Opportunities</h2>
                </motion.div>

                <PublicVacancyList emptyState={
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">No Open Positions Right Now</h3>
                        <p className="text-slate-600 max-w-lg mb-8 leading-relaxed">
                            We don't currently have any published vacancies. Check back soon or send us your interest for future opportunities.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-sm"
                            >
                                Contact Us
                                <MessageSquare className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                } />

            </div>
        </section>
    );
}
