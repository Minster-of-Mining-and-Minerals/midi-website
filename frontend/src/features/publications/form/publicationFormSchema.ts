import * as z from "zod";
import type { FileRole, Publication } from "@/redux/types/publication";

export const publicationSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(500, "Title is too long"),
    title_am: z.string().max(500, "Title is too long"),
    slug: z
        .string()
        .trim()
        .min(1, "Link is required")
        .max(200, "Link is too long")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes only"),
    category_ids: z.array(z.string()),
    summary: z.string().max(1000, "Keep the summary under 1000 characters"),
    summary_am: z.string().max(1000, "Keep the summary under 1000 characters"),
    authors: z.string().max(500, "Too long"),
    publication_date: z.string(),
    language: z.string(),
    reference_number: z.string().max(100, "Too long"),
    page_count: z.string().regex(/^\d*$/, "Numbers only"),
    allow_download: z.boolean(),
});

export type PublicationFormValues = z.infer<typeof publicationSchema>;

export interface UploadedDoc {
    file_name: string;
    file_path: string;
    file_size?: number;
    mime_type: string;
    file_role: FileRole;
    title?: string;
}

export const slugify = (text: string) =>
    text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120);

export function defaultValues(publication?: Publication): PublicationFormValues {
    return {
        title: publication?.title ?? "",
        title_am: publication?.title_am ?? "",
        slug: publication?.slug ?? "",
        category_ids: publication?.categories?.map((c) => c.category_id) ?? [],
        summary: publication?.summary ?? "",
        summary_am: publication?.summary_am ?? "",
        authors: publication?.authors ?? "",
        publication_date: publication?.publication_date?.slice(0, 10) ?? "",
        language: publication?.language ?? "en",
        reference_number: publication?.reference_number ?? "",
        page_count: publication?.page_count ? String(publication.page_count) : "",
        allow_download: publication ? publication.access_mode === "open_access" : true,
    };
}
