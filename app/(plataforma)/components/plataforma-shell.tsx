"use client";

import type { TUser } from "@/src/architecture/core/domain/entities/User";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "./app-sidebar";
import { TokenRefresher } from "./token-refresher";

type PlataformaShellProps = {
  user: TUser;
  children: React.ReactNode;
};

export function PlataformaShell({ user, children }: PlataformaShellProps) {
  return (
    <TooltipProvider>
      <TokenRefresher />
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <div className="flex flex-1 flex-col bg-background">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
