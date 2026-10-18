"use client";

import React, { useState, useEffect } from 'react';
import { useGetBusinessOverviewQuery, useUpdateBusinessOverviewMutation, useGetBusinessNodesQuery, useCreateBusinessNodeMutation, useUpdateBusinessNodeMutation, useDeleteBusinessNodeMutation, BusinessNode } from '@/redux/api/businessApi';
import { Pencil, Save, Loader2, Network, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notify, extractErrorMessage } from '@/utils/notification';
import { LucideIconPicker } from "@/components/common/LucideIconPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

// Define the static sections for the diagram
const STATIC_SECTIONS = [
    { id_string: 'center', label: 'Center Element (e.g. MIDI ETHIOPIA)', position_x: 50, position_y: 50, mobile_order: 0, isCenter: true },
    { id_string: 'top_left', label: 'Top Left Node', position_x: 25, position_y: 20, mobile_order: 1 },
    { id_string: 'top_right', label: 'Top Right Node', position_x: 75, position_y: 20, mobile_order: 2 },
    { id_string: 'middle_left', label: 'Middle Left Node', position_x: 10, position_y: 50, mobile_order: 3 },
    { id_string: 'middle_right', label: 'Middle Right Node', position_x: 90, position_y: 50, mobile_order: 4 },
    { id_string: 'bottom_left', label: 'Bottom Left Node', position_x: 25, position_y: 80, mobile_order: 5 },
    { id_string: 'bottom_right', label: 'Bottom Right Node', position_x: 75, position_y: 80, mobile_order: 6 },
];

