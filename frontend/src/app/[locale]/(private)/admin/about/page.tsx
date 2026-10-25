"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import AdminLeadership from "@/components/pages/about-page-components/AdminLeadership";
import AdminBackground from "@/components/pages/about-page-components/AdminBackground";
import AdminMissionVision from "@/components/pages/about-page-components/AdminMissionVision";
import AdminCertifications from "@/components/pages/about-page-components/AdminCertifications";

export default function AboutAdminPage() {
    return (
        <div className=" mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-primary">About Us Management</h1>
                <p className="text-muted-foreground text-lg">
                    Configure the Institute&apos;s background, leadership structure, core principles, and certifications.
                </p>
                <Link href="/admin/page-headers" className="text-sm font-medium text-primary hover:underline w-fit">
                    Edit the About page header (title &amp; background image) →
                </Link>
            </div>

            {/* Tab contents stay mounted (forceMount, hidden when inactive) so unsaved edits survive switching tabs */}
            <Tabs defaultValue="background" className="w-full">
                <TabsList className="grid max-w-2xl grid-cols-4 mb-8 h-12">
                    <TabsTrigger value="background">
                        Background
                    </TabsTrigger>

                    <TabsTrigger value="leadership">
                        Leadership
                    </TabsTrigger>

                    <TabsTrigger value="vision-mission">
                        Vision, Mission & Core
                    </TabsTrigger>

                    <TabsTrigger value="certifications">
                        Certifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="background" forceMount className="data-[state=inactive]:hidden">
                    <AdminBackground />
                </TabsContent>

                <TabsContent value="leadership" forceMount className="data-[state=inactive]:hidden">
                    <AdminLeadership />
                </TabsContent>

                <TabsContent value="vision-mission" forceMount className="data-[state=inactive]:hidden">
                    <AdminMissionVision />
                </TabsContent>

                <TabsContent value="certifications" forceMount className="data-[state=inactive]:hidden">
                    <AdminCertifications />
                </TabsContent>
            </Tabs>
        </div>
    );
}