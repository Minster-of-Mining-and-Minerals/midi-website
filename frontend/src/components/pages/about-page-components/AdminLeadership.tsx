"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from "lucide-react";
import {
    useGetLeadershipsQuery,
    useCreateLeadershipMutation,
    useUpdateLeadershipMutation,
    useDeleteLeadershipMutation,
} from "@/redux/api/leadershipApi";
import { ImageUploadField, UploadedFileInfo } from "@/components/common/ImageUploadField";
import { notify } from "@/utils/notification";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ComponentGuard } from "@/components/auth/ComponentGuard";
import {
    useGetPageHeaderByIdentifierQuery,
    useUpdatePageHeaderMutation,
} from "@/redux/api/pageHeaderApi";
import { LEADERSHIP_SECTION, readLegacyLeadershipHeader } from "./aboutDefaults";

export type LeaderNode = {
    id: string;
    level: number;
    name: string;
    title: string;
    fullDescription: string;
    // Amharic versions (empty = the Amharic page shows the English text)
    nameAm?: string;
    titleAm?: string;
    fullDescriptionAm?: string;
    displayOrder?: number; // position among siblings
    header?: string;
    children?: LeaderNode[];
    parent_id?: string | null;
    leadership_id?: string;
    attachment_id?: string; // store uploaded image ID
    image?: string;         // store previewUrl
};

