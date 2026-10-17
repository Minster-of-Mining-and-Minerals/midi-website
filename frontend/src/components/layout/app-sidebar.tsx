"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  User,
  ShieldCheck,
  Key,
  ChevronRight,
  Phone,
  Briefcase,
  Building2,
  Megaphone,
  Tag,
  Newspaper,
  Image as ImageIcon,
  Info,
  Layout,
  MessageSquare,
  Gem,
  Camera,
  Diamond,
  Layers,
  ClipboardList,
  FileText,
  Thermometer,
  Droplets,
  Target,
  Activity,
  Hammer,
  Globe,
  Search,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import Image from "next/image";
import { hasDirectPermission } from "@/lib/permissions";
import { useGetUserRolesAndPermissionsQuery } from "@/redux/api/userApi";
import { routePermissions } from "@/utils/routes";

/* ---------------- LOCALE STRIPPER ---------------- */
const stripLocale = (pathname: string) => {
  const segments = pathname.split("/");
  if (segments.length > 1 && ["en", "am"].includes(segments[1])) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
};

/* ---------------- ICON MAP ---------------- */
const getIconComponent = (iconName?: string, label?: string) => {
  const iconMap: Record<string, any> = {
    LayoutDashboard,
    Image: ImageIcon,
    Info,
    Briefcase,
    Phone,
    Layout,
    Users,
    User,
    ShieldCheck,
    Key,
    Newspaper,
    Tag,
    MessageSquare,
    Gem,
    Camera,
    Diamond,
    Layers,
    ClipboardList,
    FileText,
    Thermometer,
    Droplets,
    Target,
    Activity,
    Hammer,
    Globe,
    Search,
    // Legacy maps based on labels if needed
    Dashboard: LayoutDashboard,
    "Home Page": ImageIcon,
    About: Info,
    Services: Briefcase,
    Contacts: Phone,
    Footer: Layout,
    Mining: Gem,
    "Artisanal Mining": Hammer,
    "Investigate Ethiopia": Search,
    Geothermal: Thermometer,
    Petroleum: Droplets,
    Calendar,
  };

  if (iconName && iconMap[iconName]) return iconMap[iconName];
  if (label && iconMap[label]) return iconMap[label];

  return Tag; // Default fallback
};

/* ---------------- MENU ITEM COMPONENT ---------------- */
interface MenuItemProps {
  item: {
    path: string;
    label: string;
    icon?: string;
    permissions?: any;
  };
  pathname: string;
  isNested?: boolean;
}

const MenuItem = ({ item, pathname, isNested = false }: MenuItemProps) => {
  const { data: permissionData } = useGetUserRolesAndPermissionsQuery();

  // Check permissions if they exist
  if (item.permissions) {
    const hasAccess = hasDirectPermission(permissionData?.permissions, item.permissions);
    if (!hasAccess) return null;
  }

  const Icon = getIconComponent(item.icon, item.label);
  const isActive = isNested ? pathname === item.path : pathname.startsWith(item.path);
  const isExactActive = pathname === item.path;

  if (isNested) {
    return (
      <SidebarMenuSubItem key={item.path}>
        <SidebarMenuSubButton
          asChild
          isActive={isExactActive}
          className="text-white/80 hover:bg-white/5 hover:text-white transition-colors
            group-data-[collapsible=icon]:justify-center
            data-[active=true]:bg-primary
            data-[active=true]:text-primary-foreground"
        >
          <Link href={item.path} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem
      key={item.path}
      className="group-data-[collapsible=icon]:w-fit"
    >
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
        className="text-white/80 hover:bg-white/5 hover:text-white transition-colors px-5 py-5
          group-data-[collapsible=icon]:px-2
          group-data-[collapsible=icon]:justify-center
          data-[active=true]:bg-primary
          data-[active=true]:text-primary-foreground"
      >
        <Link
          href={item.path}
          className="flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center"
        >
          <Icon className="group-data-[collapsible=icon]:size-5" />
          <span className="text-base group-data-[collapsible=icon]:hidden">
            {item.label}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/* ---------------- COLLAPSIBLE MENU SECTION ---------------- */
interface CollapsibleSectionProps {
  route: {
    path: string;
    label: string;
    icon?: string;
    children?: any[];
    permissions?: any;
  };
  pathname: string;
}

const CollapsibleSection = ({ route, pathname }: CollapsibleSectionProps) => {
  const { data: permissionData } = useGetUserRolesAndPermissionsQuery();

  // Check parent permissions
  if (route.permissions) {
    const hasAccess = hasDirectPermission(permissionData?.permissions, route.permissions);
    if (!hasAccess) return null;
  }

  // Filter children based on permissions
  const visibleChildren = route.children?.filter(child => {
    if (child.permissions) {
      return hasDirectPermission(permissionData?.permissions, child.permissions);
    }
    return true;
  }) || [];

  if (visibleChildren.length === 0) return null;

  const Icon = getIconComponent(route.icon, route.label);
  const isActive = pathname.startsWith(route.path);

  return (
    <Collapsible
      asChild
      defaultOpen={isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem className="group-data-[collapsible=icon]:w-fit">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={route.label}
            isActive={isActive}
            className="text-white/80 hover:bg-white/5 hover:text-white transition-colors px-5 py-5
              group-data-[collapsible=icon]:px-2
              group-data-[collapsible=icon]:justify-center
              data-[active=true]:bg-primary
              data-[active=true]:text-primary-foreground"
          >
            <Icon className="group-data-[collapsible=icon]:size-5" />
            <span className="text-base group-data-[collapsible=icon]:hidden">
              {route.label}
            </span>
            <ChevronRight
              className="ml-auto transition-transform duration-200
                group-data-[state=open]/collapsible:rotate-90
                group-data-[collapsible=icon]:hidden"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub className="pt-1">
            {visibleChildren.map((child) => (
              <MenuItem
                key={child.path}
                item={child}
                pathname={pathname}
                isNested={true}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

/* ---------------- MAIN SIDEBAR COMPONENT ---------------- */
export function AppSidebar() {
  const rawPathname = usePathname();
  const pathname = stripLocale(rawPathname);

  // Separate top-level routes (no parent) and nested routes
  const topLevelRoutes = routePermissions.filter(
    (route) => !route.children && !route.path.includes("/users/") &&
      !route.path.includes("/news/")
  );

  const collapsibleRoutes = routePermissions.filter(
    (route) => route.children && route.children.length > 0
  );

  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* ---------- HEADER ---------- */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin/dashboard" className="flex flex-col items-center">
              <Image
                src="/midi-log.png"
                alt="MIDI Logo"
                width={100}
                height={100}
                className="mx-auto mb-1 rounded-xl p-2 object-contain"
              />
              <div className="grid flex-1 text-center gap-1 text-sm leading-tight group-data-[collapsible=icon]:opacity-0">
                <span className="truncate font-semibold text-golden-dark">
                  MIDI Admin Portal
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ---------- CONTENT ---------- */}
      <SidebarContent>
        <SidebarGroup className="px-5 group-data-[collapsible=icon]:px-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">

              {/* Top Level Routes (Dashboard, Hero, About, Services, Contacts, Footer) */}
              {topLevelRoutes.map((route) => (
                <MenuItem
                  key={route.path}
                  item={route}
                  pathname={pathname}
                  isNested={false}
                />
              ))}

              {/* Collapsible Sections (News, Events, Users, System) */}
              {collapsibleRoutes.map((route) => (
                <CollapsibleSection
                  key={route.path}
                  route={route}
                  pathname={pathname}
                />
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
