import { Suspense } from "react";
import NewsPageClient from "./NewsPageClient";
import { SkeletonMediaCard, TagFilterSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/pages/home-page-components/PageHeader";
import { MessageCircle } from "lucide-react";

function NewsPageFallback() {
    return (
        <>
            <PageHeader
                pageIdentifier="news"
                title="News & Press Releases"
                icon={<MessageCircle />}
                description="Latest news, industry bulletins, and updates from the Mineral Industry Development Institute (MIDI)."
            />
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 space-y-4">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-1 w-12 rounded-full" />
                    <Skeleton className="h-4 w-full max-w-2xl" />
                </div>
                <TagFilterSkeleton />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <SkeletonMediaCard key={index} />
                    ))}
                </div>
            </section>
        </>
    );
}

export default function NewsPage() {
    return (
        <Suspense fallback={<NewsPageFallback />}>
            <NewsPageClient />
        </Suspense>
    );
}
