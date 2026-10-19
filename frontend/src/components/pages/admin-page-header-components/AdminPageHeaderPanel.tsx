"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { notify, extractErrorMessage } from "@/utils/notification";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ImageUploadField } from "@/components/common/ImageUploadField";
import { LucideIconPicker } from "@/components/common/LucideIconPicker";
import {
    useGetPageHeaderByIdentifierQuery,
    useUpdatePageHeaderMutation,
} from "@/redux/api/pageHeaderApi";

const PAGE_OPTIONS = [
    { value: "about", label: "About Page" },
    { value: "businesses", label: "Businesses Page" },
    { value: "careers", label: "Careers Page" },
    { value: "contact", label: "Contact Page" },
    { value: "news", label: "News Page" },
    { value: "products", label: "Products Page" },
    { value: "services", label: "Services Page" },
];

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

export default function AdminPageHeaderPanel() {
    const [selectedPage, setSelectedPage] = useState<string>("about");

    const { data: pageHeaderData, isLoading: isFetching } = useGetPageHeaderByIdentifierQuery(
        selectedPage,
        { skip: !selectedPage }
    );
    const [updatePageHeader, { isLoading: isUpdating }] = useUpdatePageHeaderMutation();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("Info");
    const [attachmentId, setAttachmentId] = useState<string | null>(null);

    useEffect(() => {
        if (pageHeaderData) {
            setTitle(pageHeaderData.title || "");
            setDescription(pageHeaderData.description || "");
            setIcon(pageHeaderData.icon || "Info");
            setAttachmentId(pageHeaderData.attachment_id || null);
        } else {
            setTitle("");
            setDescription("");
            setIcon("Info");
            setAttachmentId(null);
        }
    }, [pageHeaderData, selectedPage]);

    const handleSave = async () => {
        try {
            await updatePageHeader({
                identifier: selectedPage,
                body: {
                    title,
                    description,
                    icon,
                    attachment_id: attachmentId,
                },
            }).unwrap();
            notify.success("Page header updated successfully.");
        } catch (error: any) {
            notify.error(extractErrorMessage(error, "Failed to update page header."));
        }
    };

    const isLoading = isFetching || isUpdating;

    return (
        <Card className="w-full mt-8">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-primary">
                        Manage Page Headers
                    </CardTitle>
                    <ComponentGuard anyPermissions={['PAGE_HEADERS:UPDATE']}>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-golden-dark hover:bg-golden-darkHover text-white"
                        >
                            {isUpdating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </ComponentGuard>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Select Page</Label>
                    <div className="w-full overflow-x-auto pb-2">
                        <Tabs value={selectedPage} onValueChange={setSelectedPage} className="w-full">
                            <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0">
                                {PAGE_OPTIONS.map((opt) => (
                                    <TabsTrigger
                                        key={opt.value}
                                        value={opt.value}
                                        className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md px-4 py-2"
                                    >
                                        {opt.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {isFetching ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 animate-spin text-golden-dark" />
                    </div>
                ) : (
                    <div className="space-y-6 border-t pt-6">
                        <div className="space-y-2">
                            <Label>Icon</Label>
                            <LucideIconPicker value={icon} onChange={(iconName) => setIcon(iconName)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter page title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter page description"
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <ImageUploadField
                                id="header-background"
                                label="Background Image (Optional)"
                                value={attachmentId ? [attachmentId] : []}
                                onChange={(ids) => setAttachmentId(ids[0] || null)}
                                category="headline"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
