"use client";

import React, { useEffect, useState } from 'react';
import {
    useGetWarehousingOverviewQuery,
    useUpdateWarehousingOverviewMutation,
} from '@/redux/api/businessApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { notify, extractErrorMessage } from '@/utils/notification';
import { LucideIconPicker } from '@/components/common/LucideIconPicker';
import { FileUploadField, UploadedFileInfo } from '@/components/common/FileUpplaodFiled';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

export const WarehousingOverviewForm = () => {
    const { data: overview, isLoading, refetch } = useGetWarehousingOverviewQuery();
    const [updateOverview, { isLoading: isUpdating }] = useUpdateWarehousingOverviewMutation();

    const [formData, setFormData] = useState<any>({
        page_header: { icon: "Globe2", small_title: "", subtitle: "", description: "" },
        hero_title: "",
        hero_image: "",
        hero_description_1: "",
        hero_description_2: "",
        stat_overlay: { title: "", value: "", label: "", description: "" },
        flow_of_goods: { title: "", description: "", icon: "Warehouse", features: [] },
        editorial_cards: [],
        visualization_nodes: [],
        business_steps: []
    });

    // No local image state needed, FileUploadField receives value and onChange directly

    useEffect(() => {
        if (overview) {
            setFormData({
                page_header: overview.page_header || { icon: "Globe2", small_title: "", subtitle: overview.page_subtitle || "", description: overview.page_description || "" },
                hero_title: overview.hero_title || "",
                hero_image: overview.hero_image || "",
                hero_description_1: overview.hero_description_1 || "",
                hero_description_2: overview.hero_description_2 || "",
                stat_overlay: overview.stat_overlay || { title: "", value: "", label: "", description: "" },
                flow_of_goods: overview.flow_of_goods || { title: "", description: "", icon: "Warehouse", features: [] },

                // If editorial_cards doesn't exist, we fallback to an array of the old static fields for backward compatibility
                editorial_cards: overview.editorial_cards || [
                    overview.trading_section || { small_title: "", title: "", description: "" },
                    overview.market_connection || { small_title: "", title: "", description: "" },
                    overview.agriculture_section || { small_title: "", title: "", description: "" }
                ].filter(card => card.title || card.small_title || card.description),

                visualization_nodes: overview.visualization_nodes || [
                    { title: "SUPPLY", active: false },
                    { title: "MIDI ETHIOPIA", active: false },
                    { title: "TRADING", active: true },
                    { title: "MARKET DEMAND", active: false },
                    { title: "CUSTOMERS", active: false }
                ],

                facilities_section: overview.facilities_section || { small_title: "OUR FACILITIES", title: "Our Warehouse Network", description: "MIDI operates purpose-built facilities that support its mineral testing, training, value addition, and technical development across the sector. Explore our facility presence across different regions.", stat_description: "Part of our documented 6,850 m² built facility infrastructure" },

                business_steps: overview.business_steps || []
            });
        }
    }, [overview]);

    const handleSave = async () => {
        try {
            await updateOverview(formData).unwrap();
            notify.success("Overview updated successfully");
            refetch();
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to update overview"));
        }
    };

    // --- Dynamic Lists Handlers ---

    const addFeature = () => {
        const newFeatures = [...(formData.flow_of_goods?.features || []), { title: "", description: "", icon: "Boxes" }];
        setFormData({ ...formData, flow_of_goods: { ...formData.flow_of_goods, features: newFeatures } });
    };

    const updateFeature = (index: number, key: string, value: string) => {
        const newFeatures = [...(formData.flow_of_goods?.features || [])];
        newFeatures[index] = { ...newFeatures[index], [key]: value };
        setFormData({ ...formData, flow_of_goods: { ...formData.flow_of_goods, features: newFeatures } });
    };

    const removeFeature = (index: number) => {
        const newFeatures = (formData.flow_of_goods?.features || []).filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, flow_of_goods: { ...formData.flow_of_goods, features: newFeatures } });
    };

    const addEditorialCard = () => {
        setFormData({
            ...formData,
            editorial_cards: [...(formData.editorial_cards || []), { small_title: "", title: "", description: "" }]
        });
    };

    const updateEditorialCard = (index: number, key: string, value: string) => {
        const newCards = [...(formData.editorial_cards || [])];
        newCards[index] = { ...newCards[index], [key]: value };
        setFormData({ ...formData, editorial_cards: newCards });
    };

    const removeEditorialCard = (index: number) => {
        const newCards = (formData.editorial_cards || []).filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, editorial_cards: newCards });
    };

    const addVisNode = () => {
        const newNodes = [...(formData.visualization_nodes || []), { title: "", active: false }];
        setFormData({ ...formData, visualization_nodes: newNodes });
    };

    const updateVisNode = (index: number, key: string, value: any) => {
        const newNodes = [...(formData.visualization_nodes || [])];
        newNodes[index] = { ...newNodes[index], [key]: value };
        setFormData({ ...formData, visualization_nodes: newNodes });
    };

    const removeVisNode = (index: number) => {
        const newNodes = (formData.visualization_nodes || []).filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, visualization_nodes: newNodes });
    };

    const addStep = () => {
        const steps = formData.business_steps || [];
        const nextNum = (steps.length + 1).toString().padStart(2, "0");
        const newSteps = [...steps, { num: nextNum, title: "", desc: "" }];
        setFormData({ ...formData, business_steps: newSteps });
    };

    const updateStep = (index: number, key: string, value: string) => {
        const newSteps = [...(formData.business_steps || [])];
        newSteps[index] = { ...newSteps[index], [key]: value };
        setFormData({ ...formData, business_steps: newSteps });
    };

    const removeStep = (index: number) => {
        const newSteps = (formData.business_steps || []).filter((_: any, i: number) => i !== index);
        // Re-number steps
        const renumbered = newSteps.map((step: any, i: number) => ({
            ...step,
            num: (i + 1).toString().padStart(2, "0")
        }));
        setFormData({ ...formData, business_steps: renumbered });
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <TabsContent value="tab1" className="space-y-8 mt-0 outline-none">
                {/* Top Banner (Header) */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">1. Top Banner (Subtitle & Description)</h3>
                        <p className="text-sm text-primary mb-4">Manage the small intro banner linking international trade to local markets.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-medium block">Icon</label>
                            <LucideIconPicker
                                value={formData.page_header?.icon || "Globe2"}
                                onChange={val => setFormData({ ...formData, page_header: { ...formData.page_header, icon: val } })}
                            />
                        </div>
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-medium block">Small Title / Overline</label>
                            <Input placeholder="e.g. WAREHOUSING & TRADING" value={formData.page_header?.small_title} onChange={e => setFormData({ ...formData, page_header: { ...formData.page_header, small_title: e.target.value } })} />
                        </div>
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-medium">Page Subtitle</label>
                            <Input placeholder="e.g. From international trade to local markets" value={formData.page_header?.subtitle} onChange={e => setFormData({ ...formData, page_header: { ...formData.page_header, subtitle: e.target.value } })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Page Description</label>
                            <Textarea rows={2} value={formData.page_header?.description} onChange={e => setFormData({ ...formData, page_header: { ...formData.page_header, description: e.target.value } })} />
                        </div>
                    </div>
                </div>

                {/* Main Overview */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">2. Main Overview</h3>
                        <p className="text-sm text-primary mb-4">The core introduction texts starting from WAREHOUSING & TRADING.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-medium">Hero Title</label>
                            <Input value={formData.hero_title} onChange={e => setFormData({ ...formData, hero_title: e.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Hero Description 1</label>
                            <Textarea rows={3} value={formData.hero_description_1} onChange={e => setFormData({ ...formData, hero_description_1: e.target.value })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Hero Description 2</label>
                            <Textarea rows={3} value={formData.hero_description_2} onChange={e => setFormData({ ...formData, hero_description_2: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* Hero Image & Stat Overlay */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">3. Hero Image & Stat Overlay</h3>
                        <p className="text-sm text-primary mb-4">The main hero image and the floating statistic overlay box.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-white">
                        <div className="space-y-2">
                            <FileUploadField
                                id="hero-image"
                                label="Hero Image"
                                accept="image/*"
                                multiple={false}
                                value={formData.hero_image ? [formData.hero_image] : []}
                                onChange={(vals) => setFormData({ ...formData, hero_image: vals[0] || "" })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 text-white md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stat Value</label>
                            <Input placeholder="e.g. 6,850 m²" value={formData.stat_overlay.value} onChange={e => setFormData({ ...formData, stat_overlay: { ...formData.stat_overlay, value: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stat Label</label>
                            <Input placeholder="e.g. Built Facilities" value={formData.stat_overlay.label} onChange={e => setFormData({ ...formData, stat_overlay: { ...formData.stat_overlay, label: e.target.value } })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Stat Description</label>
                            <Textarea rows={2} value={formData.stat_overlay.description} onChange={e => setFormData({ ...formData, stat_overlay: { ...formData.stat_overlay, description: e.target.value } })} />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-8">
                    <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                        <Button onClick={handleSave} disabled={isUpdating} className="w-full py-6 text-lg">
                            {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                            Save Overview Content
                        </Button>
                    </ComponentGuard>
                </div>
            </TabsContent>

            <TabsContent value="tab2" className="space-y-8 mt-0 outline-none">
                {/* Flow of Goods Card */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">4. Flow of Goods</h3>
                        <p className="text-sm text-primary mb-4">Describe how goods flow through the facilities and define key features.</p>
                    </div>
                    <div className="grid grid-cols-1 text-white md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-medium block">Section Icon</label>
                            <LucideIconPicker
                                value={formData.flow_of_goods?.icon || "Warehouse"}
                                onChange={val => setFormData({ ...formData, flow_of_goods: { ...formData.flow_of_goods, icon: val } })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Section Title</label>
                            <Input value={formData.flow_of_goods?.title || ''} onChange={e => setFormData({ ...formData, flow_of_goods: { ...formData.flow_of_goods, title: e.target.value } })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Section Description</label>
                            <Textarea rows={2} value={formData.flow_of_goods?.description || ''} onChange={e => setFormData({ ...formData, flow_of_goods: { ...formData.flow_of_goods, description: e.target.value } })} />
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-medium">Features</label>
                                <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                    <Button type="button" className="bg-primary text-white hover:bg-primary/80" variant="outline" size="sm" onClick={addFeature}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Feature
                                    </Button>
                                </ComponentGuard>
                            </div>

                            <div className="space-y-4">
                                {(formData.flow_of_goods?.features || []).map((feature: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-start p-4 border rounded-lg bg-card">
                                        <div className="w-48 shrink-0">
                                            <label className="text-xs font-medium mb-1 block">Icon</label>
                                            <LucideIconPicker
                                                value={feature.icon}
                                                onChange={(val) => updateFeature(idx, "icon", val)}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="text-xs font-medium mb-1 block">Title</label>
                                                <Input
                                                    placeholder="e.g. STORAGE"
                                                    value={feature.title}
                                                    onChange={e => updateFeature(idx, "title", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium mb-1 block">Description</label>
                                                <Textarea
                                                    rows={2}
                                                    value={feature.description}
                                                    onChange={e => updateFeature(idx, "description", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                            <Button type="button" variant="ghost" size="icon" className="text-destructive mt-6" onClick={() => removeFeature(idx)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentGuard>
                                    </div>
                                ))}
                                {(formData.flow_of_goods?.features || []).length === 0 && (
                                    <p className="text-sm text-slate-500 text-center py-4">No features added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-8">
                    <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                        <Button onClick={handleSave} disabled={isUpdating} className="w-full py-6 text-lg">
                            {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                            Save Overview Content
                        </Button>
                    </ComponentGuard>
                </div>
            </TabsContent>

            <TabsContent value="tab3" className="space-y-8 mt-0 outline-none">
                {/* Editorial Blocks Card */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold text-lg text-primary">5. Editorial Concepts (Dynamic)</h3>
                            <p className="text-sm text-primary mb-4">The dynamic narratives displayed alongside the flow of goods.</p>
                        </div>
                        <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                            <Button type="button" className="bg-primary text-white hover:bg-primary/80" variant="outline" size="sm" onClick={addEditorialCard}>
                                <Plus className="w-4 h-4 mr-2" /> Add Card
                            </Button>
                        </ComponentGuard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {(formData.editorial_cards || []).map((card: any, idx: number) => (
                            <div key={idx} className="space-y-4 bg-card p-4 border rounded-lg relative group text-white">
                                <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        onClick={() => removeEditorialCard(idx)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </ComponentGuard>
                                <h4 className="font-semibold text-white text-sm">Card {idx + 1}</h4>
                                <Input placeholder="Small Tag Title" value={card.small_title || ''} onChange={e => updateEditorialCard(idx, "small_title", e.target.value)} />
                                <Input placeholder="Main Title" value={card.title || ''} onChange={e => updateEditorialCard(idx, "title", e.target.value)} />
                                <Textarea rows={3} placeholder="Description" value={card.description || ''} onChange={e => updateEditorialCard(idx, "description", e.target.value)} />
                            </div>
                        ))}
                        {(formData.editorial_cards || []).length === 0 && (
                            <p className="text-sm text-slate-500 lg:col-span-3 text-center py-4 border-2 border-dashed rounded-lg">No editorial cards added yet.</p>
                        )}
                    </div>
                </div>

                {/* Trading Visualization Nodes Card */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold text-lg text-primary">6. Trading Visualization</h3>
                            <p className="text-sm text-primary mb-4">The nodes displayed in the middle canvas flow (e.g. SUPPLY &rarr; TRADING &rarr; CUSTOMERS).</p>
                        </div>
                        <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                            <Button type="button" className="bg-primary text-white hover:bg-primary/80" variant="outline" size="sm" onClick={addVisNode}>
                                <Plus className="w-4 h-4 mr-2" /> Add Node
                            </Button>
                        </ComponentGuard>
                    </div>

                    <div className="space-y-4">
                        {(formData.visualization_nodes || []).map((node: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center p-3 border rounded-lg bg-card text-white">
                                <div className="cursor-grab text-slate-400 shrink-0">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div className="md:col-span-3 space-y-1">
                                        <label className="text-xs font-medium text-white">Node Title</label>
                                        <Input
                                            placeholder="e.g. SUPPLY"
                                            value={node.title}
                                            onChange={e => updateVisNode(idx, "title", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={node.active || false}
                                                onChange={e => updateVisNode(idx, "active", e.target.checked)}
                                                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                                            />
                                            Highlight (Active)
                                        </label>
                                    </div>
                                </div>
                                <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeVisNode(idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </ComponentGuard>
                            </div>
                        ))}
                        {(formData.visualization_nodes || []).length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-4">No nodes added yet.</p>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-8">
                    <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                        <Button onClick={handleSave} disabled={isUpdating} className="w-full py-6 text-lg">
                            {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                            Save Overview Content
                        </Button>
                    </ComponentGuard>
                </div>
            </TabsContent>

            <TabsContent value="tab4" className="space-y-8 mt-0 outline-none">
                {/* Business Flow Steps Card */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">7. Business Flow Steps</h3>
                        <p className="text-sm text-primary mb-4">Define the steps in the business flow graph.</p>
                    </div>

                    <div className="space-y-4">
                        {(formData.business_steps || []).map((step: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center p-3 border rounded-lg bg-card text-white">
                                <div className="cursor-grab text-slate-400 shrink-0">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="font-mono text-sm font-semibold text-primary shrink-0 w-8">
                                    {step.num}
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        className="md:col-span-1"
                                        placeholder="Title (e.g. SOURCE)"
                                        value={step.title}
                                        onChange={e => updateStep(idx, "title", e.target.value)}
                                    />
                                    <Input
                                        className="md:col-span-2"
                                        placeholder="Description"
                                        value={step.desc}
                                        onChange={e => updateStep(idx, "desc", e.target.value)}
                                    />
                                </div>
                                <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeStep(idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </ComponentGuard>
                            </div>
                        ))}
                        {(formData.business_steps || []).length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-4">No steps added yet.</p>
                        )}

                        <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                            <Button type="button" className="w-full mt-4 bg-primary text-white hover:bg-primary/80" variant="outline" onClick={addStep}>
                                <Plus className="w-4 h-4 mr-2" /> Add Step
                            </Button>
                        </ComponentGuard>
                    </div>
                </div>

                {/* Facilities Section Card */}
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">8. Our Facilities Section</h3>
                        <p className="text-sm text-primary mb-4">Manage the introduction text for the public warehouse network section.</p>
                    </div>

                    <div className="grid grid-cols-1 text-white md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-medium text-white block">Small Title (Overline)</label>
                            <Input placeholder="e.g. OUR FACILITIES" value={formData.facilities_section?.small_title} onChange={e => setFormData({ ...formData, facilities_section: { ...formData.facilities_section, small_title: e.target.value } })} />
                        </div>
                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-sm font-medium text-white block">Title</label>
                            <Input placeholder="e.g. Our Warehouse Network" value={formData.facilities_section?.title} onChange={e => setFormData({ ...formData, facilities_section: { ...formData.facilities_section, title: e.target.value } })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-white block">Description</label>
                            <Textarea rows={3} value={formData.facilities_section?.description} onChange={e => setFormData({ ...formData, facilities_section: { ...formData.facilities_section, description: e.target.value } })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-white block">Stat Description (Under the count)</label>
                            <Input placeholder="e.g. Part of our documented 6,850 m² built facility infrastructure" value={formData.facilities_section?.stat_description} onChange={e => setFormData({ ...formData, facilities_section: { ...formData.facilities_section, stat_description: e.target.value } })} />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-8">
                    <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                        <Button onClick={handleSave} disabled={isUpdating} className="w-full py-6 text-lg">
                            {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                            Save Overview Content
                        </Button>
                    </ComponentGuard>
                </div>
            </TabsContent>

        </>
    );
};
