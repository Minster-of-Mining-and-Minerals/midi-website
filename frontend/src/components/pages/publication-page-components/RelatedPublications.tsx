"use client";

import { useLocale } from "next-intl";
import { useGetPublicationsQuery } from "@/redux/api/publicationApi";
import PublicationCard from "./PublicationCard";

interface RelatedPublicationsProps {
    publicationId: string;
    categorySlug?: string;
}

export default function RelatedPublications({ publicationId, categorySlug }: RelatedPublicationsProps) {
    const locale = useLocale();
    const { data } = useGetPublicationsQuery({
        category: categorySlug,
        sort_by: "publication_date",
        sort_order: "DESC",
        page: 1,
        limit: 5,
    });

    const related = (data?.data ?? []).filter((p) => p.publication_id !== publicationId).slice(0, 4);
    if (related.length === 0) return null;

    return (
        <section className="mt-16 border-t border-slate-200 pt-10">
            <h2 className="mb-6 text-xl font-bold text-secondary">
                {locale === "am" ? "ተዛማጅ ህትመቶች" : "Related publications"}
            </h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
                {related.map((p) => (
                    <PublicationCard key={p.publication_id} publication={p} />
                ))}
            </div>
        </section>
    );
}
