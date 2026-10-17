import React from "react";
import { getTranslations } from "next-intl/server";
import { Building2 } from "lucide-react";

import PageHeader from "@/components/pages/home-page-components/PageHeader";
import EditorialIntro from "@/components/pages/facilities-page-components/EditorialIntro";
import FacilityEditorialShowcase from "@/components/pages/facilities-page-components/FacilityEditorialShowcase";
import PhysicalFootprint from "@/components/pages/facilities-page-components/PhysicalFootprint";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "nav" });
    return {
        title: t("facilities") || "Facilities & Laboratories - MIDI",
    };
}

export default function FacilitiesPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <PageHeader
                pageIdentifier="facilities"
                title="Laboratories & Workshop Facilities"
                icon={<Building2 />}
                description="MIDI's infrastructure is supported by specialized material characterization laboratories, foundry and mold-making workshops, and technical training centers of excellence across Ethiopia."
            />
            <EditorialIntro />
            <FacilityEditorialShowcase />
            <PhysicalFootprint />
        </main>
    );
}
