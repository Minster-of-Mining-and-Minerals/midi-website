export interface BackgroundAttachment {
    background_attachment_id: string;
    background_id: string;
    attachment_id: string;
    created_at: string;
}

export interface Background {
    background_id: string;
    title: string;
    description?: string;
    icon: string;
    content: string;
    title_am?: string | null;
    description_am?: string | null;
    created_at?: string;
    updated_at?: string;
    attachments?: BackgroundAttachment[];
}