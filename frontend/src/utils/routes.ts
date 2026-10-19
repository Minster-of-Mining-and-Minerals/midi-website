// config/routes.ts
export type PermissionKey = `${string}:${string}`;

export interface RouteConfig {
    path: string;
    label: string;
    icon?: string;
    permissions?: {
        anyPermissions?: PermissionKey[];
        allPermissions?: PermissionKey[];
        onlyPermissions?: PermissionKey[];
    };
    children?: RouteConfig[];
}

export const routePermissions: RouteConfig[] = [
    // ---------------- MAIN ----------------
    {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: "LayoutDashboard",
        permissions: {
            anyPermissions: ["DASHBOARD:VIEW"],
        },
    },
    {
        path: "/admin/hero-section",
        label: "Home Page",
        icon: "Image",
        permissions: {
            anyPermissions: ["HERO:READ"],
        },
    },
    {
        path: "/admin/page-headers",
        label: "Page Headers",
        icon: "Layers",
        permissions: {
            anyPermissions: ["PAGE_HEADERS:READ"],
        },
    },
    {
        path: "/admin/about",
        label: "About (Cards, Leaders...)",
        icon: "Info",
        permissions: {
            anyPermissions: ["ABOUT:READ"],
        },
    },
    {
        path: "/admin/businesses",
        label: "Mineral Industry Dev",
        icon: "Briefcase",
        permissions: {
            anyPermissions: ["BUSINESSES:READ"],
        },
        children: [
            {
                path: "/admin/businesses",
                label: "Pages & Value Chain",
                icon: "Layers",
                permissions: { anyPermissions: ["BUSINESSES:READ"] },
            },
            {
                path: "/admin/businesses/overview",
                label: "Technical Operations",
                icon: "Tag",
                permissions: { anyPermissions: ["BUSINESSES:READ"] },
            },
        ],
    },
    {
        path: "/admin/services",
        label: "Services",
        icon: "Settings",
        permissions: {
            anyPermissions: ["SERVICES:READ"],
        },
    },

    {
        path: "/admin/contacts",
        label: "Contacts",
        icon: "Phone",
        permissions: {
            anyPermissions: ["CONTACTS:READ", "CONTACT_MESSAGES:READ"],
        },
    },
    {
        path: "/admin/footer",
        label: "Footer",
        icon: "Layout",
        permissions: {
            anyPermissions: ["FOOTER:READ"],
        },
    },

    // ---------------- CONTENT ----------------
    {
        path: "/admin/publications",
        label: "Publications & Research",
        icon: "BookOpen",
        permissions: {
            anyPermissions: [
                "PUBLICATIONS:READ",
                "PUBLICATION_CATEGORIES:READ",
                "PUBLICATION_INQUIRIES:READ",
                "PUBLICATION_PAYMENTS:READ",
            ],
        },
        children: [
            {
                path: "/admin/publications",
                label: "All Publications",
                icon: "BookOpen",
                permissions: { anyPermissions: ["PUBLICATIONS:READ"] },
            },
            {
                path: "/admin/publications/categories",
                label: "Categories",
                icon: "Tag",
                permissions: { anyPermissions: ["PUBLICATION_CATEGORIES:READ"] },
            },
            {
                path: "/admin/publications/inquiries",
                label: "Inquiries & Requests",
                icon: "MessageSquare",
                permissions: { anyPermissions: ["PUBLICATION_INQUIRIES:READ"] },
            },
            {
                path: "/admin/publications/payments",
                label: "Payment Review",
                icon: "CreditCard",
                permissions: { anyPermissions: ["PUBLICATION_PAYMENTS:READ"] },
            },
        ],
    },
    {
        path: "/admin/careers",
        label: "Careers",
        icon: "Briefcase",
        permissions: {
            // Mapping Careers to Vacancies permission
            anyPermissions: ["VACANCIES:READ"],
        },
    },
    {
        path: "/admin/news",
        label: "News Management",
        icon: "FileText",
        permissions: {
            anyPermissions: ["NEWS:READ"], // Ensure this exists or use a generic one like "SERVICES:READ" for now
        },
        children: [
            {
                path: "/admin/news",
                label: "All News",
                icon: "List",
                permissions: { anyPermissions: ["NEWS:READ"] },
            },
            {
                path: "/admin/news/tags",
                label: "Tags",
                icon: "Tag",
                permissions: { anyPermissions: ["TAGS:READ"] },
            },
            {
                path: "/admin/news/feedbacks",
                label: "Feedbacks",
                icon: "MessageSquare",
                permissions: { anyPermissions: ["NEWS_FEEDBACKS:READ"] },
            },
        ],
    },

    // ---------------- SYSTEM & USERS ----------------
    {
        path: "/admin/users",
        label: "Users & Roles",
        icon: "Users",
        permissions: {
            anyPermissions: ["USERS:READ", "ROLES:READ", "PERMISSIONS:READ"],
        },
        children: [
            {
                path: "/admin/users",
                label: "User Accounts",
                icon: "User",
                permissions: { anyPermissions: ["USERS:READ"] },
            },
            {
                path: "/admin/users/roles",
                label: "Role Management",
                icon: "ShieldCheck",
                permissions: { anyPermissions: ["ROLES:READ"] },
            },
            {
                path: "/admin/users/permissions",
                label: "Permission Management",
                icon: "Key",
                permissions: { anyPermissions: ["PERMISSIONS:READ"] },
            },
        ],
    },
    {
        path: "/admin/system",
        label: "System",
        icon: "ShieldCheck",
        permissions: {
            anyPermissions: ["AUDIT_LOGS:READ", "ROUTES:READ"],
        },
        children: [
            {
                path: "/admin/system/audit-logs",
                label: "Audit Logs",
                icon: "ClipboardList",
                permissions: { anyPermissions: ["AUDIT_LOGS:READ"] },
            },
            {
                path: "/admin/system/routes",
                label: "Routes Management",
                icon: "Map",
                permissions: { anyPermissions: ["ROUTES:READ"] },
            },
        ],
    },
];

// ---------------- HELPER ----------------

// Find route (including children)
export function getPermissionsForPath(path: string) {
    for (const route of routePermissions) {
        if (route.path === path) return route.permissions;

        if (route.children) {
            const child = route.children.find((c) => c.path === path);
            if (child) return child.permissions;
        }
    }
    return undefined;
}

// Get children for tabs
export function getChildRoutes(parentPath: string) {
    return routePermissions.find((r) => r.path === parentPath)?.children || [];
}
