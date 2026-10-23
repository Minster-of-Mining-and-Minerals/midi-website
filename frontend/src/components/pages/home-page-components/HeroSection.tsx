"use client";

import { useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useGetSlidersQuery } from "@/redux/api/sliderApi";
import { getImageUrl } from "@/utils/fileUrl";
import { HeroSkeleton } from "@/components/skeletons";

// Define a type for multi-language text
type LocalizedText = {
    en: string;
    am: string;
};

// Define a type for each slide
export type Slide = {
    id: number | string;
    eyebrow: LocalizedText;
    // Short label shown next to the slide number in the progress bar
    label: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    button_name: LocalizedText;
    button_url: string;
    button2_name: LocalizedText;
    button2_url: string;
    image: string;
};

const SLIDE_DURATION = 5000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const defaultMidiSlides: Slide[] = [
    {
        id: 1,
        eyebrow: { en: "Ministry of Mines · Ethiopia", am: "የማዕድን ሚኒስቴር · ኢትዮጵያ" },
        label: { en: "Ministry of Mines", am: "የማዕድን ሚኒስቴር" },
        title: {
            en: "Mineral Industry Development Institute (MIDI)",
            am: "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI)",
        },
        description: {
            en: "Spearheading research, technology transfer, and high-level human resource development to accelerate production, import substitution, and sustainable development of Ethiopia's mineral industry.",
            am: "የኢትዮጵያን የማዕድን ኢንዱስትሪ ለማሳደግ፣ ምርትና ምርታማነትን ለማሻሻል እና የውጭ ምርትን ለመተካት የላቀ የምርምር እና የሰው ኃይል ልማት መሪ።",
        },
        button_name: { en: "Explore Sectors", am: "ዘርፎችን ይመልከቱ" },
        button_url: "/businesses",
        button2_name: { en: "About MIDI", am: "ስለ ኢንስቲትዩቱ" },
        button2_url: "/about",
        // Compressed copies (public/hero/*.webp, ~0.5 MB) of the 4–7 MB originals
        image: "/hero/home-1.webp",
    },
    {
        id: 2,
        eyebrow: { en: "Center of Excellence", am: "የልህቀት ማዕከል" },
        label: { en: "Center of Excellence", am: "የልህቀት ማዕከል" },
        title: {
            en: "Advanced Training & Workshop Facilities",
            am: "ዘመናዊ የስልጠና እና የዎርክሾፕ ማዕከላት",
        },
        description: {
            en: "Establishing state-of-the-art Center of Excellence workshops, material testing laboratories, and technical training centers across Addis Ababa and mining regions.",
            am: "በአዲስ አበባ እና በክልሎች ደረጃቸውን የጠበቁ የልህቀት ማዕከል ዎርክሾፖችን፣ የላቦራቶሪ ምርመራ እና የሙያ ስልጠና ማዕከላትን መገንባት።",
        },
        button_name: { en: "Our Services", am: "አገልግሎቶች" },
        button_url: "/services",
        button2_name: { en: "About MIDI", am: "ስለ MIDI" },
        button2_url: "/about",
        image: "/hero/home-2.webp",
    },
    {
        id: 3,
        eyebrow: { en: "Strategic Value Chains", am: "ስልታዊ የእሴት ሰንሰለቶች" },
        label: { en: "Value Chains", am: "የእሴት ሰንሰለቶች" },
        title: {
            en: "Catalyzing Strategic Mineral Value Chains",
            am: "ስልታዊ የማዕድን እሴት ሰንሰለቶችን ማጎልበት",
        },
        description: {
            en: "Providing technical consultancy and productivity enhancement across metallic minerals, fertilizers, cement, ceramics, glass, dimensional stone, and gemstones.",
            am: "በብረታ ብረት፣ ማዳበሪያ፣ ሲሚንቶ፣ ሴራሚክስ፣ መስታወት፣ የግንባታ ድንጋይ እና የከበሩ ማዕድናት ዘርፎች የቴክኒክ ድጋፍ እና የምርታማነት ማሻሻያ።",
        },
        button_name: { en: "Our Services", am: "አገልግሎቶች" },
        button_url: "/services",
        button2_name: { en: "Contact Us", am: "አግኙን" },
        button2_url: "/contact",
        image: "/hero/home-4.webp",
    },
];

function subscribeReducedMotion(callback: () => void) {
    const mq = window.matchMedia(REDUCED_MOTION);
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
}

