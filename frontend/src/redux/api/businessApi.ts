import { baseApi } from '../baseApi';

export interface BusinessOverview {
  business_overview_id: string;
  title_part1?: string;
  title_part1_am?: string;
  title_part2?: string;
  title_part2_am?: string;
  description1?: string;
  description1_am?: string;
  description2?: string;
  description2_am?: string;
  network_operations?: Array<{
    title: string;
    description: string;
    full_description: string;
    icon: string;
  }>;
  page_metadata?: {
    general_overview_info?: { 
      title: string; 
      description: string; 
      bg_image: string;
      overlay_text?: string;
      features?: Array<{ text: string; icon: string }>;
      right_content?: { title: string; icon: string; description: string };
    };
    key_metrics_info?: { title: string; description: string };
    key_verticals_info?: { title: string; description: string; icon: string };
    operations_table_info?: { title: string; description: string; icon: string };
    network_operations_info?: { title: string; description: string; icon: string };
  };
  business_data: Array<{
    title: string;
    heading: string;
    description: string;
    features: string[];
  }>;
  business_categories: Array<{
    icon: string;
    title: string;
    growth: string;
    description: string;
    topFocus: string[];
    color?: string;
  }>;
  key_metrics: Array<{
    title: string;
    value: string;
    change: string;
    period: string;
    icon: string;
    color: string;
  }>;
  operations_data: Array<{
    area: string;
    focus: string;
    infrastructure: string;
    status: string;
    statusIcon?: string;
    statusColor?: string;
  }>;
  quick_stats: {
    left: Array<{ title?: string; subtitle?: string; label?: string; value?: string }>;
    right: Array<{ title?: string; subtitle?: string; label?: string; value?: string }>;
  };
}

export interface BusinessNode {
  business_node_id: string;
  id_string: string;
  title: string;
  title_am?: string;
  description: string;
  description_am?: string;
  icon: string;
  position_x: number;
  position_y: number;
  mobile_order: number;
}

