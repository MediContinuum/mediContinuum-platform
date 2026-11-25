import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import type { AuthSession } from "@/types/auth.types";
import { ROUTE_PATHS } from "@/routes/routePaths";

interface ProtectedRouteProps {
  children?: ReactNode;
  fallbackPath?: string;
}

function ProtectedRoute({
  children,
  fallbackPath = ROUTE_PATHS.AUTH.LOGIN,
}: ProtectedRouteProps) {
  const location = useLocation();

  const { data: session, isPending } = useQuery<AuthSession | null>({
    queryKey: ["auth", "session"],
    queryFn: async () => null,
    enabled: false,
    initialData: null,
  });

  if (isPending) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
      >
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="size-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.isAuthenticated) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;