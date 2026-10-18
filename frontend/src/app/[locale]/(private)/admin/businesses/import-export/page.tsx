"use client";

import React, { useState, useEffect } from 'react';
import {
    useGetImportExportOverviewQuery,
    useUpdateImportExportOverviewMutation,
    useGetImportExportCategoriesQuery,
    useCreateImportExportCategoryMutation,
    useUpdateImportExportCategoryMutation,
    useDeleteImportExportCategoryMutation,
    useGetImportExportStepsQuery,
    useCreateImportExportStepMutation,
    useUpdateImportExportStepMutation,
    useDeleteImportExportStepMutation,
    ImportExportOverview,
    ImportExportCategory,
    ImportExportStep
} from '@/redux/api/businessApi';
import { Pencil, Trash2, Plus, Save, Loader2, Plane, Ship, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notify, extractErrorMessage } from '@/utils/notification';
import { LucideIconPicker } from "@/components/common/LucideIconPicker";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImportExportAdminPage = () => {
    // --- Overview ---
    const { data: overview, isLoading: isOverviewLoading, refetch: refetchOverview } = useGetImportExportOverviewQuery();
    const [updateOverview, { isLoading: isUpdatingOverview }] = useUpdateImportExportOverviewMutation();

    const [overviewData, setOverviewData] = useState<Partial<ImportExportOverview>>({
        page_subtitle: '', page_title: '', page_description: '',
        export_title: '', export_description: '', export_icon: 'Plane',
        import_title: '', import_description: '', import_icon: 'Ship',
        stat1_value: '', stat1_label: '', stat1_subtext: '',
        stat2_value: '', stat2_label: '',
        cta_title: '', cta_description: '',
        center_icon: '', center_title: '', center_subtitle: '',
        cta_button_title: '', cta_button_url: '', cta_button_icon: ''
    });

    useEffect(() => {
        if (overview) {
            setOverviewData(overview);
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

    // --- Categories (Export & Import) ---
    const { data: categories = [], isLoading: isCategoriesLoading, refetch: refetchCategories } = useGetImportExportCategoriesQuery();
    const [createCategory] = useCreateImportExportCategoryMutation();
    const [updateCategory] = useUpdateImportExportCategoryMutation();
    const [deleteCategory] = useDeleteImportExportCategoryMutation();

    const [localExports, setLocalExports] = useState<ImportExportCategory[]>([]);
    const [localImports, setLocalImports] = useState<ImportExportCategory[]>([]);
    const [isSavingExports, setIsSavingExports] = useState(false);
    const [isSavingImports, setIsSavingImports] = useState(false);

    useEffect(() => {
        setLocalExports(categories.filter(c => c.type === 'export'));
        setLocalImports(categories.filter(c => c.type === 'import'));
    }, [categories]);

    const handleAddCategory = async (type: 'import' | 'export') => {
        try {
            await createCategory({ type, title: 'New Category', description: '', icon: type === 'import' ? 'HelpCircle' : undefined, order: 0 }).unwrap();
            notify.success('Category added!');
            refetchCategories();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to add category.'));
        }
    };

    const handleLocalExportChange = (id: string, field: keyof ImportExportCategory, value: any) => {
        setLocalExports(prev => prev.map(c => c.category_id === id ? { ...c, [field]: value } : c));
    };

    const handleLocalImportChange = (id: string, field: keyof ImportExportCategory, value: any) => {
        setLocalImports(prev => prev.map(c => c.category_id === id ? { ...c, [field]: value } : c));
    };

    const handleSaveExports = async () => {
        setIsSavingExports(true);
        try {
            await Promise.all(localExports.map(item => updateCategory({ id: item.category_id, data: item }).unwrap()));
            notify.success('Export commodities updated!');
            refetchCategories();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to update export commodities.'));
        } finally {
            setIsSavingExports(false);
        }
    };

    const handleSaveImports = async () => {
        setIsSavingImports(true);
        try {
            await Promise.all(localImports.map(item => updateCategory({ id: item.category_id, data: item }).unwrap()));
            notify.success('Import categories updated!');
            refetchCategories();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to update import categories.'));
        } finally {
            setIsSavingImports(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id).unwrap();
            notify.success('Category deleted!');
            refetchCategories();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to delete category.'));
        }
    };

    // --- Steps ---
    const { data: steps = [], isLoading: isStepsLoading, refetch: refetchSteps } = useGetImportExportStepsQuery();
    const [createStep] = useCreateImportExportStepMutation();
    const [updateStep] = useUpdateImportExportStepMutation();
    const [deleteStep] = useDeleteImportExportStepMutation();

    const [localSteps, setLocalSteps] = useState<ImportExportStep[]>([]);
    const [isSavingSteps, setIsSavingSteps] = useState(false);

    useEffect(() => {
        setLocalSteps(steps);
    }, [steps]);

    const handleAddStep = async () => {
        try {
            await createStep({ step_number: '00', title: 'New Step', description: '', order: 0 }).unwrap();
            notify.success('Step added!');
            refetchSteps();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to add step.'));
        }
    };

    const handleLocalStepChange = (id: string, field: keyof ImportExportStep, value: any) => {
        setLocalSteps(prev => prev.map(s => s.step_id === id ? { ...s, [field]: value } : s));
    };

    const handleSaveSteps = async () => {
        setIsSavingSteps(true);
        try {
            await Promise.all(localSteps.map(item => updateStep({ id: item.step_id, data: item }).unwrap()));
            notify.success('Steps updated!');
            refetchSteps();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to update steps.'));
        } finally {
            setIsSavingSteps(false);
        }
    };

    const handleDeleteStep = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this step?")) return;
        try {
            await deleteStep(id).unwrap();
            notify.success('Step deleted!');
            refetchSteps();
        } catch (error) {
            notify.error(extractErrorMessage(error, 'Failed to delete step.'));
        }
    };

    return (
        <div className="mx-auto space-y-10 w-full pb-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage "Import & Export"</h1>
                <p className="text-muted-foreground mt-2">Manage the content for the public Import/Export trading page.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="w-full flex justify-start h-auto gap-2 min-w-max overflow-x-auto pb-2 border-b border-transparent">
                    <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        General Overview
                    </TabsTrigger>
                    <TabsTrigger value="exports" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Export Commodities
                    </TabsTrigger>
                    <TabsTrigger value="imports" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Import Categories
                    </TabsTrigger>
                    <TabsTrigger value="steps" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 py-2.5 transition-all whitespace-nowrap">
                        Process Flow Steps
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-0">
                    <div className="p-6 rounded-xl bg-card text-primary shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-white"><Pencil className="w-5 h-5 text-white" /> General Overview</h2>
                            <ComponentGuard anyPermissions={['BUSINESS_OVERVIEW:UPDATE']}>
                                <Button onClick={handleOverviewSave} disabled={isUpdatingOverview} className="flex items-center gap-2">
                                    {isUpdatingOverview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </ComponentGuard>
                        </div>
                        {isOverviewLoading ? (
                            <div className="flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                        ) : (
                            <div className="space-y-4 text-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Page Subtitle</label>
                                        <Input name="page_subtitle" value={overviewData.page_subtitle || ''} onChange={handleOverviewChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Page Title</label>
                                        <Input name="page_title" value={overviewData.page_title || ''} onChange={handleOverviewChange} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Page Description</label>
                                        <Textarea name="page_description" value={overviewData.page_description || ''} onChange={handleOverviewChange} rows={3} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-700">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Export Section Info</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input name="export_title" value={overviewData.export_title || ''} onChange={handleOverviewChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea name="export_description" value={overviewData.export_description || ''} onChange={handleOverviewChange} rows={3} />
                                        </div>
                                        <div className="space-y-2 text-white">
                                            <label className="text-sm font-medium">Icon</label>
                                            <LucideIconPicker value={overviewData.export_icon || ''} onChange={(icon) => setOverviewData({ ...overviewData, export_icon: icon })} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Import Section Info</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input name="import_title" value={overviewData.import_title || ''} onChange={handleOverviewChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea name="import_description" value={overviewData.import_description || ''} onChange={handleOverviewChange} rows={3} />
                                        </div>
                                        <div className="space-y-2 text-white">
                                            <label className="text-sm font-medium">Icon</label>
                                            <LucideIconPicker value={overviewData.import_icon || ''} onChange={(icon) => setOverviewData({ ...overviewData, import_icon: icon })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-700">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Stat 1</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Value (e.g. $5M+)</label>
                                            <Input name="stat1_value" value={overviewData.stat1_value || ''} onChange={handleOverviewChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Label</label>
                                            <Input name="stat1_label" value={overviewData.stat1_label || ''} onChange={handleOverviewChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Subtext</label>
                                            <Input name="stat1_subtext" value={overviewData.stat1_subtext || ''} onChange={handleOverviewChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white">Stat 2</h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Value (e.g. $20M+)</label>
                                            <Input name="stat2_value" value={overviewData.stat2_value || ''} onChange={handleOverviewChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Label</label>
                                            <Input name="stat2_label" value={overviewData.stat2_label || ''} onChange={handleOverviewChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">CTA Title</label>
                                        <Input name="cta_title" value={overviewData.cta_title || ''} onChange={handleOverviewChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">CTA Description</label>
                                        <Textarea name="cta_description" value={overviewData.cta_description || ''} onChange={handleOverviewChange} rows={2} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
                                    <div className="col-span-full">
                                        <h3 className="text-lg font-medium text-white">Center Circular Content</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title (use \n for line break)</label>
                                        <Input name="center_title" value={overviewData.center_title || ''} onChange={handleOverviewChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subtitle</label>
                                        <Input name="center_subtitle" value={overviewData.center_subtitle || ''} onChange={handleOverviewChange} />
                                    </div>
                                    <div className="space-y-2 text-white">
                                        <label className="text-sm font-medium">Icon</label>
                                        <LucideIconPicker value={overviewData.center_icon || ''} onChange={(icon) => setOverviewData({ ...overviewData, center_icon: icon })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
                                    <div className="col-span-full">
                                        <h3 className="text-lg font-medium text-white">CTA Button</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Button Text</label>
                                        <Input name="cta_button_title" value={overviewData.cta_button_title || ''} onChange={handleOverviewChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Button URL</label>
                                        <Input name="cta_button_url" value={overviewData.cta_button_url || ''} onChange={handleOverviewChange} />
                                    </div>
                                    <div className="space-y-2 text-white">
                                        <label className="text-sm font-medium">Button Icon</label>
                                        <LucideIconPicker value={overviewData.cta_button_icon || ''} onChange={(icon) => setOverviewData({ ...overviewData, cta_button_icon: icon })} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="exports" className="space-y-6 mt-0">
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-white"><Plane className="w-5 h-5 text-white" /> Export Commodities List</h2>
                            <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                <div className="flex items-center gap-3">
                                    <Button onClick={() => handleAddCategory('export')} disabled={isCategoriesLoading} variant="outline" size="sm" className="bg-transparent border-slate-700 text-white hover:bg-slate-800">
                                        <Plus className="w-4 h-4 mr-2" /> Add Commodity
                                    </Button>
                                    <Button onClick={handleSaveExports} disabled={isSavingExports} className="flex items-center gap-2">
                                        {isSavingExports ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </ComponentGuard>
                        </div>

                        {isCategoriesLoading ? (
                            <div className="flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                        ) : localExports.length === 0 ? (
                            <p className="text-sm text-gray-500">No export commodities defined yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {localExports.map((item) => (
                                    <Card key={item.category_id} className="border-slate-200 shadow-sm relative">
                                        <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
                                            <CardTitle className="text-sm font-semibold text-white">Export Item</CardTitle>
                                            <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-slate-800" onClick={() => handleDeleteCategory(item.category_id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </ComponentGuard>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-300">Commodity Name</label>
                                                <Input
                                                    value={item.title}
                                                    onChange={(e) => handleLocalExportChange(item.category_id, 'title', e.target.value)}
                                                    className="h-8 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-300">Items (separated by " • " usually)</label>
                                                <Textarea
                                                    value={item.description || ''}
                                                    onChange={(e) => handleLocalExportChange(item.category_id, 'description', e.target.value)}
                                                    rows={3}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div className="space-y-2 text-white">
                                                <label className="text-xs font-medium text-slate-300">Icon</label>
                                                <LucideIconPicker
                                                    value={item.icon || ''}
                                                    onChange={(iconName) => handleLocalExportChange(item.category_id, 'icon', iconName)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="imports" className="space-y-6 mt-0">
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-white"><Ship className="w-5 h-5 text-white" /> Import Categories</h2>
                            <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                <div className="flex items-center gap-3">
                                    <Button onClick={() => handleAddCategory('import')} disabled={isCategoriesLoading} variant="outline" size="sm" className="bg-transparent border-slate-700 text-white hover:bg-slate-800">
                                        <Plus className="w-4 h-4 mr-2" /> Add Category
                                    </Button>
                                    <Button onClick={handleSaveImports} disabled={isSavingImports} className="flex items-center gap-2">
                                        {isSavingImports ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </ComponentGuard>
                        </div>

                        {isCategoriesLoading ? (
                            <div className="flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                        ) : localImports.length === 0 ? (
                            <p className="text-sm text-gray-500">No import categories defined yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {localImports.map((item) => (
                                    <Card key={item.category_id} className="border-slate-200 shadow-sm relative">
                                        <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
                                            <CardTitle className="text-sm font-semibold text-white">Import Category</CardTitle>
                                            <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-slate-800" onClick={() => handleDeleteCategory(item.category_id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </ComponentGuard>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-300">Category Name</label>
                                                <Input
                                                    value={item.title}
                                                    onChange={(e) => handleLocalImportChange(item.category_id, 'title', e.target.value)}
                                                    className="h-8 text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-slate-300">Description</label>
                                                <Textarea
                                                    value={item.description || ''}
                                                    onChange={(e) => handleLocalImportChange(item.category_id, 'description', e.target.value)}
                                                    rows={2}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div className="space-y-2 text-white">
                                                <label className="text-xs font-medium text-slate-300">Icon</label>
                                                <LucideIconPicker
                                                    value={item.icon || ''}
                                                    onChange={(iconName) => handleLocalImportChange(item.category_id, 'icon', iconName)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="steps" className="space-y-6 mt-0">
                    <div className="p-6 rounded-xl bg-card shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-white"><Activity className="w-5 h-5 text-white" /> Process Flow Steps</h2>
                            <ComponentGuard anyPermissions={['BUSINESSES:UPDATE']}>
                                <div className="flex items-center gap-3">
                                    <Button onClick={handleAddStep} disabled={isStepsLoading} variant="outline" size="sm" className="bg-transparent border-slate-700 text-white hover:bg-slate-800">
                                        <Plus className="w-4 h-4 mr-2" /> Add Step
                                    </Button>
                                    <Button onClick={handleSaveSteps} disabled={isSavingSteps} className="flex items-center gap-2">
                                        {isSavingSteps ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </ComponentGuard>
                        </div>

                        {isStepsLoading ? (
                            <div className="flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                        ) : localSteps.length === 0 ? (
                            <p className="text-sm text-gray-500">No flow steps defined yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {localSteps.map((step) => (
                                    <Card key={step.step_id} className="border-slate-200 shadow-sm relative">
                                        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                                            <div className="space-y-2 w-24">
                                                <label className="text-xs font-medium text-slate-300">Number</label>
                                                <Input
                                                    value={step.step_number}
                                                    onChange={(e) => handleLocalStepChange(step.step_id, 'step_number', e.target.value)}
                                                    className="h-8 text-center text-white"
                                                    placeholder="e.g. 01"
                                                />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <label className="text-xs font-medium text-slate-300">Title</label>
                                                <Input
                                                    value={step.title}
                                                    onChange={(e) => handleLocalStepChange(step.step_id, 'title', e.target.value)}
                                                    className="h-8 text-white"
                                                    placeholder="e.g. SOURCE"
                                                />
                                            </div>
                                            <div className="space-y-2 flex-1">
                                                <label className="text-xs font-medium text-slate-300">Description</label>
                                                <Input
                                                    value={step.description || ''}
                                                    onChange={(e) => handleLocalStepChange(step.step_id, 'description', e.target.value)}
                                                    className="h-8 text-white"
                                                />
                                            </div>
                                            <ComponentGuard anyPermissions={['BUSINESSES:DELETE']}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 mt-6 hover:bg-slate-800" onClick={() => handleDeleteStep(step.step_id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </ComponentGuard>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ImportExportAdminPage;
