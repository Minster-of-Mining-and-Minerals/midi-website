"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Loader2, Upload } from "lucide-react";

interface DropZoneProps {
    accept: string;
    onFile: (file: File) => void;
    busy?: boolean;
    title: string;
    hint: string;
    invalid?: boolean;
    compact?: boolean;
}

// Click-or-drop file picker. Accepts a single file.
export default function DropZone({ accept, onFile, busy, title, hint, invalid, compact }: DropZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const pick = (files: FileList | null) => {
        const file = files?.[0];
        if (file && !busy) onFile(file);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-disabled={busy}
            onClick={() => !busy && inputRef.current?.click()}
            onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !busy) {
                    e.preventDefault();
                    inputRef.current?.click();
                }
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pick(e.dataTransfer.files);
            }}
            className={clsx(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-center outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40",
                compact ? "gap-1 p-4" : "gap-2 p-8",
                dragging
                    ? "border-primary bg-primary/10"
                    : invalid
                      ? "border-destructive/60 bg-destructive/5"
                      : "border-slate-300 bg-slate-50 hover:border-primary hover:bg-primary/5",
                busy && "cursor-wait opacity-70"
            )}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="sr-only"
                tabIndex={-1}
                onChange={(e) => {
                    pick(e.target.files);
                    e.target.value = "";
                }}
            />
            <span
                className={clsx(
                    "flex items-center justify-center rounded-full bg-white text-primary shadow-sm",
                    compact ? "h-8 w-8" : "h-12 w-12"
                )}
            >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            </span>
            <span className={clsx("font-semibold text-secondary", compact ? "text-sm" : "text-base")}>{title}</span>
            <span className="text-xs text-muted">{hint}</span>
        </div>
    );
}
