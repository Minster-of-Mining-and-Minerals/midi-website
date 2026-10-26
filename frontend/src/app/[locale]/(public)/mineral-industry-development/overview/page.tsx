"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useGetBusinessOverviewQuery } from "@/redux/api/businessApi";
import { useGetAttachmentsQuery } from "@/redux/api/attachementApi";
import { getFileUrl, getImageUrl } from "@/utils/fileUrl";
import { BusinessOverviewSkeleton } from "@/components/skeletons";
import { useLocale } from "next-intl";

// Helper component to render icons dynamically from strings
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  if (!name) return null;
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const OverviewPage = () => {
  const locale = useLocale();
  const isAm = locale === "am";

  const { data, isLoading } = useGetBusinessOverviewQuery();
  const { data: attachmentsResponse } = useGetAttachmentsQuery();
  const [sideTab, setSideTab] = useState<"sectors" | "programs">("sectors");
  const [expanded, setExpanded] = useState<number | null>(null);

  if (isLoading) {
    return <BusinessOverviewSkeleton />;
  }

  // Graceful empty state
  if (!data) {
    return (
      <div className="w-full py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <LucideIcons.ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {isAm ? "የዘርፉ አጠቃላይ እይታ መረጃ በዝግጅት ላይ ነው" : "Sector Overview Framework"}
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto">
          {isAm
            ? "ተቋማዊ የልማት ማዕቀፍ እና የቴክኒክ ድጋፍ መረጃዎች እየተዘጋጁ ናቸው። እባክዎ ጥቂት ቆይተው እንደገና ይጎብኙ።"
            : "Institutional sector frameworks and technical support details are being updated. Please check back shortly."}
        </p>
      </div>
    );
  }

  const businessCategories = data.business_categories || [];
  const keyMetrics = data.key_metrics || [];
  const operationsData = data.operations_data || [];
  const networkOperations = data.network_operations || [];
  const rawQuickStats: any = data.quick_stats || { left: [], right: [] };
  const toList = (v: any) => (Array.isArray(v) ? v : v ? [v] : []);
  const quickStats: any[] = [...toList(rawQuickStats.left), ...toList(rawQuickStats.right)];
  const pageMetadata: any = data.page_metadata || {};
  const generalInfo: any = pageMetadata.general_overview_info || {};

  let bgImageUrl = "";
  if (generalInfo.bg_image) {
    if (generalInfo.bg_image.startsWith("/") || generalInfo.bg_image.startsWith("http")) {
      bgImageUrl = generalInfo.bg_image;
      if (!bgImageUrl.startsWith("http")) bgImageUrl = getFileUrl(bgImageUrl);
    } else if (attachmentsResponse?.attachments) {
      const found = attachmentsResponse.attachments.find(
        (a: any) => a.attachment_id === generalInfo.bg_image
      );
      if (found) {
        bgImageUrl = getImageUrl(found, "large");
      }
    }
  }

  // Right column: sub-sectors and programs share one card with a toggle
  const hasSectors = businessCategories.length > 0;
  const hasPrograms = networkOperations.length > 0;
  const activeSideTab = hasSectors && (sideTab === "sectors" || !hasPrograms) ? "sectors" : "programs";
  const sectorsTitle =
    pageMetadata.key_verticals_info?.title || (isAm ? "ቀዳሚ የማዕድን ዘርፎች" : "Priority Mineral Sub-Sectors");
  const programsTitle =
    pageMetadata.network_operations_info?.title || (isAm ? "ስልታዊ የልማት ፕሮግራሞች" : "Development Programs");

  const switchSideTab = (tab: "sectors" | "programs") => {
    setSideTab(tab);
    setExpanded(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
      {/* Left column: framework, metrics, capabilities */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        {(generalInfo.title || generalInfo.description) && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex">
            <div className="p-5 md:p-6 flex-1 min-w-0">
              {generalInfo.right_content?.title && (
                <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-primary">
                  <IconRenderer name={generalInfo.right_content.icon || "ShieldCheck"} className="w-4 h-4" />
                  {generalInfo.right_content.title}
                </span>
              )}
              {generalInfo.title && (
                <h2 className="mt-2 text-lg md:text-xl font-bold text-slate-900 leading-snug">{generalInfo.title}</h2>
              )}
              {generalInfo.description && (
                <p className="mt-2 text-sm md:text-[15px] text-slate-600 leading-relaxed line-clamp-4">
                  {generalInfo.description}
                </p>
              )}
              {generalInfo.features?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {generalInfo.features.map((feature: any, fIndex: number) => (
                    <span
                      key={`feat-${fIndex}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                    >
                      <IconRenderer name={feature.icon || "CheckCircle"} className="w-3.5 h-3.5 text-primary" />
                      {feature.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {bgImageUrl && (
              <div
                className="hidden md:block w-44 lg:w-48 shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${bgImageUrl}')` }}
                role="img"
                aria-label={generalInfo.overlay_text || generalInfo.title || ""}
              />
            )}
          </div>
        )}

        {keyMetrics.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {keyMetrics.map((metric: any, index: number) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  {/* One accent for every metric: the admin-picked colors made the row too colorful */}
                  <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                    <IconRenderer name={metric.icon || "Layers"} className="w-4 h-4" />
                  </span>
                  {metric.change && (
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 rounded-full px-2 py-0.5">
                      {metric.change}
                    </span>
                  )}
                </div>
                <span className="mt-2 text-lg font-bold text-slate-900 leading-tight">{metric.value}</span>
                <span className="text-xs text-slate-600">{metric.title}</span>
              </div>
            ))}
          </div>
        )}

        {operationsData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <IconRenderer name={pageMetadata.operations_table_info?.icon || "Wrench"} className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-slate-900">
                {pageMetadata.operations_table_info?.title ||
                  (isAm ? "ተቋማዊ የቴክኒክ አቅሞች" : "Institutional Technical Capabilities")}
              </h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {operationsData.map((item: any, index: number) => (
                <li key={index} className="px-5 py-3 grid grid-cols-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] gap-x-4 gap-y-1 items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.area}</p>
                    {item.infrastructure && <p className="text-xs text-slate-500 truncate">{item.infrastructure}</p>}
                  </div>
                  <p className="text-sm text-slate-600">{item.focus}</p>
                  {item.status && (
                    <span className="justify-self-start sm:justify-self-end inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item.status}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right column: sectors / programs, quick stats, services */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {(hasSectors || hasPrograms) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            {hasSectors && hasPrograms ? (
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                {(["sectors", "programs"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => switchSideTab(tab)}
                    aria-pressed={activeSideTab === tab}
                    className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      activeSideTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === "sectors" ? sectorsTitle : programsTitle}
                  </button>
                ))}
              </div>
            ) : (
              <h2 className="text-base font-semibold text-slate-900">
                {activeSideTab === "sectors" ? sectorsTitle : programsTitle}
              </h2>
            )}

            <ul className="flex flex-col">
              {(activeSideTab === "sectors" ? businessCategories : networkOperations).map((item: any, index: number) => {
                const isOpen = expanded === index;
                const detail = activeSideTab === "sectors" ? item.description : item.full_description || item.description;
                return (
                  <li key={index} className="border-b border-slate-100 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center gap-3 py-3 text-start"
                    >
                      <span className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                        <IconRenderer name={item.icon || (activeSideTab === "sectors" ? "Layers" : "Cpu")} className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0 text-sm font-semibold text-slate-900">{item.title}</span>
                      {activeSideTab === "sectors" && item.growth && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {item.growth}
                        </span>
                      )}
                      {detail && (
                        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      )}
                    </button>
                    {isOpen && detail && (
                      <div className="pb-3 ps-10 flex flex-col gap-2">
                        <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
                        {activeSideTab === "sectors" && item.topFocus?.filter(Boolean).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.topFocus.filter(Boolean).map((focus: string, idx: number) => (
                              <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                                {focus}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {quickStats.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 grid grid-cols-2 gap-4">
            {quickStats.map((stat: any, index: number) => (
              <div key={index} className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500">{stat.subtitle || stat.label}</span>
                <span className="text-sm font-bold text-slate-900">{stat.title || stat.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <span className="text-base font-semibold text-slate-900">{isAm ? "የቴክኒክ አገልግሎቶች" : "Technical Services"}</span>
          <div className="flex gap-2">
            <Link
              href="/services"
              className="inline-flex items-center h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              {isAm ? "አገልግሎቶች" : "Our Services"}
            </Link>
            <Link
              href="/publications"
              className="inline-flex items-center h-10 px-4 rounded-lg border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              {isAm ? "የህትመቶች ማህደር" : "Publications"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
