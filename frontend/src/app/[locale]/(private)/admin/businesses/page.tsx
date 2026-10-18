"use client";

import React, { useState, useEffect } from "react";
import {
  useGetBusinessPagesQuery,
  useUpdateBusinessPageMutation,
  useGetBusinessOverviewQuery,
  useUpdateBusinessOverviewMutation,
  useGetBusinessNodesQuery,
  useCreateBusinessNodeMutation,
  useUpdateBusinessNodeMutation,
  useDeleteBusinessNodeMutation,
  BusinessPage,
  BusinessNode,
} from "@/redux/api/businessApi";
import {
  Pencil,
  Save,
  Loader2,
  Network,
  Plus,
  Trash2,
  FileText,
  Layers,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notify, extractErrorMessage } from "@/utils/notification";
import { LucideIconPicker } from "@/components/common/LucideIconPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentGuard } from "@/components/auth/ComponentGuard";

export default function AdminBusinessesPage() {
  // --- 1. Pages Management State ---
  const {
    data: pages = [],
    isLoading: isPagesLoading,
    refetch: refetchPages,
  } = useGetBusinessPagesQuery({ status: "all" } as any);
  const [updatePageMutation, { isLoading: isUpdatingPage }] = useUpdateBusinessPageMutation();

  const [selectedSlug, setSelectedSlug] = useState<string>("landing");
  const [pageFormData, setPageFormData] = useState<Partial<BusinessPage>>({
    title: "",
    title_am: "",
    subtitle: "",
    subtitle_am: "",
    summary: "",
    summary_am: "",
    content: "",
    content_am: "",
    publish_status: "published",
    display_order: 1,
  });

  useEffect(() => {
    if (pages.length > 0) {
      const active = pages.find((p) => p.slug === selectedSlug) || pages[0];
      if (active) {
        setPageFormData({
          title: active.title || "",
          title_am: active.title_am || "",
          subtitle: active.subtitle || "",
          subtitle_am: active.subtitle_am || "",
          summary: active.summary || "",
          summary_am: active.summary_am || "",
          content: active.content || "",
          content_am: active.content_am || "",
          publish_status: active.publish_status || "published",
          display_order: active.display_order || 1,
        });
      }
    }
  }, [pages, selectedSlug]);

  const handlePageFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setPageFormData({
      ...pageFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePage = async () => {
    try {
      await updatePageMutation({
        slug: selectedSlug,
        data: pageFormData,
      }).unwrap();
      notify.success("Page content updated successfully!");
      refetchPages();
    } catch (error) {
      console.error("Failed to update page", error);
      notify.error(extractErrorMessage(error, "Failed to update page content."));
    }
  };

  // --- 2. Mineral Value Chain Nodes State ---
  const {
    data: nodes = [],
    isLoading: isNodesLoading,
    refetch: refetchNodes,
  } = useGetBusinessNodesQuery();
  const [createNode] = useCreateBusinessNodeMutation();
  const [updateNode] = useUpdateBusinessNodeMutation();
  const [deleteNode] = useDeleteBusinessNodeMutation();

  const [nodeList, setNodeList] = useState<Partial<BusinessNode>[]>([]);
  const [isSavingNodes, setIsSavingNodes] = useState(false);

  useEffect(() => {
    if (nodes) {
      setNodeList([...nodes].sort((a, b) => a.mobile_order - b.mobile_order));
    }
  }, [nodes]);

  const handleNodeFieldChange = (index: number, field: string, value: any) => {
    setNodeList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddNewNode = () => {
    const nextOrder = nodeList.length + 1;
    setNodeList((prev) => [
      ...prev,
      {
        id_string: `stage-${nextOrder}`,
        title: "",
        title_am: "",
        description: "",
        description_am: "",
        icon: "Layers",
        position_x: 20 * nextOrder,
        position_y: 50,
        mobile_order: nextOrder,
      },
    ]);
  };

  const handleDeleteNode = async (index: number) => {
    const target = nodeList[index];
    if (target.business_node_id) {
      try {
        await deleteNode(target.business_node_id).unwrap();
        notify.success("Value chain stage deleted.");
        refetchNodes();
      } catch (err) {
        notify.error(extractErrorMessage(err, "Failed to delete stage."));
      }
    } else {
      setNodeList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveNodes = async () => {
    setIsSavingNodes(true);
    try {
      for (const node of nodeList) {
        if (!node.title || !node.id_string) continue;

        if (node.business_node_id) {
          await updateNode({
            id: node.business_node_id,
            data: {
              id_string: node.id_string,
              title: node.title,
              title_am: node.title_am,
              description: node.description,
              description_am: node.description_am,
              icon: node.icon || "Layers",
              position_x: Number(node.position_x) || 50,
              position_y: Number(node.position_y) || 50,
              mobile_order: Number(node.mobile_order) || 1,
            },
          }).unwrap();
        } else {
          await createNode({
            id_string: node.id_string,
            title: node.title,
            title_am: node.title_am,
            description: node.description,
            description_am: node.description_am,
            icon: node.icon || "Layers",
            position_x: Number(node.position_x) || 50,
            position_y: Number(node.position_y) || 50,
            mobile_order: Number(node.mobile_order) || 1,
          }).unwrap();
        }
      }
      notify.success("Mineral value chain nodes saved successfully!");
      refetchNodes();
    } catch (error) {
      console.error("Failed to save nodes", error);
      notify.error(extractErrorMessage(error, "Failed to save mineral value chain nodes."));
    } finally {
      setIsSavingNodes(false);
    }
  };

  if (isPagesLoading || isNodesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pageChoices = [
    { slug: "landing", label: "1. Landing Page (/businesses)" },
    { slug: "overview", label: "2. Development Overview (/businesses/overview)" },
    { slug: "mineral-processing", label: "3. Mineral Processing (/businesses/mineral-processing)" },
    { slug: "value-addition", label: "4. Value Addition (/businesses/value-addition)" },
    { slug: "research-innovation", label: "5. Research & Innovation (/businesses/research-innovation)" },
  ];

  return (
    <div className="mx-auto space-y-8 w-full max-w-full pb-16">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Mineral Industry Development Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage bilingual institutional content for all 5 Mineral Industry Development pages and the interactive value chain diagram.
        </p>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="mb-8 grid w-full max-w-md grid-cols-2">
          <TabsTrigger
            value="pages"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Institutional Pages (5)
          </TabsTrigger>
          <TabsTrigger
            value="ecosystem"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Value Chain Nodes ({nodeList.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Institutional Pages Content */}
        <TabsContent value="pages" className="space-y-6">
          {/* Page Selector Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {pageChoices.map((p) => (
              <Button
                key={p.slug}
                variant={selectedSlug === p.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSlug(p.slug)}
                className={`whitespace-nowrap ${
                  selectedSlug === p.slug ? "bg-primary text-white font-semibold" : ""
                }`}
              >
                {p.label}
              </Button>
            ))}
          </div>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl flex items-center text-primary">
                    <FileText className="w-5 h-5 mr-2" />
                    Editing Page: <span className="font-mono text-sm ml-2 px-2 py-0.5 rounded bg-primary/10">/{selectedSlug === "landing" ? "businesses" : `businesses/${selectedSlug}`}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Manage bilingual titles, subtitles, summaries, body narratives, and publication status.
                  </CardDescription>
                </div>
                <ComponentGuard anyPermissions={["BUSINESSES:UPDATE"]}>
                  <Button onClick={handleSavePage} disabled={isUpdatingPage}>
                    {isUpdatingPage ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Page Content
                  </Button>
                </ComponentGuard>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Meta row: Status & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Publication Status
                  </label>
                  <select
                    name="publish_status"
                    value={pageFormData.publish_status}
                    onChange={handlePageFieldChange}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    name="display_order"
                    value={pageFormData.display_order}
                    onChange={handlePageFieldChange}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <Globe className="w-4 h-4 mr-1.5 text-primary" />
                    Title (English)
                  </label>
                  <Input
                    name="title"
                    value={pageFormData.title || ""}
                    onChange={handlePageFieldChange}
                    placeholder="Page Title in English..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <Globe className="w-4 h-4 mr-1.5 text-primary" />
                    Title (Amharic - አማርኛ)
                  </label>
                  <Input
                    name="title_am"
                    value={pageFormData.title_am || ""}
                    onChange={handlePageFieldChange}
                    placeholder="የርዕስ ስም በአማርኛ..."
                  />
                </div>
              </div>

              {/* Subtitles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Subtitle (English)
                  </label>
                  <Input
                    name="subtitle"
                    value={pageFormData.subtitle || ""}
                    onChange={handlePageFieldChange}
                    placeholder="Page Subtitle / Tagline..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Subtitle (Amharic - አማርኛ)
                  </label>
                  <Input
                    name="subtitle_am"
                    value={pageFormData.subtitle_am || ""}
                    onChange={handlePageFieldChange}
                    placeholder="ንዑስ ርዕስ በአማርኛ..."
                  />
                </div>
              </div>

              {/* Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Summary / Lead Paragraph (English)
                  </label>
                  <Textarea
                    name="summary"
                    value={pageFormData.summary || ""}
                    onChange={handlePageFieldChange}
                    rows={4}
                    placeholder="Enter English introductory summary..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Summary / Lead Paragraph (Amharic - አማርኛ)
                  </label>
                  <Textarea
                    name="summary_am"
                    value={pageFormData.summary_am || ""}
                    onChange={handlePageFieldChange}
                    rows={4}
                    placeholder="የመግቢያ አጭር ማብራሪያ በአማርኛ..."
                  />
                </div>
              </div>

              {/* Main Content Narratives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Institutional Narrative (English)
                  </label>
                  <Textarea
                    name="content"
                    value={pageFormData.content || ""}
                    onChange={handlePageFieldChange}
                    rows={6}
                    placeholder="Detailed institutional narrative..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Institutional Narrative (Amharic - አማርኛ)
                  </label>
                  <Textarea
                    name="content_am"
                    value={pageFormData.content_am || ""}
                    onChange={handlePageFieldChange}
                    rows={6}
                    placeholder="ዝርዝር ተቋማዊ ማብራሪያ በአማርኛ..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border mt-6">
                <ComponentGuard anyPermissions={["BUSINESSES:UPDATE"]}>
                  <Button onClick={handleSavePage} disabled={isUpdatingPage}>
                    {isUpdatingPage ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Page Content
                  </Button>
                </ComponentGuard>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Mineral Value Chain Nodes */}
        <TabsContent value="ecosystem" className="space-y-6">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl flex items-center text-primary">
                    <Network className="w-5 h-5 mr-2" />
                    Mineral Value Chain Stages & Nodes
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Configure the stages displayed on the interactive 5-stage value chain diagram.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={handleAddNewNode}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Node
                  </Button>
                  <ComponentGuard anyPermissions={["BUSINESSES:UPDATE"]}>
                    <Button onClick={handleSaveNodes} disabled={isSavingNodes}>
                      {isSavingNodes ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Value Chain Nodes
                    </Button>
                  </ComponentGuard>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nodeList.map((node, index) => (
                  <div
                    key={node.business_node_id || `new-${index}`}
                    className="relative bg-card rounded-xl border border-border shadow-sm p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                        Stage #{node.mobile_order || index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7"
                        onClick={() => handleDeleteNode(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Identifier Slug</label>
                        <Input
                          value={node.id_string || ""}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "id_string", e.target.value)
                          }
                          placeholder="e.g. extraction-prospecting"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Display Order</label>
                        <Input
                          type="number"
                          value={node.mobile_order ?? index + 1}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "mobile_order", parseInt(e.target.value))
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Title (English)</label>
                        <Input
                          value={node.title || ""}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "title", e.target.value)
                          }
                          placeholder="e.g. Mineral Extraction"
                          className="h-8 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Title (Amharic)</label>
                        <Input
                          value={node.title_am || ""}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "title_am", e.target.value)
                          }
                          placeholder="e.g. የማዕድን ቁፋሮ"
                          className="h-8 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">
                          Description (English)
                        </label>
                        <Textarea
                          value={node.description || ""}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "description", e.target.value)
                          }
                          placeholder="Enter summary..."
                          rows={2}
                          className="text-xs resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">
                          Description (Amharic)
                        </label>
                        <Textarea
                          value={node.description_am || ""}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "description_am", e.target.value)
                          }
                          placeholder="ገለፃ ያስገቡ..."
                          rows={2}
                          className="text-xs resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Icon</label>
                        <LucideIconPicker
                          value={node.icon || "Layers"}
                          onChange={(iconName) =>
                            handleNodeFieldChange(index, "icon", iconName)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Pos X (%)</label>
                        <Input
                          type="number"
                          value={node.position_x ?? 50}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "position_x", parseInt(e.target.value))
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Pos Y (%)</label>
                        <Input
                          type="number"
                          value={node.position_y ?? 50}
                          onChange={(e) =>
                            handleNodeFieldChange(index, "position_y", parseInt(e.target.value))
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
