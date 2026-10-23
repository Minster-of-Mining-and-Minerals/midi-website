"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { BookOpen, Download } from "lucide-react";
import { Publication } from "@/redux/types/publication";
import { getImageUrl } from "@/utils/fileUrl";
import PublicationCover from "./PublicationCover";
import { canDownload, downloadUrl, localized, publicationYear } from "./publicationMeta";

interface PublicationCardProps {
    publication: Publication;
}

export default function PublicationCard({ publication }: PublicationCardProps) {
    const locale = useLocale();
    const lang = locale === "am" ? "am" : "en";
    const tr = (en: string, am: string) => (lang === "am" ? am : en);
    const { title } = localized(publication, locale);
    const year = publicationYear(publication);
    const category = publication.categories?.[0];
    const href = `/${locale}/publications/${publication.slug}`;
    const coverUrl = publication.coverImage ? getImageUrl(publication.coverImage, "medium") : null;

    const meta = [year, publication.page_count ? `${publication.page_count} ${tr("pages", "ገጽ")}` : null].filter(Boolean);

    return (
        <article className="group flex h-full flex-col">
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:shadow-[0_22px_40px_-12px_rgba(0,58,92,0.28)] motion-safe:hover:-translate-y-1.5">
                {/* Cover with a curtain that slides down on hover */}
                <Link href={href} className="relative block" aria-label={title} tabIndex={-1}>
                    <PublicationCover coverUrl={coverUrl} title={title} className="rounded-none" />
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-0 bg-slate-950/45 backdrop-blur-[2px] transition-all duration-500 ease-in-out group-hover:h-full" />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-200">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-secondary shadow-lg">
                            <BookOpen className="h-4 w-4 text-primary" />
                            {tr("Read", "አንብብ")}
                        </span>
                    </span>
                </Link>

                <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-slate-50 p-3 sm:p-4">
                    {category && (
                        <span className="mb-1.5 truncate text-[11px] font-semibold uppercase tracking-wider text-primary">
                            {(lang === "am" && category.name_am) || category.name}
                        </span>
                    )}
                    <Link
                        href={href}
                        className="line-clamp-2 font-display text-base leading-snug text-secondary transition-colors group-hover:text-primary sm:text-lg"
                    >
                        {title}
                    </Link>
                    {meta.length > 0 && <p className="mt-1.5 text-xs text-muted">{meta.join(" · ")}</p>}

                    <div className="mt-auto flex flex-col gap-2 pt-4">
                        <Link
                            href={href}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-900 text-sm font-semibold text-white transition hover:bg-primary"
                        >
                            <BookOpen className="h-4 w-4" />
                            {tr("Read online", "በመስመር ላይ አንብብ")}
                        </Link>
                        {canDownload(publication) && (
                            <a
                                href={downloadUrl(publication)}
                                download
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
                            >
                                <Download className="h-4 w-4" />
                                {tr("Download PDF", "PDF አውርድ")}
                            </a>
                        )}
                    </div>
                </div>
            </div>
            {/* Soft glow under the card on hover */}
            <div className="mx-4 mt-2 h-1 rounded-full bg-slate-950/15 opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
        </article>
    );
}