export interface BusinessPage {
  business_page_id: string;
  slug: string;
  title: string;
  title_am?: string;
  subtitle?: string;
  subtitle_am?: string;
  summary?: string;
  summary_am?: string;
  content?: string;
  content_am?: string;
  cover_image_id?: string;
  sections_data?: any;
  publish_status: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ImportExportOverview {
  import_export_overview_id: string;
  page_subtitle: string;
  page_title: string;
  page_description: string;
  export_title: string;
  export_description: string;
  import_title: string;
  import_description: string;
  export_icon: string;
  import_icon: string;
  center_icon: string;
  center_title: string;
  center_subtitle: string;
  stat1_value: string;
  stat1_label: string;
  stat1_subtext: string;
  stat2_value: string;
  stat2_label: string;
  cta_title: string;
  cta_description: string;
  cta_button_title: string;
  cta_button_url: string;
  cta_button_icon: string;
}

export interface ImportExportCategory {
  category_id: string;
  type: 'import' | 'export';
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ImportExportStep {
  step_id: string;
  step_number: string;
  title: string;
  description: string;
  order: number;
}

export interface WarehouseImage {
  image_id: string;
  warehouse_id: string;
  image_url: string;
  order: number;
}

export interface WarehousingOverview {
  warehousing_overview_id: string;
  page_subtitle?: string;
  page_description?: string;
  page_header?: any;
  hero_title?: string;
  hero_image?: string;
  hero_description_1?: string;
  hero_description_2?: string;
  stat_overlay?: any;
  flow_of_goods?: any;
  trading_section?: any;
  market_connection?: any;
  agriculture_section?: any;
  facilities_section?: any;
  editorial_cards?: any;
  visualization_nodes?: any;
  business_steps?: any;
}

export interface Warehouse {
  warehouse_id: string;
  name: string;
  region: string;
  city?: string;
  description?: string;
  address?: string;
  area?: string;
  status: string;
  order: number;
  publish_status: string;
  images: WarehouseImage[];
}

export interface TradingOverview {
  page_header?: {
    subtitle?: string;
  };
  hero_title?: string;
  hero_description_1?: string;
  hero_description_2?: string;
  hero_visual?: {
    center_title?: string;
    center_subtitle?: string;
    node_top?: string;
    node_bottom?: string;
    node_left?: string;
    node_right?: string;
  };
  principles?: any[];
  relationship_nodes?: any[];
  market_gap?: {
    overline?: string;
    title?: string;
    description?: string;
    diagram_left_label?: string;
    diagram_right_label?: string;
    diagram_gap_label?: string;
    diagram_central_pill?: string;
    diagram_bottom_label?: string;
  };
  customer_connection?: {
    title?: string;
    description?: string;
    note_text?: string;
  };
  big_statement?: {
    statement_words?: string[];
    description?: string;
    central_text?: string;
    ecosystem_words?: string[];
  };
  stats?: any[];
  trading_cycle?: any[];
}

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessPages: builder.query<BusinessPage[], { status?: string } | void>({
      query: (params) => (params && params.status ? `/business/pages?status=${params.status}` : '/business/pages'),
      providesTags: ['BusinessPages'] as any,
    }),
    getBusinessPageBySlug: builder.query<BusinessPage, string>({
      query: (slug) => `/business/pages/${slug}`,
      providesTags: (_res, _err, slug) => [{ type: 'BusinessPages' as any, id: slug }],
    }),
    updateBusinessPage: builder.mutation<BusinessPage, { slug: string; data: Partial<BusinessPage> }>({
      query: ({ slug, data }) => ({
        url: `/business/pages/${slug}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BusinessPages'] as any,
    }),
    getTradingOverview: builder.query<TradingOverview, void>({
      query: () => '/business/trading/overview',
      providesTags: ['TradingOverview'] as any,
    }),
    updateTradingOverview: builder.mutation<TradingOverview, Partial<TradingOverview>>({
      query: (body) => ({
        url: '/business/trading/overview',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['TradingOverview'] as any,
    }),
    getBusinessOverview: builder.query<BusinessOverview, void>({
      query: () => '/business/overview',
      providesTags: ['BusinessOverview'],
    }),
    updateBusinessOverview: builder.mutation<BusinessOverview, Partial<BusinessOverview>>({
      query: (body) => ({
        url: '/business/overview',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['BusinessOverview'],
    }),
    getBusinessNodes: builder.query<BusinessNode[], void>({
      query: () => '/business/nodes',
      providesTags: ['BusinessNodes'],
    }),
    createBusinessNode: builder.mutation<BusinessNode, Partial<BusinessNode>>({
      query: (body) => ({
        url: '/business/nodes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BusinessNodes'],
    }),
    updateBusinessNode: builder.mutation<BusinessNode, { id: string; data: Partial<BusinessNode> }>({
      query: ({ id, data }) => ({
        url: `/business/nodes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BusinessNodes'],
    }),
    deleteBusinessNode: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/business/nodes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BusinessNodes'],
    }),

