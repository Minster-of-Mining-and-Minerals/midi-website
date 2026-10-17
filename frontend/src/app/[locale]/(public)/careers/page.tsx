import { Briefcase } from "lucide-react";
import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/pages/home-page-components/PageHeader";
import Introduction from "@/components/pages/careers-page-components/Introduction";
import PeopleAndCulture from "@/components/pages/careers-page-components/PeopleAndCulture";
import CurrentOpportunities from "@/components/pages/careers-page-components/CurrentOpportunities";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "nav" });
    return {
        title: t("careers") || "Careers & Fellowships - MIDI",
    };
}

export default function CareersPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <PageHeader
                pageIdentifier="careers"
                title="Careers & Human Resource Development"
                icon={<Briefcase />}
                description="Join the Mineral Industry Development Institute (MIDI) in pioneering research, engineering innovation, and strategic mineral industry development."
            />

            <Introduction />
            <PeopleAndCulture />
            <CurrentOpportunities />
        </main>
    );
}
