"use strict";
"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import {
    Send,
    CheckCircle2,
    FileText,
    Copy,
    Check,
    CreditCard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Publication, InquiryType } from "@/redux/types/publication";
import { useSubmitPublicationInquiryMutation } from "@/redux/api/publicationApi";
import { toast } from "sonner";

interface PublicationInquiryFormProps {
    publication: Publication;
}

interface FormValues {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    inquiry_type: InquiryType;
    message: string;
}

export default function PublicationInquiryForm({
    publication,
}: PublicationInquiryFormProps) {
    const locale = useLocale();
    const [submitInquiry, { isLoading }] = useSubmitPublicationInquiryMutation();
    const [submittedRef, setSubmittedRef] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const isPaid = publication.price && Number(publication.price) > 0;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            inquiry_type: isPaid ? "paid_publication_request" : "document_request",
            message: "",
        },
    });

    const selectedType = watch("inquiry_type");

    const onSubmit = async (data: FormValues) => {
        try {
            const payload = {
                publication_id: publication.publication_id,
                inquiry_type: data.inquiry_type,
                name: data.name.trim(),
                company: data.company?.trim() || undefined,
                email: data.email.trim(),
                phone: data.phone?.trim() || undefined,
                message: data.message.trim(),
            };

            const response = await submitInquiry(payload).unwrap();

            if (response.success) {
                setSubmittedRef(response.reference_code);
                toast.success(
                    locale === "am"
                        ? "ጥያቄዎ በተሳካ ሁኔታ ተልኳል!"
                        : "Inquiry submitted successfully!"
                );
                reset();
            }
        } catch (error: unknown) {
            console.error("Submission error:", error);
            const errMsg =
                typeof error === "object" && error !== null && "data" in error
                    ? (error as { data?: { message?: string } }).data?.message
                    : undefined;
            toast.error(
                errMsg ||
                    (locale === "am"
                        ? "ጥያቄዎን ማስገባት አልተቻለም። እባክዎ እንደገና ይሞክሩ።"
                        : "Failed to submit inquiry. Please check your inputs and try again.")
            );
        }
    };

    const copyReference = () => {
        if (!submittedRef) return;
        navigator.clipboard.writeText(submittedRef);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    if (submittedRef) {
        return (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-emerald-200 shadow-sm text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {locale === "am"
                        ? "ጥያቄዎ በተሳካ ሁኔታ ተመዝግቧል"
                        : "Request Successfully Registered"}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {locale === "am"
                        ? "የማዕድን ኢንዱስትሪ ልማት ኢንስቲትዩት ጥያቄዎን ተቀብሏል። የጥያቄዎን ሁኔታ ለመከታተል ይህን የማጣቀሻ ቁጥር ይያዙ።"
                        : "The Mineral Industry Development Institute has received your request. Please retain your institutional reference code for follow-up."}
                </p>

                {/* Reference Code Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 mb-6">
                    <div className="text-left">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            {locale === "am" ? "የማጣቀሻ ቁጥር" : "Reference Code"}
                        </span>
                        <span className="font-mono font-bold text-lg text-primary">
                            {submittedRef}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyReference}
                        className="gap-1.5 h-9"
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </Button>
                </div>

                <Button
                    variant="outline"
                    onClick={() => setSubmittedRef(null)}
                    className="w-full rounded-xl"
                >
                    {locale === "am" ? "ሌላ ጥያቄ ያስገቡ" : "Submit Another Request"}
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                    {isPaid ? (
                        <CreditCard className="w-5 h-5 text-amber-600" />
                    ) : (
                        <FileText className="w-5 h-5 text-primary" />
                    )}
                    <h3 className="text-xl font-bold text-slate-900">
                        {isPaid
                            ? locale === "am"
                                ? "የህትመት ግዢ ወይም መዳረሻ ጥያቄ"
                                : "Publication Order & Access Request"
                            : locale === "am"
                            ? "የሰነድ ወይም የጥናት ጥያቄ ቅፅ"
                            : "Document & Inquiry Request"}
                    </h3>
                </div>

                {isPaid && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        <span className="font-semibold block mb-0.5">
                            {locale === "am" ? "ተቋማዊ ዋጋ:" : "Institutional Price:"}{" "}
                            {publication.price} {publication.currency}
                        </span>
                        {locale === "am"
                            ? "ይህን ቅጽ ሲያስገቡ ይፋዊ የባንክ ሂሳብ መመሪያ ይላክልዎታል። ክፍያዎ በባለሙያ ሲረጋገጥ የመዳረሻ ፈቃድ ያገኛሉ።"
                            : "Upon request submission, verified MIDI institutional account instructions will be provided. Access is granted once your payment evidence is reviewed."}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Inquiry Type */}
                <div>
                    <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                        {locale === "am" ? "የጥያቄ አይነት *" : "Inquiry / Request Type *"}
                    </Label>
                    <Select
                        value={selectedType}
                        onValueChange={(val: InquiryType) => setValue("inquiry_type", val)}
                    >
                        <SelectTrigger className="h-10 rounded-xl">
                            <SelectValue placeholder="Select Request Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="document_request">
                                {locale === "am"
                                    ? "የሰነድ መዳረሻ ጥያቄ"
                                    : "Document Access Request"}
                            </SelectItem>
                            <SelectItem value="paid_publication_request">
                                {locale === "am"
                                    ? "የህትመት ግዢ ጥያቄ"
                                    : "Purchase / Commercial Request"}
                            </SelectItem>
                            <SelectItem value="general_inquiry">
                                {locale === "am"
                                    ? "አጠቃላይ የጥናት ጥያቄ"
                                    : "General Research Inquiry"}
                            </SelectItem>
                            <SelectItem value="access_request">
                                {locale === "am"
                                    ? "ተቋማዊ ትብብር ጥያቄ"
                                    : "Institutional Collaboration Request"}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submitter Name */}
                <div>
                    <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                        {locale === "am" ? "ሙሉ ስም *" : "Full Name *"}
                    </Label>
                    <Input
                        placeholder={locale === "am" ? "ስምዎን ያስገቡ" : "e.g. Dr. Abebe Kebede"}
                        {...register("name", { required: "Name is required" })}
                        className="h-10 rounded-xl"
                    />
                    {errors.name && (
                        <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Email Address */}
                <div>
                    <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                        {locale === "am" ? "ኢሜይል አድራሻ *" : "Email Address *"}
                    </Label>
                    <Input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address",
                            },
                        })}
                        className="h-10 rounded-xl"
                    />
                    {errors.email && (
                        <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Organization & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                            {locale === "am" ? "ተቋም / ድርጅት" : "Organization / Company"}
                        </Label>
                        <Input
                            placeholder={locale === "am" ? "አማራጭ" : "Optional"}
                            {...register("company")}
                            className="h-10 rounded-xl"
                        />
                    </div>

                    <div>
                        <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                            {locale === "am" ? "ስልክ ቁጥር" : "Phone Number"}
                        </Label>
                        <Input
                            placeholder="+251 ..."
                            {...register("phone")}
                            className="h-10 rounded-xl"
                        />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                        {locale === "am"
                            ? "መልእክት ወይም የጥናት ዓላማ *"
                            : "Message / Purpose of Request *"}
                    </Label>
                    <Textarea
                        rows={4}
                        placeholder={
                            locale === "am"
                                ? "የጥያቄዎን ዝርዝር እና የጥናት ዓላማ እዚህ ይግለጹ..."
                                : "Please state your research objectives, requested sections, or verification details..."
                        }
                        {...register("message", { required: "Message is required" })}
                        className="rounded-xl resize-none"
                    />
                    {errors.message && (
                        <p className="text-xs text-rose-600 mt-1">{errors.message.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl font-medium gap-2 shadow-sm mt-2"
                >
                    <Send className="w-4 h-4" />
                    {isLoading
                        ? locale === "am"
                            ? "በመላክ ላይ..."
                            : "Submitting..."
                        : locale === "am"
                        ? "ጥያቄ አስገባ"
                        : "Submit Inquiry"}
                </Button>
            </form>
        </div>
    );
}
