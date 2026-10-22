"use client";

import { useState } from "react";
import { Save, Loader2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import {
    useGetPageHeaderByIdentifierQuery,
    useUpdatePageHeaderMutation,
} from "@/redux/api/pageHeaderApi";
import { notify, extractErrorMessage } from "@/utils/notification";
import AdminFederalContact from "./AdminFederalContact";
import { CONTACT_SECTIONS, ContactSectionKey } from "./contactSections";

export default function AdminContactInfo() {
    return (
        <div className="space-y-6">
            <AdminFederalContact />
            <AdminContactSectionText />
        </div>
    );
}

type SectionText = Record<ContactSectionKey, { title: string; description: string }>;

const SECTION_KEYS = Object.keys(CONTACT_SECTIONS) as ContactSectionKey[];

function AdminContactSectionText() {
    const { data: infoText, isLoading: isInfoLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.info.identifier);
    const { data: formText, isLoading: isFormLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.form.identifier);
    const { data: mapText, isLoading: isMapLoading } = useGetPageHeaderByIdentifierQuery(CONTACT_SECTIONS.map.identifier);

    if (isInfoLoading || isFormLoading || isMapLoading) {
        return (
            <Card className="shadow-sm border-gray-200">
                <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
                    <Loader2 className="w-8 h-8 animate-spin text-golden-dark" />
                </CardContent>
            </Card>
        );
    }

    // Map saved page_headers rows to the form
    const savedText: SectionText = {
        info: { title: infoText?.title || "", description: infoText?.description || "" },
        form: { title: formText?.title || "", description: formText?.description || "" },
        map: { title: mapText?.title || "", description: mapText?.description || "" },
    };

    return <SectionTextForm initialText={savedText} />;
}

function SectionTextForm({ initialText }: { initialText: SectionText }) {
    const [updatePageHeader] = useUpdatePageHeaderMutation();
    const [text, setText] = useState<SectionText>(initialText);
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (key: ContactSectionKey, field: "title" | "description", value: string) => {
        setText((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await Promise.all(
                SECTION_KEYS.map((key) =>
                    updatePageHeader({
                        identifier: CONTACT_SECTIONS[key].identifier,
                        body: {
                            title: text[key].title.trim(),
                            description: text[key].description.trim(),
                        },
                    }).unwrap()
                )
            );
            notify.success("Contact page text updated successfully.");
        } catch (error) {
            console.error("Failed to save contact page text:", error);
            notify.error(extractErrorMessage(error, "Failed to save contact page text."));
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
                            Contact Page Section Text
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Titles and introductions shown on the public contact page. Leave a field empty to use the default text shown in grey.
                        </p>
                    </div>
                    <ComponentGuard anyPermissions={["PAGE_HEADERS:UPDATE"]}>
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
                            Save Text
                        </Button>
                    </ComponentGuard>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {SECTION_KEYS.map((key, index) => {
                    const section = CONTACT_SECTIONS[key];
                    return (
                        <div
                            key={key}
                            className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${index > 0 ? "pt-6 border-t border-gray-100" : ""}`}
                        >
                            <div className="space-y-2">
                                <Label htmlFor={`${key}-title`} className="flex items-center gap-2">
                                    <Type className="w-4 h-4 text-golden-dark" />
                                    {section.label}: Title
                                </Label>
                                <Input
                                    id={`${key}-title`}
                                    value={text[key].title}
                                    onChange={(e) => updateField(key, "title", e.target.value)}
                                    placeholder={section.defaultTitle}
                                    disabled={isSaving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`${key}-description`}>
                                    {section.label}: Introduction
                                </Label>
                                <Textarea
                                    id={`${key}-description`}
                                    value={text[key].description}
                                    onChange={(e) => updateField(key, "description", e.target.value)}
                                    placeholder={section.defaultDescription}
                                    rows={3}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
