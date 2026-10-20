"use client";

import React, { useState, useEffect } from 'react';
import {
    useGetBusinessOverviewQuery,
    useUpdateBusinessOverviewMutation,
    BusinessOverview
} from '@/redux/api/businessApi';
import { Pencil, Trash2, Plus, Save, Loader2, Package, Truck, Building2, TrendingUp, Database, Filter, ImageIcon } from 'lucide-react';
import { ComponentGuard } from '@/components/auth/ComponentGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notify, extractErrorMessage } from '@/utils/notification';
import { LucideIconPicker } from "@/components/common/LucideIconPicker";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BusinessOverviewAdminPage = () => {
    const { data: overview, isLoading, refetch } = useGetBusinessOverviewQuery();
    const [updateOverview, { isLoading: isUpdating }] = useUpdateBusinessOverviewMutation();

    const [formData, setFormData] = useState<Partial<BusinessOverview>>({
        business_data: [],
        business_categories: [],
        key_metrics: [],
        operations_data: [],
        quick_stats: {
            left: [],
            right: []
        },
        network_operations: [],
        page_metadata: {
            general_overview_info: { title: 'Business Overview & Operations', description: 'Explore our diversified network of business activities. Our overview provides insights into our warehousing infrastructure, distribution networks, import/export operations, and overall growth trends across multiple locations.', bg_image: '', overlay_text: '', features: [], right_content: { title: 'Integrated Ecosystem', description: '', icon: 'Box' } },
            key_metrics_info: { title: 'Key Metrics Grid', description: '' },
            key_verticals_info: { title: 'Key Verticals (Sidebar)', description: '', icon: 'Filter' },
            operations_table_info: { title: 'Business Operations Table', description: '', icon: 'Database' },
            network_operations_info: { title: 'Network Operations', description: '', icon: 'Database' }
        }
    });

    useEffect(() => {
        if (overview) {
            const normalizedOverview = { ...overview };

            // Defensively handle legacy object-style quick_stats
            if (normalizedOverview.quick_stats) {
                const qs: any = normalizedOverview.quick_stats;
                normalizedOverview.quick_stats = {
                    left: Array.isArray(qs.left) ? qs.left : (qs.left ? [qs.left] : []),
                    right: Array.isArray(qs.right) ? qs.right : (qs.right ? [qs.right] : [])
                } as any;
            }

            setFormData(normalizedOverview);
        }
    }, [overview]);

    const handleSave = async () => {
        try {
            await updateOverview(formData).unwrap();
            notify.success('Overview updated successfully!');
            refetch();
        } catch (error) {
            console.error('Failed to update overview', error);
            notify.error(extractErrorMessage(error, 'Failed to update overview.'));
        }
    };

    // Helper for simple array updates
    const updateArrayItem = (arrayName: keyof BusinessOverview, index: number, field: string, value: any) => {
        setFormData(prev => {
            const arr = [...(prev[arrayName] as any[])];
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, [arrayName]: arr };
        });
    };

    const updatePageMetadata = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            page_metadata: {
                ...prev.page_metadata,
                [section]: {
                    ...(prev.page_metadata as any)?.[section],
                    [field]: value
                }
            }
        }));
    };

    const addArrayItem = (arrayName: keyof BusinessOverview, defaultItem: any) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...(prev[arrayName] as any[] || []), defaultItem]
        }));
    };

    const removeArrayItem = (arrayName: keyof BusinessOverview, index: number) => {
        setFormData(prev => {
            const arr = [...(prev[arrayName] as any[])];
            arr.splice(index, 1);
            return { ...prev, [arrayName]: arr };
        });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="mx-auto space-y-10 w-full pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Business Overview</h1>
                    <p className="text-muted-foreground mt-2">Manage the content for the public Business Overview page.</p>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="w-full flex justify-start h-auto gap-2 min-w-max overflow-x-auto pb-2 border-b border-transparent">
                    <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        General Overview
                    </TabsTrigger>
                    <TabsTrigger value="metrics" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Key Metrics
                    </TabsTrigger>
                    <TabsTrigger value="operations" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Operations Table
                    </TabsTrigger>
                    <TabsTrigger value="network" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Network Operations
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Categories & Verticals
                    </TabsTrigger>
                    <TabsTrigger value="footer" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Quick Stats Footer
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-0">
                    {/* Business Data */}
                    <div className="p-6 rounded-xl bg-card text-primary shadow-sm border border-slate-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 border-b pb-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl text-foreground font-semibold flex items-center gap-2">
                                        <Pencil className="w-5 h-5 text-foreground" /> General Overview & Operations
                                    </h2>
                                    <ComponentGuard anyPermissions={['BUSINESS_OVERVIEW:UPDATE']}>
                                        <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </Button>
                                    </ComponentGuard>
                                </div>
                                <div className="grid grid-cols-1 text-foreground md:grid-cols-2 gap-3">
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Title</label>
                                        <Input value={formData.page_metadata?.general_overview_info?.title || ''} onChange={(e) => updatePageMetadata('general_overview_info', 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Description</label>
                                        <Input value={formData.page_metadata?.general_overview_info?.description || ''} onChange={(e) => updatePageMetadata('general_overview_info', 'description', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-medium">Overlay Text (on top of image)</label>
                                        <Input value={formData.page_metadata?.general_overview_info?.overlay_text || ''} onChange={(e) => updatePageMetadata('general_overview_info', 'overlay_text', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <ImageUploadField
                                            id="general_overview_bg_image"
                                            label="Background Image"
                                            value={formData.page_metadata?.general_overview_info?.bg_image ? [formData.page_metadata.general_overview_info.bg_image] : []}
                                            onChange={(ids) => updatePageMetadata('general_overview_info', 'bg_image', ids[0] || '')}
                                            category="headline"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2 mt-4">
                                        <label className="text-sm font-medium flex justify-between items-center border-b pb-2">
                                            Features / Capabilities
                                            <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => {
                                                    const newFeatures = [...(formData.page_metadata?.general_overview_info?.features || []), { text: '', icon: 'CheckCircle' }];
                                                    updatePageMetadata('general_overview_info', 'features', newFeatures);
                                                }}>
                                                    <Plus className="w-3 h-3 mr-1" /> Add Feature
                                                </Button>
                                            </ComponentGuard>
                                        </label>
                                        <div className="space-y-3 pt-2">
                                            {formData.page_metadata?.general_overview_info?.features?.map((feature, fIndex) => (
                                                <div key={fIndex} className="flex gap-3 items-center">
                                                    <div className="w-32">
                                                        <LucideIconPicker value={feature.icon} onChange={(iconName) => {
                                                            const newFeatures = [...(formData.page_metadata?.general_overview_info?.features || [])];
                                                            newFeatures[fIndex] = { ...feature, icon: iconName };
                                                            updatePageMetadata('general_overview_info', 'features', newFeatures);
                                                        }} />
                                                    </div>
                                                    <Input
                                                        value={feature.text}
                                                        onChange={(e) => {
                                                            const newFeatures = [...(formData.page_metadata?.general_overview_info?.features || [])];
                                                            newFeatures[fIndex] = { ...feature, text: e.target.value };
                                                            updatePageMetadata('general_overview_info', 'features', newFeatures);
                                                        }}
                                                        className="flex-1 h-10"
                                                        placeholder="Feature text (e.g. Supply chain connectivity)"
                                                    />
                                                    <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500" onClick={() => {
                                                            const newFeatures = [...(formData.page_metadata?.general_overview_info?.features || [])];
                                                            newFeatures.splice(fIndex, 1);
                                                            updatePageMetadata('general_overview_info', 'features', newFeatures);
                                                        }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </ComponentGuard>
                                                </div>
                                            ))}
                                            {(!formData.page_metadata?.general_overview_info?.features || formData.page_metadata?.general_overview_info?.features.length === 0) && (
                                                <p className="text-xs text-muted-foreground italic">No features added.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2 mt-4 pt-4 border-t">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            Right Hand Side Content
                                        </label>
                                        <div className="grid grid-cols-1 text-foreground md:grid-cols-2 gap-3">
                                            <div className="space-y-1 text-foreground">
                                                <label className="text-xs font-medium">Title</label>
                                                <Input
                                                    value={formData.page_metadata?.general_overview_info?.right_content?.title || ''}
                                                    onChange={(e) => updatePageMetadata('general_overview_info', 'right_content', { ...formData.page_metadata?.general_overview_info?.right_content, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1 text-foreground">
                                                <label className="text-xs font-medium">Icon</label>
                                                <LucideIconPicker
                                                    value={formData.page_metadata?.general_overview_info?.right_content?.icon || 'Box'}
                                                    onChange={(iconName) => updatePageMetadata('general_overview_info', 'right_content', { ...formData.page_metadata?.general_overview_info?.right_content, icon: iconName })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-6 mt-0">
                    {/* Key Metrics */}
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4 border-b pb-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl text-foreground dark:text-white font-semibold flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-foreground" /> Section Info: Key Metrics
                                    </h2>
                                    <ComponentGuard anyPermissions={['BUSINESS_OVERVIEW:UPDATE']}>
                                        <div className="flex items-center gap-3">
                                            <Button onClick={() => addArrayItem('key_metrics', { title: '', value: '', change: '', period: '', icon: 'TrendingUp', color: '#ba8200' })} variant="outline" className="flex items-center gap-2 bg-transparent border-slate-700 text-foreground hover:bg-slate-800">
                                                <Plus className="w-4 h-4" /> Add Metric
                                            </Button>
                                            <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </ComponentGuard>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 text-foreground md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {formData.key_metrics?.map((metric, index) => (
                                <Card key={index} className="border-slate-200">
                                    <CardHeader className="py-2 px-4 border-b flex flex-row justify-between items-center">
                                        <CardTitle className="text-sm font-semibold">Metric</CardTitle>
                                        <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeArrayItem('key_metrics', index)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentGuard>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Title</label>
                                            <Input value={metric.title} onChange={(e) => updateArrayItem('key_metrics', index, 'title', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Value</label>
                                            <Input value={metric.value} onChange={(e) => updateArrayItem('key_metrics', index, 'value', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Change Label</label>
                                            <Input value={metric.change} onChange={(e) => updateArrayItem('key_metrics', index, 'change', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Period/Subtext</label>
                                            <Input value={metric.period} onChange={(e) => updateArrayItem('key_metrics', index, 'period', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Icon</label>
                                            <LucideIconPicker value={metric.icon} onChange={(iconName) => updateArrayItem('key_metrics', index, 'icon', iconName)} />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Color</label>
                                            <div className="flex items-center gap-2">
                                                <input type="color" value={metric.color} onChange={(e) => updateArrayItem('key_metrics', index, 'color', e.target.value)} className="h-8 w-8 cursor-pointer border p-0 rounded-sm" />
                                                <Input value={metric.color} onChange={(e) => updateArrayItem('key_metrics', index, 'color', e.target.value)} className="h-8 flex-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="operations" className="space-y-6 mt-0">
                    {/* Operations Data Table */}
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4 border-b pb-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl text-foreground font-semibold flex items-center gap-2">
                                        <Database className="w-5 h-5 text-foreground" /> Business Operations Table
                                    </h2>
                                    <ComponentGuard anyPermissions={['BUSINESS_OVERVIEW:UPDATE']}>
                                        <div className="flex items-center gap-3">
                                            <Button onClick={() => addArrayItem('operations_data', { area: '', focus: '', infrastructure: '', status: '', statusIcon: 'TrendingUp', statusColor: '#22c55e' })} variant="outline" className="flex items-center gap-2 bg-transparent border-slate-700 text-foreground hover:bg-slate-800">
                                                <Plus className="w-4 h-4" /> Add Row
                                            </Button>
                                            <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </ComponentGuard>
                                </div>
                                <div className="grid grid-cols-1 text-foreground md:grid-cols-3 gap-3">
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Title</label>
                                        <Input className='text-foreground' value={formData.page_metadata?.operations_table_info?.title || ''} onChange={(e) => updatePageMetadata('operations_table_info', 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Description</label>
                                        <Input className='text-foreground' value={formData.page_metadata?.operations_table_info?.description || ''} onChange={(e) => updatePageMetadata('operations_table_info', 'description', e.target.value)} />
                                    </div>
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Icon</label>
                                        <LucideIconPicker value={formData.page_metadata?.operations_table_info?.icon || 'Database'} onChange={(iconName) => updatePageMetadata('operations_table_info', 'icon', iconName)} />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="space-y-4">
                            {formData.operations_data?.map((data, index) => (
                                <div key={index} className="flex flex-col gap-3 p-4 border rounded-lg">
                                    <div className="flex flex-col md:flex-row gap-3 items-center">
                                        <Input placeholder="Business Area" value={data.area} onChange={(e) => updateArrayItem('operations_data', index, 'area', e.target.value)} className="flex-1 text-foreground" />
                                        <Input placeholder="Strategic Focus" value={data.focus} onChange={(e) => updateArrayItem('operations_data', index, 'focus', e.target.value)} className="flex-1 text-foreground" />
                                        <Input placeholder="Infrastructure" value={data.infrastructure} onChange={(e) => updateArrayItem('operations_data', index, 'infrastructure', e.target.value)} className="flex-1 text-foreground" />
                                        <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500" onClick={() => removeArrayItem('operations_data', index)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentGuard>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3 items-center border-t pt-3 mt-1">
                                        <span className="text-sm font-medium text-foreground w-16">Status:</span>
                                        <Input placeholder="Status Text (e.g. increasing 10%)" value={data.status} onChange={(e) => updateArrayItem('operations_data', index, 'status', e.target.value)} className="flex-1 text-foreground" />
                                        <div className="w-32 text-foreground">
                                            <LucideIconPicker value={data.statusIcon || 'TrendingUp'} onChange={(iconName) => updateArrayItem('operations_data', index, 'statusIcon', iconName)} />
                                        </div>
                                        <div className="flex items-center gap-2 w-32">
                                            <input type="color" value={data.statusColor || '#22c55e'} onChange={(e) => updateArrayItem('operations_data', index, 'statusColor', e.target.value)} className="h-9 w-9 cursor-pointer border p-0 rounded-sm" />
                                            <Input value={data.statusColor || '#22c55e'} onChange={(e) => updateArrayItem('operations_data', index, 'statusColor', e.target.value)} className="h-9 flex-1 text-foreground" />
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="network" className="space-y-6 mt-0">
                    {/* Network Operations */}
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4 border-b pb-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl text-foreground font-semibold flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-foreground" /> Network Operations
                                    </h2>
                                    <ComponentGuard anyPermissions={['BUSINESS_OVERVIEW:UPDATE']}>
                                        <div className="flex items-center gap-3">
                                            <Button onClick={() => addArrayItem('network_operations', { title: '', description: '', full_description: '', icon: 'Truck' })} variant="outline" className="flex items-center gap-2 bg-transparent border-slate-700 text-foreground hover:bg-slate-800">
                                                <Plus className="w-4 h-4" /> Add Operation
                                            </Button>
                                            <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </ComponentGuard>
                                </div>
                                <div className="grid grid-cols-1 text-foreground md:grid-cols-3 gap-3">
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Title</label>
                                        <Input value={formData.page_metadata?.network_operations_info?.title || ''} onChange={(e) => updatePageMetadata('network_operations_info', 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Description</label>
                                        <Input value={formData.page_metadata?.network_operations_info?.description || ''} onChange={(e) => updatePageMetadata('network_operations_info', 'description', e.target.value)} />
                                    </div>
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Icon</label>
                                        <LucideIconPicker value={formData.page_metadata?.network_operations_info?.icon || 'Truck'} onChange={(iconName) => updatePageMetadata('network_operations_info', 'icon', iconName)} />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 text-foreground md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.network_operations?.map((op, index) => (
                                <Card key={index} className="border-slate-200">
                                    <CardHeader className="py-2 px-4 border-b flex flex-row justify-between items-center">
                                        <CardTitle className="text-sm font-semibold">Operation</CardTitle>
                                        <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeArrayItem('network_operations', index)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentGuard>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Title</label>
                                            <Input value={op.title} onChange={(e) => updateArrayItem('network_operations', index, 'title', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Short Description</label>
                                            <Textarea value={op.description} onChange={(e) => updateArrayItem('network_operations', index, 'description', e.target.value)} rows={2} />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Full Description (Expands on click)</label>
                                            <Textarea value={op.full_description} onChange={(e) => updateArrayItem('network_operations', index, 'full_description', e.target.value)} rows={3} />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Icon</label>
                                            <LucideIconPicker value={op.icon} onChange={(iconName) => updateArrayItem('network_operations', index, 'icon', iconName)} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-6 mt-0">
                    {/* Key Verticals / Categories */}
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4 border-b pb-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl text-foreground font-semibold flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-foreground" /> Key Verticals (Sidebar)
                                    </h2>
                                    <ComponentGuard anyPermissions={['BUSINESS_OVERVIEW:UPDATE']}>
                                        <div className="flex items-center gap-3">
                                            <Button onClick={() => addArrayItem('business_categories', { title: '', description: '', growth: '', topFocus: [], icon: 'Filter', color: '#3b82f6' })} variant="outline" className="flex items-center gap-2 bg-transparent border-slate-700 text-foreground hover:bg-slate-800">
                                                <Plus className="w-4 h-4" /> Add Vertical
                                            </Button>
                                            <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </ComponentGuard>
                                </div>
                                <div className="grid grid-cols-1 text-foreground md:grid-cols-3 gap-3">
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Title</label>
                                        <Input value={formData.page_metadata?.key_verticals_info?.title || ''} onChange={(e) => updatePageMetadata('key_verticals_info', 'title', e.target.value)} />
                                    </div>
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Description</label>
                                        <Input value={formData.page_metadata?.key_verticals_info?.description || ''} onChange={(e) => updatePageMetadata('key_verticals_info', 'description', e.target.value)} />
                                    </div>
                                    <div className="space-y-1 text-foreground">
                                        <label className="text-xs font-medium">Section Icon</label>
                                        <LucideIconPicker value={formData.page_metadata?.key_verticals_info?.icon || 'Filter'} onChange={(iconName) => updatePageMetadata('key_verticals_info', 'icon', iconName)} />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 text-foreground md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.business_categories?.map((cat, index) => (
                                <Card key={index} className="border-slate-200">
                                    <CardHeader className="py-2 px-4 border-b flex flex-row justify-between items-center">
                                        <CardTitle className="text-sm font-semibold">Vertical</CardTitle>
                                        <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeArrayItem('business_categories', index)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentGuard>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Title</label>
                                            <Input value={cat.title} onChange={(e) => updateArrayItem('business_categories', index, 'title', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Growth Label</label>
                                            <Input value={cat.growth} onChange={(e) => updateArrayItem('business_categories', index, 'growth', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1 text-foreground">
                                            <label className="text-xs font-medium">Description</label>
                                            <Textarea value={cat.description} onChange={(e) => updateArrayItem('business_categories', index, 'description', e.target.value)} rows={2} />
                                        </div>
                                        <div className="space-y-2 text-foreground">
                                            <label className="text-xs font-medium flex justify-between items-center">
                                                Focus Areas
                                                <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => {
                                                        const newFocus = [...(cat.topFocus || []), ''];
                                                        updateArrayItem('business_categories', index, 'topFocus', newFocus);
                                                    }}>
                                                        <Plus className="w-3 h-3 mr-1" /> Add
                                                    </Button>
                                                </ComponentGuard>
                                            </label>
                                            <div className="space-y-2 text-foreground">
                                                {cat.topFocus?.map((focus, fIndex) => (
                                                    <div key={fIndex} className="flex gap-2 items-center">
                                                        <Input
                                                            value={focus}
                                                            onChange={(e) => {
                                                                const newFocus = [...(cat.topFocus || [])];
                                                                newFocus[fIndex] = e.target.value;
                                                                updateArrayItem('business_categories', index, 'topFocus', newFocus);
                                                            }}
                                                            className="h-8"
                                                            placeholder="Focus text..."
                                                        />
                                                        <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => {
                                                                const newFocus = [...(cat.topFocus || [])];
                                                                newFocus.splice(fIndex, 1);
                                                                updateArrayItem('business_categories', index, 'topFocus', newFocus);
                                                            }}>
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </ComponentGuard>
                                                    </div>
                                                ))}
                                                {(!cat.topFocus || cat.topFocus.length === 0) && (
                                                    <p className="text-xs text-muted-foreground italic">No focus areas added.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 text-foreground gap-3">
                                            <div className="space-y-1 text-foreground">
                                                <label className="text-xs font-medium">Icon</label>
                                                <LucideIconPicker value={cat.icon} onChange={(iconName) => updateArrayItem('business_categories', index, 'icon', iconName)} />
                                            </div>
                                            <div className="space-y-1 text-foreground">
                                                <label className="text-xs font-medium">Color</label>
                                                <div className="flex items-center gap-2">
                                                    <input type="color" value={cat.color || '#3b82f6'} onChange={(e) => updateArrayItem('business_categories', index, 'color', e.target.value)} className="h-8 w-8 cursor-pointer border p-0 rounded-sm" />
                                                    <Input value={cat.color || '#3b82f6'} onChange={(e) => updateArrayItem('business_categories', index, 'color', e.target.value)} className="h-8 flex-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="footer" className="space-y-6 mt-0">
                    {/* Quick Stats */}
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="mb-6 flex justify-between items-center border-b pb-4">
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground"><TrendingUp className="w-5 h-5 text-foreground" /> Quick Stats Footer</h2>
                                <p className="text-sm text-muted-foreground mt-2">Manage stats that appear in a grid layout on the public page.</p>
                            </div>
                            <ComponentGuard anyPermissions={['BUSINESS_OVERVIEW:UPDATE']}>
                                <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </Button>
                            </ComponentGuard>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['left', 'right'].map((pos) => (
                                <div key={pos} className="space-y-4 p-4 border rounded-lg">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <h3 className="font-medium capitalize text-foreground">{pos} Side Stats</h3>
                                        <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                            <Button className='bg-primary text-white' variant="ghost" size="sm" onClick={() => {
                                                setFormData(prev => {
                                                    const sideArray = [...(prev.quick_stats?.[pos as 'left' | 'right'] || [])];
                                                    sideArray.push({ title: '', subtitle: '' });
                                                    return {
                                                        ...prev,
                                                        quick_stats: { ...prev.quick_stats, [pos]: sideArray } as any
                                                    };
                                                });
                                            }}>
                                                <Plus className="w-4 h-4 mr-1" /> Add Stat
                                            </Button>
                                        </ComponentGuard>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.quick_stats?.[pos as 'left' | 'right']?.map((stat: any, index: number) => (
                                            <div key={index} className="flex gap-2 items-start border p-3 rounded-md relative group">
                                                <div className="flex-1 space-y-2">
                                                    <div className="space-y-1 text-foreground">
                                                        <label className="text-xs font-medium">Title</label>
                                                        <Input
                                                            value={stat.title}
                                                            onChange={(e) => {
                                                                setFormData(prev => {
                                                                    const sideArray = [...(prev.quick_stats?.[pos as 'left' | 'right'] || [])];
                                                                    sideArray[index] = { ...stat, title: e.target.value };
                                                                    return { ...prev, quick_stats: { ...prev.quick_stats, [pos]: sideArray } as any };
                                                                });
                                                            }}
                                                            className="h-8"
                                                        />
                                                    </div>
                                                    <div className="space-y-1 text-foreground">
                                                        <label className="text-xs font-medium">Subtitle</label>
                                                        <Input
                                                            value={stat.subtitle}
                                                            onChange={(e) => {
                                                                setFormData(prev => {
                                                                    const sideArray = [...(prev.quick_stats?.[pos as 'left' | 'right'] || [])];
                                                                    sideArray[index] = { ...stat, subtitle: e.target.value };
                                                                    return { ...prev, quick_stats: { ...prev.quick_stats, [pos]: sideArray } as any };
                                                                });
                                                            }}
                                                            className="h-8"
                                                        />
                                                    </div>
                                                </div>
                                                <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                                    <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => {
                                                        setFormData(prev => {
                                                            const sideArray = [...(prev.quick_stats?.[pos as 'left' | 'right'] || [])];
                                                            sideArray.splice(index, 1);
                                                            return { ...prev, quick_stats: { ...prev.quick_stats, [pos]: sideArray } as any };
                                                        });
                                                    }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </ComponentGuard>
                                            </div>
                                        ))}
                                        {(!formData.quick_stats?.[pos as 'left' | 'right'] || formData.quick_stats?.[pos as 'left' | 'right'].length === 0) && (
                                            <p className="text-sm text-muted-foreground italic text-center py-4">No stats added for {pos} side.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BusinessOverviewAdminPage;
