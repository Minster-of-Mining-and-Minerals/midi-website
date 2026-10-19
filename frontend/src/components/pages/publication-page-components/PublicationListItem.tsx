"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { BookOpen, Download } from "lucide-react";
import { Publication } from "@/redux/types/publication";
import { getImageUrl } from "@/utils/fileUrl";
import PublicationCover from "./PublicationCover";
import {
    canDownload,
    downloadUrl,
    languageLabel,
    localized,
    publicationYear,
} from "./publicationMeta";

export default function PublicationListItem({ publication }: { publication: Publication }) {
    const locale = useLocale();
    const lang = locale === "am" ? "am" : "en";
    const { title, summary } = localized(publication, locale);
    const year = publicationYear(publication);
    const href = `/${locale}/publications/${publication.slug}`;
    const coverUrl = publication.coverImage ? getImageUrl(publication.coverImage, "thumb") : null;

    const meta = [
        year,
        publication.page_count ? `${publication.page_count} ${lang === "am" ? "ገጽ" : "pages"}` : null,
        languageLabel(publication.language, lang),
        publication.reference_number ? `Ref ${publication.reference_number}` : null,
    ].filter(Boolean);

    return (
        <article className="group flex gap-4 sm:gap-5 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 transition hover:border-primary/40 hover:shadow-md">
            <Link href={href} className="w-16 sm:w-20 shrink-0" aria-label={title}>
                <PublicationCover coverUrl={coverUrl} title={title} sizes="80px" />
            </Link>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-wide">
                    {publication.categories?.slice(0, 2).map((cat) => (
                        <span key={cat.category_id} className="text-primary">
                            {(lang === "am" && cat.name_am) || cat.name}
                        </span>
                    ))}
                </div>
                <Link
                    href={href}
                    className="mt-1 line-clamp-2 font-semibold leading-snug text-secondary transition-colors group-hover:text-primary sm:text-lg"
                >
                    {title}
                </Link>
                {summary && <p className="mt-1 hidden sm:block line-clamp-2 text-sm text-muted">{summary}</p>}
                <p className="mt-1.5 text-xs text-muted">
                    {meta.join(" · ")}
                    {publication.authors && <span className="hidden md:inline"> · {publication.authors}</span>}
                </p>
            </div>

            <div className="hidden sm:flex shrink-0 flex-col items-end justify-center gap-2">
                <Link
                    href={href}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-4 text-sm font-semibold text-white transition hover:bg-primary"
                >
                    <BookOpen className="h-4 w-4" />
                    {lang === "am" ? "አንብብ" : "Read"}
                </Link>
                {canDownload(publication) && (
                    <a
                        href={downloadUrl(publication)}
                        download
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-primary"
                    >
                        <Download className="h-3.5 w-3.5" />
                        PDF
                    </a>
                )}
            </div>
        </article>
    );
}
