"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminContactInfo from "@/components/pages/contact-page-components/AdminContactInfo";
import AdminContactMessages from "@/components/pages/contact-page-components/AdminContactMessages";
import { Mail, MapPin } from "lucide-react";

const AdminContactsPage = () => {
    return (
        <div className="mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-primary">Contacts Management</h1>
                <p className="text-muted-foreground text-sm">
                    Manage public contact details and view messages submitted through the website.
                </p>
            </div>

            <Tabs defaultValue="contact-info" className="w-full">
                <TabsList className="grid max-w-md grid-cols-2 mb-8 h-12">
                    <TabsTrigger value="messages" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Messages
                    </TabsTrigger>

                    <TabsTrigger value="contact-info" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Contact Information
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="messages">
                    <AdminContactMessages />
                </TabsContent>

                <TabsContent value="contact-info">
                    <AdminContactInfo />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminContactsPage;