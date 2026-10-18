"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2, Edit, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { notify, extractErrorMessage } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

import { DataTable } from "@/features/template/component/DataTable";
import { TableLayout } from "@/features/template/component/TableLayout";
import type { FilterField, ActionButton } from "@/types/tableLayout";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

import {
    useGetPublicationCategoriesQuery,
    useDeletePublicationCategoryMutation,
    useCreatePublicationCategoryMutation,
    useUpdatePublicationCategoryMutation,
} from "@/redux/api/publicationApi";
import { PublicationCategory } from "@/redux/types/publication";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CategoryList() {
    const router = useRouter();
    const { data = [] } = useGetPublicationCategoriesQuery();
    const [deleteCategory] = useDeletePublicationCategoryMutation();
    const [createCategory, { isLoading: isCreating }] = useCreatePublicationCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdatePublicationCategoryMutation();

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: string;
        name: string;
    }>({ open: false, id: "", name: "" });

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    // Create Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: "",
        name_am: "",
        slug: "",
        description: "",
        description_am: "",
        display_order: 0,
        is_active: true,
    });

    // Edit Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "",
        name: "",
        name_am: "",
        slug: "",
        description: "",
        description_am: "",
        display_order: 0,
        is_active: true,
    });

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.name.trim()) {
            notify.error("Category name in English is required.");
            return;
        }

        const slug = createForm.slug.trim() || generateSlug(createForm.name);

        try {
            await createCategory({
                name: createForm.name.trim(),
                name_am: createForm.name_am.trim() || null,
                slug,
                description: createForm.description.trim() || null,
                description_am: createForm.description_am.trim() || null,
                display_order: Number(createForm.display_order) || 0,
                is_active: createForm.is_active,
            }).unwrap();

            notify.success("Publication category created successfully.");
            setIsCreateModalOpen(false);
            setCreateForm({
                name: "",
                name_am: "",
                slug: "",
                description: "",
                description_am: "",
                display_order: 0,
                is_active: true,
            });
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to create category."));
        }
    };

    const handleOpenEdit = (category: PublicationCategory) => {
        setEditForm({
            id: category.category_id,
            name: category.name || "",
            name_am: category.name_am || "",
            slug: category.slug || "",
            description: category.description || "",
            description_am: category.description_am || "",
            display_order: category.display_order || 0,
            is_active: category.is_active ?? true,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.name.trim()) {
            notify.error("Category name in English is required.");
            return;
        }

        try {
            await updateCategory({
                id: editForm.id,
                data: {
                    name: editForm.name.trim(),
                    name_am: editForm.name_am.trim() || null,
                    slug: editForm.slug.trim(),
                    description: editForm.description.trim() || null,
                    description_am: editForm.description_am.trim() || null,
                    display_order: Number(editForm.display_order) || 0,
                    is_active: editForm.is_active,
                },
            }).unwrap();

            notify.success("Publication category updated successfully.");
            setIsEditModalOpen(false);
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to update category."));
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            await deleteCategory(deleteConfirm.id).unwrap();
            notify.success("Category deleted successfully.");
            setDeleteConfirm({ open: false, id: "", name: "" });
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to delete category."));
        }
    };

    const filters: FilterField[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search category name or slug...",
            value: search,
            onChange: setSearch,
        },
    ];

    const filteredData = useMemo(() => {
        return data.filter((item: PublicationCategory) => {
            const matchesSearch =
                !search ||
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                (item.name_am && item.name_am.toLowerCase().includes(search.toLowerCase())) ||
                item.slug.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [data, search]);

    const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

    const columns: ColumnDef<PublicationCategory>[] = [
        {
            accessorKey: "name",
            header: "Category Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{row.original.name}</span>
                    {row.original.name_am && (
                        <span className="text-xs text-slate-500 font-amharic">
                            {row.original.name_am}
                        </span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {row.original.slug}
                </span>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <p className="text-xs text-slate-600 line-clamp-2 max-w-sm">
                    {row.original.description || "No description provided."}
                </p>
            ),
        },
        {
            accessorKey: "display_order",
            header: "Order",
            cell: ({ row }) => (
                <span className="text-xs font-semibold text-slate-700">
                    {row.original.display_order ?? 0}
                </span>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.original.is_active ?? true;
                return (
                    <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
                            isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                    >
                        {isActive ? (
                            <>
                                <CheckCircle2 className="w-3 h-3" />
                                Active
                            </>
                        ) : (
                            <>
                                <XCircle className="w-3 h-3" />
                                Inactive
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <ComponentGuard anyPermissions={["PUBLICATION_CATEGORIES:UPDATE"]}>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Category"
                            onClick={() => handleOpenEdit(row.original)}
                        >
                            <Edit className="h-4 w-4 text-primary" />
                        </Button>
                    </ComponentGuard>
                    <ComponentGuard anyPermissions={["PUBLICATION_CATEGORIES:DELETE"]}>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Category"
                            onClick={() => {
                                setDeleteConfirm({
                                    open: true,
                                    id: row.original.category_id,
                                    name: row.original.name,
                                });
                            }}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </ComponentGuard>
                </div>
            ),
        },
    ];

    const actions: ActionButton[] = [
        {
            label: "Add Category",
            icon: <Plus className="w-4 h-4" />,
            onClick: () => setIsCreateModalOpen(true),
            variant: "default",
            permissions: ["PUBLICATION_CATEGORIES:CREATE"],
        },
        {
            label: "Back to Publications",
            icon: <ArrowLeft className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications"),
            variant: "outline",
        },
    ];

    return (
        <TableLayout
            title="Publication Categories"
            description="Organize institutional research publications, maps, and reports into thematic classifications."
            filters={filters}
            actions={actions}
        >
            <DataTable
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                columns={columns as any}
                data={paginatedData}
                totalPageCount={Math.ceil(filteredData.length / pageSize) || 1}
                handlePagination={handlePagination}
                tablePageSize={pageSize}
                currentIndex={pageIndex}
            />

            {/* Create Category Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Publication Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateCategory} className="space-y-4 py-2">
                        <div>
                            <Label htmlFor="create-name">Name (English) *</Label>
                            <Input
                                id="create-name"
                                value={createForm.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setCreateForm((prev) => ({
                                        ...prev,
                                        name,
                                        slug: prev.slug === generateSlug(prev.name) || !prev.slug ? generateSlug(name) : prev.slug,
                                    }));
                                }}
                                placeholder="e.g. Geological Studies"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="create-name-am">Name (Amharic)</Label>
                            <Input
                                id="create-name-am"
                                value={createForm.name_am}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, name_am: e.target.value }))}
                                placeholder="ለምሳሌ፡ የጂኦሎጂ ጥናቶች"
                            />
                        </div>
                        <div>
                            <Label htmlFor="create-slug">Slug *</Label>
                            <Input
                                id="create-slug"
                                value={createForm.slug}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, slug: e.target.value }))}
                                placeholder="e.g. geological-studies"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="create-desc">Description (English)</Label>
                            <Textarea
                                id="create-desc"
                                value={createForm.description}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Short description of this category..."
                                rows={2}
                            />
                        </div>
                        <div>
                            <Label htmlFor="create-desc-am">Description (Amharic)</Label>
                            <Textarea
                                id="create-desc-am"
                                value={createForm.description_am}
                                onChange={(e) => setCreateForm((prev) => ({ ...prev, description_am: e.target.value }))}
                                placeholder="የዚህ ምድብ አጭር ማብራሪያ..."
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="create-order">Display Order</Label>
                                <Input
                                    id="create-order"
                                    type="number"
                                    value={createForm.display_order}
                                    onChange={(e) => setCreateForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? "Creating..." : "Save Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Publication Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCategory} className="space-y-4 py-2">
                        <div>
                            <Label htmlFor="edit-name">Name (English) *</Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-name-am">Name (Amharic)</Label>
                            <Input
                                id="edit-name-am"
                                value={editForm.name_am}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, name_am: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-slug">Slug *</Label>
                            <Input
                                id="edit-slug"
                                value={editForm.slug}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, slug: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-desc">Description (English)</Label>
                            <Textarea
                                id="edit-desc"
                                value={editForm.description}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                rows={2}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-desc-am">Description (Amharic)</Label>
                            <Textarea
                                id="edit-desc-am"
                                value={editForm.description_am}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, description_am: e.target.value }))}
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-order">Display Order</Label>
                                <Input
                                    id="edit-order"
                                    type="number"
                                    value={editForm.display_order}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? "Saving..." : "Update Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Delete Publication Category"
                description={`Are you sure you want to delete the category "${deleteConfirm.name}"? Publications associated with this category will remain, but the category association will be safely removed.`}
                confirmText="Delete Category"
                cancelText="Cancel"
                onConfirm={handleDelete}
                variant="destructive"
            />
        </TableLayout>
    );
}
