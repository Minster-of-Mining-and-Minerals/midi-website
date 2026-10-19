"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Archive, BookOpen, CheckCircle2, FilePen, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { useGetPublicationsQuery } from "@/redux/api/publicationApi";

export type StatusFilter = "all" | "published" | "draft" | "pending_review" | "archived";

interface PublicationsAdminHeaderProps {
    activeStatus?: StatusFilter;
    onStatusSelect?: (status: StatusFilter) => void;
}

function useStatusCount(publish_status?: string) {
    const { data } = useGetPublicationsQuery({ page: 1, limit: 1, publish_status: publish_status ?? "all" });
    return data?.meta?.total;
}

// Shared header for the publications admin area: title, KPI cards, and tabs.
export default function PublicationsAdminHeader({ activeStatus, onStatusSelect }: PublicationsAdminHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const onCategories = pathname.endsWith("/publications/categories");

    const counts = {
        all: useStatusCount(),
        published: useStatusCount("published"),
        draft: useStatusCount("draft"),
        archived: useStatusCount("archived"),
    };

    const stats: { key: StatusFilter; label: string; value?: number; icon: typeof BookOpen; accent: string }[] = [
        { key: "all", label: "Total publications", value: counts.all, icon: BookOpen, accent: "bg-secondary/10 text-secondary" },
        { key: "published", label: "Live on website", value: counts.published, icon: CheckCircle2, accent: "bg-emerald-50 text-emerald-700" },
        { key: "draft", label: "Drafts", value: counts.draft, icon: FilePen, accent: "bg-primary/10 text-primary" },
        { key: "archived", label: "Archived", value: counts.archived, icon: Archive, accent: "bg-slate-100 text-slate-600" },
    ];

    const handleStatClick = (key: StatusFilter) => {
        if (onStatusSelect) onStatusSelect(key);
        else router.push(`/admin/publications${key === "all" ? "" : `?status=${key}`}`);
    };

    const tabs = [
        { href: "/admin/publications", label: "Publications", icon: BookOpen, active: !onCategories },
        { href: "/admin/publications/categories", label: "Categories", icon: Tag, active: onCategories },
    ];

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Institutional Publications & Research</h1>
                    <p className="text-sm text-muted">
                        Manage the research reports, maps, manuals and documents visitors read on the MIDI website.
                    </p>
                </div>
                <ComponentGuard anyPermissions={["PUBLICATIONS:CREATE"]}>
                    <Button onClick={() => router.push("/admin/publications/create")} className="gap-1.5">
                        <Plus className="h-4 w-4" />
                        Add Publication
                    </Button>
                </ComponentGuard>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((s) => {
                    const Icon = s.icon;
                    const selected = !onCategories && activeStatus === s.key;
                    return (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => handleStatClick(s.key)}
                            aria-pressed={selected}
                            className={clsx(
                                "flex items-center gap-3 rounded-xl border bg-white p-4 text-start transition hover:shadow-md",
                                selected ? "border-primary ring-2 ring-primary/20" : "border-slate-200"
                            )}
                        >
                            <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", s.accent)}>
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-2xl font-bold tabular-nums text-secondary">
                                    {s.value ?? "–"}
                                </span>
                                <span className="block truncate text-xs text-muted">{s.label}</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            <nav className="flex gap-1 border-b border-slate-200" aria-label="Publications sections">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={tab.active ? "page" : undefined}
                            className={clsx(
                                "-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold transition",
                                tab.active
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted hover:text-secondary"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
