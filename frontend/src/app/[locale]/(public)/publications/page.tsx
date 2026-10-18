import React from "react";
import { BookOpen } from "lucide-react";

import PageHeader from "@/components/pages/home-page-components/PageHeader";
import PublicationGrid from "@/components/pages/publication-page-components/PublicationGrid";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return {
        title:
            locale === "am"
                ? "ህትመቶች እና ምርምር - የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI)"
                : "Publications & Research | Mineral Industry Development Institute (MIDI)",
        description:
            locale === "am"
                ? "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት (MIDI) ይፋዊ የምርምር ሪፖርቶች፣ የማዕድን ካርታዎች፣ ቴክኒካዊ ሰነዶች እና መመሪያዎች ቤተ-መጽሐፍት።"
                : "Access official research reports, mineral resource maps, technical documents, and geological literature published by the Mineral Industry Development Institute (MIDI), Ethiopia.",
    };
}

export default async function PublicationsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader
                pageIdentifier="publications"
                title={
                    locale === "am"
                        ? "ህትመቶች እና ምርምር"
                        : "Publications & Research"
                }
                icon={<BookOpen className="w-8 h-8" />}
                description={
                    locale === "am"
                        ? "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት ይፋዊ የምርምር ሪፖርቶችን፣ የጂኦሎጂ እና ማዕድን ካርታዎችን፣ ቴክኒካዊ ጥናቶችን እና ተቋማዊ መመሪያዎችን እዚህ ያግኙ።"
                        : "Explore official research reports, mineral cartography, technical literature, and institutional publications characterizing Ethiopia's strategic mineral sector."
                }
            />
            <PublicationGrid />
        </main>
    );
}
