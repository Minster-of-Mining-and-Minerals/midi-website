"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    Plus,
    Trash2,
    Edit,
    CheckCircle2,
    Eye,
    FileText,
    Map as MapIcon,
    Lock,
    ExternalLink,
    Tag,
    CreditCard,
    MessageSquare,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { DataTable } from "@/features/template/component/DataTable";
import { TableLayout } from "@/features/template/component/TableLayout";
import type { FilterField, ActionButton } from "@/types/tableLayout";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

import {
    useGetPublicationsQuery,
    useDeletePublicationMutation,
    usePublishPublicationMutation,
} from "@/redux/api/publicationApi";
import { Publication } from "@/redux/types/publication";
import { notify, extractErrorMessage } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { getImageUrl } from "@/utils/fileUrl";

export default function PublicationList() {
    const router = useRouter();

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [publishStatusFilter, setPublishStatusFilter] = useState("all");
    const [docTypeFilter, setDocTypeFilter] = useState("all");
    const [accessModeFilter, setAccessModeFilter] = useState("all");

    const {
        data: publicationData,
    } = useGetPublicationsQuery({
        page: pageIndex + 1,
        limit: pageSize,
        search: search.trim() || undefined,
        publish_status: publishStatusFilter !== "all" ? publishStatusFilter : undefined,
        document_type: docTypeFilter !== "all" ? docTypeFilter : undefined,
        access_mode: accessModeFilter !== "all" ? accessModeFilter : undefined,
    });

    const [deletePublication, { isLoading: isDeleting }] = useDeletePublicationMutation();
    const [publishPublication] = usePublishPublicationMutation();

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: string;
        title: string;
    }>({ open: false, id: "", title: "" });

    const publications = publicationData?.data || [];
    const meta = publicationData?.meta;
    const totalCount = meta?.total || publications.length;

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            await deletePublication(deleteConfirm.id).unwrap();
            notify.success("Publication deleted successfully.");
            setDeleteConfirm({ open: false, id: "", title: "" });
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to delete publication."));
        }
    };

    const handleTogglePublish = async (publication: Publication) => {
        try {
            await publishPublication(publication.publication_id).unwrap();
            notify.success(
                publication.publish_status === "published"
                    ? "Publication unpublished (set to draft)."
                    : "Publication published successfully."
            );
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to update publication status."));
        }
    };

    const filters: FilterField[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search by title, author, ref...",
            value: search,
            onChange: (val) => {
                setSearch(val);
                setPageIndex(0);
            },
        },
        {
            key: "publish_status",
            label: "Status",
            type: "select",
            placeholder: "All Statuses",
            value: publishStatusFilter,
            onChange: (val) => {
                setPublishStatusFilter(val);
                setPageIndex(0);
            },
            options: [
                { label: "All Statuses", value: "all" },
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
                { label: "Pending Review", value: "pending_review" },
                { label: "Archived", value: "archived" },
            ],
        },
        {
            key: "document_type",
            label: "Document Type",
            type: "select",
            placeholder: "All Document Types",
            value: docTypeFilter,
            onChange: (val) => {
                setDocTypeFilter(val);
                setPageIndex(0);
            },
            options: [
                { label: "All Document Types", value: "all" },
                { label: "Research Report", value: "research_report" },
                { label: "Mineral Map", value: "mineral_map" },
                { label: "Book & Manual", value: "book_manual" },
                { label: "Technical Publication", value: "technical_publication" },
                { label: "Geological Study", value: "geological_study" },
                { label: "Training Material", value: "training_material" },
                { label: "Policy & Strategy", value: "policy_strategy" },
                { label: "Other", value: "other" },
            ],
        },
        {
            key: "access_mode",
            label: "Access Mode",
            type: "select",
            placeholder: "All Access Modes",
            value: accessModeFilter,
            onChange: (val) => {
                setAccessModeFilter(val);
                setPageIndex(0);
            },
            options: [
                { label: "All Access Modes", value: "all" },
                { label: "Open Access", value: "open_access" },
                { label: "Online Only", value: "online_only" },
                { label: "Enquiry Required", value: "enquiry_required" },
                { label: "Restricted", value: "restricted" },
            ],
        },
    ];

    const columns: ColumnDef<Publication>[] = [
        {
            id: "cover",
            header: "Cover",
            cell: ({ row }) => {
                const cover = row.original.coverImage;
                const coverUrl = cover ? getImageUrl(cover, "thumb") : null;
                const docType = row.original.document_type;

                return (
                    <div className="w-12 h-14 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 relative">
                        {coverUrl ? (
                            <Image
                                src={coverUrl}
                                alt={row.original.title}
                                fill
                                className="object-cover"
                            />
                        ) : docType === "mineral_map" ? (
                            <MapIcon className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <FileText className="w-5 h-5 text-slate-400" />
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "title",
            header: "Publication Title",
            cell: ({ row }) => {
                const pub = row.original;
                return (
                    <div className="flex flex-col max-w-sm md:max-w-md">
                        <Link
                            href={`/admin/publications/${pub.publication_id}`}
                            className="font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1"
                            title={pub.title}
                        >
                            {pub.title}
                        </Link>
                        {pub.title_am && (
                            <span className="text-xs text-slate-500 line-clamp-1 font-amharic">
                                {pub.title_am}
                            </span>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            {pub.reference_number && (
                                <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                    Ref: {pub.reference_number}
                                </span>
                            )}
                            {pub.authors && <span className="truncate max-w-[180px]">By {pub.authors}</span>}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "categories",
            header: "Categories",
            cell: ({ row }) => {
                const categories = row.original.categories || [];
                if (categories.length === 0) {
                    return <span className="text-xs text-slate-400">Uncategorized</span>;
                }
                return (
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {categories.slice(0, 2).map((cat) => (
                            <span
                                key={cat.category_id}
                                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                                {cat.name}
                            </span>
                        ))}
                        {categories.length > 2 && (
                            <span className="text-[10px] text-slate-500 font-medium">
                                +{categories.length - 2} more
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "document_type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("document_type") as string;
                return (
                    <span className="text-xs font-semibold capitalize px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap">
                        {type ? type.replace(/_/g, " ") : "Research"}
                    </span>
                );
            },
        },
        {
            accessorKey: "publish_status",
            header: "Publish Status",
            cell: ({ row }) => {
                const pub = row.original;
                const status = (pub.publish_status || "draft").toLowerCase();

                let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
                if (status === "published") {
                    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
                } else if (status === "draft") {
                    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
                } else if (status === "pending_review") {
                    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
                } else if (status === "archived") {
                    badgeStyle = "bg-slate-100 text-slate-500 border-slate-300";
                }

                return (
                    <ComponentGuard anyPermissions={["PUBLICATIONS:PUBLISH"]}>
                        <button
                            onClick={() => handleTogglePublish(pub)}
                            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-xs font-semibold capitalize cursor-pointer hover:opacity-80 transition-opacity ${badgeStyle}`}
                            title="Click to toggle published / draft"
                        >
                            {status === "published" && <CheckCircle2 className="h-3.5 w-3.5" />}
                            <span>{status.replace(/_/g, " ")}</span>
                        </button>
                    </ComponentGuard>
                );
            },
        },
        {
            accessorKey: "access_mode",
            header: "Access Mode",
            cell: ({ row }) => {
                const mode = row.original.access_mode;
                const price = row.original.price;
                const currency = row.original.currency || "ETB";

                let modeBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                let label = "Open Access";

                if (mode === "online_only") {
                    modeBadge = "bg-blue-50 text-blue-700 border-blue-200";
                    label = "Online Only";
                } else if (mode === "enquiry_required") {
                    modeBadge = "bg-amber-50 text-amber-700 border-amber-200";
                    label = price && Number(price) > 0 ? `${price} ${currency}` : "Enquiry Req.";
                } else if (mode === "restricted") {
                    modeBadge = "bg-rose-50 text-rose-700 border-rose-200";
                    label = "Restricted";
                }

                return (
                    <div className="flex flex-col">
                        <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold border px-2 py-0.5 rounded-md ${modeBadge}`}
                        >
                            {(mode === "enquiry_required" || mode === "restricted") && (
                                <Lock className="w-3 h-3 inline" />
                            )}
                            {label}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "metrics",
            header: "Engagement",
            cell: ({ row }) => {
                const pub = row.original;
                return (
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {pub.views_count || 0}
                        </span>
                        <span className="flex items-center gap-1" title="Downloads">
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            {pub.downloads_count || 0}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const pub = row.original;
                return (
                    <div className="flex items-center gap-1">
                        <Link
                            href={`/publications/${pub.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="ghost" size="icon" title="View Public Page">
                                <ExternalLink className="h-4 w-4 text-slate-500 hover:text-slate-800" />
                            </Button>
                        </Link>

                        <ComponentGuard anyPermissions={["PUBLICATIONS:UPDATE"]}>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Edit Publication"
                                onClick={() => router.push(`/admin/publications/${pub.publication_id}`)}
                            >
                                <Edit className="h-4 w-4 text-primary" />
                            </Button>
                        </ComponentGuard>

                        <ComponentGuard anyPermissions={["PUBLICATIONS:DELETE"]}>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Delete Publication"
                                onClick={() => {
                                    setDeleteConfirm({
                                        open: true,
                                        id: pub.publication_id,
                                        title: pub.title,
                                    });
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </ComponentGuard>
                    </div>
                );
            },
        },
    ];

    const actions: ActionButton[] = [
        {
            label: "Add Publication",
            icon: <Plus className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications/create"),
            variant: "default",
            permissions: ["PUBLICATIONS:CREATE"],
        },
        {
            label: "Categories",
            icon: <Tag className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications/categories"),
            variant: "outline",
            permissions: ["PUBLICATION_CATEGORIES:READ"],
        },
        {
            label: "Inquiries",
            icon: <MessageSquare className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications/inquiries"),
            variant: "outline",
            permissions: ["PUBLICATION_INQUIRIES:READ"],
        },
        {
            label: "Payment Review",
            icon: <CreditCard className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications/payments"),
            variant: "outline",
            permissions: ["PUBLICATION_PAYMENTS:READ"],
        },
    ];

    return (
        <TableLayout
            title="Institutional Publications & Research"
            description="Manage MIDI research reports, mineral maps, technical documents, manuals, and institutional publications."
            filters={filters}
            actions={actions}
        >
            <DataTable
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                columns={columns as any}
                data={publications}
                totalPageCount={Math.ceil(totalCount / pageSize) || 1}
                handlePagination={handlePagination}
                tablePageSize={pageSize}
                currentIndex={pageIndex}
            />

            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Delete Publication"
                description={`Are you sure you want to delete "${deleteConfirm.title}"? This action will archive this publication record and remove public access.`}
                confirmText={isDeleting ? "Deleting..." : "Delete Publication"}
                cancelText="Cancel"
                onConfirm={handleDelete}
                variant="destructive"
            />
        </TableLayout>
    );
}
