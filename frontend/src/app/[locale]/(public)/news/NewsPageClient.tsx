"use client";

import PageHeader from "@/components/pages/home-page-components/PageHeader";
import { Search, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useGetNewsQuery } from "@/redux/api/newsApi";
import { useGetTagsQuery } from "@/redux/api/tagApi";
import NewsCard from "@/components/pages/news-page-components/NewsCard";
import {
    calculateReadingTime,
    extractExcerpt,
    extractHeadlineImage,
    extractTags,
} from "@/utils/newsMapper";
import { formatDate } from "@/utils/datetime";
import PublicEmptyState from "@/components/common/PublicEmptyState";
import Pagination from "@/components/common/Pagination";
import { useTranslations } from "next-intl";
import { SkeletonMediaCard } from "@/components/skeletons";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 9;
const ALL_NEWS = "All News";

export default function NewsPageClient() {
    const t = useTranslations("empty_state");
    const { data: tagsData = [] } = useGetTagsQuery();

    const [searchTerm, setSearchTerm] = useState("");
    const [activeTag, setActiveTag] = useState<string>(ALL_NEWS);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data: allNews = [], isLoading, isError } = useGetNewsQuery();

    // Client-side filtering
    const filteredNews = useMemo(() => {
        return allNews.filter((news) => {
            const hasTag = activeTag === ALL_NEWS || news.tag_links?.some((tagLink) => tagLink.tag?.name === activeTag);
            
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = news.title.toLowerCase().includes(searchLower) || 
                                  extractExcerpt(news.content).toLowerCase().includes(searchLower);
            
            return hasTag && matchesSearch;
        });
    }, [allNews, activeTag, searchTerm]);

    // Client-side pagination
    const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
    const items = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredNews.slice(start, start + PAGE_SIZE);
    }, [filteredNews, currentPage]);

    const handleTagChange = (tag: string) => {
        setActiveTag(tag);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const tagNames = [ALL_NEWS, ...tagsData.map((tag) => tag.name)];

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader
                pageIdentifier="news"
                title="News & Press Releases"
                icon={<MessageCircle />}
                description="Latest news, industry bulletins, and updates from the Mineral Industry Development Institute (MIDI)."
            />

            <div className="py-16 bg-white min-h-[600px] flex-grow">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-primary">News & Bulletins</h1>
                        <div className="mt-2 h-1 w-12 bg-primary rounded-full" />
                        <p className="text-gray-600 mt-4 max-w-2xl">
                            Stay updated with the latest news, technological milestones, and announcements from the Mineral Industry Development Institute (MIDI).
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                        <div className="flex flex-wrap gap-2 w-full md:w-auto pb-2 md:pb-0">
                            {tagNames.map((tag) => {
                                const isActive = activeTag === tag;
                                return (
                                    <div key={tag} className="relative z-10">
                                        <button
                                            onClick={() => handleTagChange(tag)}
                                            className={`relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-gray-700 hover:bg-primary/20"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-category"
                                                className="absolute inset-0 bg-primary rounded-lg z-0"
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="relative w-full md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search news..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset page on search
                                }}
                                className="pl-10 h-11 w-full bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-full"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                                <SkeletonMediaCard key={index} />
                            ))}
                        </div>
                    ) : isError ? (
                        <PublicEmptyState
                            title={t("news_title")}
                            description={t("error_description")}
                        />
                    ) : (
                        <div className={items.length === 0 ? "" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-200"}>
                            {items.length === 0 ? (
                                <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
                                    <Search className="w-12 h-12 text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">No news found</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        We couldn't find any news matching your search criteria. Try adjusting your filters or search terms.
                                    </p>
                                    <button 
                                        onClick={() => { setSearchTerm(""); setActiveTag(ALL_NEWS); setCurrentPage(1); }}
                                        className="mt-6 text-primary font-semibold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const excerpt = extractExcerpt(item.content);
                                    const tags = extractTags(item.tag_links ?? []);
                                    const media = extractHeadlineImage(item.attachments ?? []) as
                                        | { url: string; type: "image" | "video" }
                                        | null;
                                    return (
                                        <NewsCard
                                            key={item.news_id}
                                            id={item.news_id}
                                            title={item.title}
                                            excerpt={excerpt}
                                            media={media}
                                            date={formatDate(item.created_at)}
                                            category={tags[0] || "General"}
                                            tags={tags}
                                            readingTime={() => calculateReadingTime(excerpt)}
                                        />
                                    );
                                })
                            )}
                        </div>
                    )}

                    {!isLoading && !isError && filteredNews.length > 0 && totalPages > 1 && (
                        <div className="mt-12 flex flex-col items-center gap-3">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                            <p className="text-sm text-gray-500">
                                Showing page {currentPage} of {totalPages}
                                {" · "}
                                {filteredNews.length} {filteredNews.length === 1 ? "article" : "articles"}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
