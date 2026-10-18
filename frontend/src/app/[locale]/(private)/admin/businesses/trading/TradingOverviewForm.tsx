"use client";

import React, { useEffect, useState } from 'react';
import {
    useGetTradingOverviewQuery,
    useUpdateTradingOverviewMutation,
} from '@/redux/api/businessApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { notify, extractErrorMessage } from '@/utils/notification';
import { TabsContent } from "@/components/ui/tabs";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

const RELATIONSHIP_NODE_SLOTS = [
    { name: "Top Node (e.g. Suppliers)", defaultX: 50, defaultY: 10, defaultMain: false, defaultHighlight: false },
    { name: "Center Main Node (e.g. MIDI Ethiopia)", defaultX: 50, defaultY: 45, defaultMain: true, defaultHighlight: false },
    { name: "Bottom Left Node (e.g. Customers)", defaultX: 20, defaultY: 80, defaultMain: false, defaultHighlight: false },
    { name: "Bottom Right Node (e.g. Markets)", defaultX: 80, defaultY: 80, defaultMain: false, defaultHighlight: false },
    { name: "Bottom Node Highlight (e.g. Value)", defaultX: 50, defaultY: 110, defaultMain: false, defaultHighlight: true },
];

const ECOSYSTEM_SLOTS = [
    "Orbiting Word 1 (Top Right)",
    "Orbiting Word 2 (Bottom Right)",
    "Orbiting Word 3 (Bottom)",
    "Orbiting Word 4 (Bottom Left)",
    "Orbiting Word 5 (Top Left)",
    "Orbiting Word 6 (Top)"
];

const TRADING_CYCLE_SLOTS = [
    "Step 1 (e.g. Market)",
    "Step 2 (e.g. Opportunity)",
    "Step 3 (e.g. Connection)",
    "Step 4 (e.g. Transaction)",
    "Step 5 (e.g. Value)"
];

