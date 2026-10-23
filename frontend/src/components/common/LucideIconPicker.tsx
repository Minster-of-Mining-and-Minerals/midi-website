"use client";

import * as LucideIcons from "lucide-react";
import { createElement, useMemo, useState, type ComponentType } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Command,
    CommandInput,
} from "@/components/ui/command";
import { BRAND_ICONS } from "@/components/common/socialIcons";

type IconComponent = ComponentType<{ className?: string }>;
const LUCIDE_ICONS = LucideIcons as unknown as Record<string, IconComponent>;

// Brand icons (Telegram, TikTok…) first, then lucide-react's own icons
const resolveIcon = (name?: string): IconComponent | null =>
    name ? BRAND_ICONS[name] || LUCIDE_ICONS[name] || null : null;

// Renders an icon by name without declaring a component during render
const renderIcon = (name: string | undefined, className: string) => {
    const icon = resolveIcon(name);
    return icon ? createElement(icon, { className }) : null;
};

interface IconPickerProps {
    value?: string;
    onChange: (iconName: string) => void;
}

export function LucideIconPicker({ value, onChange }: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const icons = useMemo(() => {
        const query = search.toLowerCase();
        return [...Object.keys(BRAND_ICONS), ...Object.keys(LucideIcons)]
            .filter(
                (name) =>
                    name !== "default" &&
                    name.toLowerCase().includes(query)
            )
            .slice(0, 150);
    }, [search]);

    const selectedIcon = renderIcon(value, "w-4 h-4");

    return (
        <>
            {/* FIELD */}
            <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setOpen(true)}
            >
                {selectedIcon ? (
                    <>
                        <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2">
                                {selectedIcon}
                                <span className="text-sm">{value}</span>
                            </div>
                            <LucideIcons.Plus className="w-4 h-4" />
                        </div>
                    </>
                ) : (
                    <span className="text-muted-foreground text-sm">
                        Select an icon
                    </span>
                )}
            </Button>

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Select an Icon</DialogTitle>
                    </DialogHeader>

                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search icon (file, map, shield...)"
                            value={search}
                            onValueChange={setSearch}
                        />

                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[420px] overflow-y-auto hide-scrollbar mt-4">
                            {icons.map((iconName) => {
                                const icon = renderIcon(iconName, "w-5 h-5");
                                if (!icon) return null;
                                const isSelected = iconName === value;

                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        title={iconName}
                                        onClick={() => {
                                            onChange(iconName);
                                            setOpen(false);
                                        }}
                                        className={`
                                            flex items-center justify-center
                                            h-10 w-10 rounded-md border
                                            transition
                                            hover:bg-muted
                                            ${isSelected ? "bg-muted border-primary" : "border-border"}
                                            `}
                                    >
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    );
}