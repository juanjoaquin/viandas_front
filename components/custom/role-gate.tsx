"use client";

import { useHasRole } from "@/app/(plataforma)/components/user-context";
import type { Role } from "@/src/libs/permissions";

type RoleGateProps = {
  roles: readonly Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function RoleGate({
  roles,
  children,
  fallback = null,
}: RoleGateProps) {
  const allowed = useHasRole(roles);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
