import React from "react";
import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";

import PageHeader from "@/components/pages/home-page-components/PageHeader";
import ContactForm from "@/components/pages/contact-page-components/ContactForm";
import MapSection from "@/components/pages/contact-page-components/MapSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "nav" });
    return {
        title: t("contact") || "Contact Us - Mineral Industry Development Institute (MIDI)",
    };
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader
                pageIdentifier="contact"
                title="Contact Us"
                icon={<Mail />}
                description="Get in touch with the Mineral Industry Development Institute (MIDI). We are here to assist with mineral testing, consultancy, and technical inquiries."
            />
            <div className="py-12 md:py-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">
                <ContactForm />
                <MapSection />
            </div>
        </main>
    );
}