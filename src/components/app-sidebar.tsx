import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Wallet,
  RotateCcw,
  BarChart3,
  BellRing,
  ShieldCheck,
  Tag,
  MessageCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const primary = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Orders", url: "/orders", icon: ShoppingBag },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Customers", url: "/customers", icon: Users },
];

const finance = [
  { title: "Payments", url: "/payments", icon: Wallet },
  { title: "Returns", url: "/returns", icon: RotateCcw },
  { title: "Promos", url: "/promos", icon: Tag },
];

const ops = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: BellRing },
  { title: "Roles & Audit", url: "/roles", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const renderGroup = (
    label: string,
    items: { title: string; url: string; icon: typeof LayoutDashboard }[],
  ) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-md bg-[var(--brand)] grid place-items-center text-primary-foreground">
            <MessageCircle className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Glow OMS</span>
              <span className="text-[10px] text-muted-foreground">
                WhatsApp Order Management
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Operations", primary)}
        {renderGroup("Finance", finance)}
        {renderGroup("Insights", ops)}
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <div className="mx-2 mb-2 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[var(--brand-soft)] grid place-items-center text-xs font-semibold text-[var(--brand-dark)]">
                NK
              </div>
              <div className="flex flex-col leading-tight text-xs">
                <span className="font-medium">Nadia K.</span>
                <span className="text-muted-foreground">Admin</span>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}