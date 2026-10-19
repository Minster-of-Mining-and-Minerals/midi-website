import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroSkeleton() {
    return (
        <div className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-secondary">
            <div className="absolute inset-0 z-0">
                <Skeleton className="w-full h-full rounded-none" />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center">
                <div className="w-full max-w-3xl">
                    <Skeleton className="h-14 w-full md:w-4/5 mb-6 bg-white/30" />
                    <Skeleton className="h-6 w-full bg-white/20 mb-3" />
                    <Skeleton className="h-6 w-5/6 bg-white/20 mb-8" />
                    <Skeleton className="h-12 w-40 rounded-xl bg-white/30" />
                </div>
            </div>
        </div>
    );
}
