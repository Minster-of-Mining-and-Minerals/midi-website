"use client";

import { useState } from "react";
import { DataTable } from "@/features/template/component/DataTable";
import { TableLayout } from "@/features/template/component/TableLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Power, Download, Eye, EyeOff, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify, extractErrorMessage } from "@/utils/notification";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

import {
    useGetRoutesQuery,
    useUpdateRouteLabelsMutation,
    useToggleRouteStatusMutation,
} from "@/redux/api/routeApi";
import type { Route, UpdateRouteLabelsPayload } from "@/redux/types/route";

export default function RouteList() {
    const { data: routes = [], isLoading } = useGetRoutesQuery();
    const [updateRouteLabels, { isLoading: isUpdatingLabels }] = useUpdateRouteLabelsMutation();
    const [toggleRouteStatus] = useToggleRouteStatusMutation();

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Filtering
    const [statusFilter, setStatusFilter] = useState("");
    const [navbarFilter, setNavbarFilter] = useState("");

    // Modal State
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);
    const [enLabel, setEnLabel] = useState("");
    const [amLabel, setAmLabel] = useState("");

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    const handleEditLabels = (route: Route) => {
        setEditingRoute(route);
        const en = route.translations?.find((t) => t.language_code === "en")?.label || "";
        const am = route.translations?.find((t) => t.language_code === "am")?.label || "";
        setEnLabel(en);
        setAmLabel(am);
    };

    const submitLabels = async () => {
        if (!editingRoute) return;
        try {
            const payload: UpdateRouteLabelsPayload = {
                translations: [
                    { language_code: "en", label: enLabel },
                    { language_code: "am", label: amLabel },
                ].filter(t => t.label.trim() !== ""),
            };

            if (payload.translations.length === 0) {
                notify.warning("Please provide at least one label translation.");
                return;
            }

            await updateRouteLabels({ id: editingRoute.route_id, data: payload }).unwrap();
            notify.success("Route labels updated successfully.");
            setEditingRoute(null);
        } catch (err: any) {
            notify.error(extractErrorMessage(err, "Failed to update route labels."));
        }
    };

    const handleToggleStatus = async (route: Route) => {
        try {
            await toggleRouteStatus({
                id: route.route_id,
                data: { is_active: !route.is_active },
            }).unwrap();
            notify.success(`Route ${!route.is_active ? "activated" : "deactivated"} successfully.`);
        } catch (err: any) {
            notify.error(extractErrorMessage(err, "Failed to toggle route status."));
        }
    };

    const handleToggleNavbarVisibility = async (route: Route) => {
        try {
            await toggleRouteStatus({
                id: route.route_id,
                data: { show_in_navbar: !route.show_in_navbar },
            }).unwrap();
            notify.success(`Route ${!route.show_in_navbar ? "shown in" : "hidden from"} navbar successfully.`);
        } catch (err: any) {
            notify.error(extractErrorMessage(err, "Failed to toggle navbar visibility."));
        }
    };

    const columns: ColumnDef<Route>[] = [
        {
            accessorKey: "path",
            header: "Route Path",
            cell: ({ row }) => (
                <span className="font-mono text-sm text-foreground">{row.getValue("path") || "/"}</span>
            ),
        },
        {
            id: "label-en",
            header: "Label (EN)",
            cell: ({ row }) => {
                const enLabel = row.original.translations?.find((t) => t.language_code === "en")?.label;
                return <span className="font-medium text-golden-dark">{enLabel || "N/A"}</span>;
            },
        },
        {
            id: "label-am",
            header: "Label (AM)",
            cell: ({ row }) => {
                const amLabel = row.original.translations?.find((t) => t.language_code === "am")?.label;
                return <span className="font-medium text-golden-dark">{amLabel || "N/A"}</span>;
            },
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") as boolean;
                return (
                    <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-600" : ""}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "show_in_navbar",
            header: "Navbar Visibility",
            cell: ({ row }) => {
                const isVisible = row.getValue("show_in_navbar") as boolean;
                return (
                    <Badge
                        variant={isVisible ? "default" : "outline"}
                        className={isVisible ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}
                    >
                        {isVisible ? "Visible in Nav" : "Hidden"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const route = row.original;
                return (
                    <ComponentGuard anyPermissions={["ROUTES:UPDATE"]}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <ComponentGuard anyPermissions={['ROUTES:UPDATE']}>
                                    <DropdownMenuItem onClick={() => handleEditLabels(route)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Labels
                                    </DropdownMenuItem>
                                </ComponentGuard>
                                <DropdownMenuItem onClick={() => handleToggleStatus(route)}>
                                    <Power className="mr-2 h-4 w-4" />
                                    {route.is_active ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleNavbarVisibility(route)}>
                                    {route.show_in_navbar ? (
                                        <>
                                            <EyeOff className="mr-2 h-4 w-4" />
                                            Hide from Navbar
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Show in Navbar
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ComponentGuard>
                );
            },
        },
    ];

    const filters = [
        {
            key: "status",
            label: "Status",
            type: "multiselect" as const,
            placeholder: "Select status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
        {
            key: "navbar",
            label: "Navbar Visibility",
            type: "multiselect" as const,
            placeholder: "Select navbar visibility",
            value: navbarFilter,
            onChange: setNavbarFilter,
            options: [
                { label: "Visible in Nav", value: "visible" },
                { label: "Hidden from Nav", value: "hidden" },
            ],
        },
    ];

    const actions = [
        {
            label: "Export",
            icon: <Download className="h-4 w-4" />,
            variant: "outline" as const,
            onClick: () => console.log("Export clicked"),
        },
    ];

    const filteredData = routes.filter((route) => {
        if (statusFilter === "active" && !route.is_active) return false;
        if (statusFilter === "inactive" && route.is_active) return false;
        if (navbarFilter === "visible" && !route.show_in_navbar) return false;
        if (navbarFilter === "hidden" && route.show_in_navbar) return false;
        return true;
    });

    const paginatedData = filteredData.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
    );

    return (
        <>
            <TableLayout
                title="Route Management"
                description="Manage system routes, labels, and visibility"
                actions={actions}
                filters={filters}
                filterColumnsPerRow={2}
            >
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    totalPageCount={Math.ceil(filteredData.length / pageSize)}
                    handlePagination={handlePagination}
                    tablePageSize={pageSize}
                    currentIndex={pageIndex}
                />
            </TableLayout>

            <Dialog open={!!editingRoute} onOpenChange={(open) => !open && setEditingRoute(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Route Labels</DialogTitle>
                        <DialogDescription>
                            Update the multi-language labels for the route: <span className="font-mono">{editingRoute?.path}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="en" className="text-right">
                                English (en)
                            </Label>
                            <Input
                                id="en"
                                value={enLabel}
                                onChange={(e) => setEnLabel(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="am" className="text-right">
                                Amharic (am)
                            </Label>
                            <Input
                                id="am"
                                value={amLabel}
                                onChange={(e) => setAmLabel(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <ComponentGuard anyPermissions={['ROUTES:UPDATE']}>
                            <Button variant="outline" onClick={() => setEditingRoute(null)}>
                                Cancel
                            </Button>
                        </ComponentGuard>
                        <ComponentGuard anyPermissions={['ROUTES:UPDATE']}>
                            <Button onClick={submitLabels} disabled={isUpdatingLabels} className="flex items-center gap-2">
                                {isUpdatingLabels && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isUpdatingLabels ? "Saving..." : "Save Labels"}
                            </Button>
                        </ComponentGuard>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
