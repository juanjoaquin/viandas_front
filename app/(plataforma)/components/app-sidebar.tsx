"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  LogOut,
  MailPlus,
  Motorbike,
  Package,
  Soup,
  Tags,
  UserCircle,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import { logoutAction } from "@/src/architecture/actions/auth/logout.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/custom/theme-toggle";
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
  useSidebar,
} from "@/components/ui/sidebar";

const appNavItems = [
  {
    title: "Overview",
    url: "/overview",
    icon: ClipboardList,
  },
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

const usersNavItems = [
  {
    title: "Invitaciones",
    url: "/invitaciones",
    icon: MailPlus,
  },
  {
    title: "Usuarios",
    url: "/usuarios",
    icon: UserCircle,
  },
] as const;

const sectionLabelClassName =
  "h-6 text-[11px] tracking-widest font-medium text-sidebar-foreground/40";

type NavChild = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type NavItem =
  | {
      title: string;
      url: string;
      icon: LucideIcon;
    }
  | {
      title: string;
      icon: LucideIcon;
      children: readonly NavChild[];
    };

type CollapsibleNavItemProps = {
  title: string;
  icon: LucideIcon;
  subItems: readonly NavChild[];
  pathname: string;
};

function NavMenuItems({
  items,
  pathname,
}: {
  items: readonly NavItem[];
  pathname: string;
}) {
  return (
    <SidebarMenu className="gap-1">
      {items.map((item) => {
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
                pathname === item.url || pathname.startsWith(`${item.url}/`)
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
  );
}

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
  const [userOpen, setUserOpen] = useState(false);
  const open = isParentActive || userOpen;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        onClick={() => setUserOpen((prev) => !prev)}
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
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  function handleLogout() {
    startLogoutTransition(async () => {
      const result = await logoutAction();
      if (result.success) {
        router.push("/login");
        router.refresh();
      }
    });
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-1 pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/clientes">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <UtensilsCrossed className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight text-sidebar-foreground">
                    Viandapp
                  </span>
                  <span className="truncate text-xs text-gray-400">
                    Plataforma
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-0">
        <SidebarGroup className="px-2 pb-2 pt-1">
          <SidebarGroupLabel
            className={cn(sectionLabelClassName, "uppercase")}
          >
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenuItems items={appNavItems} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-2 pb-2 pt-1">
          <SidebarGroupLabel className={sectionLabelClassName}>
            Usuarios
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenuItems items={usersNavItems} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarMenu className="px-2">
        <SidebarMenuItem>
          <ThemeToggle />
        </SidebarMenuItem>
      </SidebarMenu>

      <div className="mx-3 h-px bg-sidebar-border" />

      <SidebarFooter className="gap-1.5 group-data-[collapsible=icon]:p-1">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-2.5 py-2 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1.5">
            <div className="relative flex aspect-square size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold shadow-sm">
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-sidebar/80" />
            </div>
            <div className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold text-sidebar-foreground">
                {user.name}
              </span>
              <span className="truncate text-xs text-sidebar-foreground">
                {user.email}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLogoutDialogOpen(true)}
              disabled={isLoggingOut}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="flex size-8 shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80 hover:text-sidebar-foreground disabled:pointer-events-none disabled:opacity-50 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:hover:bg-sidebar-accent"
            >
              <LogOut className="size-4 shrink-0" />
            </button>
          </div>
        </div>
      </SidebarFooter>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a salir de tu cuenta. Tendrás que iniciar sesión de nuevo para
              volver a la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoggingOut}
              onClick={(event) => {
                event.preventDefault();
                handleLogout();
              }}
            >
              <LogOut data-icon="inline-start" />
              {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SidebarRail />
    </Sidebar>
  );
}
