import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

import { signOut } from "next-auth/react";
import { AUTH_LOGIN } from "@/constants/authRoutes";

const defaultApiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";
const rawBaseQuery = fetchBaseQuery({
  baseUrl: typeof window === 'undefined' ? (process.env.INTERNAL_API_URL || defaultApiUrl) : defaultApiUrl,
  prepareHeaders: async (headers) => {
    const session: any = await getSession();
    if (session?.accessToken) {
      // Use X-Authorization instead of Authorization to prevent conflicts with Nginx Basic Auth
      headers.set("x-authorization", `Bearer ${session.accessToken}`);
    }
    headers.set("content-type", "application/json");
    headers.set("accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn("Auth error detected, logging out...", result.error.status);

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }

    // Sign out from NextAuth
    await signOut({ callbackUrl: AUTH_LOGIN });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Tag",
    "User",
    "Roles",
    "Permissions",
    "Attachment",
    "Service",
    "Background",
    "Leadership",
    "Strategy",
    "Region",
    "FederalOffice",
    "RegionalOffice",
    "Message",
    "SocialMedia",
    "Footer",
    "Card",
    "Slider",
    "Partner",
    "ASM",
    "InvestigateEthiopia",
    "AuditLogs",
    "Vacancy",
    "Route",
    "PageHeader",
    "Product",
    "ProductCategory",
    "ProductInquiry",
    "Publication",
    "PublicationCategory",
    "PublicationInquiry",
    "PublicationPayment",
    "Canvas",
    "Purpose",
    "News",
    "Event",
    "Facility",
    "Certification",
    "BusinessOverview",
    "BusinessNodes",
    "ImportExportOverview",
    "ImportExportCategory",
    "ImportExportStep",
    "Warehouse",
    "WarehousingOverview",
    "TradingOverview",
  ],
  endpoints: () => ({}),
});
