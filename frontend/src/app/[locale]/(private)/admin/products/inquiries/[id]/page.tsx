"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetInquiryByIdQuery, useReplyToInquiryMutation } from "@/redux/api/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, User, Building, Mail, Phone, Package, Calendar, Loader2 } from "lucide-react";
import { notify, extractErrorMessage } from "@/utils/notification";
import { Badge } from "@/components/ui/badge";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

export default function InquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: inquiry, isLoading, isError } = useGetInquiryByIdQuery(id);
    const [replyToInquiry, { isLoading: isReplying }] = useReplyToInquiryMutation();

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (inquiry) {
            setSubject(`Re: Inquiry regarding ${inquiry.product?.name || "Product"}`);
        }
    }, [inquiry]);

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading inquiry details...</div>;
    }

    if (isError || !inquiry) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Failed to load inquiry.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            notify.warning("Please fill in both subject and message.");
            return;
        }

        notify.loading("Sending inquiry reply...", { id: "reply-inquiry" });

        try {
            await replyToInquiry({ id, subject, message }).unwrap();
            notify.success("Reply sent successfully via email.", { id: "reply-inquiry" });
            setMessage(""); // Clear message after sending
            router.push("/admin/products/inquiries");
        } catch (error: any) {
            notify.error(extractErrorMessage(error, "Failed to send reply."), { id: "reply-inquiry" });
        }
    };

    return (
        <div className="mx-auto space-y-6 bg-white text-foreground p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Inquiry Details</h1>
                </div>
                <Badge
                    variant={inquiry.status === "replied" ? "default" : inquiry.status === "reviewed" ? "secondary" : "outline"}
                    className="capitalize border-slate-300"
                >
                    {inquiry.status || "Pending"}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold border-b border-slate-100 pb-2 text-slate-900">Customer Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-800">{inquiry.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">{inquiry.email}</a>
                        </div>
                        {inquiry.phone && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-700">{inquiry.phone}</span>
                            </div>
                        )}
                        {inquiry.company && (
                            <div className="flex items-center gap-2 text-sm">
                                <Building className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-700">{inquiry.company}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold border-b border-slate-100 pb-2 text-slate-900">Inquiry Context</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">Product:</span>
                            <span className="font-semibold text-primary">{inquiry.product?.name || "N/A"}</span>
                        </div>
                        {inquiry.quantity && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-slate-500">Requested Quantity:</span>
                                <span className="text-slate-800">{inquiry.quantity}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">Received on:</span>
                            <span className="text-slate-700">{new Date(inquiry.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Original Message */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-slate-900">Customer's Message</h2>
                <div className="bg-slate-50 p-4 rounded-md whitespace-pre-wrap text-sm border border-slate-200 text-slate-700">
                    {inquiry.message}
                </div>
            </div>

            {/* Reply Form */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                    <Send className="w-5 h-5 text-primary" />
                    Send Reply
                </h2>
                <form onSubmit={handleSendReply} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-slate-700">Subject</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Email Subject"
                            required
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-slate-700">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your reply here... (Will be sent via email)"
                            rows={6}
                            required
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <ComponentGuard anyPermissions={['PRODUCTS:UPDATE']}>
                            <Button type="submit" disabled={isReplying} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 flex items-center gap-2">
                                {isReplying && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isReplying ? "Sending..." : "Send Reply"}
                                {!isReplying && <Send className="w-4 h-4 ml-2" />}
                            </Button>
                        </ComponentGuard>
                    </div>
                </form>
            </div>
        </div>
    );
}
