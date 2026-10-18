export type DocumentType =
    | "research_report"
    | "mineral_map"
    | "book_manual"
    | "technical_publication"
    | "geological_study"
    | "training_material"
    | "policy_strategy"
    | "other";

export type AccessMode = "open_access" | "online_only" | "enquiry_required" | "restricted";

export type PublishStatus = "draft" | "pending_review" | "published" | "archived";

export type InquiryType =
    | "general_inquiry"
    | "document_request"
    | "access_request"
    | "paid_publication_request";

export type InquiryStatus =
    | "pending"
    | "under_review"
    | "payment_pending"
    | "approved"
    | "rejected"
    | "closed";

export type PaymentStatus = "submitted" | "under_verification" | "verified" | "rejected";

export type PaymentMethod = "bank_transfer" | "telebirr_manual" | "cbe_birr" | "other";

export type FileRole =
    | "main_pdf"
    | "supplementary_pdf"
    | "map_document"
    | "cover_image"
    | "other_attachment";

export interface PublicationCategory {
    category_id: string;
    name: string;
    name_am?: string | null;
    slug: string;
    description?: string | null;
    description_am?: string | null;
    image_url?: string | null;
    is_active?: boolean;
    display_order?: number;
    publication_count?: string | number;
    created_at?: string;
    updated_at?: string;
}

export interface PublicationFile {
    publication_file_id: string;
    publication_id?: string;
    attachment_id?: string | null;
    file_role: FileRole;
    title?: string | null;
    file_name: string;
    file_path: string;
    file_size?: number | null;
    mime_type: string;
    is_public: boolean;
    downloads_count?: number;
    created_at?: string;
}

export interface Publication {
    publication_id: string;
    title: string;
    title_am?: string | null;
    slug: string;
    summary?: string | null;
    summary_am?: string | null;
    description?: string | null;
    description_am?: string | null;
    authors?: string | null;
    publication_date?: string | null;
    document_type: DocumentType;
    language: string;
    reference_number?: string | null;
    page_count?: number | null;
    publish_status: PublishStatus;
    access_mode: AccessMode;
    price: number | string;
    currency: string;
    cover_image_id?: string | null;
    views_count?: number;
    downloads_count?: number;
    created_by?: string | null;
    updated_by?: string | null;
    published_at?: string | null;
    created_at?: string;
    updated_at?: string;
    categories?: PublicationCategory[];
    files?: PublicationFile[];
    coverImage?: {
        attachment_id: string;
        file_name: string;
        file_path: string;
        file_path_thumb?: string | null;
        file_path_medium?: string | null;
        file_path_large?: string | null;
    } | null;
    creator?: {
        user_id: string;
        full_name: string;
        email: string;
    } | null;
}

export interface PublicationInquiry {
    inquiry_id: string;
    publication_id: string;
    inquiry_type: InquiryType;
    name: string;
    company?: string | null;
    email: string;
    phone?: string | null;
    message: string;
    reference_code: string;
    status: InquiryStatus;
    admin_notes?: string | null;
    assigned_to?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: string | null;
    created_at?: string;
    updated_at?: string;
    publication?: {
        publication_id: string;
        title: string;
        slug: string;
        document_type: DocumentType;
        access_mode: AccessMode;
        price: number | string;
    };
    payment?: PublicationPayment | null;
    reviewer?: {
        user_id: string;
        full_name: string;
        email: string;
    } | null;
    accessGrants?: {
        grant_id: string;
        publication_id: string;
        inquiry_id?: string;
        email: string;
        access_token: string;
        access_level: "online_only" | "download_allowed";
        expires_at?: string | null;
        downloads_used: number;
        max_downloads: number;
        is_active: boolean;
    }[];
}

export interface PublicationPayment {
    payment_id: string;
    inquiry_id: string;
    publication_id: string;
    amount: number | string;
    currency: string;
    payment_method: PaymentMethod;
    transaction_reference?: string | null;
    slip_attachment_id?: string | null;
    status: PaymentStatus;
    verified_by?: string | null;
    verified_at?: string | null;
    rejection_reason?: string | null;
    admin_notes?: string | null;
    created_at?: string;
    inquiry?: {
        inquiry_id: string;
        reference_code: string;
        name: string;
        email: string;
        phone?: string | null;
        company?: string | null;
    } | null;
    publication?: {
        publication_id: string;
        title: string;
        slug: string;
        price: number | string;
        access_mode: AccessMode;
    } | null;
    slipAttachment?: {
        attachment_id: string;
        file_name: string;
        file_path: string;
    } | null;
    verifier?: {
        user_id: string;
        full_name: string;
        email: string;
    } | null;
}

export interface PublicationAccessGrant {
    grant_id: string;
    publication_id: string;
    inquiry_id?: string | null;
    email: string;
    access_token: string;
    access_level: "online_only" | "download_allowed";
    expires_at?: string | null;
    downloads_used: number;
    max_downloads: number;
    is_active: boolean;
    created_at?: string;
}

export interface CreatePublicationPayload {
    title: string;
    title_am?: string;
    slug?: string;
    summary?: string;
    summary_am?: string;
    description?: string;
    description_am?: string;
    authors?: string;
    publication_date?: string;
    document_type?: DocumentType;
    language?: string;
    reference_number?: string;
    page_count?: number;
    publish_status?: PublishStatus;
    access_mode?: AccessMode;
    price?: number;
    currency?: string;
    cover_image_id?: string | null;
    category_ids?: string[];
    files?: Array<{
        attachment_id?: string | null;
        file_role: FileRole;
        title?: string;
        file_name: string;
        file_path: string;
        file_size?: number | null;
        mime_type?: string;
        is_public?: boolean;
    }>;
}

export interface UpdatePublicationPayload extends Partial<CreatePublicationPayload> {}

export interface CreatePublicationInquiryPayload {
    publication_id: string;
    inquiry_type?: InquiryType;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    message: string;
}

export interface CreatePublicationPaymentPayload {
    inquiry_id: string;
    publication_id: string;
    amount: number;
    currency?: string;
    payment_method?: PaymentMethod;
    transaction_reference?: string;
    slip_attachment_id?: string | null;
    admin_notes?: string;
}

export interface VerifyPaymentPayload {
    status: "verified" | "rejected";
    rejection_reason?: string;
    admin_notes?: string;
    grant_access?: boolean;
    access_level?: "online_only" | "download_allowed";
    expires_in_days?: number;
}
