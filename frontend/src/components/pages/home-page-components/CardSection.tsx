"use client";

import React from "react";
import { Button } from "../../ui/button";
import { useGetCardsQuery } from "@/redux/api/cardApi";
import { getImageUrl } from "@/utils/fileUrl";
import Link from "next/link";
import { CardSkeleton } from "@/components/skeletons";

const CardSection = () => {
    const { data: cmsCards = [], isLoading } = useGetCardsQuery();

    if (isLoading) {
        return <CardSkeleton />;
    }

    const activeCard = cmsCards.length > 0 ? cmsCards[0] : null;

    const title = activeCard?.title || "Advancing Ethiopia's Strategic Mineral Industries";
    const description = activeCard?.description || "The Mineral Industry Development Institute (MIDI) bridges the gap between raw mineral resources and industrial manufacturing through technical consultancy, laboratory testing, specialized training centers of excellence, and domestic and foreign investment facilitation.";
    const buttonName = activeCard?.button_name || "Explore Our Services";
    const buttonUrl = activeCard?.button_url || "/services";
    const image = activeCard?.attachment ? getImageUrl(activeCard.attachment as any, "original") : "/home-5.jpg";

    return (
        <section className="w-full flex justify-center md:px-4 mb-20 pt-2">
            <div
                className="relative w-full max-w-7xl md:rounded-3xl  overflow-hidden shadow-xl"
            >
                {/* Background Image */}
                {image && (
                    <img
                        src={image}
                        alt={title || "Background"}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50" />

                {/* Content */}
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 p-8 lg:p-14 text-white">

                    {/* Left Text */}
                    <div className="">
                        {title && (
                            <h2 className="text-lg lg:text-3xl font-bold text-primary mb-4 leading-snug">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="text-sm max-w-2xl lg:text-base text-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
                        )}
                    </div>

                    {/* Right Buttons */}
                    <div className="flex gap-4">
                        <Link href={buttonUrl}>
                            <Button className="bg-primary hover:bg-primaryHover px-9 py-2">
                                {buttonName}
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CardSection;