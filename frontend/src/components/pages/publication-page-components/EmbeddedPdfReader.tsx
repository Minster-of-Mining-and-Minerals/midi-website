"use strict";
"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import {
    Maximize2,
    Minimize2,
    FileText,
    Download,
    AlertCircle,
    Lock,
    ExternalLink,
    RefreshCw,
    ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Publication } from "@/redux/types/publication";

interface EmbeddedPdfReaderProps {
    publication: Publication;
    accessToken?: string | null;
}

export default function EmbeddedPdfReader({
    publication,
    accessToken,
}: EmbeddedPdfReaderProps) {
    const locale = useLocale();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";

    // Primary PDF file check
    const hasPdfFile =
        publication.files &&
        publication.files.some(
            (f) => f.mime_type === "application/pdf" || f.file_role === "main_pdf"
        );

    // Construct stream URL
    let streamUrl = `${baseUrl}/publications/${publication.publication_id}/view`;
    if (accessToken) {
        streamUrl += `?token=${encodeURIComponent(accessToken)}`;
    }

    // Determine access permissions
    const accessMode = publication.access_mode;
    const canDownload =
        accessMode === "open_access" ||
        (accessMode === "enquiry_required" && !!accessToken);

    const isRestrictedWithoutToken =
        accessMode === "enquiry_required" && !accessToken;

    if (!hasPdfFile) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center my-6">
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">
                    {locale === "am"
                        ? "ሰነድ አልተገኘም"
                        : "No Document File Available"}
                </h4>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                    {locale === "am"
                        ? "ለዚህ ህትመት እስካሁን ድረስ ዲጂታል ሰነድ አልተያያዘም። እባክዎ ለበለጠ መረጃ ተቋሙን ያነጋግሩ።"
                        : "A digital document has not yet been attached to this publication record. Please submit an inquiry for further information."}
                </p>
            </div>
        );
    }

    if (isRestrictedWithoutToken) {
        return (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-8 text-center my-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-amber-900 mb-1">
                    {locale === "am"
                        ? "ይህ ሰነድ የመዳረሻ ፈቃድ ይፈልጋል"
                        : "Document Access Requires Approval"}
                </h4>
                <p className="text-sm text-amber-700 max-w-md mx-auto mb-4">
                    {publication.price && Number(publication.price) > 0
                        ? locale === "am"
                            ? `ይህ ህትመት በ ${publication.price} ${publication.currency} የሚቀርብ ነው። እባክዎ ከጎን ባለው ቅፅ ጥያቄዎን ወይም የክፍያ ማስረጃዎን ያስገቡ።`
                            : `This publication is available upon request/purchase for ${publication.price} ${publication.currency}. Please submit your request or payment slip via the form.`
                        : locale === "am"
                        ? "ይህ ይፋዊ ሰነድ ተቋማዊ ጥያቄ እና ፈቃድ ያስፈልገዋል። እባክዎ ከጎን ባለው ቅፅ ጥያቄዎን ያስገቡ።"
                        : "Access to this institutional document requires review. Please submit an access request via the inquiry form to receive your secure reading token."}
                </p>
            </div>
        );
    }

    return (
        <div
            className={`transition-all duration-300 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm ${
                isFullscreen
                    ? "fixed inset-0 z-50 rounded-none border-none h-screen w-screen flex flex-col"
                    : "my-6"
            }`}
        >
            {/* Reader Toolbar */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-medium truncate max-w-xs md:max-w-md">
                        {publication.title}
                    </span>
                    <Badge
                        variant="secondary"
                        className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] hidden sm:inline-flex"
                    >
                        {accessMode === "online_only"
                            ? locale === "am"
                                ? "የመስመር ላይ ንባብ"
                                : "Online Reader Mode"
                            : locale === "am"
                            ? "ሙሉ መዳረሻ"
                            : "Full Access"}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    {accessMode === "online_only" && (
                        <span className="text-[11px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            {locale === "am"
                                ? "ማውረድ የተገደበ ነው"
                                : "Protected Online Reading"}
                        </span>
                    )}

                    {canDownload && (
                        <a
                            href={`${baseUrl}/publications/${publication.publication_id}/download${
                                accessToken ? `?token=${encodeURIComponent(accessToken)}` : ""
                            }`}
                            download
                        >
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white gap-1"
                            >
                                <Download className="w-3.5 h-3.5" />
                                {locale === "am" ? "አውርድ" : "Download PDF"}
                            </Button>
                        </a>
                    )}

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="h-7 text-xs text-slate-300 hover:text-white hover:bg-slate-800 px-2"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                        ) : (
                            <Maximize2 className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Embedded Iframe Container */}
            <div
                className={`relative w-full bg-slate-100 ${
                    isFullscreen ? "flex-1" : "h-[650px] md:h-[800px]"
                }`}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 text-slate-500">
                        <RefreshCw className="w-8 h-8 animate-spin mb-3 text-primary" />
                        <p className="text-sm font-medium">
                            {locale === "am"
                                ? "ሰነዱ በመጫን ላይ ነው..."
                                : "Loading secure publication document..."}
                        </p>
                    </div>
                )}

                {hasError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                        <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
                        <h5 className="font-semibold text-slate-800 mb-1">
                            {locale === "am"
                                ? "ሰነዱን ማሳየት አልተቻለም"
                                : "Unable to Display Document"}
                        </h5>
                        <p className="text-sm text-slate-500 max-w-sm mb-4">
                            {locale === "am"
                                ? "ሰነዱን በቀጥታ በገጹ ውስጥ ማሳየት አልተቻለም። በአዲስ መስኮት ለመክፈት ይሞክሩ።"
                                : "The browser was unable to render the document inline. You may try opening it directly."}
                        </p>
                        <a href={streamUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-1.5">
                                <ExternalLink className="w-4 h-4" />
                                {locale === "am"
                                    ? "በአዲስ መስኮት ክፈት"
                                    : "Open in Separate Tab"}
                            </Button>
                        </a>
                    </div>
                ) : (
                    <iframe
                        src={`${streamUrl}#toolbar=1&navpanes=1`}
                        className="w-full h-full border-none"
                        title={publication.title}
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
