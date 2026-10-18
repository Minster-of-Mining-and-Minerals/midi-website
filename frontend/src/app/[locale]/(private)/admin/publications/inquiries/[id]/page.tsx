"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    Clock,
    XCircle,
    CreditCard,
    Send,
    User,
    Mail,
    Phone,
    Building2,
    FileText,
    ExternalLink,
    Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    useGetPublicationInquiryByIdQuery,
    useUpdatePublicationInquiryStatusMutation,
    useReplyToPublicationInquiryMutation,
} from "@/redux/api/publicationApi";
import { PublicationAccessGrant } from "@/redux/types/publication";
import { notify, extractErrorMessage } from "@/utils/notification";
import { getImageUrl } from "@/utils/fileUrl";
import Image from "next/image";

export default function AdminInquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { data: inquiry, isLoading, isError } = useGetPublicationInquiryByIdQuery(id, {
        skip: !id,
    });

    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdatePublicationInquiryStatusMutation();
    const [sendReply, { isLoading: isSendingReply }] = useReplyToPublicationInquiryMutation();

    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [adminNotes, setAdminNotes] = useState<string>("");
    const [replyMessage, setReplyMessage] = useState<string>("");
    const [sendEmailNotification, setSendEmailNotification] = useState<boolean>(true);

    // Sync state when inquiry loads
    React.useEffect(() => {
        if (inquiry) {
            setSelectedStatus(inquiry.status);
            setAdminNotes(inquiry.admin_notes || "");
        }
    }, [inquiry]);

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateStatus({
                id,
                status: selectedStatus,
                admin_notes: adminNotes.trim() || undefined,
            }).unwrap();

            notify.success("Inquiry status and notes updated successfully.");
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to update inquiry status."));
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) {
            notify.error("Please enter a reply message.");
            return;
        }

        try {
            await sendReply({
                id,
                reply_message: replyMessage.trim(),
                send_email: sendEmailNotification,
            }).unwrap();

            notify.success(
                sendEmailNotification
                    ? "Reply recorded and notification email dispatched to the requester."
                    : "Reply recorded internally."
            );
            setReplyMessage("");
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to send inquiry reply."));
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <Clock className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">Loading inquiry details...</p>
                </div>
            </div>
        );
    }

    if (isError || !inquiry) {
        return (
            <div className="p-8 max-w-xl mx-auto text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Inquiry Not Found</h2>
                <p className="text-sm text-slate-500 mb-6">
                    The requested publication inquiry record could not be found or has been deleted.
                </p>
                <Button onClick={() => router.push("/admin/publications/inquiries")} variant="outline">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Inquiries List
                </Button>
            </div>
        );
    }

    const pub = inquiry.publication;
    const payment = inquiry.payment;
    const accessGrants = inquiry.accessGrants || [];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header Navigation */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/admin/publications/inquiries")}
                        className="text-slate-600"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Inquiries List
                    </Button>
                    <span className="text-slate-300">/</span>
                    <span className="font-mono font-bold text-sm text-primary bg-slate-100 px-2.5 py-1 rounded">
                        {inquiry.reference_code}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                        Submitted on{" "}
                        {new Date(inquiry.created_at || "").toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Requester Information & Message */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Submitter Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Submitter Information
                            </h3>
                            <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {inquiry.inquiry_type.replace(/_/g, " ")}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-xs font-medium text-slate-400 block mb-0.5">Full Name</span>
                                <span className="font-semibold text-slate-800">{inquiry.name}</span>
                            </div>

                            <div>
                                <span className="text-xs font-medium text-slate-400 block mb-0.5">Email</span>
                                <a
                                    href={`mailto:${inquiry.email}`}
                                    className="font-medium text-primary hover:underline flex items-center gap-1"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    {inquiry.email}
                                </a>
                            </div>

                            {inquiry.phone && (
                                <div>
                                    <span className="text-xs font-medium text-slate-400 block mb-0.5">Phone</span>
                                    <span className="font-medium text-slate-700 flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        {inquiry.phone}
                                    </span>
                                </div>
                            )}

                            {inquiry.company && (
                                <div>
                                    <span className="text-xs font-medium text-slate-400 block mb-0.5">Organization</span>
                                    <span className="font-medium text-slate-700 flex items-center gap-1">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                        {inquiry.company}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Inquiry Message */}
                        <div className="pt-3 border-t border-slate-100">
                            <span className="text-xs font-medium text-slate-400 block mb-1.5">Submitted Message</span>
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap border border-slate-100">
                                {inquiry.message}
                            </div>
                        </div>
                    </div>

                    {/* Associated Publication Box */}
                    {pub && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Associated Publication
                                </h3>
                                <Link
                                    href={`/admin/publications/${pub.publication_id}`}
                                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                                >
                                    Edit Publication
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 text-base mb-1">{pub.title}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
                                    <span className="capitalize px-2 py-0.5 bg-slate-100 rounded">
                                        Type: {pub.document_type.replace(/_/g, " ")}
                                    </span>
                                    <span className="capitalize px-2 py-0.5 bg-slate-100 rounded">
                                        Access: {pub.access_mode.replace(/_/g, " ")}
                                    </span>
                                    {pub.price && Number(pub.price) > 0 && (
                                        <span className="font-bold text-slate-800 px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                                            Price: {pub.price} ETB
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Associated Payment Record Box */}
                    {payment && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    Payment Record
                                </h3>
                                <span
                                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                                        payment.status === "verified"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : payment.status === "rejected"
                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }`}
                                >
                                    {payment.status.replace(/_/g, " ")}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-xs text-slate-400 block mb-0.5">Amount</span>
                                    <span className="font-bold text-slate-900 font-mono">
                                        {payment.amount} {payment.currency}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block mb-0.5">Method</span>
                                    <span className="font-medium text-slate-800 capitalize">
                                        {payment.payment_method?.replace(/_/g, " ")}
                                    </span>
                                </div>
                                {payment.transaction_reference && (
                                    <div className="col-span-2">
                                        <span className="text-xs text-slate-400 block mb-0.5">Transaction Ref</span>
                                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                            {payment.transaction_reference}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {payment.slipAttachment && (
                                <div>
                                    <span className="text-xs font-medium text-slate-400 block mb-2">Deposit Slip</span>
                                    <div className="relative aspect-[16/9] w-full max-w-sm rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                        <Image
                                            src={getImageUrl(payment.slipAttachment, "medium")}
                                            alt="Deposit slip"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            {payment.status !== "verified" && (
                                <div className="pt-2">
                                    <Button
                                        size="sm"
                                        onClick={() => router.push("/admin/publications/payments")}
                                        className="gap-1.5"
                                    >
                                        <CreditCard className="w-3.5 h-3.5" />
                                        Open Payment Review Queue
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Active Access Grants Box */}
                    {accessGrants.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                                <Key className="w-4 h-4 text-emerald-600" />
                                Granted Document Access Tokens
                            </h3>

                            <div className="space-y-3">
                                {accessGrants.map((grant: PublicationAccessGrant) => (
                                    <div
                                        key={grant.grant_id}
                                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-800 capitalize">
                                                {grant.access_level.replace(/_/g, " ")}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded font-semibold ${
                                                    grant.is_active
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-slate-200 text-slate-600"
                                                }`}
                                            >
                                                {grant.is_active ? "Active" : "Revoked"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Token:</span>
                                            <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-sm">
                                                {grant.access_token}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                                            <span>
                                                Expires:{" "}
                                                {grant.expires_at
                                                    ? new Date(grant.expires_at).toLocaleDateString()
                                                    : "Permanent"}
                                            </span>
                                            <span>
                                                Downloads: {grant.downloads_used} / {grant.max_downloads}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Actions (Status Update & Reply) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Status & Review Notes Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 pb-3 border-b border-slate-100">
                            Inquiry Status & Review
                        </h3>

                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <Label htmlFor="inquiry-status" className="text-xs">Status</Label>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={(val) => setSelectedStatus(val)}
                                >
                                    <SelectTrigger id="inquiry-status" className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="payment_pending">Payment Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="admin-notes" className="text-xs">Internal Administrative Notes</Label>
                                <Textarea
                                    id="admin-notes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes or track institutional decisions..."
                                    rows={4}
                                    className="mt-1 text-xs"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isUpdatingStatus}>
                                {isUpdatingStatus ? "Updating..." : "Save Status & Notes"}
                            </Button>
                        </form>
                    </div>

                    {/* Official Response Box */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 pb-3 border-b border-slate-100">
                            Reply to Submitter
                        </h3>

                        <form onSubmit={handleSendReply} className="space-y-4">
                            <div>
                                <Label htmlFor="reply-msg" className="text-xs">Reply Message</Label>
                                <Textarea
                                    id="reply-msg"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your institutional response here..."
                                    rows={5}
                                    required
                                    className="mt-1 text-xs"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="send-email"
                                    checked={sendEmailNotification}
                                    onCheckedChange={(checked: boolean) => setSendEmailNotification(!!checked)}
                                />
                                <Label htmlFor="send-email" className="text-xs text-slate-600 font-normal cursor-pointer">
                                    Send official notification email to {inquiry.email}
                                </Label>
                            </div>

                            <Button type="submit" variant="default" className="w-full gap-2" disabled={isSendingReply}>
                                <Send className="w-4 h-4" />
                                {isSendingReply ? "Sending..." : "Send Institutional Reply"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
