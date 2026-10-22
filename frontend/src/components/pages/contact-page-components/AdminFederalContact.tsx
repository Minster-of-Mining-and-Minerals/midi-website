"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Save,
    MapPin,
    Phone,
    Mail,
    Loader2,
    MessageSquare,
    Send,
} from "lucide-react";
import {
    useGetFederalOfficesQuery,
    useCreateFederalOfficeMutation,
    useUpdateFederalOfficeMutation,
} from "@/redux/api/federalOfficeApi";
import {
    useGetPageHeaderByIdentifierQuery,
    useUpdatePageHeaderMutation,
} from "@/redux/api/pageHeaderApi";
import { notify, extractErrorMessage } from "@/utils/notification";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import MapPicker from "@/components/common/MapPicker";
import { CONTACT_SECTIONS, ContactSectionKey, DEFAULT_CONTACT_DETAILS } from "./contactSections";

interface ContactInfo {
    address: string;
    phone: string;
    email: string;
    location: string;
}

type SectionText = Record<ContactSectionKey, { title: string; description: string }>;

const SECTION_KEYS = Object.keys(CONTACT_SECTIONS) as ContactSectionKey[];

/**
 * Admin → Contacts → Contact Information.
 * Everything shown on the public contact page, in page order:
 * contact details go to federal_office_contacts, section text to page_headers.
 */
