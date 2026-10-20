"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, CheckCircle2, ExternalLink, Eye, Trash, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    useGetNewsByIdQuery,
    useGetNewsFeedbacksQuery,
    useToggleFeedbackStatusMutation,
    useDeleteFeedbackMutation,
} from "@/redux/api/newsApi";
import { NewsFeedback } from "@/redux/types/news";
import { DataTable } from "@/features/template/component/DataTable";
import { TableLayout } from "@/features/template/component/TableLayout";
import { notify } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { FilterField } from "@/types/tableLayout";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { formatDate } from "@/utils/datetime";
import PublicEmptyState from "@/components/common/PublicEmptyState";

export default function AdminNewsFeedbackDetail() {
    const router = useRouter();
    const params = useParams();
    const newsId = params.newsId as string;

    const { data: selectedNews, isLoading: isSelectedNewsLoading } = useGetNewsByIdQuery(newsId, {
        skip: !newsId,
    });
    const { data: feedbacks = [], isLoading: isFeedbacksLoading } = useGetNewsFeedbacksQuery(
        { news_id: newsId, isAdmin: true },
        { skip: !newsId }
    );

    const [toggleStatus] = useToggleFeedbackStatusMutation();
    const [deleteFeedback] = useDeleteFeedbackMutation();
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
    const [viewFeedback, setViewFeedback] = useState<NewsFeedback | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        try {
            await toggleStatus(id).unwrap();
            notify.success(`Feedback ${currentStatus ? "unpublished" : "published"} successfully.`);
        } catch (error) {
            notify.error("Failed to update feedback status.", error);
        }
    };

    const handleDelete = (id: string) => {
        setDeleteConfirm({ open: true, id });
    };

    const filters: FilterField[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search by name or comment...",
            value: search,
            onChange: (value) => {
                setSearch(value);
                setPageIndex(0);
            },
        },
    ];

    const filteredData = useMemo(() => {
        return feedbacks.filter((item: NewsFeedback) => {
            const matchesSearch =
                !search ||
                item.fullname?.toLowerCase().includes(search.toLowerCase()) ||
                item.thought?.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [feedbacks, search]);

    const paginatedData = filteredData.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize
    );

    const columns: ColumnDef<NewsFeedback>[] = [
        {
            accessorKey: "fullname",
            header: "User",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-primary">{row.getValue("fullname")}</span>
                    <span className="text-[10px] text-muted-foreground">
                        {new Date(row.original.created_at).toLocaleDateString()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "thought",
            header: "Comment",
            cell: ({ row }) => (
                <p className="text-sm text-foreground max-w-[400px] line-clamp-3" title={row.getValue("thought")}>
                    {row.getValue("thought")}
                </p>
            ),
        },
        {
            accessorKey: "is_published",
            header: "Status",
            cell: ({ row }) => {
                const isPublished = row.getValue("is_published") as boolean;
                return (
                    <ComponentGuard anyPermissions={['NEWS:UPDATE']}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-1.5 h-8 px-2 rounded-full ${isPublished
                                    ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                    : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"
                                }`}
                            onClick={() => handleTogglePublish(row.original.news_feedback_id, isPublished)}
                        >
                            {isPublished ? (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">Published</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">Pending</span>
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
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        title="View Details"
                        className="text-primary hover:text-primary/80"
                        onClick={() => setViewFeedback(row.original)}
                    >
                        <Eye className="h-4 w-4 mr-1.5" />
                        View
                    </Button>
                    <ComponentGuard anyPermissions={["NEWS:DELETE"]}>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Feedback"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(row.original.news_feedback_id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </ComponentGuard>
                </div>
            ),
        },
    ];

    const isLoading = isSelectedNewsLoading || isFeedbacksLoading;
    const publishedCount = feedbacks.filter((f) => f.is_published).length;
    const pendingCount = feedbacks.length - publishedCount;

    return (
        <TableLayout
            title="Article Feedback"
            description="Review, publish, or remove comments for this news article."
            actions={[]}
            filters={filters}
            filterColumnsPerRow={1}
            sideActions={[
                {
                    label: "Back to News List",
                    icon: <ArrowLeft className="h-4 w-4" />,
                    variant: "outline",
                    onClick: () => router.push("/admin/news/feedbacks"),
                },
            ]}
        >
            {selectedNews && (
                <div className="rounded-lg border border-border bg-secondary p-5 mb-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-bold text-primary truncate">
                                    {selectedNews.title}
                                </h3>
                                <Badge
                                    variant={
                                        selectedNews.status === "published"
                                            ? "default"
                                            : selectedNews.status === "draft"
                                                ? "destructive"
                                                : "secondary"
                                    }
                                >
                                    {selectedNews.status.charAt(0).toUpperCase() + selectedNews.status.slice(1)}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                {selectedNews.author && <span>By {selectedNews.author}</span>}
                                <span>Created {formatDate(selectedNews.created_at)}</span>
                                {selectedNews.published_at && (
                                    <span>Published {formatDate(selectedNews.published_at)}</span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="text-muted-foreground">
                                    <strong>{feedbacks.length}</strong> total feedback
                                    {feedbacks.length === 1 ? "" : "s"}
                                </span>
                                <span className="text-green-700">
                                    <strong>{publishedCount}</strong> published
                                </span>
                                <span className="text-amber-600">
                                    <strong>{pendingCount}</strong> pending
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <ComponentGuard anyPermissions={['NEWS:UPDATE']}>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/news/${newsId}`}>
                                        <Eye className="h-4 w-4 mr-1.5" />
                                        Edit Article
                                    </Link>
                                </Button>
                            </ComponentGuard>
                            {selectedNews.status === "published" && (
                                <ComponentGuard anyPermissions={['NEWS:UPDATE']}>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/news/${newsId}`} target="_blank">
                                            <ExternalLink className="h-4 w-4 mr-1.5" />
                                            View Public Page
                                        </Link>
                                    </Button>
                                </ComponentGuard>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {filteredData.length === 0 && !isLoading ? (
                <PublicEmptyState
                    variant="inline"
                    title="No feedback for this article"
                    description={
                        search
                            ? "No comments match your search. Try a different keyword."
                            : "Users have not submitted any comments on this news article yet."
                    }
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    totalPageCount={Math.ceil(filteredData.length / pageSize)}
                    handlePagination={handlePagination}
                    tablePageSize={pageSize}
                    currentIndex={pageIndex}
                />
            )}

            <Dialog open={!!viewFeedback} onOpenChange={(open) => !open && setViewFeedback(null)}>
                <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Feedback Details</DialogTitle>
                        <DialogDescription>
                            From: {viewFeedback?.fullname}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium leading-none">Date</h4>
                            <p className="text-sm text-muted-foreground">
                                {viewFeedback?.created_at ? new Date(viewFeedback.created_at).toLocaleString() : ""}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium leading-none">Comment</h4>
                            <p className="text-sm text-white whitespace-pre-wrap rounded-md bg-secondary p-3">
                                {viewFeedback?.thought}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Delete Feedback?"
                description="Are you sure you want to delete this feedback comment? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={async () => {
                    try {
                        setIsDeleting(true);
                        await deleteFeedback(deleteConfirm.id).unwrap();
                        notify.success("Feedback comment deleted successfully.");
                        setDeleteConfirm((prev) => ({ ...prev, open: false }));
                    } catch (err) {
                        notify.error("Failed to delete feedback comment.", err);
                    } finally {
                        setIsDeleting(false);
                    }
                }}
            />
        </TableLayout>
    );
}
