import { baseApi } from "../baseApi";
import {
    Publication,
    PublicationCategory,
    PublicationInquiry,
    PublicationPayment,
    CreatePublicationPayload,
    UpdatePublicationPayload,
    CreatePublicationInquiryPayload,
    CreatePublicationPaymentPayload,
    VerifyPaymentPayload,
} from "../types/publication";

export const publicationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ================= PUBLICATION CATEGORIES =================
        getPublicationCategories: builder.query<
            PublicationCategory[],
            { isPublic?: boolean } | void
        >({
            query: (params) =>
                params
                    ? { url: "/publication-categories", params }
                    : { url: "/publication-categories" },
            transformResponse: (response: { success: boolean; data: PublicationCategory[] }) =>
                response.data,
            providesTags: ["PublicationCategory"],
        }),

        getPublicationCategoryById: builder.query<PublicationCategory, string>({
            query: (id) => `/publication-categories/${id}`,
            transformResponse: (response: { success: boolean; data: PublicationCategory }) =>
                response.data,
            providesTags: (_r, _e, id) => [{ type: "PublicationCategory", id }],
        }),

        createPublicationCategory: builder.mutation<
            PublicationCategory,
            Partial<PublicationCategory>
        >({
            query: (body) => ({ url: "/publication-categories", method: "POST", body }),
            invalidatesTags: ["PublicationCategory"],
        }),

        updatePublicationCategory: builder.mutation<
            PublicationCategory,
            { id: string; data: Partial<PublicationCategory> }
        >({
            query: ({ id, data }) => ({
                url: `/publication-categories/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["PublicationCategory"],
        }),

        deletePublicationCategory: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/publication-categories/${id}`, method: "DELETE" }),
            invalidatesTags: ["PublicationCategory"],
        }),

        // ================= PUBLICATIONS =================
        getPublications: builder.query<
            { data: Publication[]; meta?: { total: number; page: number; limit: number; totalPages: number } },
            {
                category?: string;
                search?: string;
                document_type?: string;
                access_mode?: string;
                language?: string;
                publish_status?: string;
                page?: number;
                limit?: number;
                sort_by?: string;
                sort_order?: string;
            } | void
        >({
            query: (params) => ({
                url: "/publications",
                params: params || {},
            }),
            transformResponse: (response: any) => {
                if (Array.isArray(response.data)) {
                    return { data: response.data, meta: response.meta };
                }
                return { data: [], meta: undefined };
            },
            providesTags: ["Publication"],
        }),

        getPublicationByIdentifier: builder.query<Publication, string>({
            query: (identifier) => `/publications/${identifier}`,
            transformResponse: (response: { success: boolean; data: Publication }) =>
                response.data,
            providesTags: (_r, _e, id) => [{ type: "Publication", id }],
        }),

        createPublication: builder.mutation<Publication, CreatePublicationPayload>({
            query: (body) => ({ url: "/publications", method: "POST", body }),
            invalidatesTags: ["Publication", "PublicationCategory"],
        }),

        updatePublication: builder.mutation<
            Publication,
            { id: string; data: UpdatePublicationPayload }
        >({
            query: ({ id, data }) => ({
                url: `/publications/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Publication", "PublicationCategory"],
        }),

        deletePublication: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/publications/${id}`, method: "DELETE" }),
            invalidatesTags: ["Publication", "PublicationCategory"],
        }),

        publishPublication: builder.mutation<Publication, string>({
            query: (id) => ({ url: `/publications/${id}/publish`, method: "PATCH" }),
            invalidatesTags: ["Publication"],
        }),

        uploadPublicationDocument: builder.mutation<
            { success: boolean; file: { file_name: string; file_path: string; file_size: number; mime_type: string } },
            FormData
        >({
            query: (formData) => ({
                url: "/publications/upload-document",
                method: "POST",
                body: formData,
            }),
        }),

        // ================= PUBLICATION INQUIRIES =================
        submitPublicationInquiry: builder.mutation<
            { success: boolean; message: string; reference_code: string; inquiry_id: string },
            CreatePublicationInquiryPayload
        >({
            query: (body) => ({
                url: "/publication-inquiries",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PublicationInquiry"],
        }),

        getPublicationInquiries: builder.query<
            { data: PublicationInquiry[]; meta?: { total: number; page: number; limit: number; totalPages: number } },
            {
                status?: string;
                inquiry_type?: string;
                search?: string;
                publication_id?: string;
                page?: number;
                limit?: number;
            } | void
        >({
            query: (params) => ({
                url: "/publication-inquiries",
                params: params || {},
            }),
            transformResponse: (response: any) => {
                if (Array.isArray(response.data)) {
                    return { data: response.data, meta: response.meta };
                }
                return { data: [], meta: undefined };
            },
            providesTags: ["PublicationInquiry"],
        }),

        getPublicationInquiryById: builder.query<PublicationInquiry, string>({
            query: (id) => `/publication-inquiries/${id}`,
            transformResponse: (response: { success: boolean; data: PublicationInquiry }) =>
                response.data,
            providesTags: (_r, _e, id) => [{ type: "PublicationInquiry", id }],
        }),

        updatePublicationInquiryStatus: builder.mutation<
            PublicationInquiry,
            { id: string; status: string; admin_notes?: string; assigned_to?: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/publication-inquiries/${id}/status`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["PublicationInquiry"],
        }),

        replyToPublicationInquiry: builder.mutation<
            PublicationInquiry,
            { id: string; reply_message: string; send_email?: boolean }
        >({
            query: ({ id, ...body }) => ({
                url: `/publication-inquiries/${id}/reply`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["PublicationInquiry"],
        }),

        deletePublicationInquiry: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({ url: `/publication-inquiries/${id}`, method: "DELETE" }),
            invalidatesTags: ["PublicationInquiry"],
        }),

        // ================= PUBLICATION PAYMENTS =================
        submitPublicationPayment: builder.mutation<
            { success: boolean; data: PublicationPayment },
            CreatePublicationPaymentPayload
        >({
            query: (body) => ({
                url: "/publication-payments",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PublicationPayment", "PublicationInquiry"],
        }),

        getPublicationPayments: builder.query<
            { data: PublicationPayment[]; meta?: { total: number; page: number; limit: number; totalPages: number } },
            {
                status?: string;
                publication_id?: string;
                page?: number;
                limit?: number;
            } | void
        >({
            query: (params) => ({
                url: "/publication-payments",
                params: params || {},
            }),
            transformResponse: (response: any) => {
                if (Array.isArray(response.data)) {
                    return { data: response.data, meta: response.meta };
                }
                return { data: [], meta: undefined };
            },
            providesTags: ["PublicationPayment"],
        }),

        verifyPublicationPayment: builder.mutation<
            { success: boolean; payment: PublicationPayment; access_grant?: any },
            { id: string; data: VerifyPaymentPayload }
        >({
            query: ({ id, data }) => ({
                url: `/publication-payments/${id}/verify`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PublicationPayment", "PublicationInquiry", "Publication"],
        }),
    }),
});

export const {
    useGetPublicationCategoriesQuery,
    useGetPublicationCategoryByIdQuery,
    useCreatePublicationCategoryMutation,
    useUpdatePublicationCategoryMutation,
    useDeletePublicationCategoryMutation,

    useGetPublicationsQuery,
    useGetPublicationByIdentifierQuery,
    useCreatePublicationMutation,
    useUpdatePublicationMutation,
    useDeletePublicationMutation,
    usePublishPublicationMutation,
    useUploadPublicationDocumentMutation,

    useSubmitPublicationInquiryMutation,
    useGetPublicationInquiriesQuery,
    useGetPublicationInquiryByIdQuery,
    useUpdatePublicationInquiryStatusMutation,
    useReplyToPublicationInquiryMutation,
    useDeletePublicationInquiryMutation,

    useSubmitPublicationPaymentMutation,
    useGetPublicationPaymentsQuery,
    useVerifyPublicationPaymentMutation,
} = publicationApi;
