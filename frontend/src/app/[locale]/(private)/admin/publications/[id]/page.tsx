"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGetPublicationByIdentifierQuery } from "@/redux/api/publicationApi";
import PublicationForm from "@/features/publications/PublicationForm";

export default function EditPublicationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data: publication, isLoading, isError } = useGetPublicationByIdentifierQuery(id, { skip: !id });

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-8">
                <p className="text-sm font-medium text-muted">Loading publication...</p>
            </div>
        );
    }

    if (isError || !publication) {
        return (
            <div className="mx-auto max-w-xl p-8 text-center">
                <h2 className="mb-2 text-xl font-bold text-secondary">Publication not found</h2>
                <Button onClick={() => router.push("/admin/publications")} variant="outline">
                    Back to publications
                </Button>
            </div>
        );
    }

    // Keyed so the form re-initialises if a different publication loads
    return <PublicationForm key={publication.publication_id} publication={publication} />;
}
