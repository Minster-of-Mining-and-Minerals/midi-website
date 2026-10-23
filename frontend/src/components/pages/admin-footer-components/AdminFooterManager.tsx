"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import FooterSocialMedia from "../contact-page-components/FooterSocialMedia";
import { notify } from "@/utils/notification";

import {
    useGetFootersQuery,
    useCreateFooterMutation,
    useUpdateFooterMutation,
    useDeleteFooterMutation,
} from "@/redux/api/footerApi";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { DEFAULT_FOOTER, FOOTER_SECTION_COUNT } from "@/components/public-layout/footerDefaults";

const newId = () => Math.random().toString(36).substring(2, 9);

// Same rule as the backend: internal path, anchor, full URL, mailto:/tel:, or empty for plain text
const isValidFooterUrl = (url: string) => url.trim() === "" || /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(url.trim());

// The default footer columns, as editable sections
const defaultSections = (from = 0): FooterSection[] =>
    DEFAULT_FOOTER.sections.slice(from, FOOTER_SECTION_COUNT).map((s) => ({
        id: newId(),
        title: s.title,
        links: s.links.map((l) => ({ id: newId(), label: l.label, href: l.url })),
    }));

interface FooterLink {
    id: string;
    label: string;
    href: string;
    footer_link_id?: string;
}

interface FooterSection {
    id: string;
    title: string;
    links: FooterLink[];
    footer_section_id?: string; // Add this to track the actual DB ID
}

