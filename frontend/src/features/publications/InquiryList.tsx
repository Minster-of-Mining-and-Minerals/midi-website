"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    Trash2,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
    CreditCard,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { DataTable } from "@/features/template/component/DataTable";
import { TableLayout } from "@/features/template/component/TableLayout";
import type { FilterField, ActionButton } from "@/types/tableLayout";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

import {
    useGetPublicationInquiriesQuery,
    useDeletePublicationInquiryMutation,
} from "@/redux/api/publicationApi";
import { PublicationInquiry, InquiryStatus, InquiryType } from "@/redux/types/publication";
import { notify, extractErrorMessage } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function InquiryList() {
    const router = useRouter();

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const {
        data: inquiryData,
    } = useGetPublicationInquiriesQuery({
        page: pageIndex + 1,
        limit: pageSize,
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        inquiry_type: typeFilter !== "all" ? typeFilter : undefined,
    });

    const [deleteInquiry, { isLoading: isDeleting }] = useDeletePublicationInquiryMutation();

    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean;
        id: string;
        ref: string;
    }>({ open: false, id: "", ref: "" });

    const inquiries = inquiryData?.data || [];
    const meta = inquiryData?.meta;
    const totalCount = meta?.total || inquiries.length;

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            await deleteInquiry(deleteConfirm.id).unwrap();
            notify.success("Inquiry deleted successfully.");
            setDeleteConfirm({ open: false, id: "", ref: "" });
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to delete inquiry."));
        }
    };

    const getStatusBadge = (status: InquiryStatus) => {
        switch (status) {
            case "approved":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved
                    </span>
                );
            case "under_review":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3.5 h-3.5" />
                        Under Review
                    </span>
                );
            case "payment_pending":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <CreditCard className="w-3.5 h-3.5" />
                        Payment Pending
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected
                    </span>
                );
            case "closed":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Closed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                    </span>
                );
        }
    };

    const getTypeBadge = (type: InquiryType) => {
        switch (type) {
            case "document_request":
                return <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Document Request</span>;
            case "access_request":
                return <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Access Request</span>;
            case "paid_publication_request":
                return <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Paid Publication</span>;
            default:
                return <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">General Inquiry</span>;
        }
    };

    const filters: FilterField[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search requester, ref, email...",
            value: search,
            onChange: (val) => {
                setSearch(val);
                setPageIndex(0);
            },
        },
        {
            key: "status",
            label: "Status",
            type: "select",
            placeholder: "All Statuses",
            value: statusFilter,
            onChange: (val) => {
                setStatusFilter(val);
                setPageIndex(0);
            },
            options: [
                { label: "All Statuses", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Under Review", value: "under_review" },
                { label: "Payment Pending", value: "payment_pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
                { label: "Closed", value: "closed" },
            ],
        },
        {
            key: "inquiry_type",
            label: "Request Type",
            type: "select",
            placeholder: "All Types",
            value: typeFilter,
            onChange: (val) => {
                setTypeFilter(val);
                setPageIndex(0);
            },
            options: [
                { label: "All Types", value: "all" },
                { label: "General Inquiry", value: "general_inquiry" },
                { label: "Document Request", value: "document_request" },
                { label: "Access Request", value: "access_request" },
                { label: "Paid Publication", value: "paid_publication_request" },
            ],
        },
    ];

    const columns: ColumnDef<PublicationInquiry>[] = [
        {
            accessorKey: "reference_code",
            header: "Ref Code",
            cell: ({ row }) => (
                <Link
                    href={`/admin/publications/inquiries/${row.original.inquiry_id}`}
                    className="font-mono font-bold text-xs text-primary hover:underline bg-slate-50 px-2 py-1 rounded border border-slate-200"
                >
                    {row.original.reference_code}
                </Link>
            ),
        },
        {
            accessorKey: "name",
            header: "Requester",
            cell: ({ row }) => {
                const inq = row.original;
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">{inq.name}</span>
                        <span className="text-xs text-slate-500">{inq.email}</span>
                        {inq.company && (
                            <span className="text-[11px] text-muted-foreground font-medium">{inq.company}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "publication.title",
            header: "Target Publication",
            cell: ({ row }) => {
                const pub = row.original.publication;
                if (!pub) return <span className="text-xs text-muted-foreground">N/A</span>;
                return (
                    <div className="flex flex-col max-w-xs">
                        <span className="font-medium text-slate-800 text-xs line-clamp-1" title={pub.title}>
                            {pub.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                            {pub.document_type?.replace(/_/g, " ")} • {pub.access_mode?.replace(/_/g, " ")}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "inquiry_type",
            header: "Type",
            cell: ({ row }) => getTypeBadge(row.original.inquiry_type),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            accessorKey: "created_at",
            header: "Submitted",
            cell: ({ row }) => {
                const date = row.original.created_at;
                if (!date) return <span className="text-xs text-muted-foreground">N/A</span>;
                return (
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Review Inquiry"
                        onClick={() => router.push(`/admin/publications/inquiries/${row.original.inquiry_id}`)}
                    >
                        <Eye className="h-4 w-4 text-primary" />
                    </Button>

                    <ComponentGuard anyPermissions={["PUBLICATION_INQUIRIES:DELETE"]}>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Inquiry"
                            onClick={() => {
                                setDeleteConfirm({
                                    open: true,
                                    id: row.original.inquiry_id,
                                    ref: row.original.reference_code,
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
            label: "Payment Review Queue",
            icon: <CreditCard className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications/payments"),
            variant: "default",
            permissions: ["PUBLICATION_PAYMENTS:READ"],
        },
        {
            label: "All Publications",
            icon: <ArrowLeft className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications"),
            variant: "outline",
        },
    ];

    return (
        <TableLayout
            title="Publication Inquiries & Requests"
            description="Review incoming document requests, purchase inquiries, and access authorization workflows."
            filters={filters}
            actions={actions}
        >
            <DataTable
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                columns={columns as any}
                data={inquiries}
                totalPageCount={Math.ceil(totalCount / pageSize) || 1}
                handlePagination={handlePagination}
                tablePageSize={pageSize}
                currentIndex={pageIndex}
            />

            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Delete Inquiry Record"
                description={`Are you sure you want to delete inquiry "${deleteConfirm.ref}"? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Delete Inquiry"}
                cancelText="Cancel"
                onConfirm={handleDelete}
                variant="destructive"
            />
        </TableLayout>
    );
}
