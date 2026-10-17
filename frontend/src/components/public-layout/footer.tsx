"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { useGetFootersQuery } from "@/redux/api/footerApi";
import { useGetAttachmentsQuery } from "@/redux/api/attachementApi";
import { getImageUrl } from "@/utils/fileUrl";
import { useGetSocialMediasQuery } from "@/redux/api/socialMediaApi";
import { FooterSkeleton } from "@/components/skeletons";

const Footer = () => {
    const { data: footers, isLoading: isFootersLoading } = useGetFootersQuery();
    const { data: attachmentsResponse, isLoading: isAttachmentsLoading } = useGetAttachmentsQuery();
    const { data: socialMedias = [], isLoading: isSocialMediasLoading } = useGetSocialMediasQuery();

    const isLoading = isFootersLoading || isAttachmentsLoading || isSocialMediasLoading;

    if (isLoading) {
        return <FooterSkeleton />;
    }

    const footerData = footers && footers.length > 0 ? footers[0] : null;

    const currentYear = new Date().getFullYear();
    const title = footerData?.title || "MIDI";
    const text = footerData?.text || `© ${currentYear} MIDI. All rights reserved.`;

    const sections = footerData?.sections || [];
    const displaySections = sections.slice(0, 3);
    
    // Fallback if no sections exist yet
    const hasDynamicSections = displaySections.length > 0;
    const gridColsClass = hasDynamicSections && displaySections.length === 3 
        ? "md:grid-cols-4" 
        : "md:grid-cols-3";

    const logoAttachment = attachmentsResponse?.attachments?.find(
        (a) => a.attachment_id === footerData?.attachment_id
    );
    const logoUrl = getImageUrl(logoAttachment, "large") || "/midi-log.png";

    return (
        <footer className="bg-footer-bg bg-blur-md text-footer">
            {/* Top section */}
            <div className={`max-w-7xl mx-auto px-6 py-6 md:py-12 grid grid-cols-1 ${gridColsClass} gap-8`}>
                {/* Brand */}
                <div className="flex justify-left items-start">
                    <div className="flex flex-col gap-2 justify-center items-center text-center w-full md:w-auto" >
                        <Link href="/" className="inline-block">
                            <img src={logoUrl} alt="Logo" width={60} height={60} className="mb-2 mx-auto object-contain" />
                        </Link>    
                        <h3 className="text-lg font-semibold text-primary mb-2">
                            {title}
                        </h3>
                    </div>
                </div>

                {/* Sections */}
                {hasDynamicSections ? (
                    displaySections.map((section, idx) => (
                        <div key={section.footer_section_id || idx}>
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {section.section_name}
                            </h3>
                            {section.links && section.links.length > 0 && (
                                <ul className="space-y-2 text-sm">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link href={link.url} className="hover:text-primary">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))
                ) : (
                    <>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                                <li><Link href="/about" className="hover:text-primary">About MIDI</Link></li>
                                <li><Link href="/midi-project" className="hover:text-primary">5-Year National Project</Link></li>
                                <li><Link href="/businesses" className="hover:text-primary">Strategic Sectors</Link></li>
                                <li><Link href="/services" className="hover:text-primary">Laboratories & Services</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Strategic Value Chains</h3>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li>Metallic & Energy Minerals</li>
                                <li>Agro-Minerals & Fertilizers</li>
                                <li>Cement & Ceramic Industries</li>
                                <li>Glass & Dimensional Stones</li>
                                <li>Artisanal & Small-Scale Mining</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Institutional Mandate</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Mineral Industry Development Institute (MIDI)<br />
                                Federal Democratic Republic of Ethiopia<br />
                                Ministry of Mines<br />
                                Reg. No. 508/2022 & Proc. No. 1263/2014
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between text-sm">
                    {/* Social */}
                    <div className="flex gap-4 justify-left w-full md:w-fit mb-10 md:mb-0">
                        {socialMedias.map((social) => {
                            const IconComponent = social.icon && (LucideIcons as any)[social.icon] 
                                ? (LucideIcons as any)[social.icon] 
                                : LucideIcons.Globe;
                            return (
                                <a
                                    key={social.social_media_id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
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

export default Footer;
