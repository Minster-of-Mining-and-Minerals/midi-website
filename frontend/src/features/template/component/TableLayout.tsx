"use client";

import { useCallback, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActionButton, PageLayoutProps } from "@/types/tableLayout";
import { FilterPopover } from "./FilterDrawer";
import { useSearchParams, useRouter } from "next/navigation";
import { hasAnyPermission } from "@/lib/permissions";
import { useGetUserRolesAndPermissionsQuery } from "@/redux/api/userApi";

export const TableLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  actions = [],
  filters = [],
  sideActions = [],
  children,
  filterColumnsPerRow = 1,
  viewModeOptions = ["table", "card"], // added prop for view toggle
  viewMode = "table",
  onViewModeChange,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";

  const handleSearchChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", value);
      params.set("page", "1"); // reset page
      router.push(`${window.location.pathname}?${params.toString()}`);
    },
    [searchParams, router]
  );

  const { data: permissionData } = useGetUserRolesAndPermissionsQuery();
  const userPermissions = permissionData?.permissions || [];

  const filteredActions = actions.filter((action) => {
    if (!action.permissions || action.permissions.length === 0) {
      return true; // no permission required
    }
    // @ts-ignore - Bypass strict type check for permissions array
    return hasAnyPermission(userPermissions, action.permissions);
  });

  const filteredSideActions = sideActions.filter((action) => {
    if (!action.permissions || action.permissions.length === 0) {
      return true; // no permission required
    }
    // @ts-ignore - Bypass strict type check for permissions array
    return hasAnyPermission(userPermissions, action.permissions);
  });

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow">
      <div className="space-y-6">
        {/* Page Header - Title & Description */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {title && description && (
            <div>
              {title && (
                <h1 className="text-xl font-semibold text-primary">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-muted-foreground text-base">{description}</p>
              )}
            </div>
          )}
          <div className="flex w-fit">
            {filteredSideActions && filteredSideActions.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {filteredSideActions.map((action: ActionButton, index: number) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    size={action.size || "default"}
                    onClick={action.onClick}
                    disabled={action.disabled || action.loading}
                    className="flex items-center space-x-2"
                  >
                    {action.icon && (
                      <span className="h-4 w-4">{action.icon}</span>
                    )}
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Search, Filters, Actions, and View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Filters */}
            {filters.length > 0 && (
              <FilterPopover
                filters={filters}
                columnsPerRow={filterColumnsPerRow}
              />
            )}

            {/* View Mode Selector */}
            {viewModeOptions.length > 0 && onViewModeChange && (
              <select
                value={viewMode}
                onChange={(e) =>
                  onViewModeChange(e.target.value as "table" | "card")
                }
                className="border rounded-lg px-3 py-2 bg-card"
              >
                {viewModeOptions.includes("table") && <option value="table">Table View</option>}
                {viewModeOptions.includes("card") && <option value="card">Card View</option>}
              </select>
            )}

            {/* Actions */}
            {filteredActions.length > 0 && (
              <div className="flex items-center space-x-2">
                {filteredActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    size={action.size || "default"}
                    onClick={action.onClick}
                    disabled={action.disabled || action.loading}
                    className="flex items-center space-x-2"
                  >
                    {action.loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      action.icon && <span className="h-4 w-4">{action.icon}</span>
                    )}
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-card text-card-foreground">{children}</div>
      </div>
    </div>
  );
};