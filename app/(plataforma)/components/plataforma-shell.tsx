"use client";

import { usePathname } from "next/navigation";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./app-sidebar";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  clientes: "Clientes",
  pedidos: "Pedidos",
  productos: "Productos",
  reportes: "Reportes",
  configuracion: "Configuración",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg) => ({
    label: ROUTE_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/"),
  }));
}

type PlataformaShellProps = {
  user: TUser;
  children: React.ReactNode;
};

export function PlataformaShell({ user, children }: PlataformaShellProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card/80 backdrop-blur-sm px-4 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <nav className="flex items-center gap-1 text-sm text-muted-foreground">
              <Home className="h-3.5 w-3.5 shrink-0" />
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  <span
                    className={
                      i === breadcrumbs.length - 1
                        ? "font-medium text-foreground"
                        : "hover:text-foreground transition-colors"
                    }
                  >
                    {crumb.label}
                  </span>
                </span>
              ))}
            </nav>
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
