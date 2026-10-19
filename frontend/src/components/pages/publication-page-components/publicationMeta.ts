import type { Publication } from "@/redux/types/publication";

type Locale = "en" | "am";
type Labelled = { value: string; en: string; am: string };

export const LANGUAGES: Labelled[] = [
    { value: "en", en: "English", am: "እንግሊዝኛ" },
    { value: "am", en: "Amharic", am: "አማርኛ" },
    { value: "en/am", en: "Bilingual", am: "ሁለት ቋንቋ" },
];

export const SORT_OPTIONS: (Labelled & { sort_by: string; sort_order: "ASC" | "DESC" })[] = [
    { value: "newest", en: "Newest first", am: "አዲስ መጀመሪያ", sort_by: "publication_date", sort_order: "DESC" },
    { value: "oldest", en: "Oldest first", am: "የቆየ መጀመሪያ", sort_by: "publication_date", sort_order: "ASC" },
    { value: "title", en: "Title A–Z", am: "በርዕስ", sort_by: "title", sort_order: "ASC" },
    { value: "popular", en: "Most read", am: "በብዛት የተነበበ", sort_by: "views_count", sort_order: "DESC" },
];

export function languageLabel(value: string | undefined, locale: Locale) {
    const lang = LANGUAGES.find((l) => l.value === value);
    return lang ? lang[locale] : value?.toUpperCase() ?? "";
}

export function localized(publication: Publication, locale: string) {
    const am = locale === "am";
    return {
        title: (am && publication.title_am) || publication.title,
        summary: (am && publication.summary_am) || publication.summary || "",
        description: (am && publication.description_am) || publication.description || "",
    };
}

// Only open-access documents are downloadable; everything published is readable online.
export const canDownload = (publication: Publication) => publication.access_mode === "open_access";

export const apiBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";

export const downloadUrl = (publication: Publication) =>
    `${apiBaseUrl()}/publications/${publication.publication_id}/download`;

export const publicationYear = (publication: Publication) =>
    publication.publication_date ? new Date(publication.publication_date).getFullYear() : null;
