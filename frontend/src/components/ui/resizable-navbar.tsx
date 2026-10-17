"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GlobeIcon } from "@radix-ui/react-icons";
import { IconMenu2, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Locale, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

type NavItem = {
    name: string;
    link?: string;
    children?: NavItem[];
};

interface NavItemsProps {
    items: NavItem[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
            className={cn("sticky inset-x-0 top-0 z-40 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "100%" : "100%",
                y: visible ? 0 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: "1000px",
            }}
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
                visible ? "bg-white/80 dark:bg-neutral-950/80" : "bg-white dark:bg-neutral-950",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const LanguageSwitcher = () => {
    const locale = useLocale(); // current locale from next-intl
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // List of supported locales
    const languages: { code: Locale; label: string; full: string }[] = [
        { code: "en", label: "EN", full: "English" },
        { code: "am", label: "AM", full: "አማርኛ" },
    ];

    const currentLang = languages.find(l => l.code === locale) || languages[0];

    // Store locale in localStorage
    const setLocaleStorage = (lang: Locale) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("NEXT_LOCALE", lang);
        }
    };

    const changeLanguage = (lang: Locale) => {
        setLocaleStorage(lang);
        startTransition(() => {
            // Navigate with next-intl locale
            router.replace(pathname, { locale: lang });
        });
        setOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen((v) => !v)}
                className={clsx(
                    "flex items-center gap-2 rounded-full px-3 py-2 hover:bg-background-secondary dark:hover:bg-neutral-800 transition"
                )}
            >
                <GlobeIcon className="h-5 w-5 animate-spin [animation-duration:6s]" />
                <span className="text-sm font-semibold text-primary dark:text-white">
                    {currentLang.label}
                </span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-40 rounded-lg bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
                    >
                        {languages.map((lang) => {
                            const isActive = currentLang.code === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={clsx(
                                        "w-full px-4 py-2 text-left text-sm transition",
                                        isActive
                                            ? "bg-background-secondary dark:bg-neutral-800 font-semibold text-primary"
                                            : "hover:bg-background-secondary dark:hover:bg-neutral-800"
                                    )}
                                >
                                    {lang.full}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const pathname = usePathname();

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-1 items-center justify-end space-x-2 px-4 text-sm font-medium lg:flex",
                className
            )}
        >
            {items.map((item, idx) => {
                const isActive = item.link
                    ? item.link === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.link)
                    : false;

                return (
                    <div
                        key={idx}
                        className="relative"
                        onMouseEnter={() => setHovered(idx)}
                    >
                        {/* Top-level item */}
                        <div
                            className={cn(
                                "relative px-4 py-2 cursor-pointer transition-colors",
                                isActive
                                    ? "text-primary dark:text-white font-semibold"
                                    : "text-muted hover:text-primary-hover dark:text-neutral-300 dark:hover:text-primary-hover"
                            )}
                        >
                            <div className="flex items-center gap-1">
                                {item.link ? (
                                    <Link href={item.link} onClick={onItemClick}>
                                        {item.name}
                                    </Link>
                                ) : (
                                    <span>{item.name}</span>
                                )}

                                {item.children && (
                                    <ChevronDown
                                        className={cn(
                                            "text-neutral-400 group-hover:text-primary-hover dark:text-neutral-400 h-4 w-4 transition-transform duration-200",
                                            hovered === idx ? "rotate-180" : "rotate-0"
                                        )}
                                    />
                                )}
                            </div>

                            {(hovered === idx || isActive) && (
                                <motion.div
                                    layoutId="hovered"
                                    className="absolute inset-0 rounded-full bg-background-secondary dark:bg-neutral-800 -z-10"
                                />
                            )}
                        </div>

                        {/* 🔽 Dropdown */}
                        {item.children && hovered === idx && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                className="absolute left-0 mt-2 min-w-[180px] rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
                            >
                                {item.children.map((child, cIdx) => (
                                    <Link
                                        key={cIdx}
                                        href={child.link!}
                                        onClick={onItemClick}
                                        className="block px-4 py-2 text-sm hover:bg-background-secondary dark:hover:bg-neutral-800 transition"
                                    >
                                        {child.name}
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </div>
                );
            })}

            <LanguageSwitcher />
        </motion.div>
    );
};


export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: "none",
                boxShadow: "none",
                width: visible ? "100%" : "100%",
                paddingRight: visible ? "12px" : "12px",
                paddingLeft: visible ? "12px" : "12px",
                y: visible ? 0 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full flex-col items-center justify-between bg-white dark:bg-neutral-950 px-0 py-2 lg:hidden",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};
export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "-100%" }}   // 👉 start off-screen left
                        animate={{ x: 0 }}         // 👉 slide to center
                        exit={{ x: "-100%" }}      // 👉 exit to left
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                        className={cn(
                            "fixed top-0 left-0 z-50 h-full w-[100%] max-w-sm bg-white dark:bg-neutral-950 px-6 py-5 shadow-xl flex flex-col gap-6",
                            className
                        )}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};



export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return isOpen ? (
        <IconX className="text-black dark:text-white" onClick={onClick} />
    ) : (
        <IconMenu2 className="text-black dark:text-white" onClick={onClick} />
    );
};

export const NavbarLogo = () => {
    return (
        <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
            <Image
                src="/midi-log.png"
                alt="MIDI Logo"
                width={40}
                height={40}
                className="object-contain"
                priority/>
            <div className="flex flex-col">
                <span className="text-secondary font-bold dark:text-white text-lg -mt-[2px] tracking-wide">MIDI</span>
            </div>
        </Link>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles =
        "px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary:
            "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        secondary: "bg-transparent shadow-none dark:text-white",
        dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        gradient:
            "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    const Component = Tag as any;
    return (
        <Component
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Component>
    );
};

