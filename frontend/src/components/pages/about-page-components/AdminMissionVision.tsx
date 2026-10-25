"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { notify } from "@/utils/notification";

import {
    useGetStrategiesQuery,
    useCreateStrategyMutation,
    useUpdateStrategyMutation
} from "@/redux/api/strategyApi";
import { CreateStrategyPayload } from "@/redux/types/strategy";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { ABOUT_STRATEGY_DEFAULTS } from "./aboutDefaults";

type CoreValueForm = { title: string; content: string; title_am: string; content_am: string };

export default function AdminMissionVision() {
    // State for title/description
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // State for sections
    const [mission, setMission] = useState("");
    const [vision, setVision] = useState("");
    const [values, setValues] = useState<CoreValueForm[]>([]);

    // Amharic versions (empty = the Amharic page shows the English text)
    const [titleAm, setTitleAm] = useState("");
    const [descriptionAm, setDescriptionAm] = useState("");
    const [missionAm, setMissionAm] = useState("");
    const [visionAm, setVisionAm] = useState("");

    // Individual attachment states for mission, vision, and core values section icon
    const [missionAttachment, setMissionAttachment] = useState<string[]>([]);
    const [visionAttachment, setVisionAttachment] = useState<string[]>([]);
    const [coreValuesSectionAttachment, setCoreValuesSectionAttachment] = useState<string[]>([]);

    // Store the strategy ID
    const [strategyId, setStrategyId] = useState<string | null>(null);

    // RTK Query hooks
    const { data: strategiesData, isLoading } = useGetStrategiesQuery();
    const [createStrategy, { isLoading: isCreating }] = useCreateStrategyMutation();
    const [updateStrategy, { isLoading: isUpdating }] = useUpdateStrategyMutation();
    const isSaving = isCreating || isUpdating;

    // Map fetched strategy to state; anything not saved starts with what the public page shows
    useEffect(() => {
        if (!strategiesData) return;

        const defaultValues = ABOUT_STRATEGY_DEFAULTS.values.map((v) => ({ ...v, title_am: "", content_am: "" }));
        setTitleAm("");
        setDescriptionAm("");
        setMissionAm("");
        setVisionAm("");

        if (strategiesData.length === 0) {
            // Nothing saved yet: start with the live defaults
            setStrategyId(null);
            setTitle(ABOUT_STRATEGY_DEFAULTS.title);
            setDescription(ABOUT_STRATEGY_DEFAULTS.description);
            setMission(ABOUT_STRATEGY_DEFAULTS.mission);
            setVision(ABOUT_STRATEGY_DEFAULTS.vision);
            setMissionAttachment([]);
            setVisionAttachment([]);
            setCoreValuesSectionAttachment([]);
            setValues(defaultValues);
            return;
        }

        const strategy = strategiesData[0];
        setStrategyId(strategy.strategy_id);

        setTitle(strategy.title || ABOUT_STRATEGY_DEFAULTS.title);
        setDescription(strategy.description || ABOUT_STRATEGY_DEFAULTS.description);
        setTitleAm(strategy.title_am || "");
        setDescriptionAm(strategy.description_am || "");

        // Sections that are missing or empty fall back to the defaults, like the public page
        setMission(ABOUT_STRATEGY_DEFAULTS.mission);
        setVision(ABOUT_STRATEGY_DEFAULTS.vision);
        setValues(defaultValues);

        strategy.sections?.forEach((sec) => {
            if (sec.type === "mission") {
                setMission(sec.content || ABOUT_STRATEGY_DEFAULTS.mission);
                setMissionAm(sec.content_am || "");
                if ((sec as any).attachment_id) {
                    setMissionAttachment([(sec as any).attachment_id]);
                }
            }
            else if (sec.type === "vision") {
                setVision(sec.content || ABOUT_STRATEGY_DEFAULTS.vision);
                setVisionAm(sec.content_am || "");
                if ((sec as any).attachment_id) {
                    setVisionAttachment([(sec as any).attachment_id]);
                }
            }
            else if (sec.type === "core_values") {
                if ((sec as any).attachment_id) {
                    setCoreValuesSectionAttachment([(sec as any).attachment_id]);
                }
                const coreVals = sec.core_values?.map((v) => ({
                    title: v.title || "",
                    content: v.content || "",
                    title_am: v.title_am || "",
                    content_am: v.content_am || "",
                })) || [];
                if (coreVals.length > 0) setValues(coreVals);
            }
        });
    }, [strategiesData]);

    const addValue = () => setValues([...values, { title: "", content: "", title_am: "", content_am: "" }]);
    const removeValue = (index: number) => setValues(values.filter((_, i) => i !== index));
    const moveValue = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= values.length) return;
        const next = [...values];
        [next[index], next[target]] = [next[target], next[index]];
        setValues(next);
    };

    // Removing a filled-in value asks first; empty rows are removed straight away
    const [valueToDelete, setValueToDelete] = useState<number | null>(null);
    const requestRemoveValue = (index: number) => {
        const v = values[index];
        if (v.title.trim() || v.content.trim() || v.title_am.trim() || v.content_am.trim()) setValueToDelete(index);
        else removeValue(index);
    };
    const updateValue = (index: number, field: keyof CoreValueForm, text: string) => {
        setValues(values.map((v, i) => (i === index ? { ...v, [field]: text } : v)));
    };

    // Save handler
    const handleSave = async () => {
        // A value with a description but no title would be dropped on save: stop and say so
        const untitledIndex = values.findIndex((v) => !v.title.trim() && v.content.trim());
        if (untitledIndex !== -1) {
            notify.error(`Core value ${untitledIndex + 1} has a description but no title. Add a title or remove it.`);
            return;
        }

        const sections = [
            {
                type: "mission" as const,
                title: "Our Mission",
                attachment_id: missionAttachment[0], // Use the first attachment ID
                content: mission,
                content_am: missionAm.trim(),
            },
            {
                type: "vision" as const,
                title: "Our Vision",
                attachment_id: visionAttachment[0], // Use the first attachment ID
                content: vision,
                content_am: visionAm.trim(),
            },
            {
                type: "core_values" as const,
                title: "Core Values",
                attachment_id: coreValuesSectionAttachment[0], // Use the first attachment ID for the section icon
                core_values: values.filter(v => v.title.trim() !== "").map((v) => ({
                    title: v.title,
                    content: v.content,
                    title_am: v.title_am.trim(),
                    content_am: v.content_am.trim(),
                })),
            },
        ];

        const payload: CreateStrategyPayload = {
            title: title || "Organizational Strategy",
            description: description || "Our long term direction",
            title_am: titleAm.trim(),
            description_am: descriptionAm.trim(),
            sections,
        };

        try {
            if (strategyId) {
                // Update existing strategy
                await updateStrategy({ id: strategyId, data: payload }).unwrap();
                notify.success("Vision, mission and core values saved.");
            } else {
                // Create new strategy
                await createStrategy(payload).unwrap();
                notify.success("Vision, mission and core values saved.");
            }
        } catch (err: any) {
            console.error("Save failed:", err);
            notify.error("Failed to save vision, mission and core values.", err);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-golden-dark" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* One Save for the whole tab (title, mission & vision, core values), kept in view while scrolling */}
            <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card px-4 py-3 shadow-sm">
                <p className="text-sm text-muted-foreground">
                    Saves the title, mission, vision and core values together.
                </p>
                <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                    <Button
                        onClick={handleSave}
                        className="bg-golden-dark hover:bg-golden-darkHover"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save all
                            </>
                        )}
                    </Button>
                </ComponentGuard>
            </div>

            <Card>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-primary">Title & Description</CardTitle>
                    </div>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Title (Amharic)</Label>
                        <Input
                            lang="am"
                            value={titleAm}
                            onChange={(e) => setTitleAm(e.target.value)}
                            placeholder="Leave empty to show the English title on the Amharic page"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description (Amharic)</Label>
                        <Textarea
                            lang="am"
                            value={descriptionAm}
                            onChange={(e) => setDescriptionAm(e.target.value)}
                            placeholder="Leave empty to show the English description on the Amharic page"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-primary">Mission & Vision</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="flex flex-col space-y-2 p-4">
                            <CardTitle className="text-xl font-bold text-primary">Mission</CardTitle>
                            <div className="space-y-2">
                                <ImageUploadField
                                    id="mission-icon"
                                    label="Icon Image"
                                    value={missionAttachment}
                                    onChange={(ids) => setMissionAttachment(ids)}
                                    category="headline"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={mission}
                                    onChange={(e) => setMission(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content (Amharic)</Label>
                                <Textarea
                                    lang="am"
                                    value={missionAm}
                                    onChange={(e) => setMissionAm(e.target.value)}
                                    className="min-h-[120px]"
                                    placeholder="Leave empty to show the English text"
                                />
                            </div>
                        </Card>

                        <Card className="flex flex-col space-y-2 p-4">
                            <CardTitle className="text-xl font-bold text-primary">Vision</CardTitle>
                            <div className="space-y-2">
                                <ImageUploadField
                                    id="vision-icon"
                                    label="Icon Image"
                                    value={visionAttachment}
                                    onChange={(ids) => setVisionAttachment(ids)}
                                    category="headline"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={vision}
                                    onChange={(e) => setVision(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content (Amharic)</Label>
                                <Textarea
                                    lang="am"
                                    value={visionAm}
                                    onChange={(e) => setVisionAm(e.target.value)}
                                    className="min-h-[120px]"
                                    placeholder="Leave empty to show the English text"
                                />
                            </div>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-primary">Core Values</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-6">
                        {/* Left side - Section Icon Image Upload */}
                        <div className="w-64 space-y-2">
                            <ImageUploadField
                                id="core-values-section-icon"
                                label="Section Icon Image"
                                value={coreValuesSectionAttachment}
                                onChange={(ids) => setCoreValuesSectionAttachment(ids)}
                                category="headline"
                            />
                        </div>

                        {/* Right side - Content */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Core Value Points</Label>
                                <Button variant="outline" onClick={addValue} size="sm" className="h-8">
                                    <Plus className="w-4 h-4 mr-2" /> Add Point
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {values.map((val, idx) => (
                                    <div key={idx} className="flex gap-2 items-start bg-transparent p-4 rounded-md border border-gray-200 shadow-sm relative">
                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-1">
                                                <Label>Title</Label>
                                                <Input
                                                    value={val.title}
                                                    onChange={(e) => updateValue(idx, "title", e.target.value)}
                                                    placeholder="e.g. Integrity"
                                                    className="h-9 bg-transparent"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={val.content}
                                                    onChange={(e) => updateValue(idx, "content", e.target.value)}
                                                    placeholder="e.g. We conduct our business with honesty..."
                                                    className="bg-transparent min-h-[60px]"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Title (Amharic)</Label>
                                                <Input
                                                    lang="am"
                                                    value={val.title_am}
                                                    onChange={(e) => updateValue(idx, "title_am", e.target.value)}
                                                    placeholder="Optional"
                                                    className="h-9 bg-transparent"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Description (Amharic)</Label>
                                                <Textarea
                                                    lang="am"
                                                    value={val.content_am}
                                                    onChange={(e) => updateValue(idx, "content_am", e.target.value)}
                                                    placeholder="Optional"
                                                    className="bg-transparent min-h-[60px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 shrink-0 mt-6">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label="Move up"
                                                title="Move up"
                                                disabled={idx === 0}
                                                onClick={() => moveValue(idx, -1)}
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label="Move down"
                                                title="Move down"
                                                disabled={idx === values.length - 1}
                                                onClick={() => moveValue(idx, 1)}
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label="Remove value"
                                                title="Remove value"
                                                onClick={() => requestRemoveValue(idx)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {values.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No value points added yet.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ConfirmDialog
                open={valueToDelete !== null}
                onOpenChange={(open) => !open && setValueToDelete(null)}
                title="Remove this core value?"
                description={`"${valueToDelete !== null ? values[valueToDelete]?.title || "Untitled value" : ""}" will be removed when you click Save all.`}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={() => {
                    if (valueToDelete !== null) removeValue(valueToDelete);
                    setValueToDelete(null);
                }}
            />
        </div>
    );
}