export default function AdminFooterManager() {
    const { data: footers, isLoading } = useGetFootersQuery();
    const [createFooter, { isLoading: isCreating }] = useCreateFooterMutation();
    const [updateFooter, { isLoading: isUpdating }] = useUpdateFooterMutation();
    const [deleteFooterSection] = useDeleteFooterMutation(); // Add this
    const [attachmentId, setAttachmentId] = useState<string[]>([]);
    const isSaving = isCreating || isUpdating;

    // Starts with the footer the public site shows until something is saved
    const [footerData, setFooterData] = useState({
        footer_id: "",
        title: DEFAULT_FOOTER.title,
        text: DEFAULT_FOOTER.copyright(),
        content: DEFAULT_FOOTER.content,
        attachment_id: "",
        sections: defaultSections(),
    });

    const [activeTab, setActiveTab] = useState("");

    /* -------------------------
    LOAD DATA FROM API
    --------------------------*/

    useEffect(() => {
        if (footers && footers.length > 0 && !isLoading) {
            const f = footers[0];

            const mappedSections: FooterSection[] =
                f.sections?.map((s: any) => ({
                    id: newId(), // Local UI ID
                    footer_section_id: s.footer_section_id, // Store the actual DB ID
                    title: s.section_name,
                    links:
                        s.links?.map((l: any) => ({
                            id: newId(),
                            label: l.label,
                            href: l.url,
                        })) ?? [],
                })) ?? [];

            // Always 3 sections, padded with the default columns (same as the public footer)
            const displayedSections = [
                ...mappedSections,
                ...defaultSections(mappedSections.length),
            ].slice(0, FOOTER_SECTION_COUNT);

            setFooterData({
                footer_id: f.footer_id,
                title: f.title || DEFAULT_FOOTER.title,
                text: f.text || DEFAULT_FOOTER.copyright(),
                content: f.content || "",
                attachment_id: f.attachment_id || "",
                sections: displayedSections,
            });

            if (f.attachment_id) {
                setAttachmentId([f.attachment_id]);
            }

            if (displayedSections.length > 0) {
                setActiveTab(displayedSections[0].id);
            }
        }
    }, [footers, isLoading]);

    /* -------------------------
    SAVE
    --------------------------*/

    const handleSave = async () => {
        // Catch link URLs the backend would reject, with a message that names the link
        for (const section of footerData.sections) {
            for (const link of section.links) {
                if (!link.label.trim()) {
                    notify.error(`A link in "${section.title}" has no label.`);
                    return;
                }
                if (!isValidFooterUrl(link.href)) {
                    notify.error(
                        `"${link.label}" in "${section.title}": the URL must start with "/", "https://", "mailto:" or "tel:", or be left empty for plain text.`
                    );
                    return;
                }
            }
        }

        try {
            const payload: any = {
                title: footerData.title,
                text: footerData.text,
                sections: footerData.sections.map((s) => ({
                    // Include footer_section_id if it exists (for updating existing sections)
                    ...(s.footer_section_id && { footer_section_id: s.footer_section_id }),
                    section_name: s.title,
                    links: s.links.map((l) => ({
                        label: l.label.trim(),
                        url: l.href.trim(),
                    })),
                })),
                // Always sent so they can be cleared: "" removes the content, null removes the logo
                content: footerData.content.trim(),
                attachment_id: attachmentId[0] ?? null,
            };

            let result;
            if (footerData.footer_id) {
                result = await updateFooter({
                    id: footerData.footer_id,
                    data: payload,
                }).unwrap();
            } else {
                result = await createFooter(payload).unwrap();
            }

            if (result) {
                notify.success("Footer settings saved successfully.");
            }
        } catch (error) {
            console.error("Error saving footer:", error);
            notify.error("Failed to save footer settings.", error);
        }
    };

    /* -------------------------
    UPDATE TITLE
    --------------------------*/

    const updateTitle = (value: string) => {
        setFooterData({
            ...footerData,
            title: value,
        });
    };

    /* -------------------------
    SECTION MANAGEMENT
    --------------------------*/

    // addSection and removeSection logic removed as per requirements (fixed 3 sections)

    const updateSectionTitle = (id: string, title: string) => {
        setFooterData({
            ...footerData,
            sections: footerData.sections.map((s) =>
                s.id === id ? { ...s, title } : s
            ),
        });
    };

    /* -------------------------
    LINK MANAGEMENT
    --------------------------*/

    const addLink = (sectionId: string) => {
        setFooterData({
            ...footerData,
            sections: footerData.sections.map((s) => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        links: [
                            ...s.links,
                            {
                                id: newId(),
                                label: "New Link",
                                href: "",
                            },
                        ],
                    };
                }
                return s;
            }),
        });
    };

    const removeLink = (sectionId: string, linkId: string) => {
        setFooterData({
            ...footerData,
            sections: footerData.sections.map((s) => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        links: s.links.filter((l) => l.id !== linkId),
                    };
                }
                return s;
            }),
        });
    };

    const updateLink = (
        sectionId: string,
        linkId: string,
        field: keyof FooterLink,
        value: string
    ) => {
        setFooterData({
            ...footerData,
            sections: footerData.sections.map((s) => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        links: s.links.map((l) =>
                            l.id === linkId ? { ...l, [field]: value } : l
                        ),
                    };
                }
                return s;
            }),
        });
    };

    /* -------------------------
    UI
    --------------------------*/

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-primary">
                            Footer Information
                        </CardTitle>

                        <div className="flex gap-3">
                            <ComponentGuard anyPermissions={['FOOTER:UPDATE']}>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-golden-dark hover:bg-golden-darkHover"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </ComponentGuard>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* MAIN INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                        <div className="space-y-2">
                            <Label>Footer Title</Label>
                            <Input
                                value={footerData.title}
                                onChange={(e) => updateTitle(e.target.value)}
                                placeholder={DEFAULT_FOOTER.title}
                            />
                            <p className="text-xs text-muted-foreground">Shown under the logo.</p>
                        </div>

                        <div className="space-y-2">
                            <ImageUploadField
                                id="footer-logo"
                                label="Logo"
                                value={attachmentId}
                                onChange={(ids: string[]) => setAttachmentId(ids)}
                                category="footer"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Short Description (Optional)</Label>
                            <Textarea
                                value={footerData.content || ""}
                                onChange={(e) => setFooterData({
                                    ...footerData,
                                    content: e.target.value
                                })}
                                placeholder="A sentence or two about MIDI, shown under the footer title"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* TABS */}
                    <Tabs value={activeTab || footerData.sections[0]?.id || "social"} onValueChange={setActiveTab}>
                        <TabsList className="flex flex-wrap gap-2 mb-6 p-1">
                            {footerData.sections.map((section) => (
                                <TabsTrigger key={section.id} value={section.id}>
                                    {section.title} ({section.links.length})
                                </TabsTrigger>
                            ))}
                            <TabsTrigger value="social">Social Links</TabsTrigger>
                        </TabsList>

                        {footerData.sections.map((section) => (
                            <TabsContent key={section.id} value={section.id}>
                                <SectionEditor
                                    section={section}
                                    updateTitle={(title) => updateSectionTitle(section.id, title)}
                                    addLink={() => addLink(section.id)}
                                    updateLink={(linkId, field, value) =>
                                        updateLink(section.id, linkId, field, value)
                                    }
                                    removeLink={(linkId) => removeLink(section.id, linkId)}
                                />
                            </TabsContent>
                        ))}

                        <TabsContent value="social">
                            <FooterSocialMedia />
                        </TabsContent>
                    </Tabs>

                    {/* Removed fixed empty state conditional since sections are always 3 */}

                    {/* COPYRIGHT TEXT */}
                    <div className="space-y-2 pt-4 border-t">
                        <Label>Copyright Text</Label>
                        <Input
                            value={footerData.text}
                            onChange={(e) =>
                                setFooterData({
                                    ...footerData,
                                    text: e.target.value,
                                })
                            }
                            placeholder="Enter copyright text"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/* -------------------------
SECTION EDITOR COMPONENT
--------------------------*/

