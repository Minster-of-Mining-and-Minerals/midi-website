"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useGetFootersQuery } from "@/redux/api/footerApi";
import { getImageUrl } from "@/utils/fileUrl";
import { useGetSocialMediasQuery } from "@/redux/api/socialMediaApi";
import { FooterSkeleton } from "@/components/skeletons";
import { getSocialIcon } from "@/components/common/socialIcons";
import { DEFAULT_FOOTER, FOOTER_SECTION_COUNT, FooterDefaultSection } from "./footerDefaults";

const Footer = () => {
    const { data: footers, isLoading } = useGetFootersQuery();
    // Social links render when they arrive; the footer does not wait for them
    const { data: socialMedias = [] } = useGetSocialMediasQuery();

    if (isLoading) {
        return <FooterSkeleton />;
    }

    const footerData = footers && footers.length > 0 ? footers[0] : null;

    const title = footerData?.title || DEFAULT_FOOTER.title;
    const text = footerData?.text || DEFAULT_FOOTER.copyright();
    const content = footerData?.content?.trim();
    const logoUrl = getImageUrl(footerData?.attachment, "large") || DEFAULT_FOOTER.logo;

    // Saved columns in order, padded with the default columns so the footer is always complete
    const savedSections: FooterDefaultSection[] = (footerData?.sections || []).map((section) => ({
        title: section.section_name,
        links: section.links || [],
    }));
    const sections = [
        ...savedSections,
        ...DEFAULT_FOOTER.sections.slice(savedSections.length),
    ].slice(0, FOOTER_SECTION_COUNT);

    return (
        <footer className="bg-footer-bg bg-blur-md text-footer">
            {/* Top section */}
            <div className="max-w-7xl mx-auto px-6 py-6 md:py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="flex justify-left items-start">
                    <div className="flex flex-col gap-2 justify-center items-center text-center w-full md:w-auto" >
                        <Link href="/" className="inline-block">
                            <img src={logoUrl} alt="Logo" width={60} height={60} className="mb-2 mx-auto object-contain" />
                        </Link>
                        <h3 className="text-lg font-semibold text-primary mb-2">
                            {title}
                        </h3>
                        {content && (
                            <p className="text-sm text-slate-300 leading-relaxed max-w-xs whitespace-pre-line">
                                {content}
                            </p>
                        )}
                    </div>
                </div>

                {/* Sections */}
                {sections.map((section, idx) => (
                    <div key={`${section.title}-${idx}`}>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            {section.title}
                        </h3>
                        {section.links.length > 0 && (
                            <ul className="space-y-2 text-sm">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <FooterLink label={link.label} url={link.url} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between text-sm">
                    {/* Social */}
                    <div className="flex gap-4 justify-left w-full md:w-fit mb-10 md:mb-0">
                        {socialMedias.map((social) => {
                            const IconComponent = getSocialIcon(social.icon);
                            return (
                                <a
                                    key={social.social_media_id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.platform_name}
                                    className="hover:text-primary"
                                >
                                    <IconComponent className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>

                    <p className="text-center w-full md:w-fit">
                        {text}
                    </p>
                </div>
            </div>
        </footer>
    );
};

/**
 * Internal paths keep the current language ("/about" → "/am/about"), full URLs open in a
 * new tab, and an empty URL renders the label as plain text.
 */
const FooterLink = ({ label, url }: { label: string; url?: string }) => {
    const href = url?.trim();

    if (!href || href === "#") {
        return <span className="text-slate-300">{label}</span>;
    }

    if (href.startsWith("/")) {
        return (
            <Link href={href} className="hover:text-primary">
                {label}
            </Link>
        );
    }

    const isWebLink = /^https?:\/\//i.test(href);
    return (
        <a
            href={href}
            target={isWebLink ? "_blank" : undefined}
            rel={isWebLink ? "noopener noreferrer" : undefined}
            className="hover:text-primary"
        >
            {label}
        </a>
    );
};

export default Footer;
