"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight, X, Maximize2, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useGetWarehousesQuery, useGetWarehousingOverviewQuery } from '@/redux/api/businessApi';
import { getFileUrl } from '@/utils/fileUrl';
import { WarehouseShowcaseSkeleton } from "@/components/skeletons";

export default function WarehouseShowcase() {
    const { data: apiWarehouses = [], isLoading: loading, error: apiError } = useGetWarehousesQuery();
    const { data: overview } = useGetWarehousingOverviewQuery();
    
    const warehouses = apiWarehouses
        .filter(w => w.publish_status !== 'draft')
        .map(w => ({
            id: w.warehouse_id,
            name: w.name,
            region: w.region,
            city: w.city,
            description: w.description,
            address: w.address,
            area: w.area,
            status: w.status,
            images: w.images?.map(img => getFileUrl(img.image_url)) || []
        }));

    const error = !!apiError;

    const [activeRegion, setActiveRegion] = useState<string>('ALL');
    const [activeWarehouseId, setActiveWarehouseId] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Derived data
    const regions = ['ALL', ...new Set(warehouses.map(w => w.region))];
    const filteredWarehouses = activeRegion === 'ALL' 
        ? warehouses 
        : warehouses.filter(w => w.region === activeRegion);

    const activeWarehouse = warehouses.find(w => w.id === activeWarehouseId) || filteredWarehouses[0];

    useEffect(() => {
        if (filteredWarehouses.length > 0) {
            if (!activeWarehouse || (activeWarehouse.region !== activeRegion && activeRegion !== 'ALL')) {
                setActiveWarehouseId(filteredWarehouses[0].id);
                setActiveImageIndex(0);
            }
        }
    }, [activeRegion, filteredWarehouses, activeWarehouse]);

    useEffect(() => {
        if (!activeWarehouse || activeWarehouse.images.length <= 1) return;
        
        const interval = setInterval(() => {
            setActiveImageIndex(prev => (prev + 1) % activeWarehouse.images.length);
        }, 10000);
        
        return () => clearInterval(interval);
    }, [activeWarehouse, activeImageIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight' && activeWarehouse && activeWarehouse.images.length > 0) {
                setActiveImageIndex(prev => (prev + 1) % activeWarehouse.images.length);
            }
            if (e.key === 'ArrowLeft' && activeWarehouse && activeWarehouse.images.length > 0) {
                setActiveImageIndex(prev => (prev - 1 + activeWarehouse.images.length) % activeWarehouse.images.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, activeWarehouse]);

    if (loading) {
        return <WarehouseShowcaseSkeleton />;
    }

    if (error) {
        return (
            <section className="py-24 bg-[#FAFAFA] text-slate-900 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Unable to load facility information</h2>
                    <p className="text-slate-500 mb-8">Please try again later.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    if (!loading && warehouses.length === 0) {
        return (
            <section className="py-24 bg-[#FAFAFA] text-slate-900 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">
                        {overview?.facilities_section?.small_title || "OUR FACILITIES"}
                    </span>
                    <h2 className="text-4xl font-bold mb-4">{overview?.facilities_section?.title || "Our Warehouse Network"}</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        {overview?.facilities_section?.description || "Our warehouse network is being updated. Please check back soon for facility information."}
                    </p>
                </div>
            </section>
        );
    }

    if (loading) {
        return <WarehouseShowcaseSkeleton />;
    }

    return (
        <section className="py-24 bg-[#FAFAFA] text-slate-900 border-t border-slate-200 overflow-hidden relative">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
                >
                    <div className="max-w-3xl">
                        <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">
                            {overview?.facilities_section?.small_title || "OUR FACILITIES"}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            {overview?.facilities_section?.title || "Our Warehouse Network"}
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {overview?.facilities_section?.description || "MIDI supports purpose-built workshops, testing laboratories, and regional technical centers facilitating the mineral industry across Ethiopia."}
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                        <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm text-center min-w-[120px]">
                            <div className="text-3xl font-bold text-slate-900">{String(warehouses.length).padStart(2, '0')}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Facilities</div>
                        </div>
                        <div className="text-xs text-slate-500 font-medium px-1 text-left md:text-right max-w-[180px] leading-snug">
                            {overview?.facilities_section?.stat_description || "Part of our documented 6,850 m² built facility infrastructure"}
                        </div>
                    </div>
                </motion.div>

                {/* Region Filter */}
                {regions.length > 2 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap gap-2 mb-12"
                    >
                        {regions.map(region => (
                            <button
                                key={region}
                                onClick={() => setActiveRegion(region)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                                    activeRegion === region 
                                        ? 'bg-slate-900 text-white shadow-md' 
                                        : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-700'
                                }`}
                            >
                                {region}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Main Facility Explorer */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    {/* Left: Navigation List */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-[30%] flex flex-col gap-2 shrink-0"
                    >
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
                            {activeRegion === 'ALL' ? 'ALL FACILITIES' : `${activeRegion} FACILITIES`}
                        </h3>
                        
                        <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar">
                            {filteredWarehouses.map((warehouse, index) => {
                                const isActive = activeWarehouse?.id === warehouse.id;
                                return (
                                    <button
                                        key={warehouse.id}
                                        onClick={() => {
                                            setActiveWarehouseId(warehouse.id);
                                            setActiveImageIndex(0);
                                        }}
                                        className={`text-left p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 group relative overflow-hidden ${
                                            isActive
                                                ? 'bg-white shadow-lg border-primary/20'
                                                : 'bg-white/50 hover:bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                                        } border`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                        )}
                                        
                                        <span className={`font-mono text-sm mt-0.5 ${
                                            isActive ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'
                                        }`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        
                                        <div>
                                            <h4 className={`font-bold text-base mb-1.5 transition-colors ${
                                                isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                                            }`}>
                                                {warehouse.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-primary/70' : 'text-slate-400'}`} />
                                                {warehouse.city ? `${warehouse.city}, ` : ''}{warehouse.region}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Right: Active Warehouse Detail */}
                    {activeWarehouse && (
                        <div className="w-full lg:w-[70%]">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={activeWarehouse.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col"
                                >
                                    {/* Main Image Gallery */}
                                    <div className="relative aspect-[4/3] md:aspect-[21/9] w-full bg-slate-900 overflow-hidden group">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={`${activeWarehouse.id}-${activeImageIndex}`}
                                                initial={{ opacity: 0, scale: 1.05 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.6 }}
                                                className="absolute inset-0"
                                            >
                                                <Image 
                                                    src={activeWarehouse.images[activeImageIndex] || '/factory.jpg'} 
                                                    alt={`${activeWarehouse.name} - Image ${activeImageIndex + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-[10s] group-hover:scale-105"
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"></div>
                                        
                                        {/* Image Controls */}
                                        {activeWarehouse.images.length > 1 && (
                                            <>
                                                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium border border-white/10 z-10">
                                                    <ImageIcon className="w-4 h-4 text-white/70" />
                                                    {String(activeImageIndex + 1).padStart(2, '0')} <span className="text-white/50">/</span> {String(activeWarehouse.images.length).padStart(2, '0')}
                                                </div>
                                                
                                                <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveImageIndex(prev => (prev - 1 + activeWarehouse.images.length) % activeWarehouse.images.length);
                                                        }}
                                                        className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/20"
                                                        aria-label="Previous image"
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveImageIndex(prev => (prev + 1) % activeWarehouse.images.length);
                                                        }}
                                                        className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/20"
                                                        aria-label="Next image"
                                                    >
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        <button 
                                            onClick={() => setIsLightboxOpen(true)}
                                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20 z-10 scale-90 group-hover:scale-100"
                                            aria-label="View fullscreen"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Thumbnails */}
                                    {activeWarehouse.images.length > 1 && (
                                        <div className="flex gap-3 p-4 md:p-6 bg-slate-50 border-b border-slate-100 overflow-x-auto hide-scrollbar">
                                            {activeWarehouse.images.map((img, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setActiveImageIndex(idx)}
                                                    className={`relative h-16 w-24 md:h-20 md:w-32 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                                        activeImageIndex === idx 
                                                            ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                                                            : 'border-transparent hover:border-slate-300 opacity-60 hover:opacity-100'
                                                    }`}
                                                >
                                                    <Image src={img} alt="" fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Warehouse Info */}
                                    <div className="p-8 md:p-10">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-6">
                                            <div>
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full mb-4 border border-primary/10">
                                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                        {activeWarehouse.region}{activeWarehouse.city ? ` / ${activeWarehouse.city}` : ''}
                                                    </span>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{activeWarehouse.name}</h3>
                                            </div>
                                            
                                            {activeWarehouse.area && (
                                                <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl shrink-0 text-center min-w-[140px]">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Facility Area</div>
                                                    <div className="text-xl font-bold text-slate-900">{activeWarehouse.area}</div>
                                                </div>
                                            )}
                                        </div>

                                        {activeWarehouse.description && (
                                            <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-3xl">
                                                {activeWarehouse.description}
                                            </p>
                                        )}

                                        {activeWarehouse.address && (
                                            <div className="flex items-start gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100 w-fit max-w-xl">
                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                    <MapIcon className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address Location</div>
                                                    <div className="text-sm text-slate-700 font-medium leading-relaxed">{activeWarehouse.address}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {isLightboxOpen && activeWarehouse && activeWarehouse.images.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 md:p-8"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <button 
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10 z-10"
                                onClick={() => setIsLightboxOpen(false)}
                                aria-label="Close fullscreen"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div 
                                className="relative w-full max-w-7xl h-[80vh] flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img 
                                        key={activeImageIndex}
                                        src={activeWarehouse.images[activeImageIndex] || '/factory.jpg'} 
                                        alt="Fullscreen view"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                    />
                                </AnimatePresence>

                                {activeWarehouse.images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={() => setActiveImageIndex(prev => (prev - 1 + activeWarehouse.images.length) % activeWarehouse.images.length)}
                                            className="absolute left-4 md:left-8 w-14 h-14 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors border border-white/10"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button 
                                            onClick={() => setActiveImageIndex(prev => (prev + 1) % activeWarehouse.images.length)}
                                            className="absolute right-4 md:right-8 w-14 h-14 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors border border-white/10"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
                                            {activeWarehouse.images.map((_, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setActiveImageIndex(idx)}
                                                    className={`h-2 rounded-full transition-all ${
                                                        idx === activeImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                                                    }`}
                                                    aria-label={`Go to image ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
