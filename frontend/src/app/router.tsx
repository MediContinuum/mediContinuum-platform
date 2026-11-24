import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  Navigate,
  Outlet,
  useRouteError,
  useNavigate,
  type RouteObject,
} from "react-router";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, HeartPulse, ShieldAlert } from "lucide-react";

import type { AuthSession } from "@/types/auth.types";
import type { UserRole } from "@/types/user.types";

import { ROUTE_PATHS } from "@/routes/routePaths";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import RoleGuard from "@/routes/RoleGuard";

import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

/* -------------------------------------------------------------------------- */
/* PUBLIC PAGES                                                               */
/* -------------------------------------------------------------------------- */

import LandingPage from "@/pages/public/LandingPage";
import AboutPage from "@/pages/public/AboutPage";
import ContactPage from "@/pages/public/ContactPage";
import NotFoundPage from "@/pages/public/NotFoundPage";

/* -------------------------------------------------------------------------- */
/* DASHBOARD PAGES                                                            */
/* -------------------------------------------------------------------------- */

import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import DoctorDashboard from "@/pages/dashboard/DoctorDashboard";
import FamilyDashboard from "@/pages/dashboard/FamilyDashboard";
import OrganisationDashboard from "@/pages/dashboard/OrganisationDashboard";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import VendorDashboard from "@/pages/dashboard/VendorDashboard";

/* -------------------------------------------------------------------------- */
/* ADHERENCE FEATURE PAGES                                                    */
/* -------------------------------------------------------------------------- */

import AdherenceCalendarPage from "@/features/adherence/pages/AdherenceCalendarPage";
import AdherenceHistoryPage from "@/features/adherence/pages/AdherenceHistoryPage";
import AdherenceStatisticsPage from "@/features/adherence/pages/AdherenceStatisticsPage";
import MedicationSchedulePage from "@/features/adherence/pages/MedicationSchedulePage";
import TodayMedicationPage from "@/features/adherence/pages/TodayMedicationPage";

/* -------------------------------------------------------------------------- */
/* AI FEATURE PAGES                                                           */
/* -------------------------------------------------------------------------- */

import AIInsightsPage from "@/features/ai/pages/AIInsightsPage";
import InventoryIntelligencePage from "@/features/ai/pages/InventoryIntelligencePage";
import MedicineScanPage from "@/features/ai/pages/MedicineScanPage";
import PrescriptionScanPage from "@/features/ai/pages/PrescriptionScanPage";

/* -------------------------------------------------------------------------- */
/* ANALYTICS FEATURE PAGES                                                    */
/* -------------------------------------------------------------------------- */

import InventoryAnalyticsPage from "@/features/analytics/pages/InventoryAnalyticsPage";
import OrganisationAnalyticsPage from "@/features/analytics/pages/OrganisationAnalyticsPage";
import PatientAnalyticsPage from "@/features/analytics/pages/PatientAnalyticsPage";

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                                                */
/* -------------------------------------------------------------------------- */

function RootLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AUTHENTICATION PAGES                                                       */
/* -------------------------------------------------------------------------- */

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Login</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Connect your existing login feature here.
        </p>
      </div>
    </main>
  );
}

function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Register</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Connect your existing registration feature here.
        </p>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* ROLE-BASED DASHBOARD REDIRECT                                              */
/* -------------------------------------------------------------------------- */

const AUTH_SESSION_QUERY_KEY = ["auth", "session"] as const;

function normalizeRole(role: string): string {
  return role
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");
}

function getDashboardPath(roles: readonly UserRole[]): string {
  const normalizedRoles = roles.map(normalizeRole);

  if (
    normalizedRoles.includes("PLATFORM_ADMIN") ||
    normalizedRoles.includes("ADMIN")
  ) {
    return ROUTE_PATHS.DASHBOARDS.ADMIN;
  }

  if (normalizedRoles.includes("DOCTOR")) {
    return ROUTE_PATHS.DASHBOARDS.DOCTOR;
  }

  if (normalizedRoles.includes("FAMILY_MEMBER")) {
    return ROUTE_PATHS.DASHBOARDS.FAMILY;
  }

  if (
    normalizedRoles.includes("ORGANISATION") ||
    normalizedRoles.includes("ORGANIZATION") ||
    normalizedRoles.includes("ORGANISATION_ADMIN") ||
    normalizedRoles.includes("ORGANIZATION_ADMIN")
  ) {
    return ROUTE_PATHS.DASHBOARDS.ORGANISATION;
  }

  if (normalizedRoles.includes("VENDOR")) {
    return ROUTE_PATHS.DASHBOARDS.VENDOR;
  }

  if (normalizedRoles.includes("PATIENT")) {
    return ROUTE_PATHS.DASHBOARDS.PATIENT;
  }

  return ROUTE_PATHS.ERROR.FORBIDDEN;
}

