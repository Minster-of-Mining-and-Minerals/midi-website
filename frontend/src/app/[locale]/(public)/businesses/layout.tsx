"use client";

import React, { useMemo } from "react";
import { Quote, BriefcaseBusiness } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PageHeader from "@/components/pages/home-page-components/PageHeader";
import { Button } from "@/components/ui/button";
import { useGetRoutesQuery } from "@/redux/api/routeApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "next-intl";

const fallbackDescriptions: Record<string, string> = {
    "/businesses": "Strategic mineral industries, value chains, and development programs",
    "/businesses/overview": "MIDI sector operations and institutional technical support",
    "/businesses/import-export": "Mineral value addition and export facilitation",
    "/businesses/warehousing": "Testing facilities and material repository infrastructure",
    "/businesses/trading": "Mineral products and industrial inputs"
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();
    const locale = currentLocale || "en";

    const { data: routes = [], isLoading } = useGetRoutesQuery();

    const dynamicItems = useMemo(() => {
        if (!routes || routes.length === 0) return [];

        const getLabel = (translations?: any[]) => {
            if (!translations || translations.length === 0) return "";
            const found = translations.find((t) => t.language_code === locale)?.label;
            if (found) return found;
            const en = translations.find((t) => t.language_code === "en")?.label;
            if (en) return en;
            return translations[0]?.label || "";
        };

        const businessesRoute = routes.find((r: any) => r.path === "/businesses");
        if (!businessesRoute) return [];

        // Add parent route itself
        const items = [
            {
                label: getLabel(businessesRoute.translations) || "Our Businesses",
                slug: businessesRoute.path || "/businesses",
                description: fallbackDescriptions[businessesRoute.path || "/businesses"] || "Connecting trade, logistics, warehousing, and distribution"
            }
        ];

        // Add child routes
        if (businessesRoute.children) {
            const children = [...businessesRoute.children]
                .filter((c: any) => c.is_active && c.show_in_navbar)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

            children.forEach((child: any) => {
                items.push({
                    label: getLabel(child.translations),
                    slug: child.path || "",
                    description: fallbackDescriptions[child.path || ""] || "MIDI Strategic Sectors"
                });
            });
        }

        return items;
    }, [routes, locale]);

    // remove locale prefix: /en/about -> /about
    const normalizedPathname = pathname.replace(/^\/(en|am)/, "");

    // Find active item for title & breadcrumb
    const activeItem = dynamicItems.find((item) => item.slug === normalizedPathname);
    const title = activeItem?.label ?? "Our Strategic Sectors";
    const description = activeItem?.description ?? "Strategic mineral industries, value chains, and development programs";

    return (
        <>
            {/* Hero / Page Header (shared across all administration pages) */}
            <PageHeader
                pageIdentifier="businesses"
                title="Strategic Mineral Sectors"
                icon={<BriefcaseBusiness />}
                description="Explore the priority mineral industries, value chains, and industrial operations supported by MIDI."
            />

            {/* Main container with relative positioning for overlay */}
            <div className="relative">
                {/* Overlay Search Bar - positioned to cover half of the PageHeader */}
                {(isLoading || dynamicItems.length > 0) && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-full max-w-7xl z-[999] pointer-events-auto">
                        <div className="pt-5 pb-10 w-full bg-white rounded-2xl shadow-xl border border-border overflow-hidden space-y-6 px-4 md:px-7">
                            <h1 className="text-2xl font-bold text-primary text-center">Explore Our Businesses</h1>

                            <div className={`bg-white flex flex-row items-stretch justify-between gap-4 overflow-x-auto pb-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x`}>
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <Skeleton key={i} className="flex-1 min-w-[180px] h-[72px] rounded-md" />
                                    ))
                                ) : (
                                    dynamicItems.map((item) => {
                                        const active = normalizedPathname === item.slug;
                                        return (
                                            <Button
                                                key={item.slug}
                                                onClick={() => router.push(item.slug)}
                                                className={`flex-1 min-w-[180px] p-6 cursor-pointer transition-colors bg-background-secondary border border-border  ${active ? "bg-primary text-white font-semibold border-l-4 border-primary shadow-xl hover:bg-primary/90" : "text-muted hover:bg-background-secondary"
                                                    }`}
                                            >
                                                {item.label}
                                            </Button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content section starts below the overlay */}
                <section className="pt-20 md:pt-28 max-w-7xl mx-auto px-6 py-12">
                    {/* CENTER MAIN CONTENT (route content) */}
                    <div className="w-full md:pl-8">
                        <div className="flex items-start gap-6 mb-8">
                            <div>
                                <h1 className="text-2xl flex gap-2 flex-col font-serif text-slate-900 dark:text-white leading-tight">
                                    {title}
                                    <span className="h-1 w-1/2 bg-primary"></span>
                                    <p className="text-muted-foreground text-lg">{description}</p>
                                </h1>
                            </div>
                        </div>

                        {/* Route-specific content renders here */}
                        <div className="prose max-w-none">{children}</div>
                    </div>
                </section>
            </div>
        </>
    );
}