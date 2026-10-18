"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  useGetImportExportOverviewQuery,
  useGetImportExportCategoriesQuery,
  useGetImportExportStepsQuery
} from '@/redux/api/businessApi';
import { ImportExportSkeleton } from "@/components/skeletons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const DynamicIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
  return <Icon className={className} />;
};

export default function ImportExport() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredImport, setHoveredImport] = useState<string | null>(null);
  const [hoveredExport, setHoveredExport] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yCenter = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Fetch dynamic data
  const { data: overview, isLoading: isOverviewLoading } = useGetImportExportOverviewQuery();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetImportExportCategoriesQuery();
  const { data: steps = [], isLoading: isStepsLoading } = useGetImportExportStepsQuery();

  if (isOverviewLoading || isCategoriesLoading || isStepsLoading) {
      return <ImportExportSkeleton />;
  }

  if (!overview) {
      return null;
  }

  const exportCategories = categories.filter(c => c.type === 'export');
  const importCategories = categories.filter(c => c.type === 'import');

  // Fallback defaults
  const PlaneIcon = LucideIcons.Plane;
  const ShipIcon = LucideIcons.Ship;

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-white text-slate-900 pt-20 pb-24">
      {/* Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.02),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-3xl mb-16"
        >
          {overview.page_subtitle && (
              <motion.span variants={itemVariants} className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">
                {overview.page_subtitle}
              </motion.span>
          )}
          {overview.page_title && (
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-heading leading-tight mb-6">
                {overview.page_title}
              </motion.h2>
          )}
          {overview.page_description && (
              <motion.p variants={itemVariants} className="text-lg text-body font-medium leading-relaxed">
                {overview.page_description}
              </motion.p>
          )}
        </motion.div>

        {/* Central Trade Visualization (Desktop: 3 columns, Mobile: Stacked) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-24 relative">

          {/* Desktop Connecting Lines (Background of columns) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            {/* Left to Center Line */}
            <svg className="absolute left-[25%] top-1/2 w-[25%] h-24 -translate-y-1/2 overflow-visible">
              <motion.path
                d="M0,48 C50,48 50,0 100,0"
                fill="none"
                stroke="url(#exportGradient)"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="100" cy="0" r="4" fill="#0F172A"
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}
              />
            </svg>

            {/* Center to Right Line */}
            <svg className="absolute left-[50%] top-1/2 w-[25%] h-24 -translate-y-1/2 overflow-visible">
              <motion.path
                d="M0,0 C50,0 50,48 100,48"
                fill="none"
                stroke="url(#importGradient)"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.circle
                cx="0" cy="0" r="4" fill="#0F172A"
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              />
            </svg>

            {/* SVG Gradients */}
            <svg className="w-0 h-0 absolute">
              <defs>
                <linearGradient id="exportGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0F172A" stopOpacity="0" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="importGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0F172A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* LEFT: EXPORT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/3 z-10 flex flex-col"
          >
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

              <div className="inline-flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase mb-6 px-3 py-1 bg-primary/10 rounded-full">
                <PlaneIcon className="w-4 h-4" />
                EXPORT
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                {overview.export_title}
              </h3>

              <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                {overview.export_description}
              </p>

              {/* Commodity Visual Strip */}
              <div className="grid grid-cols-2 gap-3">
                {exportCategories.map((cat: any, idx) => {
                  const key = cat.category_id || cat.id;
                  return (
                    <motion.div
                      key={key}
                      onMouseEnter={() => setHoveredExport(key)}
                      onMouseLeave={() => setHoveredExport(null)}
                      className="group relative bg-white hover:bg-slate-50 border border-slate-200 hover:border-primary/50 transition-all duration-300 rounded-xl p-3 cursor-default overflow-hidden shadow-sm"
                    >
                      <div className="relative z-10">
                        <DynamicIcon iconName={cat.icon || 'HelpCircle'} className={`w-5 h-5 mb-2 transition-colors duration-300 ${hoveredExport === key ? 'text-primary' : 'text-slate-400'}`} />
                        <h4 className="text-[11px] font-bold tracking-wider uppercase mb-1 text-slate-900">{cat.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{cat.description}</p>
                      </div>

                      {/* Subtle hover highlight */}
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${hoveredExport === key ? 'w-full' : 'w-0'}`}></div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* CENTER: MIDI ETHIOPIA */}
          <motion.div
            style={{ y: yCenter }}
            className="w-full lg:w-1/3 flex justify-center items-center z-20 py-8 lg:py-0"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-56 h-56 flex flex-col items-center justify-center rounded-full bg-[#0F172A] shadow-[0_20px_50px_rgba(15,23,42,0.3)] border-[6px] border-white z-10"
            >
              {/* Spinning decorative ring */}
              <div className="absolute inset-[-12px] rounded-full border border-slate-200 border-dashed animate-[spin_20s_linear_infinite]"></div>

              <DynamicIcon iconName={overview.center_icon || 'Globe2'} className="w-8 h-8 text-white/50 mb-3" />
              {overview.center_title && (
                  <h3 className="text-white font-bold text-2xl text-center leading-none tracking-wider mb-2" dangerouslySetInnerHTML={{ __html: overview.center_title.replace(/\n/g, '<br />') }} />
              )}
              <p className="text-primary text-[10px] uppercase font-bold tracking-widest text-center w-3/4">
                {overview.center_subtitle}
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT: IMPORT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/3 z-10 flex flex-col"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden h-full text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none"></div>

              <div className="inline-flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase mb-6 px-3 py-1 bg-white/10 rounded-full">
                <ShipIcon className="w-4 h-4" />
                IMPORT
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                {overview.import_title}
              </h3>

              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                {overview.import_description}
              </p>

              {/* Industry Matrix */}
              <div className="grid grid-cols-2 gap-3">
                {importCategories.map((cat: any, idx) => {
                  const Icon = (LucideIcons as any)[cat.icon] || LucideIcons.HelpCircle;
                  const key = cat.category_id || cat.id;
                  return (
                    <motion.div
                      key={key}
                      onMouseEnter={() => setHoveredImport(key)}
                      onMouseLeave={() => setHoveredImport(null)}
                      className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-all duration-300 rounded-xl p-3 cursor-default overflow-hidden"
                    >
                      <div className="relative z-10">
                        <Icon className={`w-5 h-5 mb-2 transition-colors duration-300 ${hoveredImport === key ? 'text-primary' : 'text-slate-300'}`} />
                        <h4 className="text-[11px] font-bold tracking-wider uppercase mb-1 text-white">{cat.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{cat.description}</p>
                      </div>

                      {/* Subtle hover highlight */}
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${hoveredImport === key ? 'w-full' : 'w-0'}`}></div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4-Step Flow & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-center">

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4"
          >
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex-1">
              <div className="text-3xl font-bold text-slate-900 mb-1">{overview.stat1_value}</div>
              <div className="text-sm font-semibold text-slate-600 mb-1">{overview.stat1_label}</div>
              <div className="text-xs text-slate-500">{overview.stat1_subtext}</div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex-1">
              <div className="text-3xl font-bold text-primary mb-1">{overview.stat2_value}</div>
              <div className="text-sm font-semibold text-slate-800">{overview.stat2_label}</div>
            </div>
          </motion.div>

          {/* Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 bg-slate-900 rounded-2xl p-8 relative overflow-hidden text-white"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              {steps.map((step, idx, arr) => (
                <div key={idx} className="relative">
                  {/* Arrow connecting steps (desktop) */}
                  {idx < arr.length - 1 && (
                    <div className="hidden md:block absolute top-4 right-0 w-full h-px bg-slate-700 -z-10 translate-x-1/2">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-slate-500 rotate-45"></div>
                    </div>
                  )}

                  <div className="text-primary font-mono text-sm mb-3">{step.step_number}</div>
                  <h4 className="text-sm font-bold tracking-wider mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed pr-4">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto border-t border-slate-200 pt-16"
        >
          {overview.cta_title && <h3 className="text-3xl font-bold text-slate-900 mb-4">{overview.cta_title}</h3>}
          {overview.cta_description && (
              <p className="text-slate-600 mb-8">
                {overview.cta_description}
              </p>
          )}
          {overview.cta_button_title && (
              <Link href={overview.cta_button_url || "#"} className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-8 py-4 rounded-full font-semibold hover:bg-primary transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300">
                {overview.cta_button_title}
                <DynamicIcon iconName={overview.cta_button_icon || 'ArrowRight'} className="w-5 h-5" />
              </Link>
          )}
        </motion.div>

      </div>
    </section>
  );
}
