"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, Loader2, ExternalLink, Globe } from "lucide-react";
import { ContactPageSkeleton } from "@/components/skeletons";
import { useGetFederalOfficesQuery } from "@/redux/api/federalOfficeApi";
import { useCreateMessageMutation } from "@/redux/api/messageApi";
import { useGetPageHeaderByIdentifierQuery } from "@/redux/api/pageHeaderApi";
import { useState } from "react";
import { notify, extractErrorMessage } from "@/utils/notification";
import { getGoogleMapsUrl } from "@/utils/mapUtils";
import { CONTACT_SECTIONS } from "./contactSections";

const ContactForm = () => {
    const { data: federalOffices, isLoading } = useGetFederalOfficesQuery();
    const office = federalOffices?.[0];

    const { data: infoText, isLoading: isInfoTextLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.info.identifier);
    const { data: formText, isLoading: isFormTextLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.form.identifier);

    const [createMessage, { isLoading: sending }] = useCreateMessageMutation();

    const [formData, setFormData] = useState({
        full_name: "",
        email_address: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.full_name.trim()) {
            notify.warning("Please enter your full name.");
            return;
        }

        if (!formData.email_address.trim()) {
            notify.warning("Please enter your email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email_address)) {
            notify.warning("Please enter a valid email address.");
            return;
        }

        if (!formData.subject.trim()) {
            notify.warning("Please enter a message subject.");
            return;
        }

        if (!formData.message.trim()) {
            notify.warning("Please enter your message.");
            return;
        }

        try {
            await createMessage(formData).unwrap();
            notify.success("Your message has been sent successfully. We will get back to you shortly.");

            setFormData({
                full_name: "",
                email_address: "",
                subject: "",
                message: "",
            });
        } catch (error: any) {
            console.error("Message send failed:", error);
            notify.error(extractErrorMessage(error, "Failed to send message. Please try again."));
        }
    };

    if (isLoading || isInfoTextLoading || isFormTextLoading) {
        return <ContactPageSkeleton />;
    }

    // Only show what the admin has saved in Contact Details; empty fields are hidden
    const officeAddress = office?.office_address?.trim();
    const officePhone = office?.phone?.trim();
    const officeEmail = office?.email?.trim();
    const mapLocation = office?.map_location;

    const infoTitle = infoText?.title || CONTACT_SECTIONS.info.defaultTitle;
    const infoDescription = infoText?.description || CONTACT_SECTIONS.info.defaultDescription;
    const formTitle = formText?.title || CONTACT_SECTIONS.form.defaultTitle;
    const formDescription = formText?.description || CONTACT_SECTIONS.form.defaultDescription;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT SIDE – CONTACT INFO */}
            <div className="space-y-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-primary">{infoTitle}</h2>
                    <p className="text-muted-foreground mt-1">
                        {infoDescription}
                    </p>
                </div>

                {officeAddress && (
                    <InfoCard
                        icon={<MapPin className="text-golden-dark" />}
                        title="Head Office Address"
                        value={officeAddress}
                    />
                )}

                {officePhone && (
                    <InfoCard
                        icon={<Phone className="text-golden-dark" />}
                        title="Phone Number"
                        value={officePhone}
                        href={`tel:${officePhone.replace(/\s+/g, "")}`}
                    />
                )}

                {officeEmail && (
                    <InfoCard
                        icon={<Mail className="text-golden-dark" />}
                        title="Email Address"
                        value={officeEmail}
                        href={`mailto:${officeEmail}`}
                    />
                )}

                {mapLocation && (
                    <InfoCard
                        icon={<Globe className="text-golden-dark" />}
                        title="Map Location"
                        value="View on Google Maps"
                        href={getGoogleMapsUrl(mapLocation)}
                        isExternal
                    />
                )}
            </div>

            {/* RIGHT SIDE – CONTACT FORM */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-golden-dark mb-2">
                    {formTitle}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                    {formDescription}
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name *</label>
                            <Input
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="h-11"
                                disabled={sending}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address *</label>
                            <Input
                                name="email_address"
                                type="email"
                                value={formData.email_address}
                                onChange={handleChange}
                                placeholder="example@mail.com"
                                className="h-11"
                                disabled={sending}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subject *</label>
                        <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Message subject"
                            className="h-11"
                            disabled={sending}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Message *</label>
                        <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Write your message here..."
                            disabled={sending}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Sending Message...
                            </>
                        ) : (
                            <>
                                <span>Send Message</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;

/* ---------------- COMPONENTS ---------------- */

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    href?: string;
    isExternal?: boolean;
}

const InfoCard = ({ icon, title, value, href, isExternal }: InfoCardProps) => {
    const content = (
        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors shrink-0">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-golden-dark text-sm">{title}</p>
                <p className="text-gray-600 text-sm mt-0.5 break-words flex items-center gap-1.5">
                    <span>{value}</span>
                    {isExternal && <ExternalLink className="w-3.5 h-3.5 inline text-gray-400" />}
                </p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="block hover:opacity-95 transition-opacity"
            >
                {content}
            </a>
        );
    }

    return content;
};