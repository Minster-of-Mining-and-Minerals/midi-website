"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, Plus, Trash } from "lucide-react";
import { useGetServiceWhyUsQuery, useUpdateServiceWhyUsMutation } from "@/redux/api/serviceApi";
import { notify, extractErrorMessage } from "@/utils/notification";
import { LucideIconPicker } from "@/components/common/LucideIconPicker";

export default function AdminWhyUsManager() {
    const { data, isLoading: isFetching, refetch } = useGetServiceWhyUsQuery();
    const [updateWhyUs, { isLoading: isUpdating }] = useUpdateServiceWhyUsMutation();

    const [heading, setHeading] = useState("");
    const [subheading, setSubheading] = useState("");
    const [points, setPoints] = useState<{ title: string; desc: string; icon: string }[]>([]);
    const [ctaHeading, setCtaHeading] = useState("");
    const [ctaSubheading, setCtaSubheading] = useState("");
    const [ctaButtons, setCtaButtons] = useState<{ title: string; icon: string; route: string }[]>([]);

    useEffect(() => {
        if (data) {
            setHeading(data.heading || "");
            setSubheading(data.subheading || "");
            setPoints(data.points || []);
            setCtaHeading(data.cta_heading || "");
            setCtaSubheading(data.cta_subheading || "");
            setCtaButtons(data.cta_buttons || []);
        }
    }, [data]);

    const handleSave = async () => {
        try {
            await updateWhyUs({
                heading,
                subheading,
                points,
                cta_heading: ctaHeading,
                cta_subheading: ctaSubheading,
                cta_buttons: ctaButtons,
            }).unwrap();
            notify.success("Why Us section updated successfully.");
            refetch();
        } catch (error) {
            console.error("Failed to update Why Us", error);
            notify.error(extractErrorMessage(error, "Failed to update Why Us section."));
        }
    };

    const addPoint = () => {
        setPoints([...points, { title: "", desc: "", icon: "CheckCircle" }]);
    };

    const updatePoint = (index: number, key: string, value: string) => {
        const newPoints = [...points];
        newPoints[index] = { ...newPoints[index], [key]: value };
        setPoints(newPoints);
    };

    const removePoint = (index: number) => {
        const newPoints = [...points];
        newPoints.splice(index, 1);
        setPoints(newPoints);
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
                    <h2 className="text-lg font-bold text-primary">Service Why Us</h2>
                    <p className="text-sm text-gray-500">Manage the 'Why Choose MIDI' section.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="admin-primary"
                        onClick={handleSave}
                        disabled={isUpdating}
                    >
                        {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Card className="border-gray-200">
                <CardHeader className="border-b py-3 px-4">
                    <CardTitle className="text-base font-semibold text-primary">
                        Headings & Description
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Textarea
                            rows={2}
                            value={subheading}
                            onChange={(e) => setSubheading(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200">
                <CardHeader className="border-b py-3 px-4 flex justify-between items-center flex-row">
                    <CardTitle className="text-base font-semibold text-primary">
                        Key Values / Points
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={addPoint}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Point
                    </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {points.map((point, index) => (
                        <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                            <div className="space-y-2 w-48">
                                <Label>Icon</Label>
                                <LucideIconPicker
                                    value={point.icon}
                                    onChange={(val) => updatePoint(index, "icon", val)}
                                />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>Title</Label>
                                <Input
                                    value={point.title}
                                    onChange={(e) => updatePoint(index, "title", e.target.value)}
                                    placeholder="e.g. Customer"
                                />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>Description</Label>
                                <Input
                                    value={point.desc}
                                    onChange={(e) => updatePoint(index, "desc", e.target.value)}
                                    placeholder="Description"
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removePoint(index)} className="mt-6 text-red-500">
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    {points.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No points added yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card className="border-gray-200">
                <CardHeader className="border-b py-3 px-4">
                    <CardTitle className="text-base font-semibold text-primary">
                        Call to Action Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>CTA Heading</Label>
                        <Input
                            value={ctaHeading}
                            onChange={(e) => setCtaHeading(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>CTA Subheading</Label>
                        <Textarea
                            rows={2}
                            value={ctaSubheading}
                            onChange={(e) => setCtaSubheading(e.target.value)}
                        />
                    </div>
                    
                    <div className="pt-4 space-y-4 border-t">
                        <div className="flex justify-between items-center">
                            <Label className="font-bold text-primary">Action Buttons (Max 2)</Label>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCtaButtons([...ctaButtons, { title: "", icon: "circle", route: "" }])}
                                disabled={ctaButtons.length >= 2}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Button
                            </Button>
                        </div>
                        {ctaButtons.map((btn, index) => (
                            <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={btn.title}
                                        onChange={(e) => {
                                            const newBtns = [...ctaButtons];
                                            newBtns[index] = { ...newBtns[index], title: e.target.value };
                                            setCtaButtons(newBtns);
                                        }}
                                        placeholder="e.g. Learn More"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Route</Label>
                                    <Input
                                        value={btn.route}
                                        onChange={(e) => {
                                            const newBtns = [...ctaButtons];
                                            newBtns[index] = { ...newBtns[index], route: e.target.value };
                                            setCtaButtons(newBtns);
                                        }}
                                        placeholder="e.g. /contact"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon</Label>
                                    <LucideIconPicker
                                        value={btn.icon}
                                        onChange={(val) => {
                                            const newBtns = [...ctaButtons];
                                            newBtns[index] = { ...newBtns[index], icon: val };
                                            setCtaButtons(newBtns);
                                        }}
                                    />
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => {
                                        const newBtns = [...ctaButtons];
                                        newBtns.splice(index, 1);
                                        setCtaButtons(newBtns);
                                    }} 
                                    className="mt-6 text-red-500"
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
