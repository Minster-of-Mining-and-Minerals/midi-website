import type { ComponentType } from "react";
import {
    Facebook,
    Linkedin,
    Twitter,
    Youtube,
    Instagram,
    Github,
    Globe,
    Link,
    Mail,
    Phone,
    Send,
    MessageCircle,
    Rss,
} from "lucide-react";
import { IconBrandTelegram, IconBrandTiktok, IconBrandWhatsapp } from "@tabler/icons-react";

type IconComponent = ComponentType<{ className?: string }>;

/** Brand icons that lucide-react does not have; offered first in the icon picker. */
export const BRAND_ICONS: Record<string, IconComponent> = {
    Telegram: IconBrandTelegram,
    Tiktok: IconBrandTiktok,
    Whatsapp: IconBrandWhatsapp,
};

/**
 * Icons the public footer can render for a social link. Importing only these
 * (instead of all of lucide-react) keeps the footer bundle small.
 */
const SOCIAL_ICONS: Record<string, IconComponent> = {
    Facebook,
    Linkedin,
    Twitter,
    Youtube,
    Instagram,
    Github,
    Globe,
    Link,
    Mail,
    Phone,
    Send,
    MessageCircle,
    Rss,
    ...BRAND_ICONS,
};

/** Resolves a stored icon name ("Facebook", "LucideTwitter", "Telegram"…); unknown names fall back to Globe. */
export function getSocialIcon(iconName?: string | null): IconComponent {
    const name = (iconName || "").replace(/^Lucide/, "");
    return SOCIAL_ICONS[name] || Globe;
}
