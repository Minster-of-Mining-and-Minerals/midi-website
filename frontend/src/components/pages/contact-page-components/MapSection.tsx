"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetFederalOfficesQuery } from "@/redux/api/federalOfficeApi";
import { getGoogleMapsEmbedUrl, getGoogleMapsUrl } from "@/utils/mapUtils";

const MapSection = () => {
    const { data: federalOffices, isLoading, isError } = useGetFederalOfficesQuery();
    const office = federalOffices?.[0];

    if (isLoading) {
        return (
            <section className="w-full">
                <Skeleton className="h-80 w-full rounded-2xl" />
            </section>
        );
    }

    const embedUrl = getGoogleMapsEmbedUrl(office?.map_location || office?.office_address);
    const googleMapsUrl = getGoogleMapsUrl(office?.map_location || office?.office_address);

    return (
        <section className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <MapPin className="text-golden-dark w-6 h-6" />
                        Office Location
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Find Mineral Industry Development Institute (MIDI) office on the interactive map below.
                    </p>
                    {office?.office_address && (
                        <p className="text-sm text-gray-700 font-medium mt-2">
                            <span className="text-muted-foreground font-normal">Address: </span>
                            {office.office_address}
                        </p>
                    )}
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