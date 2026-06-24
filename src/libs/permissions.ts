export const ROLES = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Rutas restringidas solo a administradores. */
export const ADMIN_ONLY_ROUTES: Record<string, readonly Role[]> = {
  "/usuarios": [ROLES.ADMIN],
  "/invitaciones": [ROLES.ADMIN],
};

export function hasRole(userRole: string, allowedRoles: readonly Role[]): boolean {
  return allowedRoles.includes(userRole as Role);
}

export function canAccessRoute(userRole: string, pathname: string): boolean {
  const normalizedPath = pathname.split("?")[0];

  const matchingRoute = Object.keys(ADMIN_ONLY_ROUTES)
    .filter(
      (route) =>
        normalizedPath === route || normalizedPath.startsWith(`${route}/`),
    )
    .sort((a, b) => b.length - a.length)[0];

  if (!matchingRoute) {
    return true;
  }

  return hasRole(userRole, ADMIN_ONLY_ROUTES[matchingRoute]);
}

export function filterNavItemsByRole<T extends { url?: string; children?: readonly { url: string }[] }>(
  items: readonly T[],
  userRole: string,
): T[] {
  return items
    .map((item) => {
      if ("children" in item && item.children) {
        const children = item.children.filter((child) =>
          canAccessRoute(userRole, child.url),
        );

        if (children.length === 0) {
          return null;
        }

        return { ...item, children };
      }

      if ("url" in item && item.url && !canAccessRoute(userRole, item.url)) {
        return null;
      }

      return item;
    })
    .filter((item): item is T => item !== null);
}
