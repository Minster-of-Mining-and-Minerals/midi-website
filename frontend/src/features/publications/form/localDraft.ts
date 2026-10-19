import type { PublicationFormValues, UploadedDoc } from "./publicationFormSchema";

// Unsaved work kept in this browser so it survives a refresh or accidental close.
export interface LocalDraft {
    values: PublicationFormValues;
    mainPdf: UploadedDoc | null;
    extraFiles: UploadedDoc[];
    coverImageId: string | null;
    // Only remote URLs are kept; blob previews don't survive a reload.
    coverPreview: string | null;
    filesDirty: boolean;
    savedAt: number;
}

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const draftKey = (publicationId?: string) => `midi:publication-draft:${publicationId ?? "new"}`;

export function loadDraft(key: string): LocalDraft | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const draft = JSON.parse(raw) as LocalDraft;
        if (!draft?.values || Date.now() - draft.savedAt > MAX_AGE_MS) {
            localStorage.removeItem(key);
            return null;
        }
        return draft;
    } catch {
        return null;
    }
}

export function saveDraft(key: string, draft: Omit<LocalDraft, "savedAt">) {
    try {
        localStorage.setItem(key, JSON.stringify({ ...draft, savedAt: Date.now() }));
    } catch {
        // Storage full or blocked — autosave is best-effort
    }
}

export function clearDraft(key: string) {
    try {
        localStorage.removeItem(key);
    } catch {
        // ignore
    }
}