export default function AdminFederalContact() {
    // Fetch federal offices and get the first one (index 0)
    const { data: federalOffices, isLoading, isError, error } = useGetFederalOfficesQuery();
    const { data: infoText, isLoading: isInfoLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.info.identifier);
    const { data: formText, isLoading: isFormLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.form.identifier);
    const { data: mapText, isLoading: isMapLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.map.identifier);

    // Loading state
    if (isLoading || isInfoLoading || isFormLoading || isMapLoading) {
        return (
            <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6 flex justify-center items-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-golden-dark" />
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (isError) {
        console.error("Failed to load contact office:", error);
        // Still show the form with empty fields
    }

    const existingOffice = federalOffices?.[0];

    // Map API data to the form; fields start with the defaults until something is saved
    const initialContact: ContactInfo = {
        address: existingOffice?.office_address || DEFAULT_CONTACT_DETAILS.address,
        phone: existingOffice?.phone || DEFAULT_CONTACT_DETAILS.phone,
        email: existingOffice?.email || DEFAULT_CONTACT_DETAILS.email,
        location: existingOffice?.map_location || "",
    };
    const sectionText = (key: ContactSectionKey, saved?: { title?: string; description?: string } | null) => ({
        title: saved?.title || CONTACT_SECTIONS[key].defaultTitle,
        description: saved?.description || CONTACT_SECTIONS[key].defaultDescription,
    });
    const initialText: SectionText = {
        info: sectionText("info", infoText),
        form: sectionText("form", formText),
        map: sectionText("map", mapText),
    };

    return (
        <ContactInformationForm
            officeId={existingOffice?.federal_office_id}
            initialContact={initialContact}
            initialText={initialText}
        />
    );
}

interface ContactInformationFormProps {
    officeId?: string;
    initialContact: ContactInfo;
    initialText: SectionText;
}

function ContactInformationForm({ officeId, initialContact, initialText }: ContactInformationFormProps) {
    const [createFederalOffice] = useCreateFederalOfficeMutation();
    const [updateFederalOffice] = useUpdateFederalOfficeMutation();
    const [updatePageHeader] = useUpdatePageHeaderMutation();

    const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContact);
    const [text, setText] = useState<SectionText>(initialText);
    const [isSaving, setIsSaving] = useState(false);

    const updateText = (key: ContactSectionKey, field: "title" | "description", value: string) => {
        setText((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const officeData = {
                office_address: contactInfo.address,
                phone: contactInfo.phone || undefined,
                email: contactInfo.email || undefined,
                map_location: contactInfo.location || undefined,
            };

            await Promise.all([
                officeId
                    ? updateFederalOffice({ id: officeId, data: officeData }).unwrap()
                    : createFederalOffice(officeData).unwrap(),
                ...SECTION_KEYS.map((key) =>
                    updatePageHeader({
                        identifier: CONTACT_SECTIONS[key].identifier,
                        body: {
                            title: text[key].title.trim(),
                            description: text[key].description.trim(),
                        },
                    }).unwrap()
                ),
            ]);
            notify.success("Contact information saved successfully.");
        } catch (error) {
            console.error("Failed to save contact information:", error);
            notify.error(extractErrorMessage(error, "Failed to save contact information."));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl font-bold text-primary">
                            Contact Information
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Everything shown on the public contact page, in page order. Fields start with the current defaults; edit them and save to change the page.
                        </p>
                    </div>
                    <ComponentGuard anyPermissions={["CONTACT:UPDATE", "PAGE_HEADERS:UPDATE"]}>
                        <Button
                            onClick={handleSave}
                            className="bg-golden-dark hover:bg-golden-darkHover"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {officeId ? "Save Changes" : "Create Details"}
                        </Button>
                    </ComponentGuard>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Get In Touch */}
                <SectionTextFields
                    sectionKey="info"
                    heading="Get In Touch"
                    icon={<MessageSquare className="w-4 h-4 text-golden-dark" />}
                    text={text.info}
                    onChange={updateText}
                    disabled={isSaving}
                />

                {/* Contact details */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-golden-dark" />
                                Office Address
                            </Label>
                            <Input
                                id="address"
                                value={contactInfo.address}
                                onChange={(e) =>
                                    setContactInfo({ ...contactInfo, address: e.target.value })
                                }
                                placeholder={DEFAULT_CONTACT_DETAILS.address}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-golden-dark" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                value={contactInfo.phone}
                                onChange={(e) =>
                                    setContactInfo({ ...contactInfo, phone: e.target.value })
                                }
                                placeholder={DEFAULT_CONTACT_DETAILS.phone}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-golden-dark" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) =>
                                    setContactInfo({ ...contactInfo, email: e.target.value })
                                }
                                placeholder={DEFAULT_CONTACT_DETAILS.email}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>

                {/* Send Us a Message */}
                <div className="pt-6 border-t border-gray-100">
                    <SectionTextFields
                        sectionKey="form"
                        heading="Send Us a Message"
                        icon={<Send className="w-4 h-4 text-golden-dark" />}
                        text={text.form}
                        onChange={updateText}
                        disabled={isSaving}
                    />
                </div>

                {/* Office Location */}
                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <SectionTextFields
                        sectionKey="map"
                        heading="Office Location"
                        icon={<MapPin className="w-4 h-4 text-golden-dark" />}
                        text={text.map}
                        onChange={updateText}
                        disabled={isSaving}
                    />
                    <MapPicker
                        value={contactInfo.location}
                        onChange={(url: string) =>
                            setContactInfo((prev) => ({ ...prev, location: url }))
                        }
                        label="Office Location Pin & Coordinates Picker"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

interface SectionTextFieldsProps {
    sectionKey: ContactSectionKey;
    heading: string;
    icon: React.ReactNode;
    text: { title: string; description: string };
    onChange: (key: ContactSectionKey, field: "title" | "description", value: string) => void;
    disabled: boolean;
}

function SectionTextFields({ sectionKey, heading, icon, text, onChange, disabled }: SectionTextFieldsProps) {
    const section = CONTACT_SECTIONS[sectionKey];
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-2">
                {icon}
                {heading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor={`${sectionKey}-title`}>Title</Label>
                    <Input
                        id={`${sectionKey}-title`}
                        value={text.title}
                        onChange={(e) => onChange(sectionKey, "title", e.target.value)}
                        placeholder={section.defaultTitle}
                        disabled={disabled}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${sectionKey}-description`}>Description</Label>
                    <Textarea
                        id={`${sectionKey}-description`}
                        value={text.description}
                        onChange={(e) => onChange(sectionKey, "description", e.target.value)}
                        placeholder={section.defaultDescription}
                        rows={3}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}
