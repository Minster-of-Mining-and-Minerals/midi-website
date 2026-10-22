"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetFederalOfficesQuery } from "@/redux/api/federalOfficeApi";
import { useGetPageHeaderByIdentifierQuery } from "@/redux/api/pageHeaderApi";
import { getGoogleMapsEmbedUrl, getGoogleMapsUrl } from "@/utils/mapUtils";
import { CONTACT_SECTIONS, DEFAULT_CONTACT_DETAILS } from "./contactSections";

const MapSection = () => {
    const { data: federalOffices, isLoading, isError } = useGetFederalOfficesQuery();
    const { data: mapText, isLoading: isMapTextLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.map.identifier);
    const office = federalOffices?.[0];

    if (isLoading || isMapTextLoading) {
        return (
            <section className="w-full">
                <Skeleton className="h-80 w-full rounded-2xl" />
            </section>
        );
    }

    // Saved pin, else saved address, else the default location
    const location =
        office?.map_location?.trim() || office?.office_address?.trim() || DEFAULT_CONTACT_DETAILS.mapQuery;
    const officeAddress = office?.office_address?.trim() || DEFAULT_CONTACT_DETAILS.address;

    const embedUrl = getGoogleMapsEmbedUrl(location);
    const googleMapsUrl = getGoogleMapsUrl(location);
    const mapTitle = mapText?.title || CONTACT_SECTIONS.map.defaultTitle;
    const mapDescription = mapText?.description || CONTACT_SECTIONS.map.defaultDescription;

    return (
        <section className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <MapPin className="text-golden-dark w-6 h-6" />
                        {mapTitle}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {mapDescription}
                    </p>
                    <p className="text-sm text-gray-700 font-medium mt-2">
                        <span className="text-muted-foreground font-normal">Address: </span>
                        {officeAddress}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="self-start sm:self-center gap-1.5 border-golden-dark/30 hover:bg-amber-50 text-golden-dark"
                    asChild
                >
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
                <iframe
                    title="MIDI Location Map"
                    src={embedUrl}
                    className="w-full h-[360px] md:h-[420px] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            </div>

            {isError && (
                <p className="text-red-500 text-sm mt-2">
                    Could not fetch custom office coordinates; displaying default map area.
                </p>
            )}
        </section>
    );
};

export default MapSection;