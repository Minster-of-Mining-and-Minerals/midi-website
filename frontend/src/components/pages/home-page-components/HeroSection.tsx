"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Activity, ArrowRight, ChevronDown, InfoIcon, ThermometerSun, WavesArrowDown, WavesIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useGetSlidersQuery } from "@/redux/api/sliderApi";
import { getImageUrl } from "@/utils/fileUrl";
import Link from "next/link";
import { HeroSkeleton } from "@/components/skeletons";

// Define a type for multi-language text
type LocalizedText = {
    en: string;
    am: string;
};

// Define a type for each slide
export type Slide = {
    id: number;
    title: LocalizedText;
    description: LocalizedText;
    button_name: LocalizedText;
    button_url: string;
    button2_name: LocalizedText;
    button2_url: string;
    image: string;
    bg: string;
};


const defaultMidiSlides: Slide[] = [
    {
        id: 1,
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
        bg: "bg-base-200/60",
    },
    {
        id: 2,
        title: {
            en: "Advanced Training & Workshop Facilities",
            am: "ዘመናዊ የስልጠና እና የዎርክሾፕ ማዕከላት",
        },
        description: {
            en: "Establishing state-of-the-art Center of Excellence workshops, material testing laboratories, and technical training centers across Addis Ababa and mining regions.",
            am: "በአዲስ አበባ እና በክልሎች ደረጃቸውን የጠበቁ የልህቀት ማዕከል ዎርክሾፖችን፣ የላቦራቶሪ ምርመራ እና የሙያ ስልጠና ማዕከላትን መገንባት።",
        },
        button_name: { en: "Our Facilities", am: "መገልገያዎች" },
        button_url: "/facilities",
        button2_name: { en: "Our Services", am: "አገልግሎቶች" },
        button2_url: "/services",
        image: "/home-2.jpg",
        bg: "bg-base-200/60",
    },
    {
        id: 3,
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
        bg: "bg-base-200/60",
    },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [locale, setLocale] = useState<keyof LocalizedText>("en"); // default language
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const t = useTranslations();
    const pathname = usePathname();
    // Load locale from localStorage
    useEffect(() => {
        if (pathname.startsWith("/am")) {
            setLocale("am");
        } else {
            setLocale("en");
        }
    }, [pathname]);

    // Fetch sliders from CMS
    const { data: cmsSliders = [], isLoading } = useGetSlidersQuery();

    // Map CMS sliders or use default MIDI slides
    const activeSlides = cmsSliders.length > 0
        ? [...cmsSliders]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((s, idx) => ({
                id: s.slider_id || idx,
                title: { en: s.title, am: s.title },
                description: { en: s.description || "", am: s.description || "" },
                button_name: { en: s.button_name || t("hero.button"), am: s.button_name || t("hero.button") },
                button_url: s.button_url || "/businesses",
                button2_name: { en: s.button2_name || t("hero.button2"), am: s.button2_name || t("hero.button2") },
                button2_url: s.button2_url || "/services",
                image: getImageUrl(s.attachment as any, "original") || "/home-1.jpg",
                bg: "bg-base-200/60"
            }))
        : defaultMidiSlides;

    // Go to next slide
    const next = () => setCurrent((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
    const prev = () => setCurrent((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));

    // Start automatic slide
    const startAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => next(), 10000);

    };

    useEffect(() => {
        if (activeSlides.length > 0) {
            startAutoSlide();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [current, activeSlides.length]);

    if (isLoading) {
        return <HeroSkeleton />;
    }

    if (activeSlides.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-[80vh] overflow-hidden bg-black">

            {activeSlides.map((slide, index) => {
                const isActive = index === current;
                const isPrev = index === (current - 1 + activeSlides.length) % activeSlides.length;


                return (
                    <div
                        key={slide.id}
                        className={clsx(
                            "absolute inset-0 will-change-[transform,opacity,filter]",
                            "transition-[transform,opacity,filter] duration-[6000ms]",
                            "ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                            isActive && "translate-x-0 opacity-100 blur-0 z-20",
                            isPrev && "-translate-x-full opacity-0 blur-xl z-10",
                            !isActive && !isPrev && "translate-x-full opacity-0 blur-xl z-0 pointer-events-none"
                        )}
                    >

                        <div className={clsx("relative flex items-center justify-start w-full h-full overflow-hidden", slide.bg)}>
                            <Image
                                src={slide.image}
                                alt={slide.title[locale]}
                                fill
                                className="object-cover w-full"
                                priority={isActive}
                                unoptimized={true}
                            />
                            <div className="absolute inset-0 bg-black/40" />

                            <div className="relative z-10 w-full h-full flex items-center justify-center mb-20">
                                <div className="max-w-7xl w-full px-6">
                                    <div className="inline-flex items-center gap-2   rounded-full bg-primary/20 text-primary text-sm font-semibold mb-10">
                                        {/* Animated ping dot */}
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>

                                        {t("hero.badge")}
                                    </div>

                                    <h2 className="text-2xl sm:text-5xl font-bold mb-4 text-white">
                                        {slide.title[locale]}
                                    </h2>
                                    <p className="text-white opacity-90 text-base sm:text-lg mb-10 md:max-w-[70%]">
                                        {slide.description[locale]}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 mt-4 w-fit">
                                        <Link href={slide.button_url}>
                                            <Button className="bg-primary z-30 w-full sm:w-fit hover:bg-primaryHover h-12  text-base flex items-center justify-center">
                                                {slide.button_name[locale]} <ArrowRight className="w-4 h-4 " />
                                            </Button>
                                        </Link>
                                        <Link href={slide.button2_url}>
                                            <Button className="bg-white z-30 text-primary w-full sm:w-fit h-12  text-base hover:bg-white/80">
                                                <Activity className="w-4 h-4 " />  {slide.button2_name[locale]}
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute start-5 top-1/2 -translate-y-1/2 z-30 size-10 rounded-full bg-base-100 shadow-sm flex items-center justify-center hover:bg-base-200 transition"
            >
                <span className="icon-[tabler--chevron-left] size-5" />
            </button>
            <button
                onClick={next}
                className="absolute end-5 top-1/2 -translate-y-1/2 z-30 size-10 rounded-full bg-base-100 shadow-sm flex items-center justify-center hover:bg-base-200 transition"
            >
                <span className="icon-[tabler--chevron-right] size-5" />
            </button>

            {/* Pagination */}
            <div className="absolute px-4 max-w-7xl mx-auto w-full bottom-4 inset-x-0 flex justify-between items-center gap-3 z-30">
                <div className="flex gap-1">
                    {activeSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={clsx(
                                "h-2.5 w-2.5 rounded-full transition",
                                current === idx ? "bg-primary" : "bg-white/60 hover:bg-white"
                            )}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prev}
                        className=" rounded-md p-1 md:p-3 hover:bg-white/80 bg-white shadow-sm flex items-center justify-center transition"
                    >
                        <ChevronDown className="rotate-90 size-7" />
                    </button>
                    <button
                        onClick={next}
                        className="p-1 md:p-3 rounded-md hover:bg-white/80 bg-white shadow-sm flex items-center justify-center transition"
                    >
                        <ChevronDown className="-rotate-90 h-6" />
                    </button>
                </div>
            </div>
        </div >
    );
}
