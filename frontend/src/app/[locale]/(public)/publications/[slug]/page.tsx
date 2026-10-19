import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Download, FileText, Map as MapIcon, Tag } from "lucide-react";
import EmbeddedPdfReader from "@/components/pages/publication-page-components/EmbeddedPdfReader";
import PublicationActions from "@/components/pages/publication-page-components/PublicationActions";
import PublicationCover from "@/components/pages/publication-page-components/PublicationCover";
import RelatedPublications from "@/components/pages/publication-page-components/RelatedPublications";
import {
    apiBaseUrl,
    canDownload,
    languageLabel,
    localized,
} from "@/components/pages/publication-page-components/publicationMeta";
import { getImageUrl } from "@/utils/fileUrl";
import { Publication } from "@/redux/types/publication";

async function getPublication(slug: string): Promise<Publication | null> {
    try {
        const baseUrl = process.env.INTERNAL_API_URL || apiBaseUrl();
        const res = await fetch(`${baseUrl}/publications/${slug}`, {
            next: { revalidate: 30 },
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;
    const publication = await getPublication(slug);

    if (!publication || publication.publish_status !== "published") {
        return { title: "Publication Not Found | MIDI" };
    }

    const { title, summary } = localized(publication, locale);
    return {
        title: `${title} | MIDI Publications & Research`,
        description: summary || "Mineral Industry Development Institute (MIDI) institutional research publication.",
    };
}

export default async function PublicationDetailPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;
    const lang = locale === "am" ? "am" : "en";
    const tr = (en: string, am: string) => (lang === "am" ? am : en);

    const publication = await getPublication(slug);

    if (!publication || publication.publish_status !== "published") {
        notFound();
    }

    const { title, summary, description } = localized(publication, locale);
    const coverUrl = publication.coverImage ? getImageUrl(publication.coverImage, "large") : null;
    const primaryCategory = publication.categories?.[0];
    const supplementaryFiles = publication.files?.filter((f) => f.file_role !== "main_pdf") || [];
    const baseUrl = apiBaseUrl();

    const formatDate = (value?: string | null) =>
        value
            ? new Date(value).toLocaleDateString(lang === "am" ? "am-ET" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : null;

    const details: { label: string; value: React.ReactNode }[] = [
        publication.reference_number && {
            label: tr("Reference", "ማጣቀሻ"),
            value: <span className="font-mono text-xs">{publication.reference_number}</span>,
        },
        publication.authors && { label: tr("Authors", "ደራሲዎች"), value: publication.authors },
        publication.publication_date && {
            label: tr("Published", "የታተመበት"),
            value: formatDate(publication.publication_date),
        },
        { label: tr("Language", "ቋንቋ"), value: languageLabel(publication.language, lang) },
        publication.page_count && {
            label: tr("Pages", "ገጾች"),
            value: publication.page_count,
        },
        publication.categories?.length && {
            label: tr("Categories", "ምድቦች"),
            value: (
                <div className="flex flex-wrap justify-end gap-1">
                    {publication.categories.map((cat) => (
                        <span key={cat.category_id} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                            {(lang === "am" && cat.name_am) || cat.name}
                        </span>
                    ))}
                </div>
            ),
        },
        publication.views_count !== undefined && {
            label: tr("Views", "እይታዎች"),
            value: publication.views_count.toLocaleString(),
        },
    ].filter(Boolean) as { label: string; value: React.ReactNode }[];

    return (
        <main className="min-h-screen bg-[#f7f9fc] pb-20">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
                    <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted" aria-label="Breadcrumb">
                        <Link href={`/${locale}/publications`} className="hover:text-primary">
                            {tr("Publications", "ህትመቶች")}
                        </Link>
                        {primaryCategory && (
                            <>
                                <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                                <span>{(lang === "am" && primaryCategory.name_am) || primaryCategory.name}</span>
                            </>
                        )}
                    </nav>

                    <div className="grid gap-6 sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] md:gap-10">
                        <div className="w-36 sm:w-full">
                            <PublicationCover
                                coverUrl={coverUrl}
                                title={title}
                                sizes="200px"
                                priority
                                className="shadow-xl shadow-secondary/20"
                            />
                        </div>

                        <div className="min-w-0">
                            {primaryCategory && (
                                <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                    <Tag className="h-3.5 w-3.5" />
                                    {(lang === "am" && primaryCategory.name_am) || primaryCategory.name}
                                </span>
                            )}
                            <h1 className=" text-2xl font-bold leading-tight text-secondary text-balance md:text-4xl">
                                {title}
                            </h1>
                            <p className="mt-3 text-sm text-muted">
                                {[
                                    publication.authors,
                                    formatDate(publication.publication_date),
                                    publication.page_count ? `${publication.page_count} ${tr("pages", "ገጾች")}` : null,
                                    languageLabel(publication.language, lang),
                                ]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </p>
                            {summary && <p className="mt-4 max-w-3xl leading-relaxed text-secondary/80">{summary}</p>}
                            <div className="mt-6">
                                <PublicationActions publication={publication} title={title} locale={lang} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
                <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
                    <div className="min-w-0 space-y-8">
                        {description && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                                    {tr("Abstract", "ማጠቃለያ")}
                                </h2>
                                <div
                                    className="prose prose-slate max-w-none break-words text-sm leading-relaxed text-secondary/80 md:text-base"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            </section>
                        )}

                        <section id="reader" className="scroll-mt-24">
                            <EmbeddedPdfReader publication={publication} />
                        </section>

                        {supplementaryFiles.length > 0 && (
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                                <h2 className="mb-4 text-lg font-bold text-secondary">
                                    {tr("Supplementary documents & maps", "ተጨማሪ ሰነዶች እና ካርታዎች")}
                                </h2>
                                <ul className="divide-y divide-slate-100">
                                    {supplementaryFiles.map((file) => {
                                        const FileIcon = file.file_role === "map_document" ? MapIcon : FileText;
                                        const fileBase = `${baseUrl}/publications/${publication.publication_id}/files/${file.publication_file_id}`;
                                        return (
                                            <li key={file.publication_file_id} className="flex items-center justify-between gap-3 py-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <FileIcon className="h-5 w-5 shrink-0 text-primary" />
                                                    <div className="min-w-0">
                                                        <a
                                                            href={`${fileBase}/view`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block truncate text-sm font-semibold text-secondary hover:text-primary"
                                                        >
                                                            {file.title || file.file_name}
                                                        </a>
                                                        <span className="text-xs capitalize text-muted">
                                                            {file.file_role.replace(/_/g, " ")}
                                                            {file.file_size ? ` · ${(file.file_size / (1024 * 1024)).toFixed(2)} MB` : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                                {canDownload(publication) && (
                                                    <a
                                                        href={`${fileBase}/download`}
                                                        download
                                                        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted hover:text-primary"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        <span className="hidden sm:inline">{tr("Download", "አውርድ")}</span>
                                                    </a>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}
                    </div>

                    <aside>
                        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6">
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                                {tr("Details", "ዝርዝሮች")}
                            </h2>
                            <dl className="divide-y divide-slate-100 text-sm">
                                {details.map((d) => (
                                    <div key={d.label} className="flex items-start justify-between gap-4 py-2.5">
                                        <dt className="shrink-0 text-muted">{d.label}</dt>
                                        <dd className="text-end font-medium text-secondary">{d.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </aside>
                </div>

                <RelatedPublications publicationId={publication.publication_id} categorySlug={primaryCategory?.slug} />
            </div>
        </main>
    );
}