interface SectionEditorProps {
    section: FooterSection;
    updateTitle: (title: string) => void;
    addLink: () => void;
    updateLink: (linkId: string, field: keyof FooterLink, value: string) => void;
    removeLink: (linkId: string) => void;
}

function SectionEditor({
    section,
    updateTitle,
    addLink,
    updateLink,
    removeLink,
}: SectionEditorProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2 flex-1">
                    <Label className="text-xs text-gray-500 uppercase font-bold">
                        Section Name:
                    </Label>

                    <Input
                        className="max-w-[200px] h-8 font-semibold"
                        value={section.title}
                        onChange={(e) => updateTitle(e.target.value)}
                        placeholder="Enter section name"
                    />
                </div>

                <div className="flex gap-2">
                    <ComponentGuard anyPermissions={['FOOTER:UPDATE']}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addLink}
                            className="border-golden-dark bg-primary text-golden-dark h-8"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Link
                        </Button>
                    </ComponentGuard>
                </div>
            </div>

            <Card className="border-gray-100 shadow-none bg-gray-50/20">
                <CardContent className="p-4 space-y-3">
                    {section.links.map((link) => (
                        <div key={link.id} className="flex gap-4 items-start">
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs">Label</Label>
                                <Input
                                    className="h-8"
                                    value={link.label}
                                    onChange={(e) =>
                                        updateLink(link.id, "label", e.target.value)
                                    }
                                    placeholder="Link label"
                                />
                            </div>

                            <div className="flex-1 space-y-1">
                                <Label className="text-xs">URL</Label>
                                <Input
                                    className="h-8"
                                    value={link.href}
                                    onChange={(e) =>
                                        updateLink(link.id, "href", e.target.value)
                                    }
                                    placeholder="/about, https://… or empty for plain text"
                                />
                            </div>

                            <ComponentGuard anyPermissions={['FOOTER:UPDATE']}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLink(link.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive/90 mt-5"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </ComponentGuard>
                        </div>
                    ))}

                    {section.links.length === 0 && (
                        <div className="text-center py-6">
                            <p className="text-gray-500 text-sm mb-3">
                                No links in this section
                            </p>
                            <ComponentGuard anyPermissions={['FOOTER:UPDATE']}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addLink}
                                    className="border-golden-dark text-golden-dark"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Link
                                </Button>
                            </ComponentGuard>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