function DashboardRedirect() {
  const { data: session } = useQuery<AuthSession | null>({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: async () => null,
    enabled: false,
    initialData: null,
  });

  if (!session?.isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.AUTH.LOGIN} replace />;
  }

  const dashboardPath = getDashboardPath(session.roles ?? []);

  return <Navigate to={dashboardPath} replace />;
}

/* -------------------------------------------------------------------------- */
/* ERROR PAGES                                                                */
/* -------------------------------------------------------------------------- */

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  showLogin?: boolean;
}

function ErrorPage({
  code,
  title,
  description,
  showLogin = false,
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-8" />
        </div>

        <p className="mt-7 text-6xl font-bold tracking-tight text-primary">
          {code}
        </p>

        <h1 className="mt-4 text-2xl font-bold">{title}</h1>

        <p className="mt-3 leading-7 text-muted-foreground">{description}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>

          {showLogin ? (
            <Link
              to={ROUTE_PATHS.AUTH.LOGIN}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Login
            </Link>
          ) : (
            <Link
              to={ROUTE_PATHS.PUBLIC.HOME}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Authentication Required"
      description="Please sign in to access this page."
      showLogin
    />
  );
}

function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      title="Access Forbidden"
      description="Your current account does not have permission to access this resource."
    />
  );
}

function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      title="Internal Server Error"
      description="Something went wrong while processing your request. Please try again later."
    />
  );
}

/* -------------------------------------------------------------------------- */
/* ROUTE ERROR BOUNDARY                                                       */
/* -------------------------------------------------------------------------- */

function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected application error occurred.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;

    message =
      typeof error.data === "string"
        ? error.data
        : "The requested page could not be loaded.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <HeartPulse className="size-7" />
      </div>

      <h1 className="text-3xl font-bold">{title}</h1>

      <p className="max-w-lg text-muted-foreground">{message}</p>

      <Link
        to={ROUTE_PATHS.PUBLIC.HOME}
        className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        Return Home
      </Link>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* ROUTE CONFIGURATION                                                        */
