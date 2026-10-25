"use client";

import { useGetLeadershipsQuery } from "@/redux/api/leadershipApi";
import HierarchyNode from "./HierarchyNode";
import { useMemo } from "react";
import { getImageUrl } from "@/utils/fileUrl";
import SplitTitle from "@/components/common/SplitTitle";
import { useGetPageHeaderByIdentifierQuery } from "@/redux/api/pageHeaderApi";
import { useLocale } from "next-intl";
import { LEADERSHIP_SECTION, readLegacyLeadershipHeader, pickLocalized } from "./aboutDefaults";

// Siblings keep the API order (display_order, set from the admin's up/down arrows)
function buildTree(items: any[], locale: string, parentId: string | null = null): any[] {
    return items
        .filter((item) => item.parent_id === parentId)
        .map((item) => {
            const attachment = item.attachments?.attachment;
            return {
                id: item.leadership_id,
                level: item.level,
                name: pickLocalized(locale, item.name, item.name_am),
                title: pickLocalized(locale, item.title, item.title_am),
                image: getImageUrl(attachment, "medium") || "/businessman.png",
                fullDescription: pickLocalized(locale, item.description || "", item.description_am),
                children: buildTree(items, locale, item.leadership_id),
            };
        });
}

export default function LeadershipSection() {
    const { data: leaderships = [], isLoading, isError } = useGetLeadershipsQuery();
    const { data: sectionHeader } = useGetPageHeaderByIdentifierQuery(LEADERSHIP_SECTION.identifier);
    const locale = useLocale();

    const rootNodes = useMemo(() => {
        // Find top-level nodes (those without parents or whose parents don't exist in the list)
        return buildTree(leaderships, locale, null);
    }, [leaderships, locale]);

    if (isLoading) {
        return (
            <div className="min-h-screen py-12 flex justify-center items-center">
                <div className="animate-pulse bg-gray-200 h-64 w-64 rounded-xl" />
            </div>
        );
    }

    if (isError || rootNodes.length === 0) {
        return null;
    }

    // Page header "about-leadership" first, then the legacy JSON on the root leader, then defaults
    const legacy = readLegacyLeadershipHeader(leaderships.find(l => !l.parent_id)?.header);
    const sectionTitle = sectionHeader?.title || legacy.title || LEADERSHIP_SECTION.defaultTitle;
    const sectionDescription = sectionHeader?.description || legacy.description || LEADERSHIP_SECTION.defaultDescription;

    return (
        <div className="min-h-screen py-12 md:px-4 space-y-4">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h1 className="md:text-4xl text-2xl font-bold">
                    <SplitTitle title={sectionTitle} />
                </h1>
                <p className="text-muted mt-2">
                    {sectionDescription}
                </p>
            </div>

            <div className="flex flex-col items-center gap-12 overflow-x-auto pb-10">
                {rootNodes.map((rootNode) => (
                    <HierarchyNode key={rootNode.id} node={rootNode} />
                ))}
            </div>
        </div>
    );
}