    // --- Import Export Overview ---
    getImportExportOverview: builder.query<ImportExportOverview, void>({
      query: () => '/business/import-export/overview',
      providesTags: ['ImportExportOverview'],
    }),
    updateImportExportOverview: builder.mutation<ImportExportOverview, Partial<ImportExportOverview>>({
      query: (body) => ({
        url: '/business/import-export/overview',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ImportExportOverview'],
    }),

    // --- Import Export Categories ---
    getImportExportCategories: builder.query<ImportExportCategory[], string | void>({
      query: (type) => (type ? `/business/import-export/categories?type=${type}` : '/business/import-export/categories'),
      providesTags: ['ImportExportCategory'],
    }),
    createImportExportCategory: builder.mutation<ImportExportCategory, Partial<ImportExportCategory>>({
      query: (body) => ({
        url: '/business/import-export/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ImportExportCategory'],
    }),
    updateImportExportCategory: builder.mutation<ImportExportCategory, { id: string; data: Partial<ImportExportCategory> }>({
      query: ({ id, data }) => ({
        url: `/business/import-export/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ImportExportCategory'],
    }),
    deleteImportExportCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/business/import-export/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ImportExportCategory'],
    }),

    // --- Import Export Steps ---
    getImportExportSteps: builder.query<ImportExportStep[], void>({
      query: () => '/business/import-export/steps',
      providesTags: ['ImportExportStep'],
    }),
    createImportExportStep: builder.mutation<ImportExportStep, Partial<ImportExportStep>>({
      query: (body) => ({
        url: '/business/import-export/steps',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ImportExportStep'],
    }),
    updateImportExportStep: builder.mutation<ImportExportStep, { id: string; data: Partial<ImportExportStep> }>({
      query: ({ id, data }) => ({
        url: `/business/import-export/steps/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ImportExportStep'],
    }),
    deleteImportExportStep: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/business/import-export/steps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ImportExportStep'],
    }),

    // --- Warehouses ---
    getWarehousingOverview: builder.query<WarehousingOverview, void>({
      query: () => '/business/warehouses/overview',
      providesTags: ['WarehousingOverview'],
      transformResponse: (response: { data: WarehousingOverview }) => response.data,
    }),
    updateWarehousingOverview: builder.mutation<WarehousingOverview, Partial<WarehousingOverview>>({
      query: (body) => ({
        url: '/business/warehouses/overview',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['WarehousingOverview'],
    }),
    getWarehouses: builder.query<Warehouse[], void>({
      query: () => '/business/warehouses',
      providesTags: ['Warehouse'],
      transformResponse: (response: { data: Warehouse[] }) => response.data,
    }),
    reorderWarehouses: builder.mutation<{ message: string }, { warehouses: { id: string; order: number }[] }>({
      query: (body) => ({
        url: '/business/warehouses/reorder',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    createWarehouse: builder.mutation<Warehouse, Partial<Warehouse>>({
      query: (body) => ({
        url: '/business/warehouses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    updateWarehouse: builder.mutation<Warehouse, { id: string; data: Partial<Warehouse> }>({
      query: ({ id, data }) => ({
        url: `/business/warehouses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    deleteWarehouse: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/business/warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warehouse'],
    }),
    addWarehouseImage: builder.mutation<WarehouseImage, { warehouseId: string; image_url: string; order?: number }>({
      query: ({ warehouseId, ...body }) => ({
        url: `/business/warehouses/${warehouseId}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    deleteWarehouseImage: builder.mutation<{ message: string }, string>({
      query: (imageId) => ({
        url: `/business/warehouses/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warehouse'],
    }),
  }),
});

export const {
  useGetBusinessPagesQuery,
  useGetBusinessPageBySlugQuery,
  useUpdateBusinessPageMutation,
  useGetBusinessOverviewQuery,
  useUpdateBusinessOverviewMutation,
  useGetBusinessNodesQuery,
  useCreateBusinessNodeMutation,
  useUpdateBusinessNodeMutation,
  useDeleteBusinessNodeMutation,
  useGetImportExportOverviewQuery,
  useUpdateImportExportOverviewMutation,
  useGetImportExportCategoriesQuery,
  useCreateImportExportCategoryMutation,
  useUpdateImportExportCategoryMutation,
  useDeleteImportExportCategoryMutation,
  useGetImportExportStepsQuery,
  useCreateImportExportStepMutation,
  useUpdateImportExportStepMutation,
  useDeleteImportExportStepMutation,
  useGetWarehousesQuery,
  useReorderWarehousesMutation,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useAddWarehouseImageMutation,
  useDeleteWarehouseImageMutation,
  useGetWarehousingOverviewQuery,
  useUpdateWarehousingOverviewMutation,
  useGetTradingOverviewQuery,
  useUpdateTradingOverviewMutation,
} = businessApi;
