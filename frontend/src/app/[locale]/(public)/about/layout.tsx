"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Quote } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PageHeader from "@/components/pages/home-page-components/PageHeader";
import { AnimatePresence, motion } from "framer-motion";

const items = [
    { label: "Company Background", slug: "/about" },
    { label: "Company Executives", slug: "/about/minister" },
    { label: "Mission, Vision and Values", slug: "/about/mission-vision-and-values" },
    { label: "Organizational Structure", slug: "/about/organizational-structure" },
];
const sidebarVariants = {
    closed: {
        height: 0,
        opacity: 0,
    },
    open: {
        height: "auto",
        opacity: 1,
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Check if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto-close sidebar on mobile when route changes
    useEffect(() => {
        if (isMobile) {
            setOpen(false);
        }
    }, [pathname, isMobile]);

    // Auto-open sidebar on desktop
    useEffect(() => {
        if (!isMobile) {
            setOpen(true);
        }
    }, [isMobile]);

    // remove locale prefix: /en/about -> /about
    const normalizedPathname = pathname.replace(/^\/(en|am)/, "");

    // Find active item for title & breadcrumb
    const activeItem = items.find((item) => item.slug === normalizedPathname);
    const title = activeItem?.label ?? "Background of MIDI";

    return (
        <>
            {/* Hero / Page Header (shared across all administration pages) */}
            <PageHeader
                pageIdentifier="about"
                title="About Mineral Industry Development Institute (MIDI)"
                icon={<Quote />}
                description="Institutional mandate, legal background, core values, and strategic pillars of MIDI."
            />

            <section className="mx-auto">
                {/* RIGHT MAIN CONTENT (route content) */}
                <div className="w-full">
                    <div className="flex">
                        <div>
                            <h1 className="text-2xl flex gap-1 flex-col font-serif text-slate-900 dark:text-white leading-tight">
                                {/* {title} */}
                                <span className="h-1 w-1/2 bg-primary"></span>
                            </h1>
                        </div>
                    </div>

                    {/* Route-specific content renders here */}
                    <div className="prose max-w-none">{children}</div>
                </div>
            </section>
        </>
    );
}