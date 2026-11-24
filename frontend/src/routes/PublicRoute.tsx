import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import type { AuthSession } from "@/types/auth.types";
import { ROUTE_PATHS } from "@/routes/routePaths";

interface PublicRouteProps {
  children?: ReactNode;
  guestOnly?: boolean;
  redirectTo?: string;
}

interface NavigationState {
  from?: {
    pathname?: string;
  };
}

function PublicRoute({
  children,
  guestOnly = false,
  redirectTo = ROUTE_PATHS.APP.DASHBOARD,
}: PublicRouteProps) {
  const location = useLocation();

  const { data: session, isPending } = useQuery<AuthSession | null>({
    queryKey: ["auth", "session"],
    queryFn: async () => null,
    enabled: false,
    initialData: null,
  });

  if (guestOnly && isPending) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
      >
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="size-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (guestOnly && session?.isAuthenticated) {
    const navigationState = location.state as NavigationState | null;

    const requestedPath = navigationState?.from?.pathname;

    const safeRedirectPath =
      requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
        ? requestedPath
        : redirectTo;

    return <Navigate to={safeRedirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PublicRoute;
