"use client";

import { BookOpen, Download } from "lucide-react";
import PublicationCover from "@/components/pages/publication-page-components/PublicationCover";

interface PublicationPreviewProps {
    title: string;
    category?: string;
    year?: number | null;
    pages?: string;
    authors?: string;
    coverUrl?: string | null;
    allowDownload: boolean;
}

// Mirrors the public PublicationCard so admins see what visitors will see.
export default function PublicationPreview({
    title,
    category,
    year,
    pages,
    coverUrl,
    allowDownload,
}: PublicationPreviewProps) {
    const shownTitle = title.trim() || "Untitled publication";
    const meta = [year, pages ? `${pages} pages` : null].filter(Boolean);

    return (
        <div className="mx-auto w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <PublicationCover coverUrl={coverUrl} title={shownTitle} sizes="176px" unoptimized className="rounded-none" />
            <div className="bg-gradient-to-b from-white to-slate-50 p-3">
                {category && (
                    <span className="mb-1 block truncate text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {category}
                    </span>
                )}
                <p className="line-clamp-2 font-display text-sm leading-snug text-secondary">{shownTitle}</p>
                <p className="mt-1 text-[11px] text-muted">{meta.join(" · ") || "Year · pages"}</p>
                <div className="mt-3 flex flex-col gap-1.5">
                    <span className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-secondary text-[11px] font-semibold text-white">
                        <BookOpen className="h-3.5 w-3.5" />
                        Read online
                    </span>
                    {allowDownload && (
                        <span className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 text-[11px] font-semibold text-secondary">
                            <Download className="h-3.5 w-3.5" />
                            Download PDF
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
