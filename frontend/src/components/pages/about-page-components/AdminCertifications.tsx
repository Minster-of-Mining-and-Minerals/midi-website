"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { ImageUploadField, UploadedFileInfo } from "@/components/common/ImageUploadField";
import { notify } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import {
    useGetCertificationsQuery,
    useCreateCertificationMutation,
    useUpdateCertificationMutation,
    useDeleteCertificationMutation,
} from "@/redux/api/certificationApi";
import {
    useGetPageHeaderByIdentifierQuery,
    useUpdatePageHeaderMutation,
} from "@/redux/api/pageHeaderApi";
import { Certification } from "@/redux/types/certification";
import { getImageUrl } from "@/utils/fileUrl";
import { Loader2 } from "lucide-react";

export default function AdminCertifications() {
    const { data: response, isLoading } = useGetCertificationsQuery();
    const certifications = response?.data || [];

    const [createCertification, { isLoading: isCreating }] = useCreateCertificationMutation();
    const [updateCertification, { isLoading: isUpdating }] = useUpdateCertificationMutation();
    const [deleteCertification, { isLoading: isDeleting }] = useDeleteCertificationMutation();
    const isSaving = isCreating || isUpdating;

    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; title: string }>({
        open: false,
        id: "",
        title: "",
    });

    // Section Header State
    const { data: headerData, isLoading: isHeaderLoading } = useGetPageHeaderByIdentifierQuery("about-certifications");
    const [updatePageHeader, { isLoading: isUpdatingHeader }] = useUpdatePageHeaderMutation();
    
    const [headerTitle, setHeaderTitle] = useState("");
    const [headerSubtitle, setHeaderSubtitle] = useState("");
    const [headerDescription, setHeaderDescription] = useState("");

    useEffect(() => {
        if (headerData) {
            setHeaderTitle(headerData.title || "Company Certifications");
            setHeaderSubtitle(headerData.icon && headerData.icon !== "Award" ? headerData.icon : "Certifications");
            setHeaderDescription(headerData.description || "");
        } else if (!isHeaderLoading) {
            // Default content as requested
            setHeaderTitle("Company Certifications");
            setHeaderSubtitle("Certifications");
            setHeaderDescription("Our company operates under strict international guidelines to meet your project's needs, ensuring quality from collaboration meetings all the way to project completion. We believe that maintaining top-tier certifications is vital to delivering excellence.");
        }
    }, [headerData, isHeaderLoading]);

    const handleSaveHeader = async () => {
        try {
            await updatePageHeader({
                identifier: "about-certifications",
                body: { title: headerTitle, description: headerDescription, icon: headerSubtitle },
            }).unwrap();
            notify.success("Certifications section title saved.");
        } catch (error) {
            console.error(error);
            notify.error("Failed to save the certifications section title.", error);
        }
    };

    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<Partial<Certification> | null>(null);

    const handleCreateNew = () => {
        setEditingId("new");
        setDraft({
            title: "",
            description: "",
            order: certifications.length,
            is_active: true,
        });
    };

    const handleEdit = (cert: Certification) => {
        setEditingId(cert.certification_id);
        setDraft({ ...cert });
    };

    const handleCancel = () => {
        setEditingId(null);
        setDraft(null);
    };

    const handleSave = async () => {
        if (!draft?.title?.trim()) {
            notify.warning("Certification title is required.");
            return;
        }

        try {
            const payload = {
                title: draft.title,
                description: draft.description || "",
                title_am: draft.title_am?.trim() || "",
                description_am: draft.description_am?.trim() || "",
                order: draft.order || 0,
                is_active: draft.is_active !== undefined ? draft.is_active : true,
                attachments: draft.attachments,
            };

            if (editingId === "new") {
                await createCertification(payload).unwrap();
                notify.success(`"${draft.title}" saved.`);
            } else if (editingId) {
                await updateCertification({ certification_id: editingId, ...payload }).unwrap();
                notify.success(`"${draft.title}" saved.`);
            }
            handleCancel();
        } catch (error) {
            console.error(error);
            notify.error("Failed to save certification.", error);
        }
    };

    // Move a certification up/down; positions are renumbered 0..n-1 and only changed rows are saved
    const [isReordering, setIsReordering] = useState(false);
    const moveCertification = async (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= certifications.length) return;
        const reordered = [...certifications];
        [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

        setIsReordering(true);
        try {
            await Promise.all(
                reordered
                    .map((cert, position) => ({ cert, position }))
                    .filter(({ cert, position }) => cert.order !== position)
                    .map(({ cert, position }) =>
                        updateCertification({
                            certification_id: cert.certification_id,
                            title: cert.title,
                            description: cert.description || "",
                            order: position,
                            is_active: cert.is_active !== undefined ? cert.is_active : true,
                        }).unwrap()
                    )
            );
            notify.success("Order saved.");
        } catch (error) {
            notify.error("Failed to save the new order.", error);
        } finally {
            setIsReordering(false);
        }
    };

    const handleDelete = (cert: Certification) => {
        setDeleteConfirm({
            open: true,
            id: cert.certification_id,
            title: cert.title || "this certification",
        });
    };

    const handleImageChange = (ids: string[], files?: UploadedFileInfo[]) => {
        const fileInfo = files?.[0];
        setDraft((prev) => ({
            ...prev,
            attachments: fileInfo?.attachment_id ? [{ attachment_id: fileInfo.attachment_id }] as any : [],
        }));
    };

    if (isLoading) {
        return <div className="py-12 flex justify-center animate-pulse text-muted">Loading certifications...</div>;
    }

    return (
        <div className="space-y-6 py-6">
            <div className="flex justify-between items-center bg-card px-6 py-4 rounded-md shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-primary">Manage Certifications</h2>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove company certifications displayed on the About page.</p>
                </div>
                {!editingId && (
                    <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                        <Button onClick={handleCreateNew} className="bg-primary text-white hover:bg-primary/80">
                            <Plus className="w-4 h-4 mr-2" /> Add Certification
                        </Button>
                    </ComponentGuard>
                )}
            </div>

            {/* Section Header Form */}
            {!editingId && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold text-primary">Section Header Content</CardTitle>
                            {/* Saves a page_headers row, so it needs the page headers permission */}
                            <ComponentGuard anyPermissions={["PAGE_HEADERS:UPDATE"]}>
                                <Button
                                    onClick={handleSaveHeader}
                                    disabled={isUpdatingHeader}
                                    className="bg-golden-dark hover:bg-golden-darkHover text-white"
                                >
                                    {isUpdatingHeader ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Header
                                </Button>
                            </ComponentGuard>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Small label above the title (shown in gold)</Label>
                            <Input
                                value={headerSubtitle}
                                onChange={(e) => setHeaderSubtitle(e.target.value)}
                                placeholder="e.g. Certifications"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Main Title <span className="font-normal text-muted-foreground">(first half of the words dark, second half gold)</span></Label>
                            <Input
                                value={headerTitle}
                                onChange={(e) => setHeaderTitle(e.target.value)}
                                placeholder="e.g. Company Certifications"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={headerDescription}
                                onChange={(e) => setHeaderDescription(e.target.value)}
                                placeholder="Enter the subtitle and description text..."
                                className="min-h-[120px]"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Editor Form */}
            {editingId && draft && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-primary">{editingId === "new" ? "New Certification" : "Edit Certification"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card px-6 py-4 rounded-md shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={draft.title || ""}
                                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                                        placeholder="e.g. ISO 9001: Quality"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title (Amharic)</Label>
                                    <Input
                                        lang="am"
                                        value={draft.title_am || ""}
                                        onChange={(e) => setDraft({ ...draft, title_am: e.target.value })}
                                        placeholder="Leave empty to show the English title on the Amharic page"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Position <span className="font-normal text-muted-foreground">(lower numbers show first)</span></Label>
                                    <Input
                                        type="number"
                                        value={draft.order || 0}
                                        onChange={(e) => setDraft({ ...draft, order: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Icon / Logo Image</Label>
                                <ImageUploadField
                                    id="certification-image"
                                    label="Upload Logo"
                                    value={
                                        draft.attachments && draft.attachments.length > 0
                                            ? [draft.attachments[0].attachment_id]
                                            : []
                                    }
                                    onChange={handleImageChange}
                                    category="profile" // Generic upload category
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={draft.description || ""}
                                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                                placeholder="Enter a brief description..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description (Amharic)</Label>
                            <Textarea
                                lang="am"
                                value={draft.description_am || ""}
                                onChange={(e) => setDraft({ ...draft, description_am: e.target.value })}
                                placeholder="Leave empty to show the English description on the Amharic page"
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-golden-dark hover:bg-golden-darkHover text-white"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </ComponentGuard>
                    </CardFooter>
                </Card>
            )}

            {/* List View */}
            {!editingId && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                            No certifications found. Click "Add Certification" to create one.
                        </div>
                    ) : (
                        certifications.map((cert, index) => (
                            <Card key={cert.certification_id} className="relative group overflow-hidden">
                                <CardHeader className="pb-3 border-b border-gray-100 flex flex-row justify-between items-start space-y-0">
                                    <div>
                                        <CardTitle className="text-lg font-bold">{cert.title}</CardTitle>
                                        <CardDescription className="text-xs mt-1">Position {index + 1}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label="Move up"
                                                title="Move up"
                                                disabled={index === 0 || isReordering}
                                                onClick={() => moveCertification(index, -1)}
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label="Move down"
                                                title="Move down"
                                                disabled={index === certifications.length - 1 || isReordering}
                                                onClick={() => moveCertification(index, 1)}
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                                                Edit
                                            </Button>
                                        </ComponentGuard>
                                        <ComponentGuard anyPermissions={["ABOUT:DELETE"]}>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                title="Delete Certification"
                                                aria-label="Delete Certification"
                                                disabled={isDeleting}
                                                onClick={() => handleDelete(cert)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentGuard>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 flex flex-col items-center">
                                    {cert.attachments && cert.attachments.length > 0 && cert.attachments[0].attachment ? (
                                        <img
                                            src={getImageUrl(cert.attachments[0].attachment, "medium")}
                                            alt={cert.title}
                                            className="w-16 h-16 object-contain mb-4 rounded-md border p-1 bg-slate-50"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-400 mb-4">
                                            No Image
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-600 text-center line-clamp-3">
                                        {cert.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Delete Certification?"
                description={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={async () => {
                    try {
                        await deleteCertification(deleteConfirm.id).unwrap();
                        notify.success("Certification deleted.");
                        setDeleteConfirm((prev) => ({ ...prev, open: false }));
                    } catch (error) {
                        console.error(error);
                        notify.error("Failed to delete certification.", error);
                    }
                }}
            />
        </div>
    );
}
