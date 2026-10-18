import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    ChevronLeft,
    BookOpen,
    Download,
    Calendar,
    User,
    FileText,
    Paperclip,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmbeddedPdfReader from "@/components/pages/publication-page-components/EmbeddedPdfReader";
import PublicationInquiryForm from "@/components/pages/publication-page-components/PublicationInquiryForm";
import { getImageUrl } from "@/utils/fileUrl";
import { Publication } from "@/redux/types/publication";

async function getPublication(slug: string): Promise<Publication | null> {
    try {
        const baseUrl =
            process.env.INTERNAL_API_URL ||
            process.env.NEXT_PUBLIC_BASE_URL ||
            "http://localhost:4000/api";
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
    const { slug } = await params;
    const publication = await getPublication(slug);

    if (!publication || publication.publish_status !== "published") {
        return { title: "Publication Not Found | MIDI" };
    }

    return {
        title: `${publication.title} | MIDI Publications & Research`,
        description:
            publication.summary ||
            "Mineral Industry Development Institute (MIDI) institutional research publication.",
    };
}

export default async function PublicationDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string; locale: string }>;
    searchParams?: Promise<{ token?: string }>;
}) {
    const { slug, locale } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const token = resolvedSearchParams.token || null;

    const publication = await getPublication(slug);

    if (!publication || publication.publish_status !== "published") {
        notFound();
    }

    const title =
        locale === "am" && publication.title_am
            ? publication.title_am
            : publication.title;
    const summary =
        locale === "am" && publication.summary_am
            ? publication.summary_am
            : publication.summary;
    const description =
        locale === "am" && publication.description_am
            ? publication.description_am
            : publication.description;

    const coverUrl = publication.coverImage
        ? getImageUrl(publication.coverImage, "large")
        : null;

    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";

    const canDownload =
        publication.access_mode === "open_access" ||
        (publication.access_mode === "enquiry_required" && !!token);

    // Supplementary files (e.g. maps, data sheets)
    const supplementaryFiles =
        publication.files?.filter((f) => f.file_role !== "main_pdf") || [];

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Breadcrumb Bar */}
            <div className="bg-white border-b border-slate-200 py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Link
                        href={`/${locale}/publications`}
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {locale === "am"
                            ? "ወደ ህትመቶች እና ምርምር ይመለሱ"
                            : "Back to Publications & Research"}
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left & Center Column: Publication Details & Document Reader */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Header Box */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                            {/* Categories */}
                            {publication.categories &&
                                publication.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {publication.categories.map((cat) => (
                                            <Badge
                                                key={cat.category_id}
                                                variant="secondary"
                                                className="bg-slate-100 text-slate-700 font-medium text-xs px-2.5 py-0.5"
                                            >
                                                {locale === "am" && cat.name_am
                                                    ? cat.name_am
                                                    : cat.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                                {title}
                            </h1>

                            {/* Authors & Reference */}
                            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
                                {publication.authors && (
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>{publication.authors}</span>
                                    </div>
                                )}
                                {publication.publication_date && (
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>
                                            {new Date(
                                                publication.publication_date
                                            ).toLocaleDateString(
                                                locale === "am" ? "am-ET" : "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                )}
                                {publication.reference_number && (
                                    <div className="flex items-center gap-1 text-slate-500 font-mono text-xs">
                                        <span>Ref: {publication.reference_number}</span>
                                    </div>
                                )}
                            </div>

                            {/* Short Summary */}
                            {summary && (
                                <div className="bg-slate-50/80 rounded-xl p-4 md:p-5 border border-slate-100 mb-6 text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                                    {summary}
                                </div>
                            )}

                            {/* Full Description / Abstract */}
                            {description && (
                                <div className="space-y-3 mb-8">
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                                        {locale === "am"
                                            ? "ማጠቃለያ እና የጥናት ዝርዝር"
                                            : "Abstract / Overview"}
                                    </h3>
                                    <div
                                        className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed break-words"
                                        dangerouslySetInnerHTML={{
                                            __html: description,
                                        }}
                                    />
                                </div>
                            )}

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                        {locale === "am" ? "የሰነድ አይነት" : "Document Type"}
                                    </span>
                                    <span className="font-medium text-slate-800 text-xs capitalize">
                                        {publication.document_type.replace(/_/g, " ")}
                                    </span>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                        {locale === "am" ? "ቋንቋ" : "Language"}
                                    </span>
                                    <span className="font-medium text-slate-800 text-xs uppercase">
                                        {publication.language}
                                    </span>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                        {locale === "am" ? "የገጽ ብዛት" : "Pages"}
                                    </span>
                                    <span className="font-medium text-slate-800 text-xs">
                                        {publication.page_count
                                            ? `${publication.page_count} pages`
                                            : "N/A"}
                                    </span>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                        {locale === "am" ? "መዳረሻ" : "Access Mode"}
                                    </span>
                                    <span className="font-medium text-slate-800 text-xs capitalize">
                                        {publication.access_mode.replace(/_/g, " ")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Embedded PDF Reader */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {locale === "am"
                                            ? "የሰነድ ንባብ እና እይታ"
                                            : "Document Reader"}
                                    </h3>
                                </div>

                                {canDownload && (
                                    <a
                                        href={`${baseUrl}/publications/${publication.publication_id}/download${
                                            token ? `?token=${encodeURIComponent(token)}` : ""
                                        }`}
                                        download
                                    >
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1.5 font-medium text-slate-700"
                                        >
                                            <Download className="w-4 h-4" />
                                            {locale === "am"
                                                ? "ሰነድ አውርድ (PDF)"
                                                : "Download PDF"}
                                        </Button>
                                    </a>
                                )}
                            </div>

                            <EmbeddedPdfReader
                                publication={publication}
                                accessToken={token}
                            />
                        </div>

                        {/* Supplementary Documents & Maps */}
                        {supplementaryFiles.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Paperclip className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {locale === "am"
                                            ? "ተጨማሪ ሰነዶች እና ካርታዎች"
                                            : "Supplementary Documents & Maps"}
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {supplementaryFiles.map((file) => (
                                        <div
                                            key={file.publication_file_id}
                                            className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-slate-500 shrink-0" />
                                                <div>
                                                    <span className="font-semibold text-slate-800 text-sm block">
                                                        {file.title || file.file_name}
                                                    </span>
                                                    <span className="text-xs text-slate-400 capitalize">
                                                        {file.file_role.replace(/_/g, " ")} •{" "}
                                                        {file.file_size
                                                            ? `${(
                                                                  file.file_size /
                                                                  (1024 * 1024)
                                                              ).toFixed(2)} MB`
                                                            : "PDF Document"}
                                                    </span>
                                                </div>
                                            </div>

                                            {canDownload && (
                                                <a
                                                    href={`${baseUrl}/publications/${publication.publication_id}/files/${file.publication_file_id}/download${
                                                        token ? `?token=${encodeURIComponent(token)}` : ""
                                                    }`}
                                                    download
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 gap-1 text-slate-600 hover:text-primary"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Download</span>
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Cover & Inquiry / Order Form */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Cover Image Card */}
                        {coverUrl && (
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 overflow-hidden">
                                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                                    <Image
                                        src={coverUrl}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        )}

                        {/* Inquiry / Request Form Box */}
                        <div className="sticky top-24">
                            <PublicationInquiryForm publication={publication} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