export const TradingOverviewForm = () => {
    const { data: overview, isLoading, refetch } = useGetTradingOverviewQuery();
    const [updateOverview, { isLoading: isUpdating }] = useUpdateTradingOverviewMutation();

    const [formData, setFormData] = useState<any>({
        page_header: { subtitle: "" },
        hero_title: "",
        hero_description_1: "",
        hero_description_2: "",
        hero_visual: {
            center_title: "",
            center_subtitle: "",
            node_top: "",
            node_bottom: "",
            node_left: "",
            node_right: ""
        },
        principles: [],
        relationship_nodes: [],
        market_gap: { overline: "", title: "", description: "", diagram_left_label: "", diagram_right_label: "", diagram_gap_label: "", diagram_central_pill: "", diagram_bottom_label: "" },
        customer_connection: { title: "", description: "", note_text: "" },
        big_statement: { statement_words: [], description: "", central_text: "", ecosystem_words: [] },
        stats: [],
        trading_cycle: []
    });

    useEffect(() => {
        if (overview) {
            setFormData({
                page_header: overview.page_header || { subtitle: "" },
                hero_title: overview.hero_title || "",
                hero_description_1: overview.hero_description_1 || "",
                hero_description_2: overview.hero_description_2 || "",
                hero_visual: overview.hero_visual || { center_title: "", center_subtitle: "", node_top: "", node_bottom: "", node_left: "", node_right: "" },
                principles: overview.principles || [],

                // Pad to exactly 5 nodes with standard positions
                relationship_nodes: RELATIONSHIP_NODE_SLOTS.map((slot, i) => {
                    const existingNode = overview.relationship_nodes?.[i];
                    return {
                        id_name: existingNode?.id_name || `node_${i}`,
                        label: existingNode?.label || "",
                        desc: existingNode?.desc || "",
                        x: slot.defaultX,
                        y: slot.defaultY,
                        main: slot.defaultMain,
                        highlight: slot.defaultHighlight
                    };
                }),

                market_gap: overview.market_gap || { overline: "", title: "", description: "", diagram_left_label: "", diagram_right_label: "", diagram_gap_label: "", diagram_central_pill: "", diagram_bottom_label: "" },
                customer_connection: overview.customer_connection || { title: "", description: "", note_text: "" },

                big_statement: {
                    statement_words: overview.big_statement?.statement_words || [],
                    description: overview.big_statement?.description || "",
                    central_text: overview.big_statement?.central_text || "",
                    // Pad to exactly 6 orbiting words
                    ecosystem_words: Array.from({ length: 6 }).map((_, i) => overview.big_statement?.ecosystem_words?.[i] || "")
                },

                stats: overview.stats || [],

                // Pad to exactly 5 trading cycle steps
                trading_cycle: Array.from({ length: 5 }).map((_, i) => {
                    const existingStep = overview.trading_cycle?.[i];
                    return {
                        label: existingStep?.label || "",
                        desc: existingStep?.desc || ""
                    };
                })
            });
        }
    }, [overview]);

    const handleSave = async () => {
        try {
            await updateOverview(formData).unwrap();
            notify.success("Trading overview updated successfully");
            refetch();
        } catch (error) {
            notify.error(extractErrorMessage(error, "Failed to update trading overview"));
        }
    };

    // Helpers
    const updateNestedArray = (arrayName: string, index: number, key: string, value: any) => {
        const newArray = [...(formData[arrayName] || [])];
        newArray[index] = { ...newArray[index], [key]: value };
        setFormData({ ...formData, [arrayName]: newArray });
    };

    const addToArray = (arrayName: string, defaultObj: any) => {
        setFormData({ ...formData, [arrayName]: [...(formData[arrayName] || []), defaultObj] });
    };

    const removeFromArray = (arrayName: string, index: number) => {
        const newArray = (formData[arrayName] || []).filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, [arrayName]: newArray });
    };

    const updateArrayString = (arrayName: string, nestedProp: string, index: number, value: string) => {
        const newArray = [...(formData[arrayName][nestedProp] || [])];
        newArray[index] = value;
        setFormData({ ...formData, [arrayName]: { ...formData[arrayName], [nestedProp]: newArray } });
    };

    const addStringToArray = (arrayName: string, nestedProp: string, defaultVal: string) => {
        setFormData({ ...formData, [arrayName]: { ...formData[arrayName], [nestedProp]: [...(formData[arrayName][nestedProp] || []), defaultVal] } });
    };

    const removeStringFromArray = (arrayName: string, nestedProp: string, index: number) => {
        const newArray = (formData[arrayName][nestedProp] || []).filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, [arrayName]: { ...formData[arrayName], [nestedProp]: newArray } });
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    const SaveButton = () => (
        <div className="pt-4 border-t border-slate-200 mt-8">
            <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                <Button onClick={handleSave} disabled={isUpdating} className="w-full py-6 text-lg">
                    {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                    Save Overview Content
                </Button>
            </ComponentGuard>
        </div>
    );

    return (
        <>
            {/* Tab 1: Banner & Hero */}
            <TabsContent value="tab1" className="space-y-8 mt-0 outline-none">
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">1. Top Banner</h3>
                        <p className="text-sm text-primary mb-4">Manage the small intro banner text.</p>
                    </div>
                    <div className="space-y-2 text-white">
                        <label className="text-sm text-white font-medium">Page Subtitle</label>
                        <Input placeholder="e.g. TRADING" className="text-white" value={formData.page_header?.subtitle} onChange={e => setFormData({ ...formData, page_header: { ...formData.page_header, subtitle: e.target.value } })} />
                    </div>
                </div>

                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">2. Hero Section</h3>
                        <p className="text-sm text-primary mb-4">The core introduction texts.</p>
                    </div>
                    <div className="grid grid-cols-1 text-white gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hero Title</label>
                            <Input value={formData.hero_title} className='text-white' onChange={e => setFormData({ ...formData, hero_title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Hero Description 1</label>
                            <Textarea rows={3} value={formData.hero_description_1} className='text-white' onChange={e => setFormData({ ...formData, hero_description_1: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Hero Description 2</label>
                            <Textarea rows={3} value={formData.hero_description_2} className='text-white' onChange={e => setFormData({ ...formData, hero_description_2: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">3. Hero Visual Graphic Texts</h3>
                        <p className="text-sm text-primary mb-4">The text elements in the spinning network diagram.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 text-white gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Center Title</label>
                            <Input className='text-white' value={formData.hero_visual?.center_title} onChange={e => setFormData({ ...formData, hero_visual: { ...formData.hero_visual, center_title: e.target.value } })} placeholder="MIDI" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Center Subtitle</label>
                            <Input className='text-white' value={formData.hero_visual?.center_subtitle} onChange={e => setFormData({ ...formData, hero_visual: { ...formData.hero_visual, center_subtitle: e.target.value } })} placeholder="Ethiopia" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Top Orbital Node</label>
                            <Input className='text-white' value={formData.hero_visual?.node_top} onChange={e => setFormData({ ...formData, hero_visual: { ...formData.hero_visual, node_top: e.target.value } })} placeholder="SUPPLIERS" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Bottom Orbital Node</label>
                            <Input className='text-white' value={formData.hero_visual?.node_bottom} onChange={e => setFormData({ ...formData, hero_visual: { ...formData.hero_visual, node_bottom: e.target.value } })} placeholder="CUSTOMERS" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Left Orbital Node</label>
                            <Input className='text-white' value={formData.hero_visual?.node_left} onChange={e => setFormData({ ...formData, hero_visual: { ...formData.hero_visual, node_left: e.target.value } })} placeholder="MARKETS" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Right Orbital Node</label>
                            <Input className='text-white' value={formData.hero_visual?.node_right} onChange={e => setFormData({ ...formData, hero_visual: { ...formData.hero_visual, node_right: e.target.value } })} placeholder="OPPORTUNITIES" />
                        </div>
                    </div>
                </div>

                <SaveButton />
            </TabsContent>

            {/* Tab 2: Principles & Network */}
            <TabsContent value="tab2" className="space-y-8 mt-0 outline-none">
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold text-lg text-primary">4. Principles</h3>
                            <p className="text-sm text-primary mb-4">Manage the numbered principles (e.g., 01 Understand, 02 Connect).</p>
                        </div>
                        <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                            <Button type="button" className='text-white bg-primary hover:bg-primary/80' variant="outline" size="sm" onClick={() => addToArray("principles", { number: "01", title: "", description: "" })}>
                                <Plus className="w-4 h-4 mr-2" /> Add Principle
                            </Button>
                        </ComponentGuard>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.principles || []).map((principle: any, idx: number) => (
                            <div key={idx} className="p-4 border rounded-lg relative bg-card text-white">
                                <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeFromArray("principles", idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </ComponentGuard>
                                <div className="space-y-3 pt-6">
                                    <div>
                                        <label className="text-xs font-medium">Number</label>
                                        <Input value={principle.number} onChange={e => updateNestedArray("principles", idx, "number", e.target.value)} placeholder="01" className="w-20" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium">Title</label>
                                        <Input value={principle.title} onChange={e => updateNestedArray("principles", idx, "title", e.target.value)} placeholder="Understand" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium">Description</label>
                                        <Textarea rows={2} value={principle.description} onChange={e => updateNestedArray("principles", idx, "description", e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold text-lg text-primary">5. Relationship Network Nodes</h3>
                            <p className="text-sm text-primary mb-4">Positional nodes for the animated center graphic.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(formData.relationship_nodes || []).map((node: any, idx: number) => (
                            <div key={idx} className="flex flex-col gap-3 p-4 border rounded-lg bg-card relative">
                                <h4 className="text-sm font-semibold text-primary uppercase pb-2 border-b pr-8">
                                    {RELATIONSHIP_NODE_SLOTS[idx]?.name || `Node ${idx + 1}`}
                                </h4>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-medium">Label</label>
                                    <Input className='text-white' value={node.label} onChange={e => updateNestedArray("relationship_nodes", idx, "label", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-white font-medium">Description (shows on hover)</label>
                                    <Textarea className='text-white' rows={2} value={node.desc} onChange={e => updateNestedArray("relationship_nodes", idx, "desc", e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <SaveButton />
            </TabsContent>

            {/* Tab 3: Market Gap & Ecosystem */}
            <TabsContent value="tab3" className="space-y-8 mt-0 outline-none">
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">6. Market Gap Philosophy</h3>
                        <p className="text-sm text-primary mb-4">The dark box detailing the trading approach and diagram below it.</p>
                    </div>
                    <div className="space-y-4 text-white">
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Overline</label>
                            <Input className="text-white" value={formData.market_gap?.overline} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, overline: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Title</label>
                            <Input className="text-white" value={formData.market_gap?.title} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, title: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Description</label>
                            <Textarea className="text-white" rows={3} value={formData.market_gap?.description} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, description: e.target.value } })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-600">
                            <div className="space-y-2">
                                <label className="text-sm text-white font-medium">Diagram Left Label (e.g. Supply)</label>
                                <Input className="text-white" value={formData.market_gap?.diagram_left_label} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, diagram_left_label: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white font-medium">Diagram Right Label (e.g. Demand)</label>
                                <Input className="text-white" value={formData.market_gap?.diagram_right_label} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, diagram_right_label: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white font-medium">Gap Text (e.g. MARKET GAP)</label>
                                <Input className="text-white" value={formData.market_gap?.diagram_gap_label} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, diagram_gap_label: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white font-medium">Central Pill (e.g. MIDI ETHIOPIA)</label>
                                <Input className="text-white" value={formData.market_gap?.diagram_central_pill} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, diagram_central_pill: e.target.value } })} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm text-white font-medium">Bottom Label (e.g. SUPPLY + DEMAND)</label>
                                <Input className="text-white" value={formData.market_gap?.diagram_bottom_label} onChange={e => setFormData({ ...formData, market_gap: { ...formData.market_gap, diagram_bottom_label: e.target.value } })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">7. Customer Connection</h3>
                    </div>
                    <div className="space-y-4 text-white">
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Title</label>
                            <Input className='text-white' value={formData.customer_connection?.title} onChange={e => setFormData({ ...formData, customer_connection: { ...formData.customer_connection, title: e.target.value } })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Description</label>
                            <Textarea rows={3} className='text-white' value={formData.customer_connection?.description} onChange={e => setFormData({ ...formData, customer_connection: { ...formData.customer_connection, description: e.target.value } })} />
                        </div>
                        <div className="space-y-2 pt-4 border-t border-slate-600">
                            <label className="text-sm text-white font-medium">Helper Text (Bottom box e.g. Hover over...)</label>
                            <Input className="text-white" value={formData.customer_connection?.note_text} onChange={e => setFormData({ ...formData, customer_connection: { ...formData.customer_connection, note_text: e.target.value } })} />
                        </div>
                    </div>
                </div>

                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">8. Big Statement & Ecosystem</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm text-white font-medium">Statement Words (e.g. MORE, than a, transaction)</label>
                                <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                    <Button type="button" className='bg-primary text-white hover:bg-primary' variant="outline" size="sm" onClick={() => addStringToArray("big_statement", "statement_words", "")}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Word
                                    </Button>
                                </ComponentGuard>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(formData.big_statement?.statement_words || []).map((word: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-1 bg-slate-100 p-1 rounded border">
                                        <Input className="h-8 w-32" value={word} onChange={e => updateArrayString("big_statement", "statement_words", idx, e.target.value)} />
                                        <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeStringFromArray("big_statement", "statement_words", idx)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentGuard>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white font-medium">Description</label>
                            <Textarea rows={3} className='text-white' value={formData.big_statement?.description} onChange={e => setFormData({ ...formData, big_statement: { ...formData.big_statement, description: e.target.value } })} />
                        </div>
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <label className="text-sm text-primary font-medium">Ecosystem Orbiting Words</label>
                                    <p className="text-xs text-primary">Fixed 6 positions orbiting the center.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(formData.big_statement?.ecosystem_words || []).map((word: string, idx: number) => (
                                    <div key={idx} className="space-y-1">
                                        <label className="text-xs text-white font-medium">{ECOSYSTEM_SLOTS[idx] || `Word ${idx + 1}`}</label>
                                        <Input className="w-full text-white" value={word} onChange={e => updateArrayString("big_statement", "ecosystem_words", idx, e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <SaveButton />
            </TabsContent>

            {/* Tab 4: Stats & Loop */}
            <TabsContent value="tab4" className="space-y-8 mt-0 outline-none">
                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold text-lg text-primary">9. Stats</h3>
                            <p className="text-sm text-primary mb-4">Key numerical achievements.</p>
                        </div>
                        <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                            <Button type="button" className='bg-primary text-white hover:bg-primary' variant="outline" size="sm" onClick={() => addToArray("stats", { value: "", label: "" })}>
                                <Plus className="w-4 h-4 mr-2" /> Add Stat
                            </Button>
                        </ComponentGuard>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.stats || []).map((stat: any, idx: number) => (
                            <div key={idx} className="p-4 border rounded-lg flex items-start gap-4 bg-card">
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <label className="text-xs text-white font-medium">Value</label>
                                        <Input className='text-white' value={stat.value} onChange={e => updateNestedArray("stats", idx, "value", e.target.value)} placeholder="e.g. $5M+" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white font-medium">Label</label>
                                        <Input className='text-white' value={stat.label} onChange={e => updateNestedArray("stats", idx, "label", e.target.value)} placeholder="e.g. Export Performance" />
                                    </div>
                                </div>
                                <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive mt-6" onClick={() => removeFromArray("stats", idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </ComponentGuard>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-slate-200 bg-card p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold text-lg text-primary">10. Trading Cycle Loop</h3>
                            <p className="text-sm text-primary mb-4">The 5 horizontal steps in the loop.</p>
                        </div>
                        <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                            <Button type="button" className='bg-primary text-white hover:bg-primary/80' variant="outline" size="sm" onClick={() => addToArray("trading_cycle", { label: "", desc: "" })}>
                                <Plus className="w-4 h-4 mr-2" /> Add Step
                            </Button>
                        </ComponentGuard>
                    </div>
                    <div className="space-y-4">
                        {(formData.trading_cycle || []).map((step: any, idx: number) => (
                            <div key={idx} className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg bg-card relative">
                                <div className="w-full md:w-48 font-semibold text-sm text-primary shrink-0">
                                    {TRADING_CYCLE_SLOTS[idx] || `Step ${idx + 1}`}
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full pr-10">
                                    <div className="space-y-1">
                                        <label className="text-xs text-white font-medium">Label</label>
                                        <Input placeholder="e.g. MARKET" className='text-white' value={step.label} onChange={e => updateNestedArray("trading_cycle", idx, "label", e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-white font-medium">Description</label>
                                        <Input placeholder="Description" className='text-white' value={step.desc} onChange={e => updateNestedArray("trading_cycle", idx, "desc", e.target.value)} />
                                    </div>
                                </div>
                                <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-destructive" onClick={() => removeFromArray("trading_cycle", idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </ComponentGuard>
                            </div>
                        ))}
                    </div>
                </div>
                <SaveButton />
            </TabsContent>
        </>
    );
};