export default function LeadershipAdminPage() {
    const { data: leaderships, isLoading } = useGetLeadershipsQuery();
    const [createLeadership, { isLoading: isCreating }] = useCreateLeadershipMutation();
    const [updateLeadership, { isLoading: isUpdating }] = useUpdateLeadershipMutation();
    const [deleteLeadership, { isLoading: isDeletingMutation }] = useDeleteLeadershipMutation();

    const [tree, setTree] = useState<LeaderNode | null>(null);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [draftNode, setDraftNode] = useState<LeaderNode | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; nodeId: string; name: string }>({
        open: false,
        nodeId: "",
        name: "",
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Section Header State (page_headers "about-leadership", legacy root-leader JSON as fallback)
    const { data: sectionHeader } = useGetPageHeaderByIdentifierQuery(LEADERSHIP_SECTION.identifier);
    const [updatePageHeader, { isLoading: isSavingSectionHeader }] = useUpdatePageHeaderMutation();
    // null = not edited yet: show the saved value (page header, then legacy root-leader JSON, then default)
    const [editedTitle, setSectionTitle] = useState<string | null>(null);
    const [editedDescription, setSectionDescription] = useState<string | null>(null);
    const legacyHeader = readLegacyLeadershipHeader(leaderships?.find((l: any) => !l.parent_id)?.header);
    const sectionTitle = editedTitle ?? (sectionHeader?.title || legacyHeader.title || LEADERSHIP_SECTION.defaultTitle);
    const sectionDescription =
        editedDescription ?? (sectionHeader?.description || legacyHeader.description || LEADERSHIP_SECTION.defaultDescription);

    // Existing leaders edited since their last save (new leaders are unsaved until created)
    const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
    const [isSavingAll, setIsSavingAll] = useState(false);
    const markClean = (id: string) =>
        setDirtyIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

    const generateId = () => `leader-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Count unsaved leaders: new ones plus edited existing ones
    const countUnsaved = (node: LeaderNode | null): number => {
        if (!node) return 0;
        const self = !node.leadership_id || dirtyIds.has(node.id) ? 1 : 0;
        return self + (node.children || []).reduce((sum, child) => sum + countUnsaved(child), 0);
    };
    const unsavedCount = countUnsaved(tree);

    // Warn before leaving the page with unsaved leaders
    useEffect(() => {
        if (unsavedCount === 0) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [unsavedCount]);

    useEffect(() => {
        if (!isLoading && leaderships) {
            if (leaderships.length === 0) {
                setTree({
                    id: generateId(),
                    level: 1,
                    name: "",
                    title: "",
                    image: "",
                    fullDescription: "",
                    children: [],
                });
            } else {
                const mapNode = (item: any): LeaderNode => {
                    const attachment = item.attachments?.attachment;

                    return {
                        id: item.leadership_id,
                        leadership_id: item.leadership_id,
                        parent_id: item.parent_id,
                        level: item.level,
                        name: item.name,
                        title: item.title,
                        fullDescription: item.description || "",
                        nameAm: item.name_am || "",
                        titleAm: item.title_am || "",
                        fullDescriptionAm: item.description_am || "",
                        displayOrder: item.display_order ?? 0,
                        header: item.header,
                        children: [],

                        // ✅ THIS IS THE FIX
                        attachment_id: attachment?.attachment_id || undefined,
                    };
                };

                const nodeMap: Record<string, LeaderNode> = {};
                leaderships.forEach((l: any) => { nodeMap[l.leadership_id] = mapNode(l); });

                const roots: LeaderNode[] = [];
                leaderships.forEach((l: any) => {
                    if (l.parent_id && nodeMap[l.parent_id]) {
                        nodeMap[l.parent_id].children = nodeMap[l.parent_id].children || [];
                        nodeMap[l.parent_id].children!.push(nodeMap[l.leadership_id]);
                    } else {
                        roots.push(nodeMap[l.leadership_id]);
                    }
                });

                setTree(roots[0] || null);
                setDirtyIds(new Set());
            }
        }
    }, [leaderships, isLoading]);

    if (!tree) return <div>Loading...</div>;

    const findNodeById = (node: LeaderNode, id: string): LeaderNode | null => {
        if (node.id === id) return node;
        for (const child of node.children || []) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
        return null;
    };

    const addChildNode = (parentId: string) => {
        const parent = findNodeById(tree!, parentId);
        if (!parent) return;

        const newNode: LeaderNode = {
            id: generateId(),
            level: parent.level + 1,
            name: "",
            title: "",
            fullDescription: "",
            displayOrder: parent.children?.length ?? 0,
            parent_id: parentId,
            children: [],
        };

        setTree(prev => addNodeRecursively(prev!, parentId, newNode));
    };

    const addNodeRecursively = (node: LeaderNode, parentId: string, newNode: LeaderNode): LeaderNode => {
        if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newNode] };
        }
        return {
            ...node,
            children: node.children?.map(child => addNodeRecursively(child, parentId, newNode)),
        };
    };

    const deleteNode = (nodeId: string) => {
        const nodeToDelete = findNodeById(tree!, nodeId);
        if (nodeToDelete?.leadership_id) {
            setDeleteConfirm({
                open: true,
                nodeId,
                name: nodeToDelete.name || nodeToDelete.title || "this leader",
            });
        } else {
            setTree(prev => deleteNodeRecursively(prev!, nodeId));
        }
    };

    // Swap a leader with its neighbour under the same parent; moved saved leaders become "Unsaved"
    const moveNode = (parentId: string, index: number, direction: -1 | 1) => {
        const parent = findNodeById(tree!, parentId);
        const siblings = parent?.children || [];
        const target = index + direction;
        if (target < 0 || target >= siblings.length) return;

        const reordered = [...siblings];
        [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
        const renumbered = reordered.map((child, i) => ({ ...child, displayOrder: i }));

        setTree(prev => updateNodeRecursively(prev!, parentId, { children: renumbered }));
        setDirtyIds((prev) => {
            const next = new Set(prev);
            renumbered.forEach((child, i) => {
                if (child.leadership_id && siblings[i].id !== child.id) next.add(child.id);
            });
            return next;
        });
    };

    // The backend needs both a name and a title (2+ characters each)
    const validateNode = (node: LeaderNode): boolean => {
        const label = node.name?.trim() || node.title?.trim() || "New leader";
        if (!node.name?.trim()) {
            notify.warning(`Leader name is required${node.title ? ` (${node.title})` : ""}.`);
            return false;
        }
        if (!node.title?.trim()) {
            notify.warning(`Leader title is required (${label}).`);
            return false;
        }
        return true;
    };

    const deleteNodeRecursively =(node: LeaderNode, nodeId: string): LeaderNode | null => {
        if (node.id === nodeId) return null;
        return {
            ...node,
            children: node.children?.map(child => deleteNodeRecursively(child, nodeId)).filter(Boolean) as LeaderNode[],
        };
    };

    // Create a new leader; returns false if it was not saved. `silent` skips the toast (used by Save all).
    const createNode = async (node: LeaderNode, silent = false): Promise<boolean> => {
        if (!validateNode(node)) return false;

        try {
            const created = await createLeadership({
                name: node.name,
                title: node.title,
                description: node.fullDescription,
                name_am: node.nameAm?.trim() || "",
                title_am: node.titleAm?.trim() || "",
                description_am: node.fullDescriptionAm?.trim() || "",
                display_order: node.displayOrder ?? 0,
                parent_id: node.parent_id || null,
                header: "Leader",
                level: node.level,
                attachments: node.attachment_id ? [{ attachment_id: node.attachment_id }] : [],
            }).unwrap();

            setTree(prev => updateNodeRecursively(prev!, node.id, { leadership_id: created.leadership_id }));
            markClean(node.id);
            if (!silent) notify.success(`"${node.name}" saved.`);
            return true;
        } catch (error) {
            notify.error(`Failed to save "${node.name}".`, error);
            return false;
        }
    };

    const updateNode = (node: LeaderNode, updatedFields: Partial<LeaderNode>) => {
        setTree(prev => updateNodeRecursively(prev!, node.id, updatedFields));
        if (node.leadership_id) {
            setDirtyIds((prev) => new Set(prev).add(node.id));
        }
    };

    const saveNode = async (node: LeaderNode, silent = false): Promise<boolean> => {
        if (!node.leadership_id) return false;
        if (!validateNode(node)) return false;

        try {
            await updateLeadership({
                id: node.leadership_id,
                data: {
                    name: node.name,
                    title: node.title,
                    description: node.fullDescription,
                    name_am: node.nameAm?.trim() || "",
                    title_am: node.titleAm?.trim() || "",
                    description_am: node.fullDescriptionAm?.trim() || "",
                    display_order: node.displayOrder ?? 0,
                    parent_id: node.parent_id,
                    attachments: node.attachment_id
                        ? [{ attachment_id: node.attachment_id }]
                        : [],
                },
            }).unwrap();
            markClean(node.id);
            if (!silent) notify.success(`"${node.name}" saved.`);
            return true;
        } catch (error) {
            console.error(error);
            notify.error(`Failed to save "${node.name}".`, error);
            return false;
        }
    };

    // Save every new or edited leader, parents before children
    const saveAll = async () => {
        setIsSavingAll(true);
        let saved = 0;
        let failed = 0;
        const walk = async (node: LeaderNode) => {
            const needsCreate = !node.leadership_id;
            if (needsCreate || dirtyIds.has(node.id)) {
                const ok = needsCreate ? await createNode(node, true) : await saveNode(node, true);
                if (ok) saved++;
                else failed++;
            }
            // New leaders cannot have children yet ("Add Child" appears once saved), so order is safe
            for (const child of node.children || []) await walk(child);
        };
        try {
            if (tree) await walk(tree);
        } finally {
            setIsSavingAll(false);
        }
        if (failed === 0) notify.success(`${saved} leader${saved === 1 ? "" : "s"} saved.`);
        else notify.error(`${saved} saved, ${failed} not saved. Check the highlighted leaders.`);
    };

    const updateNodeRecursively = (node: LeaderNode, nodeId: string, updatedFields: Partial<LeaderNode>): LeaderNode => {
        if (node.id === nodeId) return { ...node, ...updatedFields };
        return { ...node, children: node.children?.map(child => updateNodeRecursively(child, nodeId, updatedFields)) };
    };

    // Section title/description live in page_headers, so they can be saved before any leader exists
    const saveSectionHeader = async () => {
        try {
            await updatePageHeader({
                identifier: LEADERSHIP_SECTION.identifier,
                body: { title: sectionTitle.trim(), description: sectionDescription.trim() },
            }).unwrap();
            notify.success("Leadership section title saved.");
        } catch (error) {
            notify.error("Failed to save the leadership section title.", error);
        }
    };

    return (
        <div className="py-6 mx-auto space-y-8">
            <Card>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-primary">Section Title & Description</CardTitle>
                        {/* Saves a page_headers row, so it needs the page headers permission */}
                        <ComponentGuard anyPermissions={["PAGE_HEADERS:UPDATE"]}>
                            <Button
                                onClick={saveSectionHeader}
                                disabled={isSavingSectionHeader}
                                className="bg-golden-dark hover:bg-golden-darkHover"
                            >
                                Save Section Info
                            </Button>
                        </ComponentGuard>
                    </div>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                            value={sectionTitle} 
                            onChange={(e) => setSectionTitle(e.target.value)} 
                            placeholder="e.g. Corporate Leadership Structure"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            value={sectionDescription} 
                            onChange={(e) => setSectionDescription(e.target.value)} 
                            placeholder="e.g. Interactive organizational hierarchy"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Unsaved changes bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card px-4 py-3">
                <p className={`text-sm ${unsavedCount > 0 ? "font-semibold text-amber-700" : "text-muted-foreground"}`}>
                    {unsavedCount > 0
                        ? `${unsavedCount} leader${unsavedCount === 1 ? " has" : "s have"} unsaved changes.`
                        : "All leaders are saved."}
                </p>
                <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                    <Button
                        onClick={saveAll}
                        disabled={unsavedCount === 0 || isSavingAll}
                        className="bg-golden-dark hover:bg-golden-darkHover"
                    >
                        {isSavingAll ? "Saving..." : "Save all changes"}
                    </Button>
                </ComponentGuard>
            </div>

            <NodeEditor
                node={tree}
                addChildNode={addChildNode}
                deleteNode={deleteNode}
                updateNode={updateNode}
                createNode={createNode}
                saveNode={saveNode}
                moveNode={moveNode}
                dirtyIds={dirtyIds}
            />

            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Delete Leader Record?"
                description={`Are you sure you want to delete "${deleteConfirm.name}" and any subordinate positions? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={async () => {
                    try {
                        setIsDeleting(true);
                        const nodeToDelete = findNodeById(tree!, deleteConfirm.nodeId);
                        if (nodeToDelete?.leadership_id) {
                            await deleteLeadership(nodeToDelete.leadership_id).unwrap();
                        }
                        setTree(prev => deleteNodeRecursively(prev!, deleteConfirm.nodeId));
                        notify.success("Leader record deleted successfully.");
                        setDeleteConfirm((prev) => ({ ...prev, open: false }));
                    } catch (error) {
                        notify.error("Failed to delete leader record.", error);
                    } finally {
                        setIsDeleting(false);
                    }
                }}
            />
        </div>
    );
}

