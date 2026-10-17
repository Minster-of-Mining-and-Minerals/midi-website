import React from "react";
import { getTranslations } from "next-intl/server";
import { Package } from "lucide-react";

import PageHeader from "@/components/pages/home-page-components/PageHeader";
import ProductGrid from "@/components/pages/product-page-components/ProductGrid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "nav" });
    return {
        title: t("products") || "Mineral Products & Commodities - MIDI",
    };
}

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <PageHeader
                pageIdentifier="products"
                title="Mineral Products & Commodities"
                icon={<Package />}
                description="Explore Ethiopian strategic mineral commodities, industrial raw materials, and value-added resources supported and characterized by MIDI."
            />
            <ProductGrid />
        </main>
    );
}
