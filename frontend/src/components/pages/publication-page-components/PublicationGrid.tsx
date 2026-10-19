"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { BookOpen, ChevronLeft, ChevronRight, LayoutGrid, List, Search, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetPublicationsQuery, useGetPublicationCategoriesQuery } from "@/redux/api/publicationApi";
import PublicationCard from "./PublicationCard";
import PublicationListItem from "./PublicationListItem";
import { SORT_OPTIONS } from "./publicationMeta";

const PAGE_SIZE = 12;

// Card widths close to pmo.gov.et (~270–300px) alongside the filter sidebar.
const GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3 xl:gap-10";

type FilterOption = { value: string; label: string; count?: number };

function FilterGroup({
    title,
    options,
    value,
    onChange,
}: {
    title: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">{title}</legend>
            <div className="space-y-0.5">
                {options.map((opt) => {
                    const active = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            aria-pressed={active}
                            className={clsx(
                                "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-start text-sm transition",
                                active ? "bg-primary/10 font-semibold text-primary" : "text-secondary hover:bg-slate-100"
                            )}
                        >
                            <span className="truncate">{opt.label}</span>
                            {opt.count !== undefined && (
                                <span className={clsx("text-xs tabular-nums", active ? "text-primary" : "text-muted")}>
                                    {opt.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}

function pageList(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push("…");
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push("…");
    pages.push(total);
    return pages;
}

export default function PublicationGrid() {
    const locale = useLocale();
    const lang = locale === "am" ? "am" : "en";
    const tr = (en: string, am: string) => (lang === "am" ? am : en);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("newest");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);

    // Debounce search so we don't query on every keystroke
    useEffect(() => {
        const id = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(id);
    }, [searchInput]);

    const sortOption = SORT_OPTIONS.find((s) => s.value === sort) ?? SORT_OPTIONS[0];

    const { data: categories = [] } = useGetPublicationCategoriesQuery({ isPublic: true });
    const { data: totals } = useGetPublicationsQuery({ page: 1, limit: 1 });
    const { data, isLoading, isFetching } = useGetPublicationsQuery({
        category: category !== "all" ? category : undefined,
        search: search || undefined,
        sort_by: sortOption.sort_by,
        sort_order: sortOption.sort_order,
        page,
        limit: PAGE_SIZE,
    });

    const publications = data?.data ?? [];
    const total = data?.meta?.total ?? publications.length;
    const totalPages = data?.meta?.totalPages ?? 1;
    const libraryTotal = totals?.meta?.total;

    const withReset = <T,>(setter: (v: T) => void) => (v: T) => {
        setter(v);
        setPage(1);
    };

    const hasFilters = category !== "all" || !!search;

    const resetAll = () => {
        setSearchInput("");
        setSearch("");
        setCategory("all");
        setPage(1);
    };

    const categoryOptions: FilterOption[] = [
        { value: "all", label: tr("All categories", "ሁሉም ምድቦች"), count: libraryTotal },
        ...categories.map((c) => ({
            value: c.slug,
            label: (lang === "am" && c.name_am) || c.name,
            count: c.publication_count !== undefined ? Number(c.publication_count) : undefined,
        })),
    ];
    const filterPanel = (
        <FilterGroup
            title={tr("Category", "ምድብ")}
            options={categoryOptions}
            value={category}
            onChange={withReset(setCategory)}
        />
    );

    return (
        <section className="relative w-full">
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{ backgroundImage: "radial-gradient(hsl(var(--secondary)) 1px, transparent 0)", backgroundSize: "36px 36px" }}
            />

            <div className="relative mx-auto max-w-7xl px-4 pb-16 lg:px-8">
                {/* Search */}
                <div className="pb-8 pt-10 md:pt-12">
                    <div className="relative mx-auto w-full max-w-xl">
                        <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={tr("Search title, author or reference…", "በርዕስ፣ ደራሲ ወይም ማጣቀሻ ይፈልጉ…")}
                            aria-label={tr("Search publications", "ህትመቶችን ይፈልጉ")}
                            className="h-12 w-full rounded-full border border-slate-200 bg-white ps-11 pe-11 text-sm text-secondary shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput("")}
                                aria-label={tr("Clear search", "ፍለጋ አጽዳ")}
                                className="absolute end-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                </div>

                {/* Toolbar */}
                <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-10">
                    {/* Sidebar filters (desktop) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
                            {filterPanel}
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <div className="mb-8 space-y-3 border-y border-slate-200 py-3">
                            {/* Category dropdown (phones & tablets; desktop uses the sidebar) */}
                            <div className="lg:hidden">
                                <Select value={category} onValueChange={withReset(setCategory)}>
                                    <SelectTrigger className="h-11 w-full bg-white text-sm" aria-label={tr("Category", "ምድብ")}>
                                        <span className="flex min-w-0 items-center gap-2">
                                            <Tag className="h-4 w-4 shrink-0 text-primary" />
                                            <SelectValue />
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                                {opt.count !== undefined && <span className="ms-1.5 text-xs text-muted">({opt.count})</span>}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="min-w-0 flex-1 truncate text-sm text-muted" aria-live="polite">
                                    <span className="font-semibold text-secondary">{total}</span> {tr("results", "ውጤቶች")}
                                    {search && (
                                        <>
                                            {" "}
                                            {tr("for", "ለ")} <span className="font-semibold text-secondary">“{search}”</span>
                                        </>
                                    )}
                                </p>
                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={resetAll}
                                        className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
                                    >
                                        <X className="h-3 w-3" />
                                        {tr("Clear", "አጽዳ")}
                                    </button>
                                )}
                                <Select value={sort} onValueChange={withReset(setSort)}>
                                    <SelectTrigger className="h-9 w-[130px] shrink-0 bg-white text-sm sm:w-[150px]" aria-label={tr("Sort", "ደርድር")}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent align="end">
                                        {SORT_OPTIONS.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s[lang]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex shrink-0 rounded-md border border-slate-200 bg-white p-0.5">
                                    {(["grid", "list"] as const).map((mode) => {
                                        const Icon = mode === "grid" ? LayoutGrid : List;
                                        return (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setView(mode)}
                                                aria-pressed={view === mode}
                                                aria-label={mode === "grid" ? tr("Grid view", "ፍርግርግ") : tr("List view", "ዝርዝር")}
                                                className={clsx(
                                                    "rounded p-1.5 transition",
                                                    view === mode ? "bg-secondary text-white" : "text-muted hover:text-secondary"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        {isLoading ? (
                            <div className={GRID}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="animate-pulse overflow-hidden rounded-lg border border-slate-200 bg-white">
                                        <div className="aspect-[3/4] bg-slate-100 p-[7%]">
                                            <div className="h-full w-full bg-slate-200" />
                                        </div>
                                        <div className="space-y-2 p-4">
                                            <div className="h-3 w-1/3 rounded bg-slate-200" />
                                            <div className="h-4 w-4/5 rounded bg-slate-200" />
                                            <div className="h-3 w-1/2 rounded bg-slate-100" />
                                            <div className="mt-4 h-10 rounded-md bg-slate-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : publications.length === 0 ? (
                            <div className="mx-auto my-8 max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <BookOpen className="h-7 w-7" />
                                </div>
                                <h3 className="mb-1 text-lg font-bold text-secondary">{tr("No publications found", "ምንም ህትመቶች አልተገኙም")}</h3>
                                <p className="mb-5 text-sm text-muted">
                                    {tr("Try a different search term or remove some filters.", "ሌላ የፍለጋ ቃል ይሞክሩ ወይም አንዳንድ ማጣሪያዎችን ያስወግዱ።")}
                                </p>
                                {hasFilters && (
                                    <Button variant="outline" onClick={resetAll}>
                                        {tr("View all publications", "ሁሉንም ህትመቶች አሳይ")}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className={clsx("transition-opacity", isFetching && "opacity-60")}>
                                {view === "grid" ? (
                                    <div className={GRID}>
                                        {publications.map((p) => (
                                            <PublicationCard key={p.publication_id} publication={p} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {publications.map((p) => (
                                            <PublicationListItem key={p.publication_id} publication={p} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="mt-14 flex items-center justify-center gap-1" aria-label={tr("Pagination", "ገጾች")}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={page <= 1 || isFetching}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    aria-label={tr("Previous page", "ቀዳሚ ገጽ")}
                                >
                                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                                </Button>
                                {pageList(page, totalPages).map((p, i) =>
                                    p === "…" ? (
                                        <span key={`gap-${i}`} className="px-2 text-sm text-muted">
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPage(p)}
                                            aria-current={p === page ? "page" : undefined}
                                            className={clsx(
                                                "h-9 min-w-9 rounded-md px-3 text-sm font-medium transition",
                                                p === page ? "bg-secondary text-white" : "text-secondary hover:bg-slate-100"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={page >= totalPages || isFetching}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    aria-label={tr("Next page", "ቀጣይ ገጽ")}
                                >
                                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                                </Button>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
