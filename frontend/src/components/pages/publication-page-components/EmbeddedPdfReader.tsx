"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AlertCircle, Download, ExternalLink, FileText, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Publication } from "@/redux/types/publication";
import { apiBaseUrl, canDownload, downloadUrl, localized } from "./publicationMeta";

interface EmbeddedPdfReaderProps {
    publication: Publication;
}

export default function EmbeddedPdfReader({ publication }: EmbeddedPdfReaderProps) {
    const locale = useLocale();
    const tr = (en: string, am: string) => (locale === "am" ? am : en);
    const readerRef = useRef<HTMLDivElement>(null);
    // "native" = browser fullscreen (above everything); "overlay" = fixed layer where that isn't supported (iPhone)
    const [fullscreenMode, setFullscreenMode] = useState<"native" | "overlay" | null>(null);
    const isFullscreen = fullscreenMode !== null;
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { title } = localized(publication, locale);

    const hasPdfFile = publication.files?.some(
        (f) => f.mime_type === "application/pdf" || f.file_role === "main_pdf"
    );
    const isReadable = publication.access_mode === "open_access" || publication.access_mode === "online_only";
    const streamUrl = `${apiBaseUrl()}/publications/${publication.publication_id}/view`;

    // Native fullscreen: follow the browser (Esc, or the browser's own exit, ends it)
    useEffect(() => {
        const onChange = () => {
            if (!document.fullscreenElement) {
                setFullscreenMode((mode) => (mode === "native" ? null : mode));
            }
        };
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    // Overlay fallback: close with Escape and lock page scroll while open
    useEffect(() => {
        if (fullscreenMode !== "overlay") return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreenMode(null);
        document.addEventListener("keydown", onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
        };
    }, [fullscreenMode]);

    const toggleFullscreen = async () => {
        if (fullscreenMode === "native") {
            await document.exitFullscreen().catch(() => setFullscreenMode(null));
            return;
        }
        if (fullscreenMode === "overlay") {
            setFullscreenMode(null);
            return;
        }
        const el = readerRef.current;
        if (el?.requestFullscreen && document.fullscreenEnabled) {
            try {
                await el.requestFullscreen();
                setFullscreenMode("native");
                return;
            } catch {
                // Blocked by the browser: use the overlay instead
            }
        }
        setFullscreenMode("overlay");
    };

    if (!hasPdfFile || !isReadable) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-muted">
                    <FileText className="h-6 w-6" />
                </div>
                <h4 className="mb-1 font-semibold text-secondary">
                    {tr("Document not available online", "ሰነዱ በመስመር ላይ አይገኝም")}
                </h4>
                <p className="mx-auto max-w-md text-sm text-muted">
                    {tr(
                        "The digital copy of this publication has not been published yet. Please check back later or contact MIDI.",
                        "የዚህ ህትመት ዲጂታል ቅጂ እስካሁን አልተለቀቀም። እባክዎ ቆይተው ይመለሱ ወይም MIDIን ያግኙ።"
                    )}
                </p>
            </div>
        );
    }

    return (
        <div
            ref={readerRef}
            className={
                fullscreenMode === "native"
                    ? "flex h-full w-full flex-col bg-slate-950"
                    : fullscreenMode === "overlay"
                      ? // Above the sticky navbar (z-[1000])
                        "fixed inset-0 z-[1100] flex flex-col bg-slate-950"
                      : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            }
        >
            {/* Reader toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 px-4 py-3 text-xs text-white">
                <div className="flex min-w-0 items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-[#f5c451]" />
                    <span className="truncate font-medium">{title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {canDownload(publication) && (
                        <a href={downloadUrl(publication)} download>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 gap-1 text-xs text-white hover:bg-white/10 hover:text-white"
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{tr("Download", "አውርድ")}</span>
                            </Button>
                        </a>
                    )}
                    <a href={streamUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1 text-xs text-white hover:bg-white/10 hover:text-white"
                            title={tr("Open in new tab", "በአዲስ ትር ክፈት")}
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{tr("New tab", "አዲስ ትር")}</span>
                        </Button>
                    </a>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleFullscreen}
                        className="h-8 gap-1 text-xs text-white hover:bg-white/10 hover:text-white"
                        aria-label={isFullscreen ? tr("Exit full screen", "ከሙሉ ማያ ውጣ") : tr("Full screen", "ሙሉ ማያ")}
                    >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        <span className="hidden sm:inline">
                            {isFullscreen ? tr("Exit", "ውጣ") : tr("Full screen", "ሙሉ ማያ")}
                        </span>
                    </Button>
                </div>
            </div>

            <div className={`relative w-full bg-slate-100 ${isFullscreen ? "flex-1" : "h-[70vh] min-h-[520px] md:h-[85vh]"}`}>
                {isLoading && !hasError && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 text-muted">
                        <RefreshCw className="mb-3 h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">{tr("Loading document…", "ሰነዱ በመጫን ላይ…")}</p>
                    </div>
                )}

                {hasError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                        <AlertCircle className="mb-2 h-10 w-10 text-rose-500" />
                        <h5 className="mb-1 font-semibold text-secondary">
                            {tr("Unable to display the document here", "ሰነዱን እዚህ ማሳየት አልተቻለም")}
                        </h5>
                        <p className="mb-4 max-w-sm text-sm text-muted">
                            {tr("Your browser could not show the PDF inline. Open it in a new tab instead.", "አሳሽዎ PDF ን እዚህ ማሳየት አልቻለም። በአዲስ ትር ይክፈቱት።")}
                        </p>
                        <a href={streamUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-1.5">
                                <ExternalLink className="h-4 w-4" />
                                {tr("Open in new tab", "በአዲስ ትር ክፈት")}
                            </Button>
                        </a>
                    </div>
                ) : (
                    <iframe
                        // Open without the thumbnails sidebar (navpanes: Chrome/Edge, pagemode: Firefox)
                        src={`${streamUrl}#toolbar=1&navpanes=0&pagemode=none`}
                        className="h-full w-full border-none"
                        title={title}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
