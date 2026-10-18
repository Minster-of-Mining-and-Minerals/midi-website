import { Skeleton } from "@/components/ui/skeleton";

export function OurBusinessesSkeleton() {
    return (
        <section className="relative w-full overflow-hidden lg:pt-10 mb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-8">
                    {/* Left Side: Content Skeleton */}
                    <div className="w-full xl:w-[42%] flex flex-col items-start z-10">
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-12 w-full max-w-lg mb-2" />
                        <Skeleton className="h-12 w-3/4 max-w-lg mb-6" />
                        
                        <div className="space-y-3 mb-4 w-full max-w-xl">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-4/5" />
                        </div>
                        
                        <div className="space-y-3 mb-10 w-full max-w-xl">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Right Side: Ecosystem Diagram Skeleton */}
                    <div className="w-full xl:w-[58%] relative min-h-[750px] flex items-center justify-center">
                        <Skeleton className="absolute inset-0 rounded-3xl" />
                        
                        {/* Central Element Skeleton */}
                        <Skeleton className="w-48 h-48 rounded-full z-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function WarehousingTradingSkeleton() {
    return (
        <section className="relative w-full bg-[#FAFAFA] pt-24 pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Skeleton */}
                <div className="mb-20 max-w-4xl">
                    <Skeleton className="h-4 w-48 mb-4" />
                    <Skeleton className="h-12 md:h-14 w-full max-w-2xl mb-6" />
                    <Skeleton className="h-6 w-full max-w-3xl mb-4" />
                    <Skeleton className="h-4 w-full max-w-3xl mb-2" />
                    <Skeleton className="h-4 w-4/5 max-w-3xl" />
                </div>

                {/* Split Composition Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-7 flex flex-col space-y-10">
                        <Skeleton className="w-full h-[450px] rounded-3xl" />
                        <div>
                            <Skeleton className="h-8 w-64 mb-4" />
                            <Skeleton className="h-4 w-full mb-8" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200">
                                        <Skeleton className="w-5 h-5 mb-3" />
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-16 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton className="w-8 h-8 rounded-full mb-4" />
                                <Skeleton className="h-3 w-24 mb-2" />
                                <Skeleton className="h-8 w-64 mb-4" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ImportExportSkeleton() {
    return (
        <section className="relative w-full overflow-hidden bg-white pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <Skeleton className="h-4 w-48 mb-4" />
                    <Skeleton className="h-12 md:h-14 w-full max-w-2xl mb-6" />
                    <Skeleton className="h-6 w-full max-w-3xl mb-2" />
                    <Skeleton className="h-6 w-5/6 max-w-3xl" />
                </div>

                {/* Central Trade Visualization Skeleton */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mb-24 relative">
                    {/* LEFT: EXPORT */}
                    <div className="w-full lg:w-1/3">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>

                    {/* CENTER: MIDI ETHIOPIA */}
                    <div className="w-full lg:w-1/3 flex justify-center items-center py-8 lg:py-0">
                        <Skeleton className="w-56 h-56 rounded-full" />
                    </div>

                    {/* RIGHT: IMPORT */}
                    <div className="w-full lg:w-1/3">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                </div>

                {/* 4-Step Flow & Stats Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-center">
                    {/* Stats */}
                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>

                    {/* Flow */}
                    <div className="lg:col-span-8">
                        <Skeleton className="h-48 w-full rounded-2xl" />
                    </div>
                </div>

                {/* CTA Skeleton */}
                <div className="text-center max-w-2xl mx-auto pt-16">
                    <Skeleton className="h-8 w-64 mx-auto mb-4" />
                    <Skeleton className="h-4 w-full mx-auto mb-8" />
                    <Skeleton className="h-14 w-64 mx-auto rounded-full" />
                </div>
            </div>
        </section>
    );
}

export function WarehouseShowcaseSkeleton() {
    return (
        <section className="py-24 bg-[#FAFAFA] border-t border-slate-200 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-3xl w-full">
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-10 md:h-12 w-3/4 mb-6" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6 mt-2" />
                    </div>
                    <div className="shrink-0">
                        <Skeleton className="h-24 w-32 rounded-xl" />
                    </div>
                </div>

                {/* Region Filter */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))}
                </div>

                {/* Main Facility Explorer */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left: Navigation List */}
                    <div className="w-full lg:w-[30%] flex flex-col gap-2 shrink-0">
                        <Skeleton className="h-3 w-32 mb-4" />
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>

                    {/* Right: Active Warehouse Detail */}
                    <div className="w-full lg:w-[70%]">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                            {/* Main Image Gallery */}
                            <Skeleton className="aspect-[4/3] md:aspect-[21/9] w-full rounded-none" />

                            {/* Thumbnails */}
                            <div className="flex gap-3 p-4 md:p-6 bg-slate-50 border-b border-slate-100">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-24 md:h-20 md:w-32 rounded-xl shrink-0" />
                                ))}
                            </div>

                            {/* Warehouse Info */}
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-6">
                                    <div className="w-full">
                                        <Skeleton className="h-6 w-32 rounded-full mb-4" />
                                        <Skeleton className="h-10 w-3/4" />
                                    </div>
                                    <Skeleton className="h-20 w-36 rounded-2xl shrink-0" />
                                </div>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-4/5 mb-8" />
                                
                                <Skeleton className="h-16 w-full max-w-xl rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function TradingSkeleton() {
    return (
        <section className="relative w-full bg-white pt-24 pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Skeleton */}
                <div className="max-w-4xl mb-24">
                    <Skeleton className="h-4 w-48 mb-4" />
                    <Skeleton className="h-14 md:h-16 w-full max-w-2xl mb-6" />
                    <Skeleton className="h-6 w-full max-w-3xl mb-4" />
                    <Skeleton className="h-4 w-full max-w-3xl" />
                </div>

                {/* Hero Visual + Principles Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center mb-32">
                    {/* Left Principles */}
                    <div className="lg:col-span-3 flex flex-col gap-12 lg:pr-8 order-2 lg:order-1">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-4 w-8 mb-2" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ))}
                    </div>

                    {/* Center Network */}
                    <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center bg-slate-50/50 rounded-full border border-slate-100 order-1 lg:order-2">
                        <Skeleton className="w-40 h-40 rounded-full" />
                        
                        {/* Orbital Nodes Skeletons */}
                        <Skeleton className="absolute top-[10%] left-1/2 -translate-x-1/2 h-8 w-24 rounded-full" />
                        <Skeleton className="absolute bottom-[10%] left-1/2 -translate-x-1/2 h-8 w-24 rounded-full" />
                        <Skeleton className="absolute left-[5%] top-1/2 -translate-y-1/2 h-8 w-24 rounded-full" />
                        <Skeleton className="absolute right-[5%] top-1/2 -translate-y-1/2 h-8 w-24 rounded-full" />
                    </div>

                    {/* Right Principles */}
                    <div className="lg:col-span-3 flex flex-col gap-12 lg:pl-8 order-3 lg:order-3 text-left lg:text-right">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex flex-col lg:items-end">
                                <Skeleton className="h-4 w-8 mb-2" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Philosophy & Market Gap Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
                    <Skeleton className="h-64 w-full rounded-3xl" />
                    <Skeleton className="h-64 w-full rounded-3xl" />
                </div>

                {/* Big Statement Skeleton */}
                <div className="py-20 mb-20 text-center">
                    <Skeleton className="h-20 w-3/4 max-w-2xl mx-auto mb-4" />
                    <Skeleton className="h-12 w-1/2 max-w-md mx-auto mb-4" />
                    <Skeleton className="h-20 w-3/4 max-w-2xl mx-auto mb-8" />
                    <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32 max-w-3xl mx-auto">
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            </div>
        </section>
    );
}
