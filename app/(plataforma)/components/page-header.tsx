"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RouteBackButton } from "./route-back-button";

const ROUTE_LABELS: Record<string, string> = {
  clientes: "Clientes",
  deliverys: "Repartos",
  menus: "Menús",
  platos: "Platos",
  "menus-semanales": "Menú Semanal",
  producciones: "Producciones",
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

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
      {/* Fila 1: sidebar trigger + breadcrumbs */}
      <div className="flex h-10 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Home className="h-3.5 w-3.5 shrink-0" />
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? "font-medium text-foreground"
                    : "transition-colors hover:text-foreground"
                }
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Fila 2: título + descripción + acción */}
      <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-1">
        <div className="flex min-w-0 items-center gap-3">
          <RouteBackButton />
          <div className="min-w-0 space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h1>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
