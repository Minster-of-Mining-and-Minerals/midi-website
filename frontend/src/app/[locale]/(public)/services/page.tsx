import React from "react";
import { getTranslations } from "next-intl/server";
import { Settings } from "lucide-react";

import PageHeader from "@/components/pages/home-page-components/PageHeader";
import ServicesOverview from "@/components/pages/services-page-components/ServicesOverview";
import CoreServicesGrid from "@/components/pages/services-page-components/CoreServicesGrid";
import ServiceExperience from "@/components/pages/services-page-components/ServiceExperience";
import MultiSectorCapability from "@/components/pages/services-page-components/MultiSectorCapability";
import WhyMIDI from "@/components/pages/services-page-components/WhyMIDI";
import ServicesCTA from "@/components/pages/services-page-components/ServicesCTA";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "nav" });
    return {
        title: t("services") || "Services - Mineral Industry Development Institute (MIDI)",
    };
}

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader
                pageIdentifier="services"
                title="Our Services"
                icon={<Settings />}
                description="Explore applied research, technical consultancy, testing laboratories, and capacity building services offered by MIDI."
            />
            
            <ServicesOverview />
            <CoreServicesGrid />
            <ServiceExperience />
            <MultiSectorCapability />
            <WhyMIDI />
            <ServicesCTA />
        </main>
    );
}
