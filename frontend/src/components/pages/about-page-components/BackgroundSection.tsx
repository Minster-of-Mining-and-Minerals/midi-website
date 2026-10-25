"use client";
import React from "react";
import * as Icons from "lucide-react";
import { useGetBackgroundsQuery } from "@/redux/api/backgroundApi";
import SplitTitle from "@/components/common/SplitTitle";
import { useLocale } from "next-intl";
import { ABOUT_BACKGROUND_DEFAULTS, pickLocalized } from "./aboutDefaults";

const BackgroundPage = () => {
    const { data: backgrounds = [] } = useGetBackgroundsQuery();
    const locale = useLocale();

    const title = pickLocalized(locale, backgrounds[0]?.title || ABOUT_BACKGROUND_DEFAULTS.title, backgrounds[0]?.title_am);
    const description = pickLocalized(
        locale,
        backgrounds[0]?.description || ABOUT_BACKGROUND_DEFAULTS.description,
        backgrounds[0]?.description_am
    );
    const iconName = backgrounds[0]?.icon || ABOUT_BACKGROUND_DEFAULTS.icon;
    const IconComponent = (Icons as any)[iconName] || Icons.Building2;

    return (
        <div className="h-auto py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            <SplitTitle title={title} />
                        </h1>
                    </div>
                    <p className="text-muted text-lg max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: description }} />
                </div>
            </div>
        </div>
    );
};

export default BackgroundPage;