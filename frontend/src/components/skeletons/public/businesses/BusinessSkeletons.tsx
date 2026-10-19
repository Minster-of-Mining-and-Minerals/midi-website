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
