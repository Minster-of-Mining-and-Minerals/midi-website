import Image from "next/image";
import clsx from "clsx";
import { BookOpen } from "lucide-react";

interface PublicationCoverProps {
    coverUrl?: string | null;
    title: string;
    sizes?: string;
    priority?: boolean;
    className?: string;
    // Skip Next image optimisation (needed for local blob previews in the admin form).
    unoptimized?: boolean;
}

// Portrait (3:4) "sheet of paper" cover: the whole page is shown uncropped on a
// light mat with a soft shadow. Without an uploaded cover, a branded MIDI page
// showing the title is drawn instead.
export default function PublicationCover({
    coverUrl,
    title,
    sizes = "(max-width: 768px) 50vw, 25vw",
    priority,
    className,
    unoptimized,
}: PublicationCoverProps) {
    return (
        <div className={clsx("relative aspect-[3/4] w-full overflow-hidden rounded-md bg-slate-100 p-[7%]", className)}>
            <div className="relative h-full w-full">
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        sizes={sizes}
                        priority={priority}
                        unoptimized={unoptimized}
                        className="object-contain drop-shadow-[0_10px_14px_rgba(0,37,61,0.28)]"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-secondary via-secondary to-[#003a5c] p-[9%] text-white shadow-[0_10px_20px_-4px_rgba(0,37,61,0.4)]">
                        <div className="flex items-center gap-2">
                            <span className="h-px flex-1 bg-primary/70" />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f5c451]">MIDI</span>
                        </div>
                        <p className="line-clamp-5 font-display text-[clamp(0.7rem,1.5vw,1rem)] leading-snug text-white/95">
                            {title}
                        </p>
                        <BookOpen className="h-[16%] w-[16%] stroke-[1.25] text-[#f5c451]/80" />
                        {/* Book spine highlight */}
                        <span className="pointer-events-none absolute inset-y-0 start-0 w-[5%] bg-gradient-to-r from-black/25 to-transparent" />
                    </div>
                )}
            </div>
        </div>
    );
}
