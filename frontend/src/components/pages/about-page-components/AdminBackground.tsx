"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { notify, extractErrorMessage } from "@/utils/notification";

import {
    useGetBackgroundsQuery,
    useCreateBackgroundMutation,
    useUpdateBackgroundMutation
} from "@/redux/api/backgroundApi";
import { LucideIconPicker } from "@/components/common/LucideIconPicker";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { ABOUT_BACKGROUND_DEFAULTS } from "./aboutDefaults";

export default function AdminBackground() {
    // Fetch backgrounds
    const { data: backgrounds, isLoading: isFetching } = useGetBackgroundsQuery();
    const [createBackground, { isLoading: isCreating }] = useCreateBackgroundMutation();
    const [updateBackground, { isLoading: isUpdating }] = useUpdateBackgroundMutation();

    // Form state
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [backgroundId, setBackgroundId] = useState<string | null>(null);
    const [icon, setIcon] = useState<string>("Info");
    // Amharic versions (empty = the Amharic page shows the English text)
    const [titleAm, setTitleAm] = useState("");
    const [subtitleAm, setSubtitleAm] = useState("");

    // Map background data to form when fetched; empty fields start with what the public page shows
    useEffect(() => {
        if (backgrounds && backgrounds.length > 0) {
            const background = backgrounds[0]; // Get the first/only background

            setBackgroundId(background.background_id);
            setTitle(background.title || ABOUT_BACKGROUND_DEFAULTS.title);
            setSubtitle(background.description || ABOUT_BACKGROUND_DEFAULTS.description);
            setIcon(background.icon || ABOUT_BACKGROUND_DEFAULTS.icon);
            setTitleAm(background.title_am || "");
            setSubtitleAm(background.description_am || "");
        } else {
            // Nothing saved yet: start with the live defaults
            setTitle(ABOUT_BACKGROUND_DEFAULTS.title);
            setSubtitle(ABOUT_BACKGROUND_DEFAULTS.description);
            setIcon(ABOUT_BACKGROUND_DEFAULTS.icon);
            setTitleAm("");
            setSubtitleAm("");
            setBackgroundId(null);
        }
    }, [backgrounds]);

    const handleSave = async () => {
        const payload = {
            title,
            description: subtitle,
            icon: icon ?? ABOUT_BACKGROUND_DEFAULTS.icon,
            content: "",
            title_am: titleAm.trim(),
            description_am: subtitleAm.trim(),
        };

        try {
            if (backgroundId) {
                // Update existing background
                await updateBackground({
                    id: backgroundId,
                    data: {
                        title,
                        description: subtitle,
                        icon: icon ?? ABOUT_BACKGROUND_DEFAULTS.icon,
                        title_am: titleAm.trim(),
                        description_am: subtitleAm.trim(),
                    },
                }).unwrap();
                notify.success("Background saved.");
            } else {
                // Create new background
                await createBackground(payload).unwrap();
                notify.success("Background saved.");
            }
        } catch (error: any) {
            notify.error(extractErrorMessage(error, "Failed to save the background."));
        }
    };

    const isLoading = isFetching || isCreating || isUpdating;

    if (isFetching) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-golden-dark" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-primary">
                        Edit Background Section
                    </CardTitle>

                    <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-golden-dark hover:bg-golden-darkHover"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {backgroundId ? 'Update' : 'Save'} Changes
                        </Button>
                    </ComponentGuard>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* ICON */}
                <div className="space-y-2">
                    <Label>Icon</Label>
                    <LucideIconPicker
                        value={icon}
                        onChange={(iconName) => setIcon(iconName)}
                    />
                </div>
                {/* TITLE */}
                <div className="space-y-2">
                    <Label htmlFor="title">Main Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter main title"
                    />
                </div>

                {/* SUBTITLE */}
                <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle / Intro</Label>
                    <Textarea
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Enter subtitle"
                    />
                </div>

                {/* AMHARIC */}
                <div className="space-y-2">
                    <Label htmlFor="title-am">Main Title (Amharic)</Label>
                    <Input
                        id="title-am"
                        lang="am"
                        value={titleAm}
                        onChange={(e) => setTitleAm(e.target.value)}
                        placeholder="Leave empty to show the English title on the Amharic page"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subtitle-am">Subtitle / Intro (Amharic)</Label>
                    <Textarea
                        id="subtitle-am"
                        lang="am"
                        value={subtitleAm}
                        onChange={(e) => setSubtitleAm(e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Leave empty to show the English intro on the Amharic page"
                    />
                </div>
            </CardContent>
        </Card>
    );
}