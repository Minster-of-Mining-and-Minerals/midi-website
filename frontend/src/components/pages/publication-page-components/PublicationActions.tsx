"use client";

import { useState } from "react";
import { BookOpen, Check, Download, Quote, Share2 } from "lucide-react";
import { Publication } from "@/redux/types/publication";
import ShareMenu from "@/components/common/ShareMenu";
import { copyText } from "@/utils/clipboard";
import { notify } from "@/utils/notification";
import { canDownload, downloadUrl, publicationYear } from "./publicationMeta";

interface PublicationActionsProps {
    publication: Publication;
    title: string;
    locale: string;
}

export default function PublicationActions({ publication, title, locale }: PublicationActionsProps) {
    const tr = (en: string, am: string) => (locale === "am" ? am : en);
    const [citeCopied, setCiteCopied] = useState(false);

    const citation = () => {
        const parts = [
            publication.authors ? `${publication.authors}.` : null,
            publicationYear(publication) ? `(${publicationYear(publication)}).` : null,
            `${title}.`,
            "Mineral Industry Development Institute (MIDI), Addis Ababa.",
            publication.reference_number ? `Ref. ${publication.reference_number}.` : null,
            typeof window !== "undefined" ? window.location.href.split("?")[0] : null,
        ];
        return parts.filter(Boolean).join(" ");
    };

    // Copies a ready-made reference (authors, year, title, MIDI, reference number, link) for researchers
    const cite = async () => {
        if (await copyText(citation())) {
            setCiteCopied(true);
            setTimeout(() => setCiteCopied(false), 2000);
        } else {
            notify.error(tr("Could not copy the citation", "ጥቅሱን መገልበጥ አልተቻለም"));
        }
    };

    const secondary =
        "inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary";

    return (
        <div className="flex flex-wrap gap-2">
            <a
                href="#reader"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover"
            >
                <BookOpen className="h-4 w-4" />
                {tr("Read Now", "አሁን ያንብቡ")}
            </a>
            {canDownload(publication) && (
                <a href={downloadUrl(publication)} download className={secondary}>
                    <Download className="h-4 w-4" />
                    {tr("Download PDF", "PDF አውርድ")}
                </a>
            )}
            <button
                type="button"
                onClick={cite}
                className={secondary}
                title={tr("Copy a ready-made reference to this publication", "ለዚህ ህትመት ዝግጁ ጥቅስ ይቅዱ")}
            >
                {citeCopied ? <Check className="h-4 w-4 text-primary" /> : <Quote className="h-4 w-4" />}
                {citeCopied ? tr("Citation copied", "ተገልብጧል") : tr("Cite", "ጥቀስ")}
            </button>
            <ShareMenu title={title}>
                <button type="button" className={secondary}>
                    <Share2 className="h-4 w-4" />
                    {tr("Share", "አጋራ")}
                </button>
            </ShareMenu>
        </div>
    );
}
