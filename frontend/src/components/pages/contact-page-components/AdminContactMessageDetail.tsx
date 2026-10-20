"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteMessageMutation, useGetMessageByIdQuery } from "@/redux/api/messageApi";
import { TableLayout } from "@/features/template/component/TableLayout";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { formatDate, formatDateTime } from "@/utils/datetime";
import { notify } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import PublicEmptyState from "@/components/common/PublicEmptyState";

export default function AdminContactMessageDetail() {
    const router = useRouter();
    const params = useParams();
    const messageId = params.messageId as string;

    const { data: message, isLoading, isError } = useGetMessageByIdQuery(messageId, {
        skip: !messageId,
    });
    const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDelete = () => {
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteMessage(messageId).unwrap();
            notify.success("Contact message deleted successfully.");
            setIsConfirmOpen(false);
            router.push("/admin/contacts");
        } catch (error) {
            notify.error("Failed to delete contact message.", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="animate-spin w-6 h-6 text-golden-dark" />
            </div>
        );
    }

    if (isError || !message) {
        return (
            <TableLayout
                title="Message Not Found"
                description="This contact message could not be found or may have been deleted."
                sideActions={[
                    {
                        label: "Back to Messages",
                        icon: <ArrowLeft className="h-4 w-4" />,
                        variant: "outline",
                        onClick: () => router.push("/admin/contacts"),
                    },
                ]}
            >
                <PublicEmptyState
                    variant="inline"
                    title="Message not found"
                    description="The message you are looking for does not exist or has been removed."
                />
            </TableLayout>
        );
    }

    return (
        <TableLayout
            title="Contact Message"
            description="View the full details of a message submitted through the public contact form."
            sideActions={[
                {
                    label: "Back to Messages",
                    icon: <ArrowLeft className="h-4 w-4" />,
                    variant: "outline",
                    onClick: () => router.push("/admin/contacts"),
                },
            ]}
        >
            <div className="space-y-6">
                <div className="rounded-lg border border-[#094C81]/15 bg-[#094C81]/5 p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3 min-w-0">
                            <h3 className="text-xl font-bold text-primary break-words">
                                {message.subject}
                            </h3>
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    {message.full_name}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    <a
                                        href={`mailto:${message.email_address}`}
                                        className="text-primary hover:underline break-all"
                                    >
                                        {message.email_address}
                                    </a>
                                </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <span>Received {formatDateTime(message.created_at)}</span>
                                {message.updated_at && message.updated_at !== message.created_at && (
                                    <span className="ml-4">Updated {formatDate(message.updated_at)}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                            <Button variant="outline" size="sm" asChild>
                                <a href={`mailto:${message.email_address}?subject=Re: ${encodeURIComponent(message.subject)}`}>
                                    <Mail className="h-4 w-4 mr-1.5" />
                                    Reply by Email
                                </a>
                            </Button>
                            <ComponentGuard anyPermissions={["CONTACT_MESSAGES:DELETE"]}>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </ComponentGuard>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-primary mb-4">
                        Message
                    </h4>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed break-words">
                        {message.message}
                    </p>
                </div>
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete Contact Message?"
                description="Are you sure you want to delete this contact message? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={confirmDelete}
            />
        </TableLayout>
    );
}
