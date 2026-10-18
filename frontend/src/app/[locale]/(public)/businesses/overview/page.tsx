"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { useGetBusinessOverviewQuery } from "@/redux/api/businessApi";
import { useGetAttachmentsQuery } from "@/redux/api/attachementApi";
import { ChevronRight } from "lucide-react";
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
  const [expandedNetworkOp, setExpandedNetworkOp] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="py-20">
        <BusinessOverviewSkeleton />
      </div>
    );
  }

  // Graceful empty state
  if (!data) {
    return (
      <div className="w-full py-16 text-center bg-slate-50 border border-slate-200 rounded-2xl p-8">
        <LucideIcons.ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {isAm ? "የዘርፉ አጠቃላይ እይታ መረጃ በዝግጅት ላይ ነው" : "Sector Overview Framework"}
        </h3>
        <p className="text-slate-600 max-w-xl mx-auto">
          {isAm
            ? "ተቋማዊ የልማት ማዕቀፍ እና የቴክኒክ ድጋፍ መረጃዎች እየተዘጋጁ ናቸው። እባክዎ ጥቂት ቆይተው እንደገና ይጎብኙ።"
            : "Institutional sector frameworks and technical support details are being updated. Please check back shortly."}
        </p>
      </div>
    );
  }

  const businessData = data.business_data || [];
  const businessCategories = data.business_categories || [];
  const keyMetrics = data.key_metrics || [];
  const operationsData = data.operations_data || [];
  const networkOperations = data.network_operations || [];
  const rawQuickStats: any = data.quick_stats || { left: [], right: [] };
  const quickStats: any = {
    left: Array.isArray(rawQuickStats.left)
      ? rawQuickStats.left
      : rawQuickStats.left
      ? [rawQuickStats.left]
      : [],
    right: Array.isArray(rawQuickStats.right)
      ? rawQuickStats.right
      : rawQuickStats.right
      ? [rawQuickStats.right]
      : [],
  };
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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs md:text-sm text-slate-500 mb-2">
        <a href={`/${locale}`} className="hover:text-primary transition-colors">
          {isAm ? "መነሻ" : "Home"}
        </a>
        <span>/</span>
        <a href={`/${locale}/businesses`} className="hover:text-primary transition-colors">
          {isAm ? "የማዕድን ኢንዱስትሪ ልማት" : "Mineral Industry Development"}
        </a>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">
          {isAm ? "የልማት አጠቃላይ እይታ" : "Development Overview"}
        </span>
      </nav>
      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Key Strategic Metrics Grid */}
          {keyMetrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-2.5 rounded-lg text-white"
                      style={{ backgroundColor: metric.color || "#ba8200" }}
                    >
                      <IconRenderer name={metric.icon || "Layers"} className="w-5 h-5" />
                    </div>
                    {metric.change && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700">
                        {metric.change}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-1">{metric.value}</h3>
                  <p className="text-heading font-medium text-sm mb-1">{metric.title}</p>
                  <p className="text-xs text-muted leading-snug">{metric.period}</p>
                </div>
              ))}
            </div>
          )}

          {/* Institutional Framework Overview Card */}
          {generalInfo && (generalInfo.title || generalInfo.description) && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-border">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-heading mb-2">
                      {generalInfo.title}
                    </h2>
                    <p className="text-muted text-sm md:text-base leading-relaxed">
                      {generalInfo.description}
                    </p>
                  </div>
                  {generalInfo.right_content?.title && (
                    <div className="flex items-center gap-2 text-secondary font-medium text-sm">
                      <IconRenderer
                        name={generalInfo.right_content.icon || "Box"}
                        className="w-5 h-5"
                      />
                      <span>{generalInfo.right_content.title}</span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div
                    className="min-h-[280px] md:min-h-[360px] bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-cover bg-center relative overflow-hidden"
                    style={bgImageUrl ? { backgroundImage: `url('${bgImageUrl}')` } : {}}
                  >
                    {bgImageUrl && <div className="absolute inset-0 bg-black/50"></div>}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-6 md:gap-8">
                      {generalInfo.overlay_text ? (
                        <p className="text-base sm:text-lg md:text-xl font-semibold text-white">
                          {generalInfo.overlay_text}
                        </p>
                      ) : (
                        <p
                          className={`text-sm sm:text-base md:text-lg max-w-lg ${
                            bgImageUrl ? "text-white" : "text-muted"
                          }`}
                        >
                          {generalInfo.right_content?.description}
                        </p>
                      )}
                      <IconRenderer
                        name={generalInfo.right_content?.icon || "ShieldCheck"}
                        className={`w-14 h-14 md:w-16 md:h-16 mx-auto ${
                          bgImageUrl ? "text-white" : "text-primary"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generalInfo.features &&
                    generalInfo.features.length > 0 &&
                    generalInfo.features.map((feature: any, fIndex: number) => (
                      <div
                        key={`feat-${fIndex}`}
                        className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <IconRenderer
                            name={feature.icon || "CheckCircle"}
                            className="w-4 h-4 text-primary"
                          />
                        </div>
                        <span className="text-muted text-sm">{feature.text}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Operations / Technical Capabilities Table */}
          {operationsData.length > 0 && (
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl md:text-2xl font-bold text-heading flex items-center gap-2">
                  <IconRenderer
                    name={pageMetadata.operations_table_info?.icon || "Wrench"}
                    className="w-6 h-6 text-primary"
                  />
                  {pageMetadata.operations_table_info?.title ||
                    (isAm ? "ተቋማዊ የቴክኒክ አቅሞች" : "Institutional Technical Capabilities")}
                </h3>
                <p className="text-muted text-sm mt-1">
                  {pageMetadata.operations_table_info?.description ||
                    (isAm
                      ? "ለማዕድን ኢንዱስትሪው የሚሰጡ ቁልፍ የቴክኒክ ድጋፎች እና የላቦራቶሪ አገልግሎቶች"
                      : "Core technical divisions and specialized engineering services provided to the industry")}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-secondary">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                        {isAm ? "የስራ ክፍል / ዘርፍ" : "Technical Division"}
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                        {isAm ? "ስልታዊ ትኩረት" : "Strategic Focus"}
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                        {isAm ? "ተቋማዊ መሠረተ ልማት" : "Facility & Setup"}
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-heading uppercase tracking-wider">
                        {isAm ? "ሁኔታ" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {operationsData.map((dataItem: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-background-secondary transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-semibold text-heading text-sm">
                            {dataItem.area}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-slate-700 text-sm">{dataItem.focus}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-slate-600 text-sm font-medium">
                            {dataItem.infrastructure}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>{dataItem.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Priority Sectors & Programs (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Priority Mineral Sub-Sectors */}
          {businessCategories.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl p-6 border border-amber-600/20">
              <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                <IconRenderer
                  name={pageMetadata.key_verticals_info?.icon || "Layers"}
                  className="w-5 h-5 text-primary"
                />
                {pageMetadata.key_verticals_info?.title ||
                  (isAm ? "ቀዳሚ የማዕድን ዘርፎች" : "Priority Mineral Sub-Sectors")}
              </h3>
              <div className="space-y-4">
                {businessCategories.map((category: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 bg-amber-500/10 rounded-lg text-primary"
                        >
                          <IconRenderer
                            name={category.icon || "Layers"}
                            className="w-4 h-4"
                          />
                        </div>
                        <h4 className="font-bold text-sm text-heading">{category.title}</h4>
                      </div>
                      {category.growth && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[11px] rounded-full font-semibold border border-green-200">
                          {category.growth}
                        </span>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-xs text-muted mb-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                    {category.topFocus &&
                      category.topFocus.length > 0 &&
                      category.topFocus[0] !== "" && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-[11px] font-medium text-muted mb-1.5">
                            {isAm ? "ትኩረት የሚሰጣቸው መስኮች:" : "Focus Areas:"}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {category.topFocus.map((focus: string, idx: number) =>
                              focus ? (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-background-secondary text-slate-700 text-[11px] rounded"
                                >
                                  {focus}
                                </span>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Development Programs */}
          {networkOperations.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-xl font-bold text-heading mb-1 flex items-center gap-2">
                <IconRenderer
                  name={pageMetadata.network_operations_info?.icon || "ShieldCheck"}
                  className="w-5 h-5 text-primary"
                />
                {pageMetadata.network_operations_info?.title ||
                  (isAm ? "ስልታዊ የልማት ፕሮግራሞች" : "Development Programs")}
              </h3>
              {pageMetadata.network_operations_info?.description && (
                <p className="text-xs text-muted mb-4">
                  {pageMetadata.network_operations_info.description}
                </p>
              )}
              <div className="space-y-3">
                {networkOperations.map((tool: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col p-3 bg-background-secondary rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedNetworkOp(expandedNetworkOp === index ? null : index)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <IconRenderer name={tool.icon || "Cpu"} className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs md:text-sm text-heading">
                            {tool.title}
                          </p>
                          <p className="text-[11px] text-muted line-clamp-1">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedNetworkOp === index ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    {expandedNetworkOp === index && tool.full_description && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {tool.full_description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Footer */}
      {((quickStats.left && quickStats.left.length > 0) ||
        (quickStats.right && quickStats.right.length > 0)) && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-8">
              {quickStats.left?.map((stat: any, index: number) => (
                <div key={`left-${index}`}>
                  <p className="text-xs text-muted mb-1">
                    {stat.subtitle || stat.label}
                  </p>
                  <p className="font-bold text-sm text-heading">
                    {stat.title || stat.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6">
              {quickStats.right?.map((stat: any, index: number) => (
                <React.Fragment key={`right-${index}`}>
                  <div className="text-center">
                    <p className="text-sm font-bold text-heading">
                      {stat.title || stat.label}
                    </p>
                    <p className="text-xs text-muted">
                      {stat.subtitle || stat.value}
                    </p>
                  </div>
                  {index < quickStats.right.length - 1 && (
                    <div className="h-6 w-px bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Contextual Links to Other Institutional Development Pages */}
      <div className="pt-8 border-t border-border">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          {isAm ? "ተዛማጅ የልማት ክፍሎችን ያስሱ" : "Related Technical Development Areas"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`/${locale}/businesses/mineral-processing`}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-primary mb-1">
                {isAm ? "የማጣራት ቴክኖሎጂዎች" : "Beneficiation"}
              </p>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {isAm ? "የማዕድን ማቀነባበሪያ እና ማበልፀጊያ" : "Mineral Processing & Beneficiation"}
              </h5>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {isAm
                  ? "የኦር ባህሪ ጥናት፣ መፍጨት፣ የስበት እና የፍሎቴሽን አካላዊ የማጣሪያ ቴክኖሎጂዎች።"
                  : "Ore characterization, comminution, gravity concentration, and flotation methods."}
              </p>
            </div>
          </a>

          <a
            href={`/${locale}/businesses/value-addition`}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-primary mb-1">
                {isAm ? "እሴት መጨመር" : "Manufacturing"}
              </p>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {isAm ? "እሴት መጨመር እና ማኑፋክቸሪንግ" : "Mineral-Based Manufacturing"}
              </h5>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {isAm
                  ? "የሀገር ውስጥ ማዕድናትን ወደ ሲሚንቶ፣ ሴራሚክስ፣ መስታወት፣ ብረታብረት እና ጌጣጌጥ መቀየር።"
                  : "Transforming domestic mineral feedstocks into finished construction and industrial products."}
              </p>
            </div>
          </a>

          <a
            href={`/${locale}/businesses/research-innovation`}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <p className="text-xs font-semibold text-primary mb-1">
                {isAm ? "ኢኖቬሽን እና ምርምር" : "R&D Pipeline"}
              </p>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {isAm ? "ተግባራዊ ምርምር እና ቴክኖሎጂ ሽግግር" : "Applied Research & Innovation"}
              </h5>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {isAm
                  ? "ኢንዱስትሪ-መር ምርምር፣ የሙከራ ፍሰት-ንድፍ ግምገማ እና የቴክኖሎጂ ማላመድ።"
                  : "Bench-scale testing, pilot trials, metallurgical solutions, and technical publications."}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;