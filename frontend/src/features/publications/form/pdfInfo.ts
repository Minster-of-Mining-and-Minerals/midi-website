export interface PdfInfo {
    pages: number;
    title?: string;
    author?: string;
    // yyyy-mm-dd
    date?: string;
}

// Generic metadata titles that authoring tools leave behind; not worth pre-filling.
const JUNK_TITLE = /^(untitled|microsoft word|document\d*|slide \d+|presentation\d*)\b|\.(docx?|pdf|pptx?)$/i;

const clean = (value?: string) => value?.replace(/\s+/g, " ").trim() || undefined;

// Reads page count and metadata from a PDF in the browser.
// pdf-lib is loaded on demand so it never ships to public pages.
export async function readPdfInfo(file: File): Promise<PdfInfo | null> {
    try {
        const { PDFDocument } = await import("pdf-lib");
        const doc = await PDFDocument.load(await file.arrayBuffer(), {
            ignoreEncryption: true,
            updateMetadata: false,
        });

        const title = clean(doc.getTitle());
        const created = doc.getCreationDate();
        return {
            pages: doc.getPageCount(),
            title: title && !JUNK_TITLE.test(title) ? title : undefined,
            author: clean(doc.getAuthor()),
            date: created && !isNaN(created.getTime()) ? created.toISOString().slice(0, 10) : undefined,
        };
    } catch {
        return null;
    }
}

// Turns "afar_potash-survey_2025.pdf" into "Afar potash survey 2025".
export function titleFromFileName(name: string) {
    const base = name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
}
