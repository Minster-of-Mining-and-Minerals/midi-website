"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { FilterField } from "@/types/tableLayout";
import { TableLayout } from "@/features/template/component/TableLayout";
import { DataTable } from "@/features/template/component/DataTable";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

import { useGetAuditLogsQuery, useDeleteAuditLogMutation } from "@/redux/api/auditLogApi";
import { notify } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

/* ----------------------------------
   COMPONENT
----------------------------------- */
export default function AuditLogList() {
    /* Pagination */
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    /* Filters */
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");

    const filters: FilterField[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search model name...",
            value: search,
            onChange: setSearch,
        },
        {
            key: "action",
            label: "Action Type",
            type: "select",
            options: [
                { value: "all", label: "All Actions" },
                { value: "CREATE", label: "CREATE" },
                { value: "UPDATE", label: "UPDATE" },
                { value: "DELETE", label: "DELETE" },
            ],
            value: actionFilter,
            onChange: setActionFilter,
        },
    ];

    /* API Call */
    const { data: logsData, isLoading } = useGetAuditLogsQuery({
        page: pageIndex + 1,
        limit: pageSize,
        search,
        action: actionFilter === "all" ? "" : actionFilter,
    });

    const logs = logsData?.data || [];
    const totalCount = logsData?.totalCount || 0;

    const [deleteAuditLog] = useDeleteAuditLogMutation();
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: string) => {
        setDeleteConfirm({ open: true, id });
    };

    /* ----------------------------------
       TABLE COLUMNS
    ----------------------------------- */
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "user.full_name",
            header: "User",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-primary">
                        {row.original.user?.full_name || "System"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {row.original.user?.email || ""}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {
                const action = row.getValue("action") as string;
                let colorClass = "bg-gray-100 text-gray-800";
                if (action === "CREATE") colorClass = "bg-green-100 text-green-800";
                if (action === "UPDATE") colorClass = "bg-blue-100 text-blue-800";
                if (action === "DELETE") colorClass = "bg-red-100 text-red-800";
                
                return (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                        {action}
                    </span>
                );
            },
        },
        {
            accessorKey: "model_name",
            header: "Resource",
            cell: ({ row }) => (
                <span className="font-medium text-muted-foreground">
                    {row.getValue("model_name")}
                </span>
            ),
        },
        {
            accessorKey: "record_id",
            header: "Record ID",
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground max-w-[120px] truncate block" title={row.getValue("record_id")}>
                    {row.getValue("record_id")}
                </span>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.getValue("created_at")).toLocaleString()}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const id = row.original.audit_id;
                return (
                    <div className="flex items-center gap-1">
                        <ComponentGuard anyPermissions={["AUDIT_LOGS:DELETE"]}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(id)}
                            >
                                <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                        </ComponentGuard>
                    </div>
                );
            },
        },
    ];

    return (
        <TableLayout
            title="System Audit Logs"
            description="View real-time traces of interactions and database modifications."
            actions={[]}
            filters={filters}
            filterColumnsPerRow={2}
        >
            <DataTable
                columns={columns}
                data={logs}
                totalPageCount={Math.ceil(totalCount / pageSize)}
                handlePagination={handlePagination}
                tablePageSize={pageSize}
                currentIndex={pageIndex}
            />

            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Delete Audit Log?"
                description="Are you sure you want to permanently delete this audit log record? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={async () => {
                    try {
                        setIsDeleting(true);
                        await deleteAuditLog(deleteConfirm.id).unwrap();
                        notify.success("Audit log record deleted successfully.");
                        setDeleteConfirm((prev) => ({ ...prev, open: false }));
                    } catch (err) {
                        notify.error("Failed to delete audit log record.", err);
                    } finally {
                        setIsDeleting(false);
                    }
                }}
            />
        </TableLayout>
    );
}