const BusinessesPage = () => {
    // --- Overview State ---
    const { data: overview, isLoading: isOverviewLoading, refetch: refetchOverview } = useGetBusinessOverviewQuery();
    const [updateOverview, { isLoading: isUpdatingOverview }] = useUpdateBusinessOverviewMutation();

    const [overviewData, setOverviewData] = useState({
        title_part1: '',
        title_part2: '',
        description1: '',
        description2: ''
    });

    useEffect(() => {
        if (overview) {
            setOverviewData({
                title_part1: overview.title_part1 || '',
                title_part2: overview.title_part2 || '',
                description1: overview.description1 || '',
                description2: overview.description2 || ''
            });
        }
    }, [overview]);

    const handleOverviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOverviewData({ ...overviewData, [e.target.name]: e.target.value });
    };

    const handleOverviewSave = async () => {
        try {
            await updateOverview(overviewData).unwrap();
            notify.success('Overview updated successfully!');
            refetchOverview();
        } catch (error) {
            console.error('Failed to update overview', error);
            notify.error(extractErrorMessage(error, 'Failed to update overview.'));
        }
    };

    // --- Nodes State ---
    const { data: nodes, isLoading: isNodesLoading, refetch: refetchNodes } = useGetBusinessNodesQuery();
    const [createNode] = useCreateBusinessNodeMutation();
    const [updateNode] = useUpdateBusinessNodeMutation();
    const [deleteNode] = useDeleteBusinessNodeMutation();

    const [nodeForms, setNodeForms] = useState<Record<string, Partial<BusinessNode>>>({});
    const [isSavingNodes, setIsSavingNodes] = useState(false);

    useEffect(() => {
        if (nodes) {
            const forms: Record<string, Partial<BusinessNode>> = {};
            STATIC_SECTIONS.forEach(section => {
                const existingNode = nodes.find(n => n.id_string === section.id_string);
                if (existingNode) {
                    forms[section.id_string] = existingNode;
                } else {
                    forms[section.id_string] = {
                        id_string: section.id_string,
                        title: '',
                        description: '',
                        icon: '',
                        position_x: section.position_x,
                        position_y: section.position_y,
                        mobile_order: section.mobile_order
                    };
                }
            });
            setNodeForms(forms);
        }
    }, [nodes]);

    const handleNodeChange = (id_string: string, field: string, value: string) => {
        setNodeForms(prev => ({
            ...prev,
            [id_string]: { ...prev[id_string], [field]: value }
        }));
    };

    const handleSaveNodes = async () => {
        setIsSavingNodes(true);
        try {
            const promises = STATIC_SECTIONS.map(async (section) => {
                const formData = nodeForms[section.id_string];
                // Only save if title or description is provided
                if (formData && (formData.title || formData.description)) {
                    const existingNode = nodes?.find(n => n.id_string === section.id_string);
                    if (existingNode) {
                        return updateNode({ id: existingNode.business_node_id, data: formData }).unwrap();
                    } else {
                        return createNode({
                            ...formData,
                            id_string: section.id_string,
                            position_x: section.position_x,
                            position_y: section.position_y,
                            mobile_order: section.mobile_order
                        }).unwrap();
                    }
                } else {
                    // If fields are cleared, delete the node if it existed
                    const existingNode = nodes?.find(n => n.id_string === section.id_string);
                    if (existingNode) {
                        return deleteNode(existingNode.business_node_id).unwrap();
                    }
                }
                return Promise.resolve();
            });

            await Promise.all(promises);
            notify.success('Diagram nodes updated successfully!');
            refetchNodes();
        } catch (error) {
            console.error('Failed to save nodes', error);
            notify.error(extractErrorMessage(error, 'Failed to save diagram nodes.'));
        } finally {
            setIsSavingNodes(false);
        }
    };

    if (isOverviewLoading || isNodesLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-8 w-full max-w-full pb-16">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Businesses Overview</h1>
                <p className="text-muted-foreground mt-2">Update the main heading, descriptions, and dynamic ecosystem diagram for the Our Businesses page.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8 grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        General Content
                    </TabsTrigger>
                    <TabsTrigger value="ecosystem" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Ecosystem Diagram
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: General Content */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="border-primary/10 shadow-sm">
                        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                            <CardTitle className="text-xl flex items-center text-primary">
                                <Pencil className="w-5 h-5 mr-2" />
                                General Content
                            </CardTitle>
                            <CardDescription>
                                Main page headers and descriptions shown before the diagram.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title Part 1 (e.g. Connecting Markets.)</label>
                                    <Input name="title_part1" value={overviewData.title_part1} onChange={handleOverviewChange} placeholder="Connecting Markets." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title Part 2 (e.g. Building Value.)</label>
                                    <Input name="title_part2" value={overviewData.title_part2} onChange={handleOverviewChange} placeholder="Building Value." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description 1</label>
                                <Textarea name="description1" value={overviewData.description1} onChange={handleOverviewChange} rows={3} placeholder="First paragraph..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description 2</label>
                                <Textarea name="description2" value={overviewData.description2} onChange={handleOverviewChange} rows={3} placeholder="Second paragraph..." />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border mt-6">
                                <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                    <Button onClick={handleOverviewSave} disabled={isUpdatingOverview}>
                                        {isUpdatingOverview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Content
                                    </Button>
                                </ComponentGuard>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: Ecosystem Diagram */}
                <TabsContent value="ecosystem" className="space-y-6">
                    <Card className="border-primary/10 shadow-sm">
                        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl flex items-center text-primary">
                                        <Network className="w-5 h-5 mr-2" />
                                        Ecosystem Diagram Nodes
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Edit the 7 static node slots in the interactive diagram. The center node represents the core business. Leave a title/desc blank to hide a node.
                                    </CardDescription>
                                </div>
                                <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                    <Button onClick={handleSaveNodes} disabled={isSavingNodes}>
                                        {isSavingNodes ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Diagram
                                    </Button>
                                </ComponentGuard>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {STATIC_SECTIONS.map((section) => {
                                    const formData = nodeForms[section.id_string] || {};
                                    return (
                                        <div key={section.id_string} className={`relative bg-card rounded-lg border shadow-sm p-5 ${section.isCenter ? 'md:col-span-2 border-primary/40 ring-1 ring-primary/20' : 'border-border'}`}>
                                            <div className="absolute top-0 right-0 p-2 opacity-30"><GripVertical className="w-4 h-4" /></div>
                                            <h3 className={`font-semibold mb-4 ${section.isCenter ? 'text-primary text-lg' : 'text-foreground text-md'}`}>{section.label}</h3>

                                            <div className={`gap-4 ${section.isCenter ? 'grid grid-cols-1 md:grid-cols-2' : 'space-y-4'}`}>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-muted-foreground">{section.isCenter ? 'Center Main Title' : 'Title'}</label>
                                                    <Input
                                                        value={formData.title || ''}
                                                        onChange={(e) => handleNodeChange(section.id_string, 'title', e.target.value)}
                                                        placeholder={section.isCenter ? "e.g. MIDI ETHIOPIA" : "e.g. Export Trade"}
                                                    />
                                                    {section.isCenter && <p className="text-[10px] text-muted-foreground mt-1">Use \n for line breaks (e.g. MIDI\nETHIOPIA)</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-muted-foreground">{section.isCenter ? 'Center Subtitle' : 'Description'}</label>
                                                    <Textarea
                                                        value={formData.description || ''}
                                                        onChange={(e) => handleNodeChange(section.id_string, 'description', e.target.value)}
                                                        placeholder={section.isCenter ? "e.g. Multi-Sector Business" : "Enter brief description"}
                                                        rows={2}
                                                        className="resize-none"
                                                    />
                                                </div>
                                                {!section.isCenter && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground">Icon (Lucide)</label>
                                                        <LucideIconPicker
                                                            value={formData.icon || ''}
                                                            onChange={(iconName) => handleNodeChange(section.id_string, 'icon', iconName)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BusinessesPage;
