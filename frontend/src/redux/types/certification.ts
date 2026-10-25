import type { Attachment } from "@/redux/api/attachementApi";

export interface CertificationAttachment {
    certification_attachment_id: string;
    certification_id: string;
    attachment_id: string;
    created_at: string;
    attachment: Attachment;
}

export interface Certification {
    certification_id: string;
    title: string;
    description: string;
    order: number;
    is_active: boolean;
    title_am?: string | null;
    description_am?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    attachments?: CertificationAttachment[];
}

export interface CreateCertificationPayload {
    title: string;
    description: string;
    order?: number;
    is_active?: boolean;
    title_am?: string | null;
    description_am?: string | null;
    attachments?: { attachment_id: string }[];
}

export interface UpdateCertificationPayload extends Partial<CreateCertificationPayload> {
    certification_id: string;
}
