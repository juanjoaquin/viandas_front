"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Motorbike,
  Package,
  Soup,
  Tags,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import { cn } from "@/lib/utils";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Deliverys",
    url: "/deliverys",
    icon: Motorbike,
  },
  {
    title: "Menús",
    url: "/menus",
    icon: ClipboardList,
  },
  {
    title: "Platos",
    url: "/platos",
    icon: Soup,
  },
  {
    title: "Productos",
    icon: Package,
    children: [
      {
        title: "Categorías",
        url: "/categorias",
        icon: Tags,
      },
      {
        title: "Productos",
        url: "/productos",
        icon: Package,
      },
    ],
  },
  {
    title: "Menú Semanal",
    url: "/menus-semanales",
    icon: CalendarDays,
  },
  {
    title: "Producciones",
    url: "/producciones",
    icon: ClipboardCheck,
  },
] as const;

type NavChild = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type CollapsibleNavItemProps = {
  title: string;
  icon: LucideIcon;
  subItems: readonly NavChild[];
  pathname: string;
};

function CollapsibleNavItem({
  title,
  icon: Icon,
  subItems,
  pathname,
}: CollapsibleNavItemProps) {
  const isParentActive = subItems.some(
    (child) =>
      pathname === child.url || pathname.startsWith(`${child.url}/`),
  );
  const [open, setOpen] = useState(isParentActive);

  useEffect(() => {
    if (isParentActive) {
      setOpen(true);
    }
  }, [isParentActive]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        isActive={isParentActive}
        tooltip={title}
      >
        <Icon />
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "ml-auto size-4 shrink-0 transition-transform duration-200 ease-in-out",
            open && "rotate-180",
          )}
        />
      </SidebarMenuButton>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <SidebarMenuSub className={cn(!open && "pointer-events-none")}>
            {subItems.map((child) => (
              <SidebarMenuSubItem key={child.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={
                    pathname === child.url ||
                    pathname.startsWith(`${child.url}/`)
                  }
                >
                  <Link href={child.url}>
                    <child.icon />
                    <span>{child.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </div>
      </div>
    </SidebarMenuItem>
  );
}

type AppSidebarProps = {
  user: TUser;
};

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/clientes">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <UtensilsCrossed className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight">
                    Viandas
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    Plataforma
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest font-medium text-sidebar-foreground/40">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const hasChildren = "children" in item;

                if (hasChildren) {
                  return (
                    <CollapsibleNavItem
                      key={item.title}
                      title={item.title}
                      icon={item.icon}
                      subItems={item.children}
                      pathname={pathname}
                    />
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === item.url ||
                        pathname.startsWith(`${item.url}/`)
                      }
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mx-3 h-px bg-sidebar-border" />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={`${user.name} — ${user.email}`}>
              <div className="relative flex aspect-square size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold shadow-sm">
                {initials}
                <span className="absolute bottom-0 right-0 size-2 rounded-full bg-green-400 ring-1 ring-sidebar" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
