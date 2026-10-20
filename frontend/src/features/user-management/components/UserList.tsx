"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, CheckCircle2, XCircle, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    useGetUsersQuery,
    useToggleUserStatusMutation,
    useResetUserPasswordMutation,
    useDeleteUserMutation
} from "@/redux/api/userApi";
import { User } from "@/redux/types/user";
import { DataTable } from "@/features/template/component/DataTable";
import { TableLayout } from "@/features/template/component/TableLayout";
import { notify } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { FilterField, ActionButton } from "@/types/tableLayout";
import { Badge } from "@/components/ui/badge";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

/* ----------------------------------
   COMPONENT
----------------------------------- */
export default function UserList() {
    const router = useRouter();

    /* API */
    const { data: users = [], isLoading } = useGetUsersQuery();
    const [toggleStatus] = useToggleUserStatusMutation();
    const [resetPassword] = useResetUserPasswordMutation();
    const [deleteUser] = useDeleteUserMutation();

    const [isActionLoading, setIsActionLoading] = useState(false);
    const [confirmState, setConfirmState] = useState<{
        open: boolean;
        title: string;
        description: string;
        confirmLabel: string;
        variant: "danger" | "warning";
        onConfirm: () => Promise<void>;
    }>({
        open: false,
        title: "",
        description: "",
        confirmLabel: "Confirm",
        variant: "danger",
        onConfirm: async () => { },
    });

    const handleToggleStatus = async (user: User) => {
        try {
            await toggleStatus({
                id: user.user_id,
                data: { is_active: !user.is_active }
            }).unwrap();
            notify.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully.`);
        } catch (error) {
            notify.error("Failed to update user status.", error);
        }
    };

    const handleResetPassword = (id: string) => {
        setConfirmState({
            open: true,
            title: "Reset User Password?",
            description: "Are you sure you want to reset this user's password? A temporary password will be generated and emailed to them.",
            confirmLabel: "Reset Password",
            variant: "warning",
            onConfirm: async () => {
                try {
                    setIsActionLoading(true);
                    await resetPassword(id).unwrap();
                    notify.success("Password reset successfully. Email sent to user.");
                    setConfirmState(prev => ({ ...prev, open: false }));
                } catch (error) {
                    notify.error("Failed to reset password.", error);
                } finally {
                    setIsActionLoading(false);
                }
            },
        });
    };

    const handleDelete = (id: string) => {
        setConfirmState({
            open: true,
            title: "Deactivate User?",
            description: "Are you sure you want to deactivate (soft delete) this user? They will no longer be able to log in.",
            confirmLabel: "Deactivate",
            variant: "danger",
            onConfirm: async () => {
                try {
                    setIsActionLoading(true);
                    await deleteUser(id).unwrap();
                    notify.success("User deactivated successfully.");
                    setConfirmState(prev => ({ ...prev, open: false }));
                } catch (error) {
                    notify.error("Failed to deactivate user.", error);
                } finally {
                    setIsActionLoading(false);
                }
            },
        });
    };

    /* View mode */
    const [viewMode, setViewMode] = useState<"table" | "card">("table");

    /* Pagination */
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    /* Filters */
    const [search, setSearch] = useState("");

    const filters: FilterField[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search by name or email...",
            value: search,
            onChange: setSearch,
        },
    ];

    /* ----------------------------------
       DATA FILTERING
    ----------------------------------- */
    const filteredData = useMemo(() => {
        return users.filter((user: User) => {
            const matchesSearch =
                !search ||
                user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email?.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [users, search]);

    /* Pagination slice */
    const paginatedData = filteredData.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
    );

    /* ----------------------------------
       TABLE COLUMNS
    ----------------------------------- */
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "full_name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-primary">{row.getValue("full_name")}</span>
                    <span className="text-xs text-muted-foreground">{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "userType",
            header: "Type",
            cell: ({ row }) => (
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                    {(row.original as any).userType?.name || "Standard"}
                </span>
            ),
        },
        {
            id: "roles",
            header: "Roles",
            cell: ({ row }) => {
                const roles = row.original.roles || [];
                return (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <Badge key={role.role_id} variant="secondary" className="text-[10px] px-1 h-5 bg-primary/10 text-primary border-none">
                                    {role.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground italic">No roles</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") as boolean;
                const user = row.original;
                return (
                    <ComponentGuard anyPermissions={['USERS:UPDATE']}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-1.5 h-8 px-2 rounded-full ${isActive
                                ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                : "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
                                }`}
                            onClick={() => handleToggleStatus(user)}
                        >
                            {isActive ? (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">Active</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">Disabled</span>
                                </>
                            )}
                        </Button>
                    </ComponentGuard>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const id = row.original.user_id;
                return (
                    <div className="flex items-center gap-1">
                        <ComponentGuard anyPermissions={['USERS:UPDATE']}>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Edit User"
                                onClick={() => router.push(`/admin/users/edit/${id}`)}
                            >
                                <Edit className="h-4 w-4 text-primary" />
                            </Button>
                        </ComponentGuard>
                        <ComponentGuard anyPermissions={['USERS:UPDATE']}>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Reset Password"
                                onClick={() => handleResetPassword(id)}
                            >
                                <Key className="h-4 w-4 text-amber-500" />
                            </Button>
                        </ComponentGuard>
                        <ComponentGuard anyPermissions={["USERS:DELETE"]}>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Deactivate"
                                onClick={() => handleDelete(id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </ComponentGuard>
                    </div>
                );
            },
        },
    ];

    /* ----------------------------------
       TOP ACTIONS
    ----------------------------------- */
    const actions: ActionButton[] = [
        {
            label: "Add New User",
            icon: <Plus className="h-4 w-4" />,
            variant: "default",
            onClick: () => router.push(`/admin/users/create`),
            permissions: ["USERS:CREATE"],
        },
    ];

    /* ----------------------------------
       RENDER
    ----------------------------------- */
    return (
        <TableLayout
            title="User Management"
            description="Manage system users, adjust roles, and control access permissions."
            actions={actions}
            filters={filters}
            filterColumnsPerRow={1}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
        >
            <DataTable
                columns={columns}
                data={paginatedData}
                totalPageCount={Math.ceil(filteredData.length / pageSize)}
                handlePagination={handlePagination}
                tablePageSize={pageSize}
                currentIndex={pageIndex}
            // isLoading={isLoading}
            />

            <ConfirmDialog
                open={confirmState.open}
                onOpenChange={(open) => setConfirmState(prev => ({ ...prev, open }))}
                title={confirmState.title}
                description={confirmState.description}
                confirmLabel={confirmState.confirmLabel}
                variant={confirmState.variant}
                isLoading={isActionLoading}
                onConfirm={confirmState.onConfirm}
            />
        </TableLayout>
    );
}
