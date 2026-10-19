"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertTriangle,
    Check,
    ChevronDown,
    ChevronLeft,
    Download,
    ExternalLink,
    FileText,
    History,
    Languages,
    Loader2,
    Map as MapIcon,
    Paperclip,
    RefreshCw,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { notify, extractErrorMessage } from "@/utils/notification";
import { getImageUrl } from "@/utils/fileUrl";
import {
    useCreatePublicationMutation,
    useDeletePublicationMutation,
    useGetPublicationCategoriesQuery,
    useLazyGetPublicationByIdentifierQuery,
    useUpdatePublicationMutation,
    useUploadPublicationDocumentMutation,
} from "@/redux/api/publicationApi";
import { useUploadAttachmentsMutation } from "@/redux/api/attachementApi";
import type { CreatePublicationPayload, FileRole, Publication, PublishStatus } from "@/redux/types/publication";
import { LANGUAGES } from "@/components/pages/publication-page-components/publicationMeta";
import {
    defaultValues,
    publicationSchema,
    slugify,
    type PublicationFormValues,
    type UploadedDoc,
} from "./form/publicationFormSchema";
import { readPdfInfo, titleFromFileName } from "./form/pdfInfo";
import { clearDraft, draftKey, saveDraft, type LocalDraft } from "./form/localDraft";
import DropZone from "./form/DropZone";
import PublicationPreview from "./form/PublicationPreview";

const MAX_PDF_BYTES = 100 * 1024 * 1024;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const STATUS_LABEL: Record<PublishStatus, string> = {
    published: "Live",
    draft: "Draft",
    pending_review: "In review",
    archived: "Archived",
};

type SlugStatus = "idle" | "checking" | "available" | "taken";
type AutoField = "title" | "authors" | "publication_date" | "page_count";

const formatSize = (bytes?: number) => (bytes ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : "");

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p role="alert" className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" />
            {message}
        </p>
    );
}

function AutoHint() {
    return (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-primary">
            <Sparkles className="h-3 w-3" />
            Filled from the PDF — please check
        </p>
    );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return <section className={clsx("rounded-xl border border-slate-200 bg-white p-5 sm:p-6", className)}>{children}</section>;
}

// Re-renders on its own so typing doesn't redraw the whole form.
function LivePreview({
    control,
    categoryName,
    coverUrl,
}: {
    control: Control<PublicationFormValues>;
    categoryName: (id?: string) => string | undefined;
    coverUrl: string | null;
}) {
    const [title, categoryIds, date, pages, authors, allowDownload] = useWatch({
        control,
        name: ["title", "category_ids", "publication_date", "page_count", "authors", "allow_download"],
    });
    return (
        <PublicationPreview
            title={title}
            category={categoryName(categoryIds[0])}
            year={date ? new Date(date).getFullYear() : null}
            pages={pages}
            authors={authors}
            coverUrl={coverUrl}
            allowDownload={allowDownload}
        />
    );
}

// Page count shown on the uploaded-PDF row; watched so it updates after auto-fill.
function PdfPages({ control }: { control: Control<PublicationFormValues> }) {
    const pages = useWatch({ control, name: "page_count" });
    return pages ? <> · {pages} pages</> : null;
}

// Saves unsaved work to this browser a moment after each change.
function AutosaveDraft({
    control,
    enabled,
    storageKey,
    files,
}: {
    control: Control<PublicationFormValues>;
    enabled: boolean;
    storageKey: string;
    files: Omit<LocalDraft, "values" | "savedAt">;
}) {
    const values = useWatch({ control }) as PublicationFormValues;
    useEffect(() => {
        if (!enabled) return;
        const id = setTimeout(() => saveDraft(storageKey, { values, ...files }), 800);
        return () => clearTimeout(id);
    }, [values, files, enabled, storageKey]);
    return null;
}

const subscribeStorage = (cb: () => void) => {
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
};

interface PublicationFormProps {
    // Existing publication when editing; omitted when creating.
    publication?: Publication;
}

