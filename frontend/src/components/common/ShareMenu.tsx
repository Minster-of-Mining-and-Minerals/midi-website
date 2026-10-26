"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Facebook, Link as LinkIcon, Linkedin, Mail, Share2, Twitter } from "lucide-react";
import { IconBrandTelegram, IconBrandWhatsapp } from "@tabler/icons-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyText } from "@/utils/clipboard";
import { notify } from "@/utils/notification";

interface ShareMenuProps {
    title: string;
    /** The button that opens the menu (rendered as the trigger). */
    children: React.ReactElement;
    /** Defaults to the current page without its query string. */
    url?: string;
}

/**
 * Share options that work on plain http too: the phone share sheet (when the browser offers it),
 * copy link, and direct links to email and social apps.
 */
export default function ShareMenu({ title, children, url }: ShareMenuProps) {
    const locale = useLocale();
    const tr = (en: string, am: string) => (locale === "am" ? am : en);

    const pageUrl = () => url ?? window.location.href.split("?")[0];
    const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

    const copyLink = async () => {
        if (await copyText(pageUrl())) notify.success(tr("Link copied", "ሊንኩ ተገልብጧል"));
        else notify.error(tr("Could not copy the link", "ሊንኩን መገልበጥ አልተቻለም"));
    };

    const nativeShare = async () => {
        try {
            await navigator.share({ title, url: pageUrl() });
        } catch {
            // Dismissed by the user
        }
    };

    const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
    const enc = encodeURIComponent;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            {/* Above the sticky navbar (z-[1000]) */}
            <DropdownMenuContent align="end" className="z-[1050] min-w-[12rem] bg-white">
                {canNativeShare && (
                    <>
                        <DropdownMenuItem onSelect={nativeShare}>
                            <Share2 className="text-primary" />
                            {tr("Share via…", "በ… አጋራ")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem onSelect={copyLink}>
                    <LinkIcon className="text-primary" />
                    {tr("Copy link", "ሊንክ ቅዳ")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => open(`mailto:?subject=${enc(title)}&body=${enc(pageUrl())}`)}>
                    <Mail className="text-primary" />
                    {tr("Email", "ኢሜይል")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => open(`https://t.me/share/url?url=${enc(pageUrl())}&text=${enc(title)}`)}>
                    <IconBrandTelegram className="text-primary" />
                    Telegram
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => open(`https://wa.me/?text=${enc(`${title} ${pageUrl()}`)}`)}>
                    <IconBrandWhatsapp className="text-primary" />
                    WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => open(`https://www.facebook.com/sharer/sharer.php?u=${enc(pageUrl())}`)}>
                    <Facebook className="text-primary" />
                    Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => open(`https://twitter.com/intent/tweet?url=${enc(pageUrl())}&text=${enc(title)}`)}>
                    <Twitter className="text-primary" />X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(pageUrl())}`)}>
                    <Linkedin className="text-primary" />
                    LinkedIn
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
