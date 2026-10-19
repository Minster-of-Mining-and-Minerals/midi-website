"use client";

import { useState } from "react";
import { BookOpen, Check, Download, Quote, Share2 } from "lucide-react";
import { Publication } from "@/redux/types/publication";
import { canDownload, downloadUrl, publicationYear } from "./publicationMeta";

interface PublicationActionsProps {
    publication: Publication;
    title: string;
    locale: string;
}

export default function PublicationActions({ publication, title, locale }: PublicationActionsProps) {
    const tr = (en: string, am: string) => (locale === "am" ? am : en);
    const [copied, setCopied] = useState<"cite" | "share" | null>(null);

    const flash = (kind: "cite" | "share") => {
        setCopied(kind);
        setTimeout(() => setCopied(null), 2000);
    };

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

    const copy = async (text: string, kind: "cite" | "share") => {
        try {
            await navigator.clipboard.writeText(text);
            flash(kind);
        } catch {
            // Clipboard unavailable (e.g. insecure context) — nothing else to do
        }
    };

    const share = async () => {
        const url = window.location.href.split("?")[0];
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // User dismissed the share sheet
            }
            return;
        }
        copy(url, "share");
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
            <button type="button" onClick={() => copy(citation(), "cite")} className={secondary}>
                {copied === "cite" ? <Check className="h-4 w-4 text-emerald-600" /> : <Quote className="h-4 w-4" />}
                {copied === "cite" ? tr("Citation copied", "ተገልብጧል") : tr("Cite", "ጥቀስ")}
            </button>
            <button type="button" onClick={share} className={secondary}>
                {copied === "share" ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                {copied === "share" ? tr("Link copied", "ሊንክ ተገልብጧል") : tr("Share", "አጋራ")}
            </button>
        </div>
    );
}
