"use client";

import React, { useMemo } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PageHeader from "@/components/pages/home-page-components/PageHeader";
import { Button } from "@/components/ui/button";
import { useGetRoutesQuery } from "@/redux/api/routeApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "next-intl";

const fallbackDescriptions: Record<string, { en: string; am: string }> = {
  "/businesses": {
    en: "Mineral value chain, processing, beneficiation, and industrial manufacturing",
    am: "የማዕድን እሴት ሰንሰለት፣ ማቀነባበሪያ፣ ማበልፀጊያ እና የኢንዱስትሪ ማኑፋክቸሪንግ",
  },
  "/businesses/overview": {
    en: "Institutional technical framework across strategic mineral focus areas",
    am: "በስልታዊ የማዕድን ትኩረት መስኮች ላይ የተዘረጋ ተቋማዊ የቴክኒክ ማዕቀፍ",
  },
  "/businesses/mineral-processing": {
    en: "Ore characterization, comminution, flotation, and physical separation methods",
    am: "የኦር ባህሪ ጥናት፣ መፍጨት፣ ፍሎቴሽን እና አካላዊ የማጣሪያ ዘዴዎች",
  },
  "/businesses/value-addition": {
    en: "Transforming domestic mineral feedstocks into finished industrial products",
    am: "የሀገር ውስጥ የጥሬ ማዕድን ግብዓቶችን ወደ ተጠናቀቁ የኢንዱስትሪ ምርቶች መቀየር",
  },
  "/businesses/research-innovation": {
    en: "Industry-driven applied R&D, pilot evaluation, and technology adaptation",
    am: "ኢንዱስትሪ-መር ተግባራዊ ምርምር፣ የሙከራ ግምገማ እና የቴክኖሎጂ ሽግግር",
  },
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
  const isAm = locale === "am";

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

    const defaultTitle = isAm ? "የማዕድን ኢንዱስትሪ ልማት" : "Mineral Industry Development";
    const defaultDesc = isAm
      ? fallbackDescriptions["/businesses"].am
      : fallbackDescriptions["/businesses"].en;

    // Add parent route itself (Landing page)
    const items = [
      {
        label: getLabel(businessesRoute.translations) || defaultTitle,
        slug: businessesRoute.path || "/businesses",
        description:
          fallbackDescriptions[businessesRoute.path || "/businesses"]?.[isAm ? "am" : "en"] ||
          defaultDesc,
      },
    ];

    // Add child routes in order
    if (businessesRoute.children) {
      const children = [...businessesRoute.children]
        .filter((c: any) => c.is_active && c.show_in_navbar)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      children.forEach((child: any) => {
        items.push({
          label: getLabel(child.translations),
          slug: child.path || "",
          description:
            fallbackDescriptions[child.path || ""]?.[isAm ? "am" : "en"] ||
            (isAm ? "ስልታዊ የማዕድን ዘርፎች" : "MIDI Strategic Mineral Sectors"),
        });
      });
    }

    return items;
  }, [routes, locale, isAm]);

  // remove locale prefix: /en/businesses -> /businesses
  const normalizedPathname = pathname.replace(/^\/(en|am)/, "");

  // Find active item for title & description
  const activeItem = dynamicItems.find((item) => item.slug === normalizedPathname);
  const title =
    activeItem?.label ??
    (isAm ? "የማዕድን ኢንዱስትሪ ልማት" : "Mineral Industry Development");
  const description =
    activeItem?.description ??
    (isAm
      ? fallbackDescriptions["/businesses"].am
      : fallbackDescriptions["/businesses"].en);

  return (
    <>
      {/* Hero / Page Header */}
      <PageHeader
        pageIdentifier="businesses"
        title={isAm ? "የማዕድን ኢንዱስትሪ ልማት" : "Mineral Industry Development"}
        icon={<BriefcaseBusiness />}
        description={
          isAm
            ? "በማዕድን እሴት ሰንሰለት፣ በማበልፀግ፣ በማኑፋክቸሪንግ እና በቴክኖሎጂ ሽግግር የሀገሪቱን ኢንዱስትሪ ማሳደግ።"
            : "Fostering sustainable mineral beneficiation, value addition, industrial manufacturing, and technology transfer."
        }
      />

      {/* Main container with relative positioning for overlay */}
      <div className="relative">
        {/* Navigation Tabs (All 5 Pages) */}
        {(isLoading || dynamicItems.length > 0) && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-full max-w-7xl z-[999] pointer-events-auto">
            <div className="pt-4 pb-8 w-full bg-white rounded-2xl shadow-xl border border-border overflow-hidden space-y-4 px-4 md:px-6">
              <h1 className="text-xl md:text-2xl font-bold text-primary text-center">
                {isAm ? "የማዕድን ኢንዱስትሪ ልማትን ያስሱ" : "Explore Mineral Industry Development"}
              </h1>

              <div
                className="bg-white flex flex-row items-stretch justify-start lg:justify-center gap-2 md:gap-3 overflow-x-auto pb-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x"
              >
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton
                        key={i}
                        className="flex-1 min-w-[160px] max-w-[240px] h-[56px] rounded-md"
                      />
                    ))
                ) : (
                  dynamicItems.map((item) => {
                    const active = normalizedPathname === item.slug;
                    return (
                      <Button
                        key={item.slug}
                        onClick={() => router.push(`/${locale}${item.slug}`)}
                        className={`flex-1 min-w-[170px] max-w-[240px] px-3 py-5 cursor-pointer text-xs md:text-sm transition-all bg-background-secondary border border-border ${
                          active
                            ? "bg-primary text-white font-semibold border-b-4 border-amber-400 shadow-md hover:bg-primary/95"
                            : "text-muted hover:bg-background-secondary hover:text-slate-900"
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
        <section className="pt-24 md:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-full">
            <div className="flex items-start gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl flex gap-2 flex-col font-serif text-slate-900 dark:text-white leading-tight">
                  {title}
                  <span className="h-1 w-20 bg-primary rounded"></span>
                  <p className="text-muted-foreground text-sm md:text-base">{description}</p>
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