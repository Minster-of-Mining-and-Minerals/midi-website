"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Upload,
    FileText,
    Trash2,
    Plus,
    Lock,
    Map as MapIcon,
    Paperclip,
    ExternalLink,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { notify, extractErrorMessage } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

import {
    useGetPublicationByIdentifierQuery,
    useUpdatePublicationMutation,
    useDeletePublicationMutation,
    usePublishPublicationMutation,
    useGetPublicationCategoriesQuery,
    useUploadPublicationDocumentMutation,
} from "@/redux/api/publicationApi";
import { useUploadAttachmentsMutation } from "@/redux/api/attachementApi";
import {
    DocumentType,
    AccessMode,
    PublishStatus,
    FileRole,
} from "@/redux/types/publication";
import { getImageUrl } from "@/utils/fileUrl";

// Dynamic Quill import
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "quill/dist/quill.snow.css";

interface UploadedDoc {
    publication_file_id?: string;
    file_name: string;
    file_path: string;
    file_size?: number;
    mime_type: string;
    file_role: FileRole;
    title?: string;
    is_public?: boolean;
}

export default function EditPublicationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const {
        data: publication,
        isLoading,
        isError,
    } = useGetPublicationByIdentifierQuery(id, { skip: !id });

    const { data: categories = [] } = useGetPublicationCategoriesQuery();
    const [updatePublication, { isLoading: isUpdating }] = useUpdatePublicationMutation();
    const [deletePublication, { isLoading: isDeleting }] = useDeletePublicationMutation();
    const [publishPublication, { isLoading: isPublishing }] = usePublishPublicationMutation();
    const [uploadProtectedDoc, { isLoading: isUploadingDoc }] = useUploadPublicationDocumentMutation();
    const [uploadAttachment, { isLoading: isUploadingCover }] = useUploadAttachmentsMutation();

    // Form States
    const [title, setTitle] = useState("");
    const [titleAm, setTitleAm] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState("");
    const [summaryAm, setSummaryAm] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionAm, setDescriptionAm] = useState("");
    const [authors, setAuthors] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [documentType, setDocumentType] = useState<DocumentType>("research_report");
    const [language, setLanguage] = useState("en");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [pageCount, setPageCount] = useState<number | "">("");

    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [accessMode, setAccessMode] = useState<AccessMode>("open_access");
    const [initialAccessMode, setInitialAccessMode] = useState<AccessMode>("open_access");
    const [price, setPrice] = useState<number>(0);
    const [currency, setCurrency] = useState("ETB");

    // Files State
    const [coverImageId, setCoverImageId] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const [mainPdf, setMainPdf] = useState<UploadedDoc | null>(null);
    const [supplementaryFiles, setSupplementaryFiles] = useState<UploadedDoc[]>([]);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // Populate data when loaded
    useEffect(() => {
        if (publication) {
            setTitle(publication.title || "");
            setTitleAm(publication.title_am || "");
            setSlug(publication.slug || "");
            setSummary(publication.summary || "");
            setSummaryAm(publication.summary_am || "");
            setDescription(publication.description || "");
            setDescriptionAm(publication.description_am || "");
            setAuthors(publication.authors || "");
            setPublicationDate(publication.publication_date || "");
            setDocumentType(publication.document_type || "research_report");
            setLanguage(publication.language || "en");
            setReferenceNumber(publication.reference_number || "");
            setPageCount(publication.page_count ?? "");

            setAccessMode(publication.access_mode || "open_access");
            setInitialAccessMode(publication.access_mode || "open_access");
            setPrice(publication.price ? Number(publication.price) : 0);
            setCurrency(publication.currency || "ETB");

            if (publication.cover_image_id) {
                setCoverImageId(publication.cover_image_id);
            }
            if (publication.coverImage) {
                setCoverPreview(getImageUrl(publication.coverImage, "large"));
            }

            if (publication.categories) {
                setSelectedCategoryIds(publication.categories.map((c) => c.category_id));
            }

            if (publication.files && publication.files.length > 0) {
                const primary = publication.files.find(
                    (f) => f.file_role === "main_pdf" || f.mime_type === "application/pdf"
                );
                if (primary) {
                    setMainPdf({
                        publication_file_id: primary.publication_file_id,
                        file_name: primary.file_name,
                        file_path: primary.file_path,
                        file_size: primary.file_size || undefined,
                        mime_type: primary.mime_type,
                        file_role: "main_pdf",
                        title: primary.title || "Main Publication PDF",
                        is_public: primary.is_public,
                    });
                }

                const supps = publication.files.filter(
                    (f) => f.publication_file_id !== primary?.publication_file_id
                );
                setSupplementaryFiles(
                    supps.map((f) => ({
                        publication_file_id: f.publication_file_id,
                        file_name: f.file_name,
                        file_path: f.file_path,
                        file_size: f.file_size || undefined,
                        mime_type: f.mime_type,
                        file_role: f.file_role,
                        title: f.title || f.file_name,
                        is_public: f.is_public,
                    }))
                );
            }
        }
    }, [publication]);

    const toggleCategory = (categoryId: string) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Cover Image Upload Handler
    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const res = await uploadAttachment({ files: [file] }).unwrap();
            if (res.attachments && res.attachments.length > 0) {
                const uploaded = res.attachments[0];
                setCoverImageId(uploaded.attachment_id);
                setCoverPreview(URL.createObjectURL(file));
                notify.success("Cover image uploaded successfully.");
            }
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to upload cover image."));
        }
    };

    // Main PDF Upload Handler (safe replacement)
    const handleMainPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
            notify.error("Please upload a valid PDF document.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await uploadProtectedDoc(formData).unwrap();
            if (res.success && res.file) {
                setMainPdf({
                    file_name: res.file.file_name,
                    file_path: res.file.file_path,
                    file_size: res.file.file_size,
                    mime_type: res.file.mime_type,
                    file_role: "main_pdf",
                    title: "Main Publication Document",
                });
                notify.success("New primary PDF uploaded to protected storage.");
            }
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to upload protected PDF."));
        }
    };

    // Supplementary File Upload Handler
    const handleSupplementaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await uploadProtectedDoc(formData).unwrap();
            if (res.success && res.file) {
                const isMap = file.name.toLowerCase().includes("map");
                const newDoc: UploadedDoc = {
                    file_name: res.file.file_name,
                    file_path: res.file.file_path,
                    file_size: res.file.file_size,
                    mime_type: res.file.mime_type,
                    file_role: isMap ? "map_document" : "supplementary_pdf",
                    title: file.name.replace(/\.[^/.]+$/, ""),
                };
                setSupplementaryFiles((prev) => [...prev, newDoc]);
                notify.success(`Supplementary file "${file.name}" uploaded.`);
            }
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to upload supplementary document."));
        }
    };

    const removeSupplementaryFile = (index: number) => {
        setSupplementaryFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const updateSupplementaryRole = (index: number, role: FileRole) => {
        setSupplementaryFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, file_role: role } : f))
        );
    };

    const handleSave = async (publishStatus?: PublishStatus) => {
        if (!title.trim()) {
            notify.error("Publication title in English is required.");
            return;
        }
        if (!slug.trim()) {
            notify.error("A unique slug is required.");
            return;
        }

        // Prepare files payload
        const allFiles: Array<{
            file_role: string;
            title: string;
            file_name: string;
            file_path: string;
            file_size: number;
            mime_type: string;
            is_public: boolean;
        }> = [];
        if (mainPdf) {
            allFiles.push({
                file_role: "main_pdf",
                title: mainPdf.title || "Main Publication PDF",
                file_name: mainPdf.file_name,
                file_path: mainPdf.file_path,
                file_size: mainPdf.file_size,
                mime_type: mainPdf.mime_type,
                is_public: accessMode === "open_access",
            });
        }

        supplementaryFiles.forEach((supp) => {
            allFiles.push({
                file_role: supp.file_role,
                title: supp.title || supp.file_name,
                file_name: supp.file_name,
                file_path: supp.file_path,
                file_size: supp.file_size,
                mime_type: supp.mime_type,
                is_public: accessMode === "open_access",
            });
        });

        const payload = {
            title: title.trim(),
            title_am: titleAm.trim() || undefined,
            slug: slug.trim(),
            summary: summary.trim() || undefined,
            summary_am: summaryAm.trim() || undefined,
            description: description.trim() || undefined,
            description_am: descriptionAm.trim() || undefined,
            authors: authors.trim() || undefined,
            publication_date: publicationDate || undefined,
            document_type: documentType,
            language,
            reference_number: referenceNumber.trim() || undefined,
            page_count: pageCount !== "" ? Number(pageCount) : undefined,
            publish_status: publishStatus || publication?.publish_status || "draft",
            access_mode: accessMode,
            price: Number(price) || 0,
            currency,
            cover_image_id: coverImageId || undefined,
            category_ids: selectedCategoryIds,
            files: allFiles,
        };

        try {
            await updatePublication({ id, data: payload }).unwrap();
            notify.success("Publication updated successfully!");
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to update publication."));
        }
    };

    const handleDelete = async () => {
        try {
            await deletePublication(id).unwrap();
            notify.success("Publication deleted successfully.");
            router.push("/admin/publications");
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to delete publication."));
        }
    };

    const handleTogglePublish = async () => {
        try {
            await publishPublication(id).unwrap();
            notify.success(
                publication?.publish_status === "published"
                    ? "Publication unpublished (set to draft)."
                    : "Publication published successfully."
            );
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to update publication status."));
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <p className="text-sm font-medium">Loading publication...</p>
                </div>
            </div>
        );
    }

    if (isError || !publication) {
        return (
            <div className="p-8 max-w-xl mx-auto text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Publication Not Found</h2>
                <Button onClick={() => router.push("/admin/publications")} variant="outline">
                    Back to Publications List
                </Button>
            </div>
        );
    }

    const accessModeChanged = initialAccessMode !== accessMode;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/admin/publications")}
                        className="text-slate-600"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Publications
                    </Button>
                    <span className="text-slate-300">/</span>
                    <h2 className="text-lg font-bold text-slate-900 truncate max-w-md">
                        Edit: {publication.title}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={`/publications/${publication.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="gap-1 text-slate-700">
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Public Page
                        </Button>
                    </Link>

                    <ComponentGuard anyPermissions={["PUBLICATIONS:PUBLISH"]}>
                        <Button
                            variant={publication.publish_status === "published" ? "secondary" : "default"}
                            size="sm"
                            onClick={handleTogglePublish}
                            disabled={isPublishing}
                        >
                            {publication.publish_status === "published"
                                ? "Unpublish (Set Draft)"
                                : "Publish Live"}
                        </Button>
                    </ComponentGuard>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSave()}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>

                    <ComponentGuard anyPermissions={["PUBLICATIONS:DELETE"]}>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteConfirmOpen(true)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </ComponentGuard>
                </div>
            </div>

            {/* Access Mode Change Warning */}
            {accessModeChanged && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-amber-900 text-sm">
                            Access Policy Change Notice
                        </h4>
                        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                            You are changing access mode from <strong>{initialAccessMode.replace(/_/g, " ")}</strong> to <strong>{accessMode.replace(/_/g, " ")}</strong>.
                            This will immediately change document delivery security rules and reader availability for all public visitors.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Left Column (8 cols): Metadata & Content */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Primary Info Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider">
                            General Information
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Publication Title (English) *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="title-am">Title (Amharic)</Label>
                                <Input
                                    id="title-am"
                                    value={titleAm}
                                    onChange={(e) => setTitleAm(e.target.value)}
                                    className="mt-1 font-amharic"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="slug">Slug (Unique URL Identifier) *</Label>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        required
                                        className="mt-1 font-mono text-xs"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ref-num">Institutional Reference / ISBN</Label>
                                    <Input
                                        id="ref-num"
                                        value={referenceNumber}
                                        onChange={(e) => setReferenceNumber(e.target.value)}
                                        className="mt-1 font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="doc-type">Document Type *</Label>
                                    <Select
                                        value={documentType}
                                        onValueChange={(val: DocumentType) => setDocumentType(val)}
                                    >
                                        <SelectTrigger id="doc-type" className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="research_report">Research Report</SelectItem>
                                            <SelectItem value="mineral_map">Mineral Map</SelectItem>
                                            <SelectItem value="book_manual">Book & Manual</SelectItem>
                                            <SelectItem value="technical_publication">Technical Paper</SelectItem>
                                            <SelectItem value="geological_study">Geological Study</SelectItem>
                                            <SelectItem value="training_material">Training Material</SelectItem>
                                            <SelectItem value="policy_strategy">Policy Document</SelectItem>
                                            <SelectItem value="other">Other Publication</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="authors">Authors / Contributors</Label>
                                    <Input
                                        id="authors"
                                        value={authors}
                                        onChange={(e) => setAuthors(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="pub-date">Publication Date</Label>
                                    <Input
                                        id="pub-date"
                                        type="date"
                                        value={publicationDate}
                                        onChange={(e) => setPublicationDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger id="language" className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English (en)</SelectItem>
                                            <SelectItem value="am">Amharic (am)</SelectItem>
                                            <SelectItem value="en/am">Bilingual (en/am)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="pages">Page Count</Label>
                                    <Input
                                        id="pages"
                                        type="number"
                                        min="1"
                                        value={pageCount}
                                        onChange={(e) => setPageCount(e.target.value ? Number(e.target.value) : "")}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary & Abstract Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider">
                            Executive Summary & Abstract
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="summary">Executive Summary (English)</Label>
                                <Textarea
                                    id="summary"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="summary-am">Executive Summary (Amharic)</Label>
                                <Textarea
                                    id="summary-am"
                                    value={summaryAm}
                                    onChange={(e) => setSummaryAm(e.target.value)}
                                    rows={3}
                                    className="mt-1 font-amharic"
                                />
                            </div>

                            <div>
                                <Label className="block mb-1">Full Description / Abstract (English)</Label>
                                <div className="border border-slate-200 rounded-md overflow-hidden min-h-[160px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={setDescription}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="block mb-1">Full Description / Abstract (Amharic)</Label>
                                <div className="border border-slate-200 rounded-md overflow-hidden min-h-[160px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={descriptionAm}
                                        onChange={setDescriptionAm}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document Files Management Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Secure Document Files (Protected Storage)
                        </h3>

                        {/* Main PDF Document */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <Label className="font-semibold block">Primary PDF Document</Label>

                            {mainPdf ? (
                                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                                    <div className="flex items-center gap-2.5">
                                        <FileText className="w-5 h-5 text-primary shrink-0" />
                                        <div>
                                            <span className="font-semibold text-slate-800 text-xs block truncate max-w-sm">
                                                {mainPdf.file_name}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {mainPdf.file_size
                                                    ? `${(mainPdf.file_size / (1024 * 1024)).toFixed(2)} MB • `
                                                    : ""}
                                                Protected Storage
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleMainPdfUpload}
                                                disabled={isUploadingDoc}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <Button size="sm" variant="outline" className="h-7 text-xs">
                                                Replace PDF
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setMainPdf(null)}
                                            title="Remove PDF"
                                        >
                                            <Trash2 className="w-4 h-4 text-rose-600" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-5 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleMainPdfUpload}
                                        disabled={isUploadingDoc}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-xs font-semibold text-slate-700">
                                        {isUploadingDoc ? "Uploading to Protected Storage..." : "Upload Primary PDF Document"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Supplementary Documents & Maps */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="font-semibold block">Supplementary Files & Mineral Maps</Label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleSupplementaryUpload}
                                        disabled={isUploadingDoc}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                                        <Plus className="w-3.5 h-3.5" />
                                        Add File
                                    </Button>
                                </div>
                            </div>

                            {supplementaryFiles.length > 0 && (
                                <div className="space-y-2">
                                    {supplementaryFiles.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg gap-2 text-xs"
                                        >
                                            <div className="flex items-center gap-2">
                                                {file.file_role === "map_document" ? (
                                                    <MapIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                                                ) : (
                                                    <Paperclip className="w-4 h-4 text-slate-500 shrink-0" />
                                                )}
                                                <span className="font-medium text-slate-800 truncate max-w-xs">
                                                    {file.file_name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={file.file_role}
                                                    onValueChange={(val: FileRole) => updateSupplementaryRole(idx, val)}
                                                >
                                                    <SelectTrigger className="h-7 text-xs w-36">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="map_document">Map Document</SelectItem>
                                                        <SelectItem value="supplementary_pdf">Supplementary PDF</SelectItem>
                                                        <SelectItem value="other_attachment">Other File</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-rose-600"
                                                    onClick={() => removeSupplementaryFile(idx)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Column (4 cols): Categories, Access & Cover */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Access Mode Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-primary" />
                            Access Mode & Security
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="access-mode" className="text-xs font-semibold">Configured Mode</Label>
                                <Select
                                    value={accessMode}
                                    onValueChange={(val: AccessMode) => setAccessMode(val)}
                                >
                                    <SelectTrigger id="access-mode" className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open_access">Open Access (Read & Download)</SelectItem>
                                        <SelectItem value="online_only">Online Only (No Downloads)</SelectItem>
                                        <SelectItem value="enquiry_required">Enquiry Required (Access/Purchase)</SelectItem>
                                        <SelectItem value="restricted">Restricted (Internal Only)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-600">
                                {accessMode === "open_access" && (
                                    <span>Public visitors can read and download this publication without restriction.</span>
                                )}
                                {accessMode === "online_only" && (
                                    <span>Public visitors can read via the embedded reader. Direct download action is disabled.</span>
                                )}
                                {accessMode === "enquiry_required" && (
                                    <span className="text-amber-800">
                                        Document viewing and downloading will require an approved inquiry, verified payment, and a valid access grant token.
                                    </span>
                                )}
                                {accessMode === "restricted" && (
                                    <span className="text-rose-700">
                                        Restricted from public access entirely. Only authenticated institutional administrators may access document streams.
                                    </span>
                                )}
                            </div>

                            {accessMode === "enquiry_required" && (
                                <div className="space-y-3 pt-2 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="price" className="text-xs">Price</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={price}
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                className="mt-1 text-xs"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="currency" className="text-xs">Currency</Label>
                                            <Input
                                                id="currency"
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value)}
                                                className="mt-1 text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Categories Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider">
                            Categories
                        </h3>

                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {categories.map((cat) => (
                                <div
                                    key={cat.category_id}
                                    className="flex items-center space-x-2 text-xs"
                                >
                                    <Checkbox
                                        id={`cat-${cat.category_id}`}
                                        checked={selectedCategoryIds.includes(cat.category_id)}
                                        onCheckedChange={() => toggleCategory(cat.category_id)}
                                    />
                                    <Label
                                        htmlFor={`cat-${cat.category_id}`}
                                        className="text-xs font-medium cursor-pointer"
                                    >
                                        {cat.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cover Image Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 uppercase tracking-wider">
                            Cover Image
                        </h3>

                        {coverPreview ? (
                            <div className="space-y-2">
                                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-rose-600 gap-1 text-xs"
                                    onClick={() => {
                                        setCoverImageId(null);
                                        setCoverPreview(null);
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Remove Cover
                                </Button>
                            </div>
                        ) : (
                            <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                    disabled={isUploadingCover}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                                <span className="text-xs font-semibold text-slate-700">
                                    {isUploadingCover ? "Uploading Cover..." : "Upload Cover Image"}
                                </span>
                                <span className="text-[11px] text-slate-400">PNG, JPG, WebP</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Publication"
                description={`Are you sure you want to delete "${publication.title}"? This action will archive this publication record and revoke document access.`}
                confirmText={isDeleting ? "Deleting..." : "Delete Publication"}
                cancelText="Cancel"
                onConfirm={handleDelete}
                variant="destructive"
            />
        </div>
    );
}
