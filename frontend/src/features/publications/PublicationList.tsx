"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
    Archive,
    CheckCircle2,
    Download,
    Edit,
    ExternalLink,
    Eye,
    FilePen,
    MoreHorizontal,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/features/template/component/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import {
    useDeletePublicationMutation,
    useGetPublicationsQuery,
    useUpdatePublicationMutation,
} from "@/redux/api/publicationApi";
import { Publication, PublishStatus } from "@/redux/types/publication";
import { notify, extractErrorMessage } from "@/utils/notification";
import { getImageUrl } from "@/utils/fileUrl";
import PublicationCover from "@/components/pages/publication-page-components/PublicationCover";
import { canDownload } from "@/components/pages/publication-page-components/publicationMeta";
import PublicationsAdminHeader, { type StatusFilter } from "./PublicationsAdminHeader";

const STATUS_STYLES: Record<PublishStatus, { label: string; className: string }> = {
    published: { label: "Live", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    draft: { label: "Draft", className: "bg-primary/10 text-primary border-primary/30" },
    pending_review: { label: "In review", className: "bg-blue-50 text-blue-700 border-blue-200" },
    archived: { label: "Archived", className: "bg-slate-100 text-slate-500 border-slate-200" },
};

const STATUS_FILTERS: StatusFilter[] = ["all", "published", "draft", "pending_review", "archived"];

type PendingAction =
    | { kind: "status"; publication: Publication; status: PublishStatus }
    | { kind: "delete"; publication: Publication };

export default function PublicationList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get("status") as StatusFilter | null;

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>(
        initialStatus && STATUS_FILTERS.includes(initialStatus) ? initialStatus : "all"
    );
    const [pending, setPending] = useState<PendingAction | null>(null);

    useEffect(() => {
        const id = setTimeout(() => {
            setSearch(searchInput.trim());
            setPageIndex(0);
        }, 400);
        return () => clearTimeout(id);
    }, [searchInput]);

    const { data, isFetching } = useGetPublicationsQuery({
        page: pageIndex + 1,
        limit: pageSize,
        search: search || undefined,
        publish_status: status,
        sort_by: "created_at",
        sort_order: "DESC",
    });
    const [updatePublication, { isLoading: isUpdating }] = useUpdatePublicationMutation();
    const [deletePublication, { isLoading: isDeleting }] = useDeletePublicationMutation();

    const publications = data?.data ?? [];
    const totalCount = data?.meta?.total ?? publications.length;

    const selectStatus = (value: StatusFilter) => {
        setStatus(value);
        setPageIndex(0);
    };

    const runPendingAction = async () => {
        if (!pending) return;
        try {
            if (pending.kind === "delete") {
                await deletePublication(pending.publication.publication_id).unwrap();
                notify.success("Publication deleted.");
            } else {
                await updatePublication({
                    id: pending.publication.publication_id,
                    data: { publish_status: pending.status },
                }).unwrap();
                notify.success(
                    pending.status === "published"
                        ? "Publication is now live on the website."
                        : `Publication moved to ${STATUS_STYLES[pending.status].label.toLowerCase()}.`
                );
            }
            setPending(null);
        } catch (error) {
            notify.error(extractErrorMessage(error, "Action failed. Please try again."));
        }
    };

    const confirmCopy = (() => {
        if (!pending) return { title: "", description: "", confirm: "" };
        const name = `"${pending.publication.title}"`;
        if (pending.kind === "delete") {
            return {
                title: "Delete publication",
                description: `Delete ${name}? It will be removed from the website and archived.`,
                confirm: isDeleting ? "Deleting..." : "Delete",
            };
        }
        switch (pending.status) {
            case "published":
                return { title: "Publish publication", description: `Make ${name} visible to everyone on the website?`, confirm: "Publish" };
            case "draft":
                return { title: "Move to draft", description: `${name} will be taken off the website until it is published again.`, confirm: "Move to draft" };
            default:
                return { title: "Archive publication", description: `${name} will be taken off the website and kept in the archive.`, confirm: "Archive" };
        }
    })();

    const columns: ColumnDef<Publication>[] = [
        {
            accessorKey: "title",
            header: "Publication",
            cell: ({ row }) => {
                const pub = row.original;
                const coverUrl = pub.coverImage ? getImageUrl(pub.coverImage, "thumb") : null;
                return (
                    <div className="flex min-w-[260px] max-w-md items-center gap-3">
                        <div className="w-10 shrink-0">
                            <PublicationCover coverUrl={coverUrl} title={pub.title} sizes="40px" className="rounded" />
                        </div>
                        <div className="min-w-0">
                            <Link
                                href={`/admin/publications/${pub.publication_id}`}
                                className="line-clamp-1 font-semibold text-secondary hover:text-primary"
                                title={pub.title}
                            >
                                {pub.title}
                            </Link>
                            {pub.title_am && <p className="line-clamp-1 text-xs text-muted">{pub.title_am}</p>}
                            <p className="mt-0.5 truncate text-[11px] text-muted">
                                {[pub.reference_number && `Ref ${pub.reference_number}`, pub.authors].filter(Boolean).join(" · ")}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "categories",
            header: "Category",
            cell: ({ row }) => {
                const cats = row.original.categories ?? [];
                if (cats.length === 0) return <span className="text-xs text-muted">—</span>;
                return (
                    <span className="whitespace-nowrap text-xs text-secondary">
                        {cats[0].name}
                        {cats.length > 1 && <span className="text-muted"> +{cats.length - 1}</span>}
                    </span>
                );
            },
        },
        {
            accessorKey: "publish_status",
            header: "Status",
            cell: ({ row }) => {
                const style = STATUS_STYLES[row.original.publish_status] ?? STATUS_STYLES.draft;
                return (
                    <span className={clsx("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold", style.className)}>
                        {row.original.publish_status === "published" && <CheckCircle2 className="h-3 w-3" />}
                        {style.label}
                    </span>
                );
            },
        },
        {
            id: "reads",
            header: "Reads",
            cell: ({ row }) => {
                const pub = row.original;
                return (
                    <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1" title="Views">
                            <Eye className="h-3.5 w-3.5" />
                            {pub.views_count ?? 0}
                        </span>
                        {canDownload(pub) && (
                            <span className="flex items-center gap-1" title="Downloads">
                                <Download className="h-3.5 w-3.5" />
                                {pub.downloads_count ?? 0}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "updated_at",
            header: "Updated",
            cell: ({ row }) => {
                const value = row.original.updated_at || row.original.created_at;
                return (
                    <span className="whitespace-nowrap text-xs text-muted">
                        {value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const pub = row.original;
                const isLive = pub.publish_status === "published";
                return (
                    <div className="flex items-center justify-end gap-1">
                        <ComponentGuard anyPermissions={["PUBLICATIONS:UPDATE"]}>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Edit"
                                onClick={() => router.push(`/admin/publications/${pub.publication_id}`)}
                            >
                                <Edit className="h-4 w-4 text-primary" />
                            </Button>
                        </ComponentGuard>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm" aria-label="More actions">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {isLive && (
                                    <DropdownMenuItem asChild>
                                        <Link href={`/publications/${pub.slug}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                            View on website
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <ComponentGuard anyPermissions={["PUBLICATIONS:PUBLISH"]}>
                                    {!isLive && (
                                        <DropdownMenuItem onSelect={() => setPending({ kind: "status", publication: pub, status: "published" })}>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Publish
                                        </DropdownMenuItem>
                                    )}
                                    {pub.publish_status !== "draft" && (
                                        <DropdownMenuItem onSelect={() => setPending({ kind: "status", publication: pub, status: "draft" })}>
                                            <FilePen className="h-4 w-4" />
                                            Move to draft
                                        </DropdownMenuItem>
                                    )}
                                    {pub.publish_status !== "archived" && (
                                        <DropdownMenuItem onSelect={() => setPending({ kind: "status", publication: pub, status: "archived" })}>
                                            <Archive className="h-4 w-4" />
                                            Archive
                                        </DropdownMenuItem>
                                    )}
                                </ComponentGuard>
                                <ComponentGuard anyPermissions={["PUBLICATIONS:DELETE"]}>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onSelect={() => setPending({ kind: "delete", publication: pub })}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </ComponentGuard>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const hasFilters = search || status !== "all";

    return (
        <div className="space-y-5 p-6">
            <PublicationsAdminHeader activeStatus={status} onStatusSelect={selectStatus} />

            <div className="rounded-xl border border-slate-200 bg-white">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search title, author, reference…"
                            className="h-9 w-full rounded-md border border-slate-200 ps-9 pe-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <Select value={status} onValueChange={(v) => selectStatus(v as StatusFilter)}>
                        <SelectTrigger className="h-9 w-[150px]" aria-label="Status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="published">Live</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="pending_review">In review</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted"
                            onClick={() => {
                                setSearchInput("");
                                setSearch("");
                                selectStatus("all");
                            }}
                        >
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </Button>
                    )}
                    <span className="ms-auto text-sm text-muted">
                        <span className="font-semibold text-secondary">{totalCount}</span> publications
                    </span>
                </div>

                <div className={clsx("p-2 transition-opacity", isFetching && "opacity-60")}>
                    <DataTable
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        columns={columns as any}
                        data={publications}
                        totalPageCount={Math.ceil(totalCount / pageSize) || 1}
                        handlePagination={(index, size) => {
                            setPageIndex(index);
                            setPageSize(size);
                        }}
                        tablePageSize={pageSize}
                        currentIndex={pageIndex}
                    />
                </div>
            </div>

            <ConfirmDialog
                open={!!pending}
                onOpenChange={(open) => !open && setPending(null)}
                title={confirmCopy.title}
                description={confirmCopy.description}
                confirmText={confirmCopy.confirm}
                cancelText="Cancel"
                isLoading={isUpdating || isDeleting}
                variant={pending?.kind === "delete" ? "destructive" : "default"}
                onConfirm={runPendingAction}
            />
        </div>
    );
}
