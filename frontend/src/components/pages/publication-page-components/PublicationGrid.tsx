"use strict";
"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Search, BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PublicationCard from "./PublicationCard";
import {
    useGetPublicationsQuery,
    useGetPublicationCategoriesQuery,
} from "@/redux/api/publicationApi";

export default function PublicationGrid() {
    const locale = useLocale();

    // Filters state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedDocType, setSelectedDocType] = useState<string>("all");
    const [selectedAccessMode, setSelectedAccessMode] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("publication_date");
    const [page, setPage] = useState<number>(1);
    const limit = 12;

    // Fetch categories
    const { data: categories = [] } = useGetPublicationCategoriesQuery({
        isPublic: true,
    });

    // Fetch publications with server-side filtering
    const {
        data: publicationData,
        isLoading: isPublicationsLoading,
        isFetching,
    } = useGetPublicationsQuery({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        document_type: selectedDocType !== "all" ? selectedDocType : undefined,
        access_mode: selectedAccessMode !== "all" ? selectedAccessMode : undefined,
        sort_by: sortBy,
        sort_order: "DESC",
        page,
        limit,
    });

    const publications = publicationData?.data || [];
    const meta = publicationData?.meta;
    const totalPages = meta?.totalPages || 1;

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedDocType("all");
        setSelectedAccessMode("all");
        setSortBy("publication_date");
        setPage(1);
    };

    const hasActiveFilters =
        searchQuery !== "" ||
        selectedCategory !== "all" ||
        selectedDocType !== "all" ||
        selectedAccessMode !== "all";

    return (
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search Input */}
                    <div className="relative md:col-span-5">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder={
                                locale === "am"
                                    ? "በአርእስት፣ ደራሲ ወይም ቁልፍ ቃል ይፈልጉ..."
                                    : "Search by title, author, or reference number..."
                            }
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus-visible:ring-primary rounded-xl"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Selector */}
                    <div className="md:col-span-3">
                        <Select
                            value={selectedCategory}
                            onValueChange={(val) => {
                                setSelectedCategory(val);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder={locale === "am" ? "ሁሉንም ምድቦች" : "All Categories"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {locale === "am" ? "ሁሉንም ምድቦች" : "All Categories"}
                                </SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.category_id} value={cat.slug}>
                                        {locale === "am" && cat.name_am ? cat.name_am : cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Document Type Selector */}
                    <div className="md:col-span-2">
                        <Select
                            value={selectedDocType}
                            onValueChange={(val) => {
                                setSelectedDocType(val);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder={locale === "am" ? "የሰነድ አይነት" : "Document Type"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{locale === "am" ? "ሁሉም አይነቶች" : "All Types"}</SelectItem>
                                <SelectItem value="research_report">
                                    {locale === "am" ? "የምርምር ሪፖርት" : "Research Report"}
                                </SelectItem>
                                <SelectItem value="mineral_map">
                                    {locale === "am" ? "የማዕድን ካርታ" : "Mineral Map"}
                                </SelectItem>
                                <SelectItem value="book_manual">
                                    {locale === "am" ? "መጽሐፍ / ማንዋል" : "Book & Manual"}
                                </SelectItem>
                                <SelectItem value="technical_publication">
                                    {locale === "am" ? "ቴክኒካዊ ህትመት" : "Technical Paper"}
                                </SelectItem>
                                <SelectItem value="geological_study">
                                    {locale === "am" ? "የጂኦሎጂ ጥናት" : "Geological Study"}
                                </SelectItem>
                                <SelectItem value="training_material">
                                    {locale === "am" ? "የስልጠና ቁሳቁስ" : "Training Material"}
                                </SelectItem>
                                <SelectItem value="policy_strategy">
                                    {locale === "am" ? "ፖሊሲ እና ስትራቴጂ" : "Policy Document"}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Access Mode Selector */}
                    <div className="md:col-span-2">
                        <Select
                            value={selectedAccessMode}
                            onValueChange={(val) => {
                                setSelectedAccessMode(val);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder={locale === "am" ? "የመዳረሻ አይነት" : "Access Mode"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{locale === "am" ? "ሁሉም መዳረሻዎች" : "All Access"}</SelectItem>
                                <SelectItem value="open_access">
                                    {locale === "am" ? "ነፃ መዳረሻ" : "Open Access"}
                                </SelectItem>
                                <SelectItem value="online_only">
                                    {locale === "am" ? "ንባብ ብቻ" : "Online Only"}
                                </SelectItem>
                                <SelectItem value="enquiry_required">
                                    {locale === "am" ? "ጥያቄ / ግዢ" : "Enquiry Required"}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Sub-bar: Category Pills & Reset */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                        <button
                            onClick={() => {
                                setSelectedCategory("all");
                                setPage(1);
                            }}
                            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                selectedCategory === "all"
                                    ? "bg-primary text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {locale === "am" ? "ሁሉም" : "All"}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.category_id}
                                onClick={() => {
                                    setSelectedCategory(cat.slug);
                                    setPage(1);
                                }}
                                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                    selectedCategory === cat.slug
                                        ? "bg-primary text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {locale === "am" && cat.name_am ? cat.name_am : cat.name}
                            </button>
                        ))}
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 gap-1 font-medium"
                        >
                            <X className="w-3.5 h-3.5" />
                            {locale === "am" ? "ማጣሪያዎችን አጽዳ" : "Clear Filters"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Results Grid */}
            {isPublicationsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse h-96"
                        >
                            <div className="aspect-[16/10] bg-slate-200 w-full" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-1/3" />
                                <div className="h-6 bg-slate-200 rounded w-4/5" />
                                <div className="h-4 bg-slate-100 rounded w-full" />
                                <div className="h-4 bg-slate-100 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : publications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm my-8">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {locale === "am" ? "ምንም ህትመቶች አልተገኙም" : "No Publications Found"}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        {locale === "am"
                            ? "በተመረጡት ማጣሪያዎች መሰረት ምንም አይነት ህትመት አልተገኘም። እባክዎ ሌሎች ቃላትን ወይም ምድቦችን ይሞክሩ።"
                            : "We couldn't find any publications matching your current search or filter criteria. Try adjusting your search query or reset filters."}
                    </p>
                    {hasActiveFilters && (
                        <Button onClick={resetFilters} variant="outline" className="rounded-xl">
                            {locale === "am" ? "ሁሉንም ህትመቶች አሳይ" : "View All Publications"}
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publications.map((publication) => (
                            <PublicationCard key={publication.publication_id} publication={publication} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1 || isFetching}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="rounded-xl"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                {locale === "am" ? "ቀዳሚ" : "Previous"}
                            </Button>

                            <span className="text-sm text-slate-600 px-3">
                                {page} / {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages || isFetching}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="rounded-xl"
                            >
                                {locale === "am" ? "ቀጣይ" : "Next"}
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
