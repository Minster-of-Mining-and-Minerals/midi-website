import { baseApi } from "../baseApi";
import { Background } from "../types/background";

// Payload types
export interface CreateBackgroundPayload {
    title: string;
    description?: string;
    icon: string;
    content: string;
    title_am?: string | null;
    description_am?: string | null;
    attachments?: { attachment_id: string }[];
}

export interface UpdateBackgroundPayload {
    title?: string;
    description?: string;
    icon?: string;
    content?: string;
    title_am?: string | null;
    description_am?: string | null;
    attachment_ids?: string[];
}

export const backgroundApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /** ---------------------------
         * GET ALL BACKGROUNDS
         * --------------------------- */
        getBackgrounds: builder.query<Background[], void>({
            query: () => "/backgrounds",
            transformResponse: (response: any): Background[] => response.data ?? [],
            providesTags: ["Background"],
        }),

        /** ---------------------------
         * GET BACKGROUND BY ID
         * --------------------------- */
        getBackgroundById: builder.query<Background, string>({
            query: (id) => `/backgrounds/${id}`,
            transformResponse: (response: any): Background => response.data,
            providesTags: (_r, _e, id) => [{ type: "Background", id }],
        }),

        /** ---------------------------
         * CREATE BACKGROUND
         * --------------------------- */
        createBackground: builder.mutation<Background, CreateBackgroundPayload>({
            query: (body) => ({
                url: "/backgrounds",
                method: "POST",
                body,
            }),
            transformResponse: (response: any): Background => response.data,
            invalidatesTags: ["Background"],
        }),

        /** ---------------------------
         * UPDATE BACKGROUND
         * --------------------------- */
        updateBackground: builder.mutation<
            Background,
            { id: string; data: UpdateBackgroundPayload }
        >({
            query: ({ id, data }) => ({
                url: `/backgrounds/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: any): Background => response.data,
            invalidatesTags: (_r, _e, { id }) => [{ type: "Background", id }, "Background"],
        }),

        /** ---------------------------
         * DELETE BACKGROUND
         * --------------------------- */
        deleteBackground: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/backgrounds/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response: any) => response,
            invalidatesTags: ["Background"],
        }),
    }),
});

export const {
    useGetBackgroundsQuery,
    useGetBackgroundByIdQuery,
    useCreateBackgroundMutation,
    useUpdateBackgroundMutation,
    useDeleteBackgroundMutation,
} = backgroundApi;