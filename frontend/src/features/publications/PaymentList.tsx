"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    CheckCircle2,
    XCircle,
    Clock,
    ArrowLeft,
    ShieldCheck,
    Eye,
    ExternalLink,
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
    useGetPublicationPaymentsQuery,
    useVerifyPublicationPaymentMutation,
} from "@/redux/api/publicationApi";
import { PublicationPayment, PaymentStatus } from "@/redux/types/publication";
import { notify, extractErrorMessage } from "@/utils/notification";
import { getImageUrl } from "@/utils/fileUrl";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function PaymentList() {
    const router = useRouter();

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState("all");

    const {
        data: paymentData,
    } = useGetPublicationPaymentsQuery({
        page: pageIndex + 1,
        limit: pageSize,
        status: statusFilter !== "all" ? statusFilter : undefined,
    });

    const [verifyPayment, { isLoading: isVerifying }] = useVerifyPublicationPaymentMutation();

    const [selectedPayment, setSelectedPayment] = useState<PublicationPayment | null>(null);
    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const [actionType, setActionType] = useState<"verified" | "rejected">("verified");
    const [accessLevel, setAccessLevel] = useState<"download_allowed" | "online_only">("download_allowed");
    const [expiresInDays, setExpiresInDays] = useState<number>(30);
    const [rejectionReason, setRejectionReason] = useState("");
    const [adminNotes, setAdminNotes] = useState("");

    // Slip Viewer Modal
    const [slipModalOpen, setSlipModalOpen] = useState(false);
    const [slipUrl, setSlipUrl] = useState<string | null>(null);

    const payments = paymentData?.data || [];
    const meta = paymentData?.meta;
    const totalCount = meta?.total || payments.length;

    const handlePagination = (index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
    };

    const openVerifyModal = (payment: PublicationPayment) => {
        setSelectedPayment(payment);
        setActionType("verified");
        setAccessLevel("download_allowed");
        setExpiresInDays(30);
        setRejectionReason("");
        setAdminNotes(payment.admin_notes || "");
        setVerificationModalOpen(true);
    };

    const handleProcessVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPayment) return;

        if (actionType === "rejected" && !rejectionReason.trim()) {
            notify.error("Please provide a reason for rejecting the payment.");
            return;
        }

        try {
            await verifyPayment({
                id: selectedPayment.payment_id,
                data: {
                    status: actionType,
                    grant_access: actionType === "verified",
                    access_level: accessLevel,
                    expires_in_days: expiresInDays > 0 ? expiresInDays : undefined,
                    rejection_reason: actionType === "rejected" ? rejectionReason.trim() : undefined,
                    admin_notes: adminNotes.trim() || undefined,
                },
            }).unwrap();

            notify.success(
                actionType === "verified"
                    ? "Payment verified successfully and access granted to the requester."
                    : "Payment marked as rejected. Submitter notified."
            );

            setVerificationModalOpen(false);
            setSelectedPayment(null);
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to process payment verification."));
        }
    };

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case "verified":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected
                    </span>
                );
            case "under_verification":
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3.5 h-3.5" />
                        Under Verification
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Submitted
                    </span>
                );
        }
    };

    const filters: FilterField[] = [
        {
            key: "status",
            label: "Verification Status",
            type: "select",
            placeholder: "All Statuses",
            value: statusFilter,
            onChange: (val) => {
                setStatusFilter(val);
                setPageIndex(0);
            },
            options: [
                { label: "All Statuses", value: "all" },
                { label: "Submitted", value: "submitted" },
                { label: "Under Verification", value: "under_verification" },
                { label: "Verified", value: "verified" },
                { label: "Rejected", value: "rejected" },
            ],
        },
    ];

    const columns: ColumnDef<PublicationPayment>[] = [
        {
            accessorKey: "inquiry.reference_code",
            header: "Ref Code",
            cell: ({ row }) => (
                <Link
                    href={`/admin/publications/inquiries/${row.original.inquiry_id}`}
                    className="font-mono font-bold text-xs text-primary hover:underline bg-slate-50 px-2 py-1 rounded border border-slate-200"
                >
                    {row.original.inquiry?.reference_code || "N/A"}
                </Link>
            ),
        },
        {
            accessorKey: "inquiry.name",
            header: "Requester",
            cell: ({ row }) => {
                const inq = row.original.inquiry;
                if (!inq) return <span className="text-xs text-muted-foreground">N/A</span>;
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">{inq.name}</span>
                        <span className="text-xs text-slate-500">{inq.email}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "publication.title",
            header: "Publication",
            cell: ({ row }) => {
                const pub = row.original.publication;
                if (!pub) return <span className="text-xs text-muted-foreground">N/A</span>;
                return (
                    <div className="flex flex-col max-w-xs">
                        <span className="font-medium text-slate-800 text-xs line-clamp-1" title={pub.title}>
                            {pub.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                            Expected: {pub.price} ETB
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "amount",
            header: "Amount Paid",
            cell: ({ row }) => (
                <span className="font-semibold text-xs text-slate-900 font-mono">
                    {row.original.amount} {row.original.currency}
                </span>
            ),
        },
        {
            accessorKey: "payment_method",
            header: "Method / Reference",
            cell: ({ row }) => {
                const p = row.original;
                return (
                    <div className="flex flex-col text-xs">
                        <span className="capitalize font-medium text-slate-700">
                            {p.payment_method?.replace(/_/g, " ")}
                        </span>
                        {p.transaction_reference && (
                            <span className="font-mono text-[11px] text-muted-foreground">
                                Ref: {p.transaction_reference}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "slip",
            header: "Payment Slip",
            cell: ({ row }) => {
                const slip = row.original.slipAttachment;
                if (!slip) {
                    return <span className="text-xs text-muted-foreground">None</span>;
                }
                const url = getImageUrl(slip, "medium");
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                            setSlipUrl(url);
                            setSlipModalOpen(true);
                        }}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        View Slip
                    </Button>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <ComponentGuard anyPermissions={["PUBLICATION_PAYMENTS:VERIFY"]}>
                        <Button
                            variant={payment.status === "verified" ? "ghost" : "default"}
                            size="sm"
                            className="h-8 text-xs font-medium"
                            onClick={() => openVerifyModal(payment)}
                        >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                            {payment.status === "verified" ? "Re-evaluate" : "Review"}
                        </Button>
                    </ComponentGuard>
                );
            },
        },
    ];

    const actions: ActionButton[] = [
        {
            label: "Inquiries List",
            icon: <ArrowLeft className="w-4 h-4" />,
            onClick: () => router.push("/admin/publications/inquiries"),
            variant: "outline",
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
            title="Publication Payment Review Queue"
            description="Manually verify submitted bank deposit receipts and transaction references before granting publication access."
            filters={filters}
            actions={actions}
        >
            <DataTable
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                columns={columns as any}
                data={payments}
                totalPageCount={Math.ceil(totalCount / pageSize) || 1}
                handlePagination={handlePagination}
                tablePageSize={pageSize}
                currentIndex={pageIndex}
            />

            {/* Verification & Access Granting Modal */}
            <Dialog open={verificationModalOpen} onOpenChange={setVerificationModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Review Payment & Grant Access</DialogTitle>
                    </DialogHeader>

                    {selectedPayment && (
                        <form onSubmit={handleProcessVerification} className="space-y-4 py-2">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Requester:</span>
                                    <span className="font-semibold text-slate-800">{selectedPayment.inquiry?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Publication:</span>
                                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                                        {selectedPayment.publication?.title}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Submitted Amount:</span>
                                    <span className="font-bold text-slate-900">
                                        {selectedPayment.amount} {selectedPayment.currency}
                                    </span>
                                </div>
                                {selectedPayment.transaction_reference && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Transaction Ref:</span>
                                        <span className="font-mono text-slate-800">
                                            {selectedPayment.transaction_reference}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Verification Decision */}
                            <div>
                                <Label className="block mb-1.5 font-semibold">Verification Decision</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActionType("verified")}
                                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                            actionType === "verified"
                                                ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        Approve & Grant
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActionType("rejected")}
                                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                            actionType === "rejected"
                                                ? "border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20"
                                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        <XCircle className="w-4 h-4 text-rose-600" />
                                        Reject Evidence
                                    </button>
                                </div>
                            </div>

                            {actionType === "verified" ? (
                                <div className="space-y-3 pt-1 border-t border-slate-100">
                                    <div>
                                        <Label htmlFor="access-level" className="text-xs">Permitted Access Level</Label>
                                        <Select
                                            value={accessLevel}
                                            onValueChange={(val: "download_allowed" | "online_only") => setAccessLevel(val)}
                                        >
                                            <SelectTrigger id="access-level" className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="download_allowed">
                                                    Download & Online Reader Access
                                                </SelectItem>
                                                <SelectItem value="online_only">
                                                    Online Reader Access Only
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="expiry" className="text-xs">Access Expiry Period</Label>
                                        <Select
                                            value={String(expiresInDays)}
                                            onValueChange={(val) => setExpiresInDays(Number(val))}
                                        >
                                            <SelectTrigger id="expiry" className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30">30 Days</SelectItem>
                                                <SelectItem value="60">60 Days</SelectItem>
                                                <SelectItem value="90">90 Days</SelectItem>
                                                <SelectItem value="0">Permanent (No Expiry)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-normal">
                                        An email with the generated reading access token and secure direct link will be sent to <strong>{selectedPayment.inquiry?.email}</strong>.
                                    </p>
                                </div>
                            ) : (
                                <div className="pt-1 border-t border-slate-100">
                                    <Label htmlFor="rejection-reason" className="text-xs">Rejection Reason *</Label>
                                    <Textarea
                                        id="rejection-reason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Explain why the payment evidence could not be verified..."
                                        rows={2}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                            )}

                            <div>
                                <Label htmlFor="admin-notes" className="text-xs">Internal Notes (Optional)</Label>
                                <Input
                                    id="admin-notes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Internal verification remarks..."
                                    className="mt-1"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setVerificationModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant={actionType === "verified" ? "default" : "destructive"}
                                    disabled={isVerifying}
                                >
                                    {isVerifying
                                        ? "Processing..."
                                        : actionType === "verified"
                                        ? "Verify & Dispatch Access"
                                        : "Confirm Rejection"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Payment Slip Viewer Dialog */}
            <Dialog open={slipModalOpen} onOpenChange={setSlipModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Payment Slip Document</DialogTitle>
                    </DialogHeader>
                    {slipUrl && (
                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <Image src={slipUrl} alt="Payment Slip" fill className="object-contain" />
                        </div>
                    )}
                    <DialogFooter>
                        {slipUrl && (
                            <a href={slipUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1.5">
                                    <ExternalLink className="w-4 h-4" />
                                    Open Full Size
                                </Button>
                            </a>
                        )}
                        <Button variant="secondary" size="sm" onClick={() => setSlipModalOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TableLayout>
    );
}