/* =====================================================
   NODE EDITOR
===================================================== */
type NodeEditorProps = {
    node: LeaderNode;
    addChildNode: (id: string) => void;
    deleteNode: (id: string) => void;
    updateNode: (node: LeaderNode, fields: Partial<LeaderNode>) => void;
    createNode: (node: LeaderNode) => void;
    saveNode: (node: LeaderNode) => void;
    moveNode: (parentId: string, index: number, direction: -1 | 1) => void;
    dirtyIds: Set<string>;
    // Position among siblings (absent for the root leader)
    index?: number;
    siblingCount?: number;
};

function NodeEditor({ node, addChildNode, deleteNode, updateNode, createNode, saveNode, moveNode, dirtyIds, index, siblingCount }: NodeEditorProps) {
    const [isOpen, setIsOpen] = useState(true);
    const isNew = !node.leadership_id;
    const isUnsaved = isNew || dirtyIds.has(node.id);

    return (
        <div className="w-full">
            <Card className="overflow-hidden w-full py-0">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <NodeHeader
                        node={node}
                        isOpen={isOpen}
                        addChildNode={addChildNode}
                        deleteNode={deleteNode}
                        createNode={createNode}
                        saveNode={saveNode}
                        isNew={isNew}
                        isUnsaved={isUnsaved}
                        onMove={
                            node.parent_id && index !== undefined && siblingCount && siblingCount > 1
                                ? (direction: -1 | 1) => moveNode(node.parent_id!, index, direction)
                                : undefined
                        }
                        canMoveUp={index !== undefined && index > 0}
                        canMoveDown={index !== undefined && siblingCount !== undefined && index < siblingCount - 1}
                    />
                    <CollapsibleContent>
                        <CardContent className="px-4 space-y-6 bg-card py-6">
                            <NodeBasicInfo node={node} updateNode={updateNode} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <NodeImageUpload node={node} updateNode={updateNode} />
                                <NodeDescription node={node} updateNode={updateNode} />
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

            {node.children && node.children.length > 0 && (
                <div className="ml-8 mt-4 border-l-2 border-gray-100 pl-6">
                    {node.children.map((child, childIndex) => (
                        <NodeEditor
                            key={child.id}
                            node={child}
                            addChildNode={addChildNode}
                            deleteNode={deleteNode}
                            updateNode={updateNode}
                            createNode={createNode}
                            saveNode={saveNode}
                            moveNode={moveNode}
                            dirtyIds={dirtyIds}
                            index={childIndex}
                            siblingCount={node.children!.length}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* =====================================================
   NODE HEADER
===================================================== */
function NodeHeader({ node, isOpen, addChildNode, deleteNode, createNode, saveNode, isNew, isUnsaved, onMove, canMoveUp, canMoveDown }: any) {
    return (
        <CardHeader className="bg-golden-dark20 py-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </CollapsibleTrigger>

                    <div>
                        <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                            {node.name || "New Leader"}
                            {isUnsaved && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                    {isNew ? "Not created" : "Unsaved"}
                                </span>
                            )}
                        </CardTitle>
                        <p className="text-xs text-gray-500">{node.title || "No Title"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onMove && (
                        <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Move up"
                                title="Move up (save to keep the new order)"
                                disabled={!canMoveUp}
                                onClick={(e) => { e.stopPropagation(); onMove(-1); }}
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Move down"
                                title="Move down (save to keep the new order)"
                                disabled={!canMoveDown}
                                onClick={(e) => { e.stopPropagation(); onMove(1); }}
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                        </ComponentGuard>
                    )}
                    {isNew ? (
                        <>
                            <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => createNode(node)}
                                >
                                    Create
                                </Button>
                            </ComponentGuard>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNode(node.id)}
                            >
                                Cancel
                            </Button></>

                    ) : (
                        <>
                            <ComponentGuard anyPermissions={["ABOUT:UPDATE"]}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 bg-green-600 text-white hover:bg-green-700 hover:text-white"
                                    onClick={(e) => { e.stopPropagation(); saveNode(node); }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 bg-golden-dark text-white hover:bg-golden-darkHover hover:text-white"
                                    onClick={(e) => { e.stopPropagation(); addChildNode(node.id); }}
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" />
                                    Add Child
                                </Button>
                            </ComponentGuard>
                            {node.level !== 0 && (
                                <ComponentGuard anyPermissions={["ABOUT:DELETE"]}>
                                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}>
                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                        Delete
                                    </Button>
                                </ComponentGuard>
                            )}
                        </>
                    )}
                </div>
            </div>
        </CardHeader>
    );
}

/* =====================================================
   BASIC INFO / IMAGE / DESCRIPTION
===================================================== */
function NodeBasicInfo({ node, updateNode }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input value={node.name} onChange={(e) => updateNode(node, { name: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Title</Label>
                <Input value={node.title} onChange={(e) => updateNode(node, { title: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Name (Amharic)</Label>
                <Input
                    lang="am"
                    value={node.nameAm || ""}
                    onChange={(e) => updateNode(node, { nameAm: e.target.value })}
                    placeholder="Optional"
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Title (Amharic)</Label>
                <Input
                    lang="am"
                    value={node.titleAm || ""}
                    onChange={(e) => updateNode(node, { titleAm: e.target.value })}
                    placeholder="Optional"
                />
            </div>
        </div>
    );
}

/* =====================================================
   IMAGE UPLOAD
===================================================== */
function NodeImageUpload({ node, updateNode }: any) {
    const handleChange = (ids: string[], files?: UploadedFileInfo[]) => {
        const fileInfo = files?.[0]; // single image only
        updateNode(node, {
            attachment_id: fileInfo?.attachment_id || undefined,
        });
    };

    return (
        <div className="md:col-span-1">
            <ImageUploadField
                id={`node-image-${node.id}`}
                label="Profile Image"
                value={node.attachment_id ? [node.attachment_id] : []}
                onChange={handleChange}
                category="profile"
            />
        </div>
    );
}

function NodeDescription({ node, updateNode }: any) {
    return (
        <div className="md:col-span-2 space-y-2">
            <Label>Full Description</Label>
            <Textarea value={node.fullDescription} onChange={(e) => updateNode(node, { fullDescription: e.target.value })} className="min-h-[160px]" />
            <Label>Full Description (Amharic)</Label>
            <Textarea
                lang="am"
                value={node.fullDescriptionAm || ""}
                onChange={(e) => updateNode(node, { fullDescriptionAm: e.target.value })}
                className="min-h-[120px]"
                placeholder="Optional"
            />
        </div>
    );
}