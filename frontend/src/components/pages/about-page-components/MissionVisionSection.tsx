"use client";
import { useGetStrategiesQuery } from "@/redux/api/strategyApi";
import { getImageUrl } from "@/utils/fileUrl";
import SplitTitle from "@/components/common/SplitTitle";
import { useLocale } from "next-intl";
import { ABOUT_STRATEGY_DEFAULTS, pickLocalized } from "./aboutDefaults";

const Column = ({ item, isLast = false }: { item: any; isLast?: boolean }) => {
    return (
        <div className={`flex flex-col items-center text-center p-8 ${!isLast ? 'md:border-r border-gray-200' : ''}`}>
            {/* Main Icon */}
            <div className="mb-8 relative flex items-center justify-center">
                {item.icon}
                {/* Subtle highlight behind icon */}
                {item.icon && <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl -z-10"></div>}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold tracking-tight mb-5 uppercase">
                <span className="text-secondary">OUR</span> <span className="text-primary">{item.title2}</span>
            </h3>

            <div className="flex items-center justify-center w-full mb-6 opacity-60">
                <div className="h-px bg-gray-300 w-12"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full mx-2"></div>
                <div className="h-px bg-gray-300 w-12"></div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                {item.description}
            </p>
        </div>
    );
};

export default function VisionMissionValues() {
    const { data: strategiesData, isLoading } = useGetStrategiesQuery();
    const locale = useLocale();

    if (isLoading) {
        return (
            <div className="py-16 bg-white w-full flex justify-center items-center">
                <div className="animate-pulse bg-gray-200 h-64 w-full max-w-7xl mx-4 rounded-xl" />
            </div>
        );
    }

    const strategy = strategiesData && strategiesData.length > 0 ? strategiesData[0] : null;

    const sectionTitle = pickLocalized(locale, strategy?.title || ABOUT_STRATEGY_DEFAULTS.title, strategy?.title_am);
    const sectionDescription = pickLocalized(
        locale,
        strategy?.description || ABOUT_STRATEGY_DEFAULTS.description,
        strategy?.description_am
    );

    const defaultValuesList = ABOUT_STRATEGY_DEFAULTS.values;

    const displayData = {
        mission: {
            title2: "MISSION",
            icon: <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">M</div>,
            description: ABOUT_STRATEGY_DEFAULTS.mission
        },
        vision: {
            title2: "VISION",
            icon: <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">V</div>,
            description: ABOUT_STRATEGY_DEFAULTS.vision
        },
        values: {
            title2: "VALUES",
            icon: <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">★</div>,
            description: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
                    {defaultValuesList.map((v, i) => (
                        <div key={i} className="flex flex-col gap-2 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                                <span className="font-bold text-lg text-secondary">{v.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed pl-5 border-l-2 border-primary/20 ml-1">
                                {v.content}
                            </p>
                        </div>
                    ))}
                </div>
            ) as any
        },
    };

    strategy?.sections?.forEach((sec: any) => {
        const imageUrl = sec.attachment ? getImageUrl(sec.attachment) : null;
        const customIcon = imageUrl ? <img src={imageUrl} alt={sec.type} className="w-28 h-28 object-contain z-10" /> : null;

        if (sec.type === "mission") {
            if (sec.content) displayData.mission.description = pickLocalized(locale, sec.content, sec.content_am);
            if (customIcon) displayData.mission.icon = customIcon;
        } else if (sec.type === "vision") {
            if (sec.content) displayData.vision.description = pickLocalized(locale, sec.content, sec.content_am);
            if (customIcon) displayData.vision.icon = customIcon;
        } else if (sec.type === "core_values") {
            if (sec.core_values && sec.core_values.length > 0) {
                displayData.values.description = (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
                        {sec.core_values.map((v: any, i: number) => {
                            const valueTitle = pickLocalized(locale, v.title, v.title_am);
                            const valueContent = pickLocalized(locale, v.content || "", v.content_am);
                            return (
                                <div key={i} className="flex flex-col gap-2 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#ba8200] rounded-full shrink-0" />
                                        <span className="font-bold text-lg text-slate-900 dark:text-white">{valueTitle}</span>
                                    </div>
                                    {valueContent && valueContent !== valueTitle && (
                                        <p className="text-sm text-gray-600 leading-relaxed pl-5 border-l-2 border-[#ba8200]/20 ml-1">
                                            {valueContent}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) as any;
            } else if (sec.content) {
                displayData.values.description = sec.content;
            }
            if (customIcon) displayData.values.icon = customIcon;
        }
    });

    return (
        <div className="py-16 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <SplitTitle title={sectionTitle} />
                    </h2>
                    {sectionDescription && (
                        <p className="text-gray-500 text-lg max-w-3xl mx-auto">
                            {sectionDescription}
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 py-4 mb-16">
                    <Column item={displayData.mission} />
                    <Column item={displayData.vision} isLast={true} />
                </div>

                <div className="w-full flex flex-col items-center text-center p-8 pt-12 border-t border-gray-200">
                    <div className="mb-8 relative flex items-center justify-center">
                        {displayData.values.icon}
                        {displayData.values.icon && <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl -z-10"></div>}
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight mb-5 uppercase">
                        <span className="text-secondary">OUR</span> <span className="text-primary">{displayData.values.title2}</span>
                    </h3>

                    <div className="flex items-center justify-center w-full mb-12 opacity-60">
                        <div className="h-px bg-gray-300 w-12"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mx-2"></div>
                        <div className="h-px bg-gray-300 w-12"></div>
                    </div>

                    <div className="w-full max-w-6xl mx-auto">
                        {displayData.values.description}
                    </div>
                </div>
            </div>
        </div>
    );
}
