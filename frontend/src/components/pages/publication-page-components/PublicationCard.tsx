"use strict";
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
    BookOpen,
    Download,
    FileText,
    Map as MapIcon,
    Calendar,
    User,
    Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Publication } from "@/redux/types/publication";
import { getImageUrl } from "@/utils/fileUrl";

interface PublicationCardProps {
    publication: Publication;
}

export default function PublicationCard({ publication }: PublicationCardProps) {
    const locale = useLocale();

    const title = locale === "am" && publication.title_am ? publication.title_am : publication.title;
    const summary = locale === "am" && publication.summary_am ? publication.summary_am : publication.summary;

    const coverUrl = publication.coverImage ? getImageUrl(publication.coverImage, "medium") : null;

    const getDocTypeLabel = (type: string) => {
        switch (type) {
            case "research_report":
                return { label: locale === "am" ? "የምርምር ሪፖርት" : "Research Report", color: "bg-blue-100 text-blue-800 border-blue-200" };
            case "mineral_map":
                return { label: locale === "am" ? "የማዕድን ካርታ" : "Mineral Map", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
            case "book_manual":
                return { label: locale === "am" ? "መጽሐፍ / ማንዋል" : "Book & Manual", color: "bg-purple-100 text-purple-800 border-purple-200" };
            case "technical_publication":
                return { label: locale === "am" ? "ቴክኒካዊ ህትመት" : "Technical Paper", color: "bg-amber-100 text-amber-800 border-amber-200" };
            case "geological_study":
                return { label: locale === "am" ? "የጂኦሎጂ ጥናት" : "Geological Study", color: "bg-teal-100 text-teal-800 border-teal-200" };
            case "training_material":
                return { label: locale === "am" ? "የስልጠና ቁሳቁስ" : "Training Material", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
            case "policy_strategy":
                return { label: locale === "am" ? "ፖሊሲ እና ስትራቴጂ" : "Policy Document", color: "bg-rose-100 text-rose-800 border-rose-200" };
            default:
                return { label: locale === "am" ? "ህትመት" : "Publication", color: "bg-slate-100 text-slate-800 border-slate-200" };
        }
    };

    const getAccessBadge = (mode: string) => {
        switch (mode) {
            case "open_access":
                return (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs">
                        {locale === "am" ? "ነፃ ንባብና ማውረድ" : "Open Access"}
                    </Badge>
                );
            case "online_only":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs">
                        {locale === "am" ? "የመስመር ላይ ንባብ ብቻ" : "Online Only"}
                    </Badge>
                );
            case "enquiry_required":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium text-xs">
                        <Lock className="w-3 h-3 mr-1 inline" />
                        {publication.price && Number(publication.price) > 0
                            ? `${publication.price} ${publication.currency}`
                            : locale === "am"
                            ? "ጥያቄ የሚያስፈልገው"
                            : "Enquiry Required"}
                    </Badge>
                );
            case "restricted":
                return (
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-medium text-xs">
                        <Lock className="w-3 h-3 mr-1 inline" />
                        {locale === "am" ? "የተገደበ" : "Restricted"}
                    </Badge>
                );
            default:
                return null;
        }
    };

    const docTypeInfo = getDocTypeLabel(publication.document_type);

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
            {/* Thumbnail Header */}
            <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6 text-slate-400">
                        {publication.document_type === "mineral_map" ? (
                            <MapIcon className="w-16 h-16 stroke-[1.25] text-slate-400 group-hover:scale-110 transition-transform" />
                        ) : (
                            <FileText className="w-16 h-16 stroke-[1.25] text-slate-400 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-xs font-semibold tracking-wider uppercase mt-2 text-slate-500">
                            MIDI Library
                        </span>
                    </div>
                )}

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${docTypeInfo.color}`}>
                        {docTypeInfo.label}
                    </span>
                </div>

                <div className="absolute top-3 right-3">{getAccessBadge(publication.access_mode)}</div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    {/* Categories */}
                    {publication.categories && publication.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {publication.categories.slice(0, 2).map((cat) => (
                                <span
                                    key={cat.category_id}
                                    className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                                >
                                    {locale === "am" && cat.name_am ? cat.name_am : cat.name}
                                </span>
                            ))}
                            {publication.categories.length > 2 && (
                                <span className="text-[11px] font-medium text-slate-400 px-1 py-0.5">
                                    +{publication.categories.length - 2}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <Link
                        href={`/${locale}/publications/${publication.slug}`}
                        className="block font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 text-lg mb-2 leading-snug"
                    >
                        {title}
                    </Link>

                    {/* Summary */}
                    {summary && (
                        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {summary}
                        </p>
                    )}
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        {publication.authors && (
                            <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{publication.authors}</span>
                            </div>
                        )}
                        {publication.publication_date && (
                            <div className="flex items-center gap-1 text-slate-400 shrink-0">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(publication.publication_date).getFullYear()}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/${locale}/publications/${publication.slug}`} className="flex-1">
                            <Button variant="default" size="sm" className="w-full gap-1.5 font-medium shadow-none">
                                <BookOpen className="w-4 h-4" />
                                {publication.access_mode === "open_access" || publication.access_mode === "online_only"
                                    ? locale === "am"
                                        ? "አንብብ"
                                        : "Read Online"
                                    : locale === "am"
                                    ? "ዝርዝር / ጥያቄ"
                                    : "View & Request"}
                            </Button>
                        </Link>

                        {publication.access_mode === "open_access" && (
                            <a
                                href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api"}/publications/${publication.slug}/download`}
                                download
                                className="shrink-0"
                                title="Download Document"
                            >
                                <Button variant="outline" size="sm" className="px-2.5 text-slate-700">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