const same = (text: string): LocalizedText => ({ en: text, am: text });

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const locale: keyof LocalizedText = useLocale() === "am" ? "am" : "en";
    const t = useTranslations();
    const reducedMotion = useSyncExternalStore(
        subscribeReducedMotion,
        () => window.matchMedia(REDUCED_MOTION).matches,
        () => false
    );

    // Fetch sliders from CMS
    const { data: cmsSliders = [], isLoading } = useGetSlidersQuery();

    // Map CMS sliders or use default MIDI slides
    const activeSlides: Slide[] = cmsSliders.length > 0
        ? [...cmsSliders]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((s, idx) => ({
                id: s.slider_id || idx,
                eyebrow: same(t("hero.badge")),
                label: same(s.title),
                title: same(s.title),
                description: same(s.description || ""),
                button_name: same(s.button_name || t("hero.button")),
                button_url: s.button_url || "/businesses",
                button2_name: same(s.button2_name || t("hero.button2")),
                button2_url: s.button2_url || "/services",
                // "large" is the backend's resized WebP (falls back to the original if it has none)
                image: getImageUrl(s.attachment as Parameters<typeof getImageUrl>[0], "large") || "/hero/home-1.webp",
            }))
        : defaultMidiSlides;

    const count = activeSlides.length;
    const next = () => setCurrent((c) => (c + 1) % count);
    // Auto-advance is driven by the progress bar's animation: when it ends, the next slide opens.
    const autoPlay = !reducedMotion && count > 1;

    if (isLoading) {
        return <HeroSkeleton />;
    }

    if (count === 0) {
        return null;
    }

    // Expanding panels: every slide is a photo panel; the active one is wide and shows its
    // text, the others are narrow strips (thin bars on phones) that open when clicked.
    return (
        <section
            className="w-full bg-white px-4 sm:px-6 lg:px-16 pt-4 pb-6 md:pb-10"
            aria-roledescription="carousel"
            aria-label={activeSlides[current].label[locale]}
        >
            <div className="flex flex-col md:flex-row gap-3 md:h-[78vh] md:min-h-[560px]">
                {activeSlides.map((slide, index) => {
                    const isActive = index === current;
                    const number = String(index + 1).padStart(2, "0");

                    return (
                        <div
                            key={slide.id}
                            aria-roledescription="slide"
                            aria-label={`${number} · ${slide.label[locale]}`}
                            className={clsx(
                                "group relative overflow-hidden rounded-2xl transition-[flex-grow,flex-basis,height] duration-500 ease-out",
                                isActive
                                    ? "h-[68vh] min-h-[460px] md:h-auto md:min-h-0 md:grow md:basis-0"
                                    : "h-14 md:h-auto md:grow-0 md:shrink-0 md:basis-[88px] lg:basis-[124px]"
                            )}
                        >
                            <Image
                                src={slide.image}
                                alt=""
                                fill
                                priority={index === 0}
                                unoptimized={true}
                                className={clsx(
                                    "object-cover transition-transform ease-linear",
                                    isActive && !reducedMotion ? "scale-105 duration-[6000ms]" : "scale-100 duration-500"
                                )}
                            />

                            {isActive ? (
                                <>
                                    {/* Readability gradient, bottom only */}
                                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />

                                    <div
                                        key={current}
                                        className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10"
                                    >
                                        <div className="max-w-2xl">
                                            <span className="block text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-[#f5c451] animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both">
                                                {number} · {slide.eyebrow[locale]}
                                            </span>
                                            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-white text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                                                {slide.title[locale]}
                                            </h1>
                                            {slide.description[locale] && (
                                                <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed line-clamp-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                                                    {slide.description[locale]}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
                                            <Link
                                                href={slide.button_url}
                                                className="group/btn inline-flex items-center justify-center gap-2 h-12 px-7 rounded-md bg-primary text-white font-semibold shadow-lg shadow-black/20 hover:bg-primary-hover transition"
                                            >
                                                {slide.button_name[locale]}
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 rtl:rotate-180" />
                                            </Link>
                                            <Link
                                                href={slide.button2_url}
                                                className="inline-flex items-center justify-center h-12 px-7 rounded-md border border-white/50 text-white font-semibold hover:bg-white hover:text-slate-950 transition"
                                            >
                                                {slide.button2_name[locale]}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Progress of the active slide; drives auto-advance (keeps running on hover) */}
                                    {count > 1 && (
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
                                            <span
                                                key={current}
                                                className={clsx("block h-full bg-primary", autoPlay ? "animate-hero-progress" : "w-full")}
                                                style={autoPlay ? { animationDuration: `${SLIDE_DURATION}ms` } : undefined}
                                                onAnimationEnd={next}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setCurrent(index)}
                                    aria-label={`Show slide ${number}: ${slide.label[locale]}`}
                                    className="absolute inset-0 flex md:flex-col items-center justify-start md:justify-between gap-3 px-5 md:px-0 md:py-6 bg-slate-950/65 hover:bg-slate-950/45 text-white transition-colors text-start"
                                >
                                    <span className="text-sm font-semibold text-[#f5c451]">{number}</span>
                                    <span className="truncate md:[writing-mode:vertical-rl] md:rotate-180 text-base font-semibold tracking-wide md:max-h-[70%]">
                                        {slide.label[locale]}
                                    </span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