/* -------------------------------------------------------------------------- */

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,

    children: [
      /* ------------------------------------------------------------------ */
      /* PUBLIC ROUTES                                                      */
      /* ------------------------------------------------------------------ */

      {
        element: <PublicRoute />,

        children: [
          {
            index: true,
            element: <LandingPage />,
          },
          {
            path: ROUTE_PATHS.PUBLIC.ABOUT.slice(1),
            element: <AboutPage />,
          },
          {
            path: ROUTE_PATHS.PUBLIC.CONTACT.slice(1),
            element: <ContactPage />,
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      /* GUEST-ONLY AUTHENTICATION ROUTES                                   */
      /* ------------------------------------------------------------------ */

      {
        element: <PublicRoute guestOnly />,

        children: [
          {
            path: ROUTE_PATHS.AUTH.LOGIN.slice(1),
            element: (
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            ),
          },
          {
            path: ROUTE_PATHS.AUTH.REGISTER.slice(1),
            element: (
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            ),
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      /* PROTECTED APPLICATION ROUTES                                      */
      /* ------------------------------------------------------------------ */

      {
        element: <ProtectedRoute />,

        children: [
          {
            element: (
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            ),

            children: [
              /* -------------------------------------------------------- */
              /* DEFAULT DASHBOARD REDIRECT                               */
              /* -------------------------------------------------------- */

              {
                path: ROUTE_PATHS.APP.DASHBOARD.slice(1),
                element: <DashboardRedirect />,
              },

              /* -------------------------------------------------------- */
              /* ADMIN DASHBOARD                                          */
              /* -------------------------------------------------------- */

              {
                path: ROUTE_PATHS.DASHBOARDS.ADMIN.slice(1),
                element: (
                  <RoleGuard allowedRoles={["ADMIN", "PLATFORM_ADMIN"]}>
                    <AdminDashboard />
                  </RoleGuard>
                ),
              },

              /* -------------------------------------------------------- */
              /* DOCTOR DASHBOARD                                         */
              /* -------------------------------------------------------- */

              {
                path: ROUTE_PATHS.DASHBOARDS.DOCTOR.slice(1),
                element: (
                  <RoleGuard allowedRoles={["DOCTOR"]}>
                    <DoctorDashboard />
                  </RoleGuard>
                ),
              },

              /* -------------------------------------------------------- */
              /* FAMILY DASHBOARD                                         */
              /* -------------------------------------------------------- */

              {
                path: ROUTE_PATHS.DASHBOARDS.FAMILY.slice(1),
                element: (
                  <RoleGuard allowedRoles={["FAMILY_MEMBER"]}>
                    <FamilyDashboard />
                  </RoleGuard>
                ),
              },

              /* -------------------------------------------------------- */
              /* ORGANISATION DASHBOARD                                   */
              /* -------------------------------------------------------- */

              {
                path: ROUTE_PATHS.DASHBOARDS.ORGANISATION.slice(1),
                element: (
                  <RoleGuard
                    allowedRoles={[
                      "ORGANISATION",
                      "ORGANIZATION",
                      "ORGANISATION_ADMIN",
                      "ORGANIZATION_ADMIN",
                    ]}
                  >
                    <OrganisationDashboard />
                  </RoleGuard>
                ),
              },

              /* -------------------------------------------------------- */
              /* PATIENT DASHBOARD                                        */
              /* -------------------------------------------------------- */

              {
                path: ROUTE_PATHS.DASHBOARDS.PATIENT.slice(1),
                element: (
                  <RoleGuard allowedRoles={["PATIENT"]}>
                    <PatientDashboard />
                  </RoleGuard>
                ),
              },

              /* -------------------------------------------------------- */
              /* VENDOR DASHBOARD                                         */
              /* -------------------------------------------------------- */

              {
                path: ROUTE_PATHS.DASHBOARDS.VENDOR.slice(1),
                element: (
                  <RoleGuard allowedRoles={["VENDOR"]}>
                    <VendorDashboard />
                  </RoleGuard>
                ),
              },

              /* ======================================================== */
              /* ADHERENCE MODULE                                         */
              /* ======================================================== */

              {
                path: ROUTE_PATHS.APP.ADHERENCE.slice(1),
                element: <AdherenceCalendarPage />,
              },
              {
                path: ROUTE_PATHS.APP.ADHERENCE_TODAY.slice(1),
                element: <TodayMedicationPage />,
              },
              {
                path: ROUTE_PATHS.APP.ADHERENCE_SCHEDULE.slice(1),
                element: <MedicationSchedulePage />,
              },
              {
                path: ROUTE_PATHS.APP.ADHERENCE_CALENDAR.slice(1),
                element: <AdherenceCalendarPage />,
              },
              {
                path: ROUTE_PATHS.APP.ADHERENCE_HISTORY.slice(1),
                element: <AdherenceHistoryPage />,
              },
              {
                path: ROUTE_PATHS.APP.ADHERENCE_STATISTICS.slice(1),
                element: <AdherenceStatisticsPage />,
              },

              /* ======================================================== */
              /* AI MODULE                                                */
              /* ======================================================== */

              {
                path: ROUTE_PATHS.APP.AI.slice(1),
                element: <Navigate to={ROUTE_PATHS.APP.AI_INSIGHTS} replace />,
              },
              {
                path: ROUTE_PATHS.APP.AI_INSIGHTS.slice(1),
                element: <AIInsightsPage />,
              },
              {
                path: ROUTE_PATHS.APP.AI_INVENTORY.slice(1),
                element: <InventoryIntelligencePage />,
              },
              {
                path: ROUTE_PATHS.APP.AI_MEDICINE_SCAN.slice(1),
                element: <MedicineScanPage />,
              },
              {
                path: ROUTE_PATHS.APP.AI_PRESCRIPTION_SCAN.slice(1),
                element: <PrescriptionScanPage />,
              },

              /* ======================================================== */
              /* ANALYTICS MODULE                                         */
              /* ======================================================== */

              {
                path: ROUTE_PATHS.APP.ANALYTICS.slice(1),
                element: <OrganisationAnalyticsPage />,
              },
              {
                path: `${ROUTE_PATHS.APP.ANALYTICS.slice(1)}/inventory`,
                element: <InventoryAnalyticsPage />,
              },
              {
                path: `${ROUTE_PATHS.APP.ANALYTICS.slice(1)}/patients`,
                element: <PatientAnalyticsPage />,
              },
            ],
          },
        ],
      },

      /* ------------------------------------------------------------------ */
      /* ERROR ROUTES                                                       */
      /* ------------------------------------------------------------------ */

      {
        path: ROUTE_PATHS.ERROR.UNAUTHORIZED.slice(1),
        element: <UnauthorizedPage />,
      },
      {
        path: ROUTE_PATHS.ERROR.FORBIDDEN.slice(1),
        element: <ForbiddenPage />,
      },
      {
        path: ROUTE_PATHS.ERROR.SERVER_ERROR.slice(1),
        element: <ServerErrorPage />,
      },
      {
        path: ROUTE_PATHS.ERROR.NOT_FOUND.slice(1),
        element: <NotFoundPage />,
      },

      /* ------------------------------------------------------------------ */
      /* 404 FALLBACK                                                       */
      /* ------------------------------------------------------------------ */

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* CREATE ROUTER                                                              */
/* -------------------------------------------------------------------------- */

const router = createBrowserRouter(routes);

export default router;
