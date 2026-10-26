"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useGetRoutesQuery } from "@/redux/api/routeApi";
import { useGetPageHeaderByIdentifierQuery } from "@/redux/api/pageHeaderApi";
import { Skeleton } from "@/components/ui/skeleton";
import InteractiveGrid from "@/components/ui/interactive-grid";
import { getFileUrl } from "@/utils/fileUrl";
import { useLocale } from "next-intl";

// Page headlines shown in the title band; pages without one show their tab label
const pageHeadlines: Record<string, { en: string; am: string }> = {
  "/businesses/mineral-processing": {
    en: "Upgrading Raw Ore Grades via Precision Beneficiation",
    am: "የጥሬ ማዕድን ይዘትን በማሳደግ የኢንዱስትሪ ጥሬ ዕቃ ዝግጅት",
  },
  "/businesses/value-addition": {
    en: "The Connected Industrial Transformation Continuum",
    am: "ከተፈጥሮ ክምችት እስከ ገበያ ዝግጁ ምርት ድረስ ያለው ሂደት",
  },
  "/businesses/research-innovation": {
    en: "Bridging Fundamental Science and Industrial Scalability",
    am: "የማዕድን ምርምርን ከተግባራዊ የኢንዱስትሪ መፍትሄዎች ጋር ማስተሳሰር",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const locale = currentLocale || "en";
  const isAm = locale === "am";

  const { data: routes = [], isLoading } = useGetRoutesQuery();
  // Background image set in Admin → Page Headers → Businesses (same treatment as other page headers)
  const { data: pageHeaderData } = useGetPageHeaderByIdentifierQuery("businesses");
  const bgImage = pageHeaderData?.backgroundAttachment?.file_path;

  const sectionTitle = isAm ? "የማዕድን ኢንዱስትሪ ልማት" : "Mineral Industry Development";

  // Tabs come from the CMS routes (Businesses and its children), with built-in fallbacks
  const dynamicItems = useMemo(() => {
    const defaultItems = [
      { label: sectionTitle, slug: "/businesses" },
      { label: isAm ? "የልማት አጠቃላይ እይታ" : "Development Overview", slug: "/businesses/overview" },
      { label: isAm ? "የማዕድን ማቀነባበሪያ እና ማበልፀጊያ" : "Mineral Processing & Beneficiation", slug: "/businesses/mineral-processing" },
      { label: isAm ? "እሴት መጨመር እና ማኑፋክቸሪንግ" : "Manufacturing & Value Addition", slug: "/businesses/value-addition" },
      { label: isAm ? "ተግባራዊ ምርምር እና ቴክኖሎጂ" : "Applied Research & Innovation", slug: "/businesses/research-innovation" },
    ];

    if (!routes || routes.length === 0) return defaultItems;

    const getLabel = (translations?: any[]) => {
      if (!translations || translations.length === 0) return "";
      const found = translations.find((t) => t.language_code === locale)?.label;
      if (found) return found;
      const en = translations.find((t) => t.language_code === "en")?.label;
      if (en) return en;
      return translations[0]?.label || "";
    };

    const businessesRoute = routes.find((r: any) => r.path === "/businesses");
    if (!businessesRoute) return defaultItems;

    const items = [
      {
        label: getLabel(businessesRoute.translations) || sectionTitle,
        slug: businessesRoute.path || "/businesses",
      },
    ];

    if (businessesRoute.children) {
      [...businessesRoute.children]
        .filter((c: any) => c.is_active && c.show_in_navbar)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .forEach((child: any) => {
          items.push({ label: getLabel(child.translations), slug: child.path || "" });
        });
    }

    return items;
  }, [routes, locale, isAm, sectionTitle]);

  // remove locale prefix: /en/businesses -> /businesses
  const normalizedPathname = pathname.replace(/^\/(en|am)(?=\/|$)/, "") || "/";

  const activeItem = dynamicItems.find((item) => item.slug === normalizedPathname);
  const headline = pageHeadlines[normalizedPathname]?.[isAm ? "am" : "en"];
  const title = headline ?? activeItem?.label ?? sectionTitle;
  const isLanding = normalizedPathname === "/businesses";

  return (
    <>
      {/* Title band: breadcrumb, page headline and section tabs.
          Same minimum height as the shared PageHeader on other pages (35vh, ~440px). */}
      <section className="relative overflow-hidden bg-slate-950 text-white flex flex-col min-h-[max(35vh,440px)]">
        {bgImage && (
          <div
            className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: `url('${getFileUrl(bgImage)}')` }}
          />
        )}
        {/* Animated grid as a background layer only, so the tabs stay on the band's bottom edge
            (as a wrapper it adds its own padding and centering) */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <InteractiveGrid className="h-full min-h-0" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
          {/* Breadcrumb + headline centered vertically in the space above the tabs */}
          <div className="flex-1 flex flex-col justify-center">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-xs md:text-sm text-slate-400">
            <Link href="/" className="hover:text-primary transition-colors">
              {isAm ? "መነሻ" : "Home"}
            </Link>
            <span aria-hidden="true">/</span>
            {isLanding ? (
              <span className="text-golden-dark">{sectionTitle}</span>
            ) : (
              <>
                <Link href="/businesses" className="hover:text-primary transition-colors">
                  {sectionTitle}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-golden-dark">{activeItem?.label}</span>
              </>
            )}
          </nav>

          <h1 className="mt-3 font-display text-2xl md:text-3xl lg:text-5xl font-bold leading-tight text-balance text-golden-classic">
            {title}
          </h1>
          </div>

          <nav
            aria-label={sectionTitle}
            className="mt-10 flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-44 shrink-0 rounded-t-lg rounded-b-none bg-slate-800" />
                ))
              : dynamicItems.map((item) => {
                  const active = normalizedPathname === item.slug;
                  return (
                    <Link
                      key={item.slug}
                      href={item.slug}
                      aria-current={active ? "page" : undefined}
                      className={`shrink-0 whitespace-nowrap rounded-t-lg px-4 md:px-5 py-3 text-sm transition-colors ${
                        active
                          ? "bg-slate-50 text-primary font-semibold border-t-2 border-primary"
                          : "text-slate-300 hover:text-primary hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
          </nav>
        </div>
      </section>

      {/* Route-specific content */}
      <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">{children}</div>
      </div>
    </>
  );
}
