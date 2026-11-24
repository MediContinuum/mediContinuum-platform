import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

import type { AuthSession } from "@/types/auth.types";
import type { UserRole } from "@/types/user.types";

import { ROUTE_PATHS } from "@/routes/routePaths";

interface RoleGuardProps {
  children?: ReactNode;
  allowedRoles: readonly UserRole[];
  fallbackPath?: string;
}

function normalizeRole(role: string): string {
  return role
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");
}

function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = ROUTE_PATHS.ERROR.FORBIDDEN,
}: RoleGuardProps) {
  const location = useLocation();

  const { data: session } = useQuery<AuthSession | null>({
    queryKey: ["auth", "session"],
    queryFn: async () => null,
    enabled: false,
    initialData: null,
  });

  if (!session?.isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_PATHS.AUTH.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  const userRoles = (session.roles ?? []).map(normalizeRole);

  const requiredRoles = allowedRoles.map(normalizeRole);

  const hasPermission =
    requiredRoles.length > 0 &&
    userRoles.some((role) => requiredRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default RoleGuard;
