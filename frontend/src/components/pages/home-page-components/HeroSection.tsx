"use client";

import { useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

const SLIDE_DURATION = 7000;
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
        image: "/home-1.jpg",
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
        image: "/home-2.jpg",
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
        image: "/home-4.jpg",
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
    const [hovered, setHovered] = useState(false);
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
                image: getImageUrl(s.attachment as Parameters<typeof getImageUrl>[0], "original") || "/home-1.jpg",
            }))
        : defaultMidiSlides;

    const count = activeSlides.length;
    const next = () => setCurrent((c) => (c + 1) % count);
    const prev = () => setCurrent((c) => (c - 1 + count) % count);
    // Auto-advance is driven by the progress bar's animation, so pausing on
    // hover pauses the bar and the timer together.
    const autoPlay = !reducedMotion && count > 1;

    if (isLoading) {
        return <HeroSkeleton />;
    }

    if (count === 0) {
        return null;
    }

    return (
        <section
            className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-secondary"
            aria-roledescription="carousel"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {activeSlides.map((slide, index) => {
                const isActive = index === current;
                return (
                    <div
                        key={slide.id}
                        aria-hidden={!isActive}
                        className={clsx(
                            "absolute inset-0 transition-opacity duration-1000 ease-out",
                            isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
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
                                isActive && !reducedMotion ? "scale-110 duration-[9000ms]" : "scale-100 duration-0"
                            )}
                        />
                        {/* Readability gradients */}
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/60 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

                        {isActive && (
                            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center pb-16">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-sm text-[#f5c451] text-xs sm:text-sm font-semibold tracking-wide uppercase animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                        </span>
                                        {slide.eyebrow[locale]}
                                    </div>

                                    <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                                        {slide.title[locale]}
                                    </h1>

                                    <div className="mt-6 h-1 w-16 rounded-full bg-primary animate-in fade-in zoom-in-50 duration-700 delay-200 fill-mode-both" />

                                    {slide.description[locale] && (
                                        <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                                            {slide.description[locale]}
                                        </p>
                                    )}

                                    <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
                                        <Link
                                            href={slide.button_url}
                                            className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-md bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:bg-primary-hover transition"
                                        >
                                            {slide.button_name[locale]}
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                        <Link
                                            href={slide.button2_url}
                                            className="inline-flex items-center justify-center h-12 px-7 rounded-md border border-white/40 text-white font-semibold backdrop-blur-sm hover:bg-white hover:text-secondary transition"
                                        >
                                            {slide.button2_name[locale]}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Numbered progress + arrows */}
            {count > 1 && (
                <div className="absolute inset-x-0 bottom-6 z-20">
                    <div className="max-w-7xl mx-auto px-6 flex items-end justify-between gap-6">
                        <div className="flex gap-4 sm:gap-6 flex-1 max-w-xl">
                            {activeSlides.map((slide, idx) => {
                                const isActive = idx === current;
                                return (
                                    <button
                                        key={slide.id}
                                        onClick={() => setCurrent(idx)}
                                        aria-label={`Go to slide ${idx + 1}`}
                                        aria-current={isActive}
                                        className="group flex-1 min-w-0 text-start"
                                    >
                                        <span
                                            className={clsx(
                                                "flex text-xs font-semibold mb-2 transition-colors",
                                                isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                                            )}
                                        >
                                            {String(idx + 1).padStart(2, "0")}
                                            <span className="hidden md:inline truncate font-normal ms-2">{slide.label[locale]}</span>
                                        </span>
                                        <span className="block h-[3px] w-full rounded-full bg-white/25 overflow-hidden">
                                            {isActive ? (
                                                <span
                                                    key={current}
                                                    className={clsx("block h-full bg-primary", autoPlay ? "animate-hero-progress" : "w-full")}
                                                    style={autoPlay ? {
                                                        animationDuration: `${SLIDE_DURATION}ms`,
                                                        animationPlayState: hovered ? "paused" : "running",
                                                    } : undefined}
                                                    onAnimationEnd={next}
                                                />
                                            ) : (
                                                <span className={clsx("block h-full bg-primary", idx < current ? "w-full" : "w-0")} />
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="hidden sm:flex gap-2">
                            <button
                                onClick={prev}
                                aria-label="Previous slide"
                                className="size-11 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white hover:text-secondary transition"
                            >
                                <ChevronLeft className="size-5 rtl:rotate-180" />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Next slide"
                                className="size-11 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white hover:text-secondary transition"
                            >
                                <ChevronRight className="size-5 rtl:rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
