"use client";

import { createContext, useContext } from "react";
import type { TUser } from "@/src/architecture/core/domain/entities/User";
import { hasRole, type Role } from "@/src/libs/permissions";

const UserContext = createContext<TUser | null>(null);

type UserProviderProps = {
  user: TUser;
  children: React.ReactNode;
};

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useCurrentUser(): TUser {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("useCurrentUser debe usarse dentro de UserProvider");
  }

  return user;
}

export function useHasRole(allowedRoles: readonly Role[]): boolean {
  const user = useCurrentUser();
  return hasRole(user.role, allowedRoles);
}