export default function PublicationForm({ publication }: PublicationFormProps) {
    const router = useRouter();
    const isEdit = !!publication;
    const storageKey = draftKey(publication?.publication_id);

    const { data: categories = [] } = useGetPublicationCategoriesQuery();
    const [createPublication, { isLoading: isCreating }] = useCreatePublicationMutation();
    const [updatePublication, { isLoading: isUpdating }] = useUpdatePublicationMutation();
    const [deletePublication, { isLoading: isDeleting }] = useDeletePublicationMutation();
    const [uploadProtectedDoc] = useUploadPublicationDocumentMutation();
    const [uploadAttachment] = useUploadAttachmentsMutation();
    const [fetchBySlug] = useLazyGetPublicationByIdentifierQuery();
    const isSaving = isCreating || isUpdating;

    const {
        register,
        control,
        handleSubmit,
        setValue,
        getValues,
        setError,
        clearErrors,
        reset,
        formState: { errors, isDirty },
    } = useForm<PublicationFormValues>({
        resolver: zodResolver(publicationSchema),
        defaultValues: defaultValues(publication),
        mode: "onTouched",
    });

    // ---------- Files (kept outside the form; uploaded immediately) ----------
    const [mainPdf, setMainPdf] = useState<UploadedDoc | null>(() => {
        const primary =
            publication?.files?.find((f) => f.file_role === "main_pdf") ??
            publication?.files?.find((f) => f.mime_type === "application/pdf");
        return primary
            ? {
                  file_name: primary.file_name,
                  file_path: primary.file_path,
                  file_size: primary.file_size ?? undefined,
                  mime_type: primary.mime_type,
                  file_role: "main_pdf",
                  title: primary.title ?? undefined,
              }
            : null;
    });
    const [extraFiles, setExtraFiles] = useState<UploadedDoc[]>(() =>
        (publication?.files ?? [])
            .filter((f) => f.file_path !== mainPdf?.file_path)
            .map((f) => ({
                file_name: f.file_name,
                file_path: f.file_path,
                file_size: f.file_size ?? undefined,
                mime_type: f.mime_type,
                file_role: f.file_role,
                title: f.title || f.file_name,
            }))
    );
    const [coverImageId, setCoverImageId] = useState<string | null>(publication?.cover_image_id ?? null);
    const [coverPreview, setCoverPreview] = useState<string | null>(
        publication?.coverImage ? getImageUrl(publication.coverImage, "large") : null
    );
    // The API replaces every file on submit, so files are only sent when changed.
    const [filesDirty, setFilesDirty] = useState(false);
    const [coverDirty, setCoverDirty] = useState(false);
    const [pdfBusy, setPdfBusy] = useState(false);
    const [coverBusy, setCoverBusy] = useState(false);
    const [extraBusy, setExtraBusy] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    // ---------- UI state ----------
    const [showAmharic, setShowAmharic] = useState(!!(publication?.title_am || publication?.summary_am));
    const [showMore, setShowMore] = useState(false);
    const [autoFilled, setAutoFilled] = useState<AutoField[]>([]);
    const [slugLocked, setSlugLocked] = useState(isEdit);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [draftDismissed, setDraftDismissed] = useState(false);

    const hasUnsaved = isDirty || filesDirty || coverDirty;

    // ---------- Locally saved draft ----------
    const rawDraft = useSyncExternalStore(
        subscribeStorage,
        () => {
            try {
                return localStorage.getItem(storageKey);
            } catch {
                return null;
            }
        },
        () => null
    );
    const savedDraft = useMemo<LocalDraft | null>(() => {
        try {
            return rawDraft ? (JSON.parse(rawDraft) as LocalDraft) : null;
        } catch {
            return null;
        }
    }, [rawDraft]);
    // Only offer a restore once the form has no unsaved edits of its own,
    // so our own autosaves never trigger the banner.
    const offerRestore = !draftDismissed && !!savedDraft && !hasUnsaved;

    const restoreDraft = () => {
        const draft = savedDraft;
        if (!draft) return;
        reset(draft.values, { keepDefaultValues: true });
        setMainPdf(draft.mainPdf);
        setExtraFiles(draft.extraFiles);
        setCoverImageId(draft.coverImageId);
        setCoverPreview(draft.coverPreview);
        setFilesDirty(draft.filesDirty);
        setCoverDirty(draft.coverImageId !== (publication?.cover_image_id ?? null));
        setShowAmharic(!!(draft.values.title_am || draft.values.summary_am));
        setSlugLocked(true);
        setDraftDismissed(true);
        notify.success("Unsaved changes restored.");
    };

    const discardDraft = () => {
        clearDraft(storageKey);
        setDraftDismissed(true);
    };

    // ---------- Leave protection, Ctrl+S, blob cleanup ----------
    useEffect(() => {
        if (!hasUnsaved) return;
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [hasUnsaved]);

    const quickSave = useRef<() => void>(() => {});
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                quickSave.current();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        return () => {
            if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
        };
    }, [coverPreview]);

    const leave = () => {
        if (hasUnsaved && !window.confirm("You have unsaved changes. Leave without saving?")) return;
        router.push("/admin/publications");
    };

    // ---------- Slug ----------
    // Debounced availability check; status is derived from the latest result.
    const slugValue = useWatch({ control, name: "slug" });
    const slugValid = SLUG_PATTERN.test(slugValue);
    const [slugCheck, setSlugCheck] = useState<{ slug: string; taken: boolean } | null>(null);
    useEffect(() => {
        if (!slugValid) return;
        let cancelled = false;
        const id = setTimeout(async () => {
            const res = await fetchBySlug(slugValue);
            if (cancelled) return;
            const taken = !!res.data && res.data.publication_id !== publication?.publication_id;
            setSlugCheck({ slug: slugValue, taken });
        }, 500);
        return () => {
            cancelled = true;
            clearTimeout(id);
        };
    }, [slugValue, slugValid, fetchBySlug, publication?.publication_id]);
    const slugStatus: SlugStatus = !slugValid
        ? "idle"
        : slugCheck?.slug !== slugValue
          ? "checking"
          : slugCheck.taken
            ? "taken"
            : "available";

    const updateSlugFromTitle = (title: string) => {
        if (slugLocked) return;
        const slug = slugify(title);
        setValue("slug", slug, { shouldDirty: true });
    };

    const dropAutoFlag = (field: AutoField) => setAutoFilled((prev) => prev.filter((f) => f !== field));

    // ---------- Uploads ----------
    const uploadDoc = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadProtectedDoc(formData).unwrap();
        return res.success && res.file ? res.file : null;
    };

    const handlePdf = async (file: File) => {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setPdfError("Please choose a PDF file.");
            return;
        }
        if (file.size > MAX_PDF_BYTES) {
            setPdfError("The PDF is larger than 100 MB.");
            return;
        }
        setPdfError(null);
        setPdfBusy(true);
        try {
            const [uploaded, info] = await Promise.all([uploadDoc(file), readPdfInfo(file)]);
            if (!uploaded) throw new Error("Upload failed");

            setMainPdf({
                file_name: uploaded.file_name,
                file_path: uploaded.file_path,
                file_size: uploaded.file_size,
                mime_type: uploaded.mime_type,
                file_role: "main_pdf",
                title: "Main Publication Document",
            });
            setFilesDirty(true);

            // Pre-fill only what's still empty, so we never overwrite the admin's input.
            const filled: AutoField[] = [];
            const fill = (field: AutoField, value?: string) => {
                if (value && !getValues(field)) {
                    setValue(field, value, { shouldDirty: true, shouldValidate: true });
                    filled.push(field);
                }
            };
            fill("title", info?.title ?? titleFromFileName(file.name));
            fill("authors", info?.author);
            fill("publication_date", info?.date);
            if (info?.pages) {
                setValue("page_count", String(info.pages), { shouldDirty: true });
                filled.push("page_count");
            }
            if (filled.includes("title")) updateSlugFromTitle(getValues("title"));
            setAutoFilled(filled);

            notify.success(info?.pages ? `PDF uploaded — ${info.pages} pages.` : "PDF uploaded.");
        } catch (error) {
            setPdfError(extractErrorMessage(error, "Upload failed. Please try again."));
        } finally {
            setPdfBusy(false);
        }
    };

    const handleCover = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            notify.error("Please choose an image (PNG, JPG or WebP).");
            return;
        }
        setCoverBusy(true);
        try {
            const res = await uploadAttachment({ files: [file] }).unwrap();
            const uploaded = res.attachments?.[0];
            if (!uploaded) throw new Error("Upload failed");
            setCoverImageId(uploaded.attachment_id);
            setCoverPreview(URL.createObjectURL(file));
            setCoverDirty(true);
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to upload cover image."));
        } finally {
            setCoverBusy(false);
        }
    };

    const handleExtraFile = async (file: File) => {
        setExtraBusy(true);
        try {
            const uploaded = await uploadDoc(file);
            if (!uploaded) throw new Error("Upload failed");
            setExtraFiles((prev) => [
                ...prev,
                {
                    file_name: uploaded.file_name,
                    file_path: uploaded.file_path,
                    file_size: uploaded.file_size,
                    mime_type: uploaded.mime_type,
                    file_role: file.name.toLowerCase().includes("map") ? "map_document" : "supplementary_pdf",
                    title: file.name.replace(/\.[^/.]+$/, ""),
                },
            ]);
            setFilesDirty(true);
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to upload file."));
        } finally {
            setExtraBusy(false);
        }
    };

    // ---------- Save ----------
    const save = async (values: PublicationFormValues, status?: PublishStatus) => {
        const publishing = (status ?? publication?.publish_status) === "published";
        let blocked = false;
        if (publishing && !mainPdf) {
            setPdfError("Upload the PDF before publishing.");
            blocked = true;
        }
        if (publishing && values.category_ids.length === 0) {
            setError("category_ids", { message: "Choose at least one category before publishing." });
            blocked = true;
        }
        if (slugStatus === "taken") {
            setError("slug", { message: "Another publication already uses this link." });
            setShowMore(true);
            blocked = true;
        }
        if (blocked) {
            notify.error("Please fix the highlighted fields.");
            return;
        }

        const files = [...(mainPdf ? [mainPdf] : []), ...extraFiles].map((f) => ({
            file_role: f.file_role,
            title: f.title || f.file_name,
            file_name: f.file_name,
            file_path: f.file_path,
            file_size: f.file_size || 0,
            mime_type: f.mime_type,
            is_public: true,
        }));

        // Empty strings / nulls clear a field on edit; the API accepts both.
        const payload = {
            title: values.title.trim(),
            title_am: values.title_am.trim(),
            slug: values.slug.trim(),
            summary: values.summary.trim(),
            summary_am: values.summary_am.trim(),
            authors: values.authors.trim(),
            publication_date: values.publication_date || null,
            language: values.language,
            reference_number: values.reference_number.trim(),
            page_count: values.page_count ? Number(values.page_count) : null,
            publish_status: status ?? publication?.publish_status ?? "draft",
            access_mode: values.allow_download ? "open_access" : "online_only",
            price: 0,
            cover_image_id: coverImageId,
            category_ids: values.category_ids,
            // Omitting files keeps the stored ones untouched
            files: !isEdit || filesDirty ? files : undefined,
        } as unknown as CreatePublicationPayload;

        try {
            if (isEdit) {
                await updatePublication({ id: publication.publication_id, data: payload }).unwrap();
            } else {
                await createPublication(payload).unwrap();
            }
            clearDraft(storageKey);
            setDraftDismissed(true);
            reset(values);
            setFilesDirty(false);
            setCoverDirty(false);
            setAutoFilled([]);

            if (status === "published") notify.success("Published — it's now live on the website.");
            else if (status === "draft" && publication?.publish_status === "published")
                notify.success("Unpublished — it's no longer on the website.");
            else notify.success(isEdit ? "Changes saved." : "Draft saved.");

            if (!isEdit || status) router.push("/admin/publications");
        } catch (error) {
            notify.error(extractErrorMessage(error, "Couldn't save the publication."));
        }
    };

    const submit = (status?: PublishStatus) =>
        handleSubmit(
            (values) => save(values, status),
            (formErrors) => {
                if (formErrors.slug || formErrors.reference_number || formErrors.page_count) setShowMore(true);
                if (formErrors.title_am || formErrors.summary_am) setShowAmharic(true);
                notify.error("Please fix the highlighted fields.");
            }
        )();

    useEffect(() => {
        quickSave.current = () => {
            if (!isSaving) submit(isEdit ? undefined : "draft");
        };
    });

    const handleDelete = async () => {
        if (!publication) return;
        try {
            await deletePublication(publication.publication_id).unwrap();
            clearDraft(storageKey);
            reset(getValues());
            notify.success("Publication deleted.");
            router.push("/admin/publications");
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to delete publication."));
        }
    };

    const categoryName = (id?: string) => categories.find((c) => c.category_id === id)?.name;
    const isLive = publication?.publish_status === "published";
    const legacyAccess =
        publication && !["open_access", "online_only"].includes(publication.access_mode) ? publication.access_mode : null;
    const autosaveFiles = useMemo(
        () => ({
            mainPdf,
            extraFiles,
            coverImageId,
            coverPreview: coverPreview?.startsWith("blob:") ? null : coverPreview,
            filesDirty,
        }),
        [mainPdf, extraFiles, coverImageId, coverPreview, filesDirty]
    );

    return (
        <div className="min-h-screen bg-[#f7f9fc]">
            <AutosaveDraft control={control} enabled={hasUnsaved} storageKey={storageKey} files={autosaveFiles} />

            {/* Sticky action bar */}
            <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
                    <button type="button" onClick={leave} className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Publications</span>
                    </button>
                    <span className="hidden h-5 w-px bg-slate-200 sm:block" />
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <h1 className="truncate font-semibold text-secondary">{isEdit ? "Edit publication" : "New publication"}</h1>
                        {publication && (
                            <span
                                className={clsx(
                                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                                    isLive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-muted"
                                )}
                            >
                                {STATUS_LABEL[publication.publish_status]}
                            </span>
                        )}
                        {hasUnsaved && <span className="hidden shrink-0 text-xs text-muted md:inline">· Unsaved changes</span>}
                    </div>

                    <div className="flex items-center gap-2">
                        {isLive && (
                            <Link href={`/publications/${publication.slug}`} target="_blank">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="hidden lg:inline">View</span>
                                </Button>
                            </Link>
                        )}
                        {isEdit && (
                            <ComponentGuard anyPermissions={["PUBLICATIONS:DELETE"]}>
                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)} aria-label="Delete publication">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </ComponentGuard>
                        )}
                        {isLive ? (
                            <>
                                <ComponentGuard anyPermissions={["PUBLICATIONS:PUBLISH"]}>
                                    <Button variant="outline" size="sm" onClick={() => submit("draft")} disabled={isSaving}>
                                        Unpublish
                                    </Button>
                                </ComponentGuard>
                                <Button size="sm" onClick={() => submit()} disabled={isSaving || pdfBusy} title="Ctrl+S">
                                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Save changes
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => submit(isEdit ? undefined : "draft")}
                                    disabled={isSaving || pdfBusy}
                                    title="Ctrl+S"
                                >
                                    {isEdit ? "Save" : "Save draft"}
                                </Button>
                                <ComponentGuard anyPermissions={["PUBLICATIONS:PUBLISH"]}>
                                    <Button size="sm" onClick={() => submit("published")} disabled={isSaving || pdfBusy}>
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Publish
                                    </Button>
                                </ComponentGuard>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
                {offerRestore && (
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                        <History className="h-5 w-5 shrink-0 text-blue-600" />
                        <p className="flex-1">
                            You have unsaved changes from{" "}
                            <strong>
                                {new Date(savedDraft.savedAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </strong>
                            . Restore them?
                        </p>
                        <Button size="sm" onClick={restoreDraft}>
                            Restore
                        </Button>
                        <Button size="sm" variant="ghost" onClick={discardDraft}>
                            Discard
                        </Button>
                    </div>
                )}

                {legacyAccess && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <p>
                            This publication was set to <strong>{legacyAccess.replace(/_/g, " ")}</strong>. Saving makes it free to read
                            for everyone, like all other publications.
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    {/* ---------------- Main column ---------------- */}
                    <div className="min-w-0 space-y-4">
                        {/* Document */}
                        <Card>
                            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                                <h2 className="font-semibold text-secondary">PDF document</h2>
                                <span className="text-xs text-muted">Start here — we&apos;ll fill in what we can</span>
                            </div>
                            {mainPdf && !pdfBusy ? (
                                <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                                    <FileText className="h-9 w-9 shrink-0 text-primary" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-secondary">{mainPdf.file_name}</p>
                                        <p className="text-xs text-muted">
                                            {formatSize(mainPdf.file_size) || "PDF"}
                                            <PdfPages control={control} />
                                        </p>
                                    </div>
                                    <label className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10">
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Replace
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                e.target.value = "";
                                                if (file) handlePdf(file);
                                            }}
                                        />
                                    </label>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label="Remove PDF"
                                        onClick={() => {
                                            setMainPdf(null);
                                            setFilesDirty(true);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <DropZone
                                    accept="application/pdf"
                                    onFile={handlePdf}
                                    busy={pdfBusy}
                                    invalid={!!pdfError}
                                    title={pdfBusy ? "Uploading and reading the PDF…" : "Drop the PDF here or click to choose"}
                                    hint="Title, authors, date and page count are filled in automatically · up to 100 MB"
                                />
                            )}
                            <FieldError message={pdfError ?? undefined} />
                        </Card>

                        {/* Details */}
                        <Card className="space-y-5">
                            <h2 className="font-semibold text-secondary">Details</h2>

                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Assessment of Rare Earth Mineral Deposits in Western Ethiopia"
                                    aria-invalid={!!errors.title}
                                    className={clsx("mt-1", errors.title && "border-destructive")}
                                    {...register("title", {
                                        onChange: (e) => {
                                            dropAutoFlag("title");
                                            updateSlugFromTitle(e.target.value);
                                        },
                                    })}
                                />
                                <FieldError message={errors.title?.message} />
                                {autoFilled.includes("title") && <AutoHint />}
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="contents">
                                    <div>
                                        <Label htmlFor="pub-date">Date</Label>
                                        <Input
                                            id="pub-date"
                                            type="date"
                                            className="mt-1"
                                            {...register("publication_date", { onChange: () => dropAutoFlag("publication_date") })}
                                        />
                                        {autoFilled.includes("publication_date") && <AutoHint />}
                                    </div>
                                    <div>
                                        <Label htmlFor="pages">Pages</Label>
                                        <Input
                                            id="pages"
                                            inputMode="numeric"
                                            placeholder="Auto"
                                            aria-invalid={!!errors.page_count}
                                            className={clsx("mt-1", errors.page_count && "border-destructive")}
                                            {...register("page_count", { onChange: () => dropAutoFlag("page_count") })}
                                        />
                                        <FieldError message={errors.page_count?.message} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Category *</Label>
                                <Controller
                                    control={control}
                                    name="category_ids"
                                    render={({ field }) =>
                                        categories.length === 0 ? (
                                            <p className="mt-1 text-sm text-muted">
                                                No categories yet.{" "}
                                                <Link href="/admin/publications/categories" className="font-medium text-primary hover:underline">
                                                    Create one
                                                </Link>
                                            </p>
                                        ) : (
                                            <div className="mt-1.5 flex flex-wrap gap-2">
                                                {categories.map((cat) => {
                                                    const checked = field.value.includes(cat.category_id);
                                                    return (
                                                        <button
                                                            key={cat.category_id}
                                                            type="button"
                                                            aria-pressed={checked}
                                                            onClick={() => {
                                                                field.onChange(
                                                                    checked
                                                                        ? field.value.filter((id) => id !== cat.category_id)
                                                                        : [...field.value, cat.category_id]
                                                                );
                                                                clearErrors("category_ids");
                                                            }}
                                                            className={clsx(
                                                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                                                                checked
                                                                    ? "border-primary bg-primary/10 font-semibold text-primary"
                                                                    : "border-slate-200 text-secondary hover:border-slate-300"
                                                            )}
                                                        >
                                                            {checked && <Check className="h-3.5 w-3.5" />}
                                                            {cat.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )
                                    }
                                />
                                <FieldError message={errors.category_ids?.message} />
                            </div>

                            <div>
                                <Label htmlFor="summary">Summary</Label>
                                <Textarea
                                    id="summary"
                                    rows={3}
                                    placeholder="2–3 sentences about what this document covers. Shown on the card and publication page."
                                    aria-invalid={!!errors.summary}
                                    className={clsx("mt-1", errors.summary && "border-destructive")}
                                    {...register("summary")}
                                />
                                <FieldError message={errors.summary?.message} />
                            </div>

                            <div>
                                <Label htmlFor="authors">Authors</Label>
                                <Input
                                    id="authors"
                                    placeholder="e.g. Dr. Solomon Haile, Tigist Bekele"
                                    className="mt-1"
                                    {...register("authors", { onChange: () => dropAutoFlag("authors") })}
                                />
                                <FieldError message={errors.authors?.message} />
                                {autoFilled.includes("authors") && <AutoHint />}
                            </div>

                            {/* Amharic */}
                            {showAmharic ? (
                                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
                                            <Languages className="h-4 w-4 text-primary" />
                                            Amharic version
                                        </span>
                                        <button type="button" onClick={() => setShowAmharic(false)} className="text-xs text-muted hover:text-secondary">
                                            Hide
                                        </button>
                                    </div>
                                    <div>
                                        <Label htmlFor="title-am">Title (Amharic)</Label>
                                        <Input id="title-am" className="mt-1 font-amharic" placeholder="የህትመቱ ርዕስ" {...register("title_am")} />
                                        <FieldError message={errors.title_am?.message} />
                                    </div>
                                    <div>
                                        <Label htmlFor="summary-am">Summary (Amharic)</Label>
                                        <Textarea
                                            id="summary-am"
                                            rows={3}
                                            className="mt-1 font-amharic"
                                            placeholder="የሰነዱ አጭር ማጠቃለያ…"
                                            {...register("summary_am")}
                                        />
                                        <FieldError message={errors.summary_am?.message} />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowAmharic(true)}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                                >
                                    <Languages className="h-4 w-4" />
                                    Add Amharic title & summary
                                </button>
                            )}
                        </Card>

                        {/* More details */}
                        <Card className="p-0 sm:p-0">
                            <button
                                type="button"
                                onClick={() => setShowMore((v) => !v)}
                                aria-expanded={showMore}
                                className="flex w-full items-center justify-between gap-3 p-5 text-start sm:p-6"
                            >
                                <span>
                                    <span className="block font-semibold text-secondary">More details</span>
                                    <span className="block text-xs text-muted">Web link, language, reference number, extra files & maps</span>
                                </span>
                                <ChevronDown className={clsx("h-5 w-5 text-muted transition-transform", showMore && "rotate-180")} />
                            </button>

                            {showMore && (
                                <div className="space-y-5 border-t border-slate-100 p-5 sm:p-6">
                                    <div>
                                        <Label htmlFor="slug">Web link</Label>
                                        <div
                                            className={clsx(
                                                "mt-1 flex items-center overflow-hidden rounded-md border bg-white focus-within:ring-2 focus-within:ring-primary/20",
                                                errors.slug || slugStatus === "taken" ? "border-destructive" : "border-input"
                                            )}
                                        >
                                            <span className="shrink-0 border-e border-slate-200 bg-slate-50 px-3 py-2 text-xs text-muted">
                                                /publications/
                                            </span>
                                            <input
                                                id="slug"
                                                className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-xs outline-none"
                                                {...register("slug", {
                                                    onChange: () => setSlugLocked(true),
                                                })}
                                            />
                                            <span className="pe-3">
                                                {slugStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
                                                {slugStatus === "available" && <Check className="h-4 w-4 text-emerald-600" />}
                                            </span>
                                        </div>
                                        {slugStatus === "taken" && !errors.slug ? (
                                            <FieldError message="Another publication already uses this link." />
                                        ) : (
                                            <FieldError message={errors.slug?.message} />
                                        )}
                                        {!slugLocked && <p className="mt-1 text-[11px] text-muted">Created from the title automatically.</p>}
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="language">Document language</Label>
                                            <Controller
                                                control={control}
                                                name="language"
                                                render={({ field }) => (
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger id="language" className="mt-1">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {LANGUAGES.map((l) => (
                                                                <SelectItem key={l.value} value={l.value}>
                                                                    {l.en}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="ref-num">Reference / ISBN</Label>
                                            <Input
                                                id="ref-num"
                                                placeholder="e.g. MIDI-TR-2026-004"
                                                className="mt-1 font-mono text-xs"
                                                {...register("reference_number")}
                                            />
                                            <FieldError message={errors.reference_number?.message} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Extra files & maps</Label>
                                        <p className="mb-2 text-xs text-muted">Appendices, maps or data sheets shown below the reader.</p>
                                        {extraFiles.length > 0 && (
                                            <ul className="mb-2 space-y-2">
                                                {extraFiles.map((file, idx) => (
                                                    <li
                                                        key={file.file_path}
                                                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm"
                                                    >
                                                        {file.file_role === "map_document" ? (
                                                            <MapIcon className="h-4 w-4 shrink-0 text-primary" />
                                                        ) : (
                                                            <Paperclip className="h-4 w-4 shrink-0 text-muted" />
                                                        )}
                                                        <span className="min-w-0 flex-1 truncate font-medium text-secondary">{file.file_name}</span>
                                                        <Select
                                                            value={file.file_role}
                                                            onValueChange={(role: FileRole) => {
                                                                setExtraFiles((prev) =>
                                                                    prev.map((f, i) => (i === idx ? { ...f, file_role: role } : f))
                                                                );
                                                                setFilesDirty(true);
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 w-32 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="map_document">Map</SelectItem>
                                                                <SelectItem value="supplementary_pdf">Supplementary</SelectItem>
                                                                <SelectItem value="other_attachment">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            aria-label={`Remove ${file.file_name}`}
                                                            onClick={() => {
                                                                setExtraFiles((prev) => prev.filter((_, i) => i !== idx));
                                                                setFilesDirty(true);
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <DropZone
                                            compact
                                            accept="*/*"
                                            onFile={handleExtraFile}
                                            busy={extraBusy}
                                            title={extraBusy ? "Uploading…" : "Add a file"}
                                            hint="Drop a file or click to choose"
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* ---------------- Side column ---------------- */}
                    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                        <Card className="p-5 sm:p-5">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Website preview</p>
                            <div className="rounded-lg bg-[#f7f9fc] p-4">
                                <LivePreview control={control} categoryName={categoryName} coverUrl={coverPreview} />
                            </div>
                        </Card>

                        <Card className="space-y-3 p-5 sm:p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-secondary">Cover image</h2>
                                {(coverPreview || coverImageId) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCoverImageId(null);
                                            setCoverPreview(null);
                                            setCoverDirty(true);
                                        }}
                                        className="text-xs font-medium text-destructive hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <DropZone
                                compact
                                accept="image/*"
                                onFile={handleCover}
                                busy={coverBusy}
                                title={coverBusy ? "Uploading…" : coverImageId ? "Replace cover" : "Add cover"}
                                hint={coverImageId ? "Drop a new image" : "Optional · portrait images look best"}
                            />
                        </Card>

                        <Card className="p-5 sm:p-5">
                            <Controller
                                control={control}
                                name="allow_download"
                                render={({ field }) => (
                                    <div className="flex items-start justify-between gap-3">
                                        <span>
                                            <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
                                                <Download className="h-4 w-4 text-primary" />
                                                Allow download
                                            </span>
                                            <span className="mt-0.5 block text-xs text-muted">
                                                Everyone can read online. This adds a Download button.
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={field.value}
                                            aria-label="Allow download"
                                            onClick={() => field.onChange(!field.value)}
                                            className={clsx(
                                                "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition",
                                                field.value ? "bg-primary" : "bg-slate-300"
                                            )}
                                        >
                                            <span
                                                className={clsx(
                                                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                                                    field.value ? "start-[22px]" : "start-0.5"
                                                )}
                                            />
                                        </button>
                                    </div>
                                )}
                            />
                        </Card>

                        <p className="px-1 text-center text-[11px] text-muted">
                            Tip: press <kbd className="rounded border border-slate-300 bg-white px-1 font-sans">Ctrl</kbd> +{" "}
                            <kbd className="rounded border border-slate-300 bg-white px-1 font-sans">S</kbd> to save
                        </p>
                    </aside>
                </div>
            </div>

            {isEdit && (
                <ConfirmDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    title="Delete publication"
                    description={`Delete "${publication.title}"? It will be removed from the website and archived.`}
                    confirmText={isDeleting ? "Deleting..." : "Delete"}
                    cancelText="Cancel"
                    isLoading={isDeleting}
                    variant="destructive"
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
