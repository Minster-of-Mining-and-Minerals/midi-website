"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { useGetCanvasQuery, useCreateOrUpdateCanvasMutation } from "@/redux/api/canvasApi";
import { notify, extractErrorMessage } from "@/utils/notification";
import { CanvasWords } from "@/redux/types/canvas";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

const WORD_KEYS = [
    { key: "top_left_1", label: "Top Left 1 (e.g. Sustainable)" },
    { key: "top_left_2", label: "Top Left 2 (e.g. Investment)" },
    { key: "top_left_3", label: "Top Left 3 (e.g. Quality)" },
    { key: "top_left_4", label: "Top Left 4 (e.g. Integrity)" },

    { key: "top_right_1", label: "Top Right 1 (Vertical - e.g. VALUE)" },
    { key: "top_right_2", label: "Top Right 2 (Vertical - e.g. GROWTH)" },
    { key: "top_right_3", label: "Top Right 3 (e.g. Innovation)" },
    { key: "top_right_4", label: "Top Right 4 (e.g. Collaboration)" },

    { key: "center", label: "Center Main Word (e.g. IMPACT)" },

    { key: "bottom_left_1", label: "Bottom Left 1 (e.g. Empowerment)" },
    { key: "bottom_left_2", label: "Bottom Left 2 (e.g. Community)" },
    { key: "bottom_left_3", label: "Bottom Left 3 (e.g. Development)" },
    { key: "bottom_left_4", label: "Bottom Left 4 (Vertical - e.g. PROGRESS)" },

    { key: "bottom_right_1", label: "Bottom Right 1 (e.g. Customer)" },
    { key: "bottom_right_2", label: "Bottom Right 2 (e.g. Value)" },
    { key: "bottom_right_3", label: "Bottom Right 3 (e.g. Competency)" },
    { key: "bottom_right_4", label: "Bottom Right 4 (e.g. Excellence)" },
    { key: "bottom_right_5", label: "Bottom Right 5 (Vertical - e.g. INNOVATION)" },
    { key: "bottom_right_6", label: "Bottom Right 6 (Vertical - e.g. FUTURE)" },
];

export default function AdminCanvasManager() {
    const { data: canvasData, isLoading: isFetching, refetch } = useGetCanvasQuery();
    const [updateCanvas, { isLoading: isUpdating }] = useCreateOrUpdateCanvasMutation();

    const [titlePrefix, setTitlePrefix] = useState("");
    const [titleHighlight, setTitleHighlight] = useState("");
    const [description, setDescription] = useState("");
    const [visionTitle, setVisionTitle] = useState("");
    const [visionDescription, setVisionDescription] = useState("");
    const [words, setWords] = useState<CanvasWords>({});

    useEffect(() => {
        if (canvasData) {
            setTitlePrefix(canvasData.title_prefix || "");
            setTitleHighlight(canvasData.title_highlight || "");
            setDescription(canvasData.description || "");
            setVisionTitle(canvasData.vision_title || "");
            setVisionDescription(canvasData.vision_description || "");
            setWords(canvasData.words || {});
        }
    }, [canvasData]);

    const handleSave = async () => {
        try {
            await updateCanvas({
                title_prefix: titlePrefix,
                title_highlight: titleHighlight,
                description,
                vision_title: visionTitle,
                vision_description: visionDescription,
                words,
            }).unwrap();
            notify.success("Canvas section updated successfully.");
            refetch();
        } catch (error) {
            console.error("Failed to update canvas", error);
            notify.error(extractErrorMessage(error, "Failed to update canvas section."));
        }
    };

    const handleWordChange = (key: string, value: string) => {
        setWords((prev) => ({ ...prev, [key]: value }));
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-primary">Canvas (Word Cloud) Management</h2>
                    <p className="text-sm text-gray-500">Manage the texts and words of the canvas section.</p>
                </div>
                <div className="flex gap-2">
                    <ComponentGuard anyPermissions={['HERO:UPDATE']}>
                        <Button
                            variant="admin-primary"
                            onClick={handleSave}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </ComponentGuard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 h-fit">
                    <CardHeader className="border-b py-3 px-4">
                        <CardTitle className="text-base font-semibold text-primary">
                            Headings & Vision
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-medium text-sm text-primary uppercase tracking-wider">Top Section</h3>
                            <div className="space-y-2">
                                <Label>Title Prefix</Label>
                                <Input
                                    value={titlePrefix}
                                    onChange={(e) => setTitlePrefix(e.target.value)}
                                    placeholder="e.g. Creating Value. "
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Title Highlight (Colored text)</Label>
                                <Input
                                    value={titleHighlight}
                                    onChange={(e) => setTitleHighlight(e.target.value)}
                                    placeholder="e.g. Driving Sustainable Growth."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description"
                                />
                            </div>
                        </div>

                        <hr />

                        <div className="space-y-4">
                            <h3 className="font-medium text-sm text-primary uppercase tracking-wider">Vision Section</h3>
                            <div className="space-y-2">
                                <Label>Vision Title</Label>
                                <Input
                                    value={visionTitle}
                                    onChange={(e) => setVisionTitle(e.target.value)}
                                    placeholder="e.g. Our Vision"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vision Description</Label>
                                <Textarea
                                    rows={3}
                                    value={visionDescription}
                                    onChange={(e) => setVisionDescription(e.target.value)}
                                    placeholder="Enter vision text"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200">
                    <CardHeader className="border-b py-3 px-4 flex justify-between items-center flex-row">
                        <CardTitle className="text-base font-semibold text-primary">
                            Word Cloud Canvas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-6">
                            Edit the words that appear in the dynamic canvas. The layout positions are fixed to ensure the design remains intact.
                        </p>

                        <div className="space-y-6">
                            {/* Grouping by region for better UX */}
                            {["top_left", "top_right", "center", "bottom_left", "bottom_right"].map((region) => (
                                <div key={region} className="p-4 border rounded-lg space-y-4">
                                    <h4 className="font-medium text-sm text-primary uppercase">
                                        {region.replace("_", " ")}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {WORD_KEYS.filter(k => k.key.startsWith(region)).map((w) => (
                                            <div key={w.key} className="space-y-1">
                                                <Label className="text-xs text-foreground">{w.label}</Label>
                                                <Input
                                                    value={words[w.key] || ""}
                                                    onChange={(e) => handleWordChange(w.key, e.target.value)}
                                                    placeholder="Enter word"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
