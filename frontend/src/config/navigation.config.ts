/**
 * MediContinuum - Navigation Configuration
 *
 * Central source of truth for application navigation.
 *
 * Responsibilities:
 * - Public navigation
 * - Authenticated navigation
 * - Role-based navigation visibility
 * - Nested sidebar navigation
 * - Navigation icons
 * - Breadcrumb labels
 * - Feature-based navigation visibility
 *
 * Framework:
 * React + TypeScript + React Router v7
 *
 * Icons:
 * Lucide React
 *
 * IMPORTANT:
 * Navigation visibility is NOT authorization.
 * Backend authorization remains the final authority.
 */

// --------------------------------------------------
// 1. Imports
// --------------------------------------------------

import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Users,
  UserRound,
  UsersRound,
  Building2,
  Stethoscope,
  HeartPulse,
  Pill,
  ClipboardList,
  CalendarDays,
  Clock,
  Package,
  ShoppingCart,
  Store,
  Bell,
  BarChart3,
  BrainCircuit,
  FileText,
  ShieldCheck,
  Settings,
  Activity,
  LifeBuoy,
  LogIn,
  UserPlus,
  KeyRound,
  Home,
} from "lucide-react";

import { FEATURE_FLAGS } from "@/config/app.config";

// --------------------------------------------------
// 2. Navigation Types
// --------------------------------------------------

export type NavigationRole =
  | "PATIENT"
  | "FAMILY_MEMBER"
  | "DOCTOR"
  | "NURSE"
  | "PHARMACIST"
  | "VENDOR"
  | "ORGANIZATION_ADMIN"
  | "SUPER_ADMIN";

export type NavigationItem = {
  id: string;

  label: string;

  path?: string;

  icon?: LucideIcon;

  description?: string;

  roles?: readonly NavigationRole[];

  children?: readonly NavigationItem[];

  featureFlag?: keyof typeof FEATURE_FLAGS;

  exact?: boolean;

  disabled?: boolean;

  external?: boolean;
};

// --------------------------------------------------
// 3. Public Navigation
// --------------------------------------------------

export const PUBLIC_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    icon: Home,
    exact: true,
  },

  {
    id: "login",
    label: "Login",
    path: "/login",
    icon: LogIn,
    exact: true,
  },

  {
    id: "register",
    label: "Create Account",
    path: "/register",
    icon: UserPlus,
    exact: true,
  },

  {
    id: "forgot-password",
    label: "Forgot Password",
    path: "/forgot-password",
    icon: KeyRound,
    exact: true,
  },
] as const;

// --------------------------------------------------
// 4. Common Authenticated Navigation
// --------------------------------------------------

const COMMON_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    featureFlag: "notifications",
  },

  {
    id: "profile",
    label: "My Profile",
    path: "/profile",
    icon: UserRound,
  },

  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },

  {
    id: "help",
    label: "Help & Support",
    path: "/help",
    icon: LifeBuoy,
  },
] as const;

// --------------------------------------------------
// 5. Patient Navigation
// --------------------------------------------------

export const PATIENT_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "my-health",
    label: "My Health",
    icon: HeartPulse,
    children: [
      {
        id: "patient-profile",
        label: "Health Profile",
        path: "/patients/profile",
        icon: UserRound,
      },
      {
        id: "prescriptions",
        label: "Prescriptions",
        path: "/prescriptions",
        icon: ClipboardList,
      },
      {
        id: "medicines",
        label: "My Medicines",
        path: "/medicines",
        icon: Pill,
      },
      {
        id: "adherence",
        label: "Medication Adherence",
        path: "/adherence",
        icon: Activity,
        featureFlag: "medicationAdherence",
      },
    ],
  },

  {
    id: "appointments",
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    featureFlag: "appointmentScheduling",
  },

  {
    id: "family",
    label: "My Family",
    path: "/family",
    icon: UsersRound,
    featureFlag: "familyManagement",
  },

  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    featureFlag: "notifications",
  },

  {
    id: "analytics",
    label: "Health Analytics",
    path: "/analytics",
    icon: BarChart3,
    featureFlag: "analytics",
  },

  ...COMMON_NAVIGATION.filter(
    (item) => !["dashboard", "notifications"].includes(item.id),
  ),
] as const;

// --------------------------------------------------
// 6. Family Member Navigation
// --------------------------------------------------

export const FAMILY_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "family-members",
    label: "Family Members",
    path: "/family/members",
    icon: UsersRound,
    featureFlag: "familyManagement",
  },

  {
    id: "health-overview",
    label: "Health Overview",
    path: "/family/health",
    icon: HeartPulse,
    featureFlag: "familyManagement",
  },

  {
    id: "medication",
    label: "Medication Tracking",
    path: "/family/medication",
    icon: Pill,
    featureFlag: "medicationAdherence",
  },

  {
    id: "appointments",
    label: "Appointments",
    path: "/family/appointments",
    icon: CalendarDays,
    featureFlag: "appointmentScheduling",
  },

  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    featureFlag: "notifications",
  },

  ...COMMON_NAVIGATION.filter(
    (item) => !["dashboard", "notifications"].includes(item.id),
  ),
] as const;

// --------------------------------------------------
// 7. Doctor Navigation
// --------------------------------------------------

export const DOCTOR_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "patients",
    label: "Patients",
    path: "/patients",
    icon: Users,
  },

  {
    id: "appointments",
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    featureFlag: "appointmentScheduling",
  },

  {
    id: "schedule",
    label: "My Schedule",
    path: "/schedule",
    icon: Clock,
  },

  {
    id: "prescriptions",
    label: "Prescriptions",
    path: "/prescriptions",
    icon: ClipboardList,
  },

  {
    id: "clinical-records",
    label: "Clinical Records",
    path: "/clinical-records",
    icon: FileText,
  },

  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    featureFlag: "analytics",
  },

  ...COMMON_NAVIGATION.filter(
    (item) => !["dashboard", "notifications"].includes(item.id),
  ),
] as const;

// --------------------------------------------------
// 8. Nurse Navigation
// --------------------------------------------------

export const NURSE_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "patients",
    label: "Assigned Patients",
    path: "/patients",
    icon: Users,
  },

  {
    id: "appointments",
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    featureFlag: "appointmentScheduling",
  },

  {
    id: "medication",
    label: "Medication Management",
    path: "/medication",
    icon: Pill,
  },

  {
    id: "adherence",
    label: "Adherence Tracking",
    path: "/adherence",
    icon: Activity,
    featureFlag: "medicationAdherence",
  },

  {
    id: "clinical-records",
    label: "Clinical Records",
    path: "/clinical-records",
    icon: FileText,
  },

  ...COMMON_NAVIGATION.filter(
    (item) => !["dashboard", "notifications"].includes(item.id),
  ),
] as const;

// --------------------------------------------------
// 9. Pharmacist Navigation
// --------------------------------------------------

export const PHARMACIST_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "medicines",
    label: "Medicine Catalogue",
    path: "/medicines",
    icon: Pill,
  },

  {
    id: "prescriptions",
    label: "Prescriptions",
    path: "/prescriptions",
    icon: ClipboardList,
  },

  {
    id: "inventory",
    label: "Inventory",
    path: "/inventory",
    icon: Package,
    featureFlag: "inventoryManagement",
  },

  {
    id: "procurement",
    label: "Procurement",
    path: "/procurement",
    icon: ShoppingCart,
    featureFlag: "procurementManagement",
  },

  {
    id: "vendors",
    label: "Vendors",
    path: "/vendors",
    icon: Store,
    featureFlag: "vendorManagement",
  },

  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    featureFlag: "analytics",
  },

  ...COMMON_NAVIGATION.filter(
    (item) => !["dashboard", "notifications"].includes(item.id),
  ),
] as const;

// --------------------------------------------------
// 10. Vendor Navigation
// --------------------------------------------------

export const VENDOR_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "vendor-profile",
    label: "Vendor Profile",
    path: "/vendor/profile",
    icon: Store,
  },

  {
    id: "orders",
    label: "Orders",
    path: "/vendor/orders",
    icon: ShoppingCart,
  },

  {
    id: "medicines",
    label: "Medicine Catalogue",
    path: "/vendor/medicines",
    icon: Pill,
  },

  {
    id: "inventory",
    label: "Stock Management",
    path: "/vendor/inventory",
    icon: Package,
    featureFlag: "inventoryManagement",
  },

  {
    id: "analytics",
    label: "Business Analytics",
    path: "/vendor/analytics",
    icon: BarChart3,
    featureFlag: "analytics",
  },

  ...COMMON_NAVIGATION.filter(
    (item) => !["dashboard", "notifications"].includes(item.id),
  ),
] as const;

// --------------------------------------------------
// 11. Organization Admin Navigation
// --------------------------------------------------

export const ORGANIZATION_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "organization",
    label: "Organization",
    icon: Building2,
    children: [
      {
        id: "organization-profile",
        label: "Organization Profile",
        path: "/organization/profile",
        icon: Building2,
      },
      {
        id: "organization-members",
        label: "Members",
        path: "/organization/members",
        icon: Users,
      },
      {
        id: "organization-doctors",
        label: "Doctors",
        path: "/organization/doctors",
        icon: Stethoscope,
      },
      {
        id: "organization-patients",
        label: "Patients",
        path: "/organization/patients",
        icon: UserRound,
      },
    ],
  },

  {
    id: "appointments",
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    featureFlag: "appointmentScheduling",
  },

  {
    id: "inventory",
    label: "Inventory",
    path: "/inventory",
    icon: Package,
    featureFlag: "inventoryManagement",
  },

  {
    id: "procurement",
    label: "Procurement",
    path: "/procurement",
    icon: ShoppingCart,
    featureFlag: "procurementManagement",
  },

  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    featureFlag: "analytics",
  },

  {
    id: "audit",
    label: "Audit Logs",
    path: "/audit",
    icon: ShieldCheck,
    featureFlag: "auditLogs",
  },

  ...COMMON_NAVIGATION.filter(
    (item) => !["dashboard", "notifications"].includes(item.id),
  ),
] as const;

// --------------------------------------------------
// 12. Super Admin Navigation
// --------------------------------------------------

export const ADMIN_NAVIGATION: readonly NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },

  {
    id: "users",
    label: "User Management",
    path: "/admin/users",
    icon: Users,
  },

  {
    id: "organisations",
    label: "Organizations",
    path: "/admin/organisations",
    icon: Building2,
  },

  {
    id: "doctors",
    label: "Doctors",
    path: "/admin/doctors",
    icon: Stethoscope,
  },

  {
    id: "vendors",
    label: "Vendor Management",
    path: "/admin/vendors",
    icon: Store,
  },

  {
    id: "analytics",
    label: "Platform Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
    featureFlag: "analytics",
  },

  {
    id: "ai",
    label: "AI Management",
    path: "/admin/ai",
    icon: BrainCircuit,
    featureFlag: "aiAssistant",
  },

  {
    id: "audit",
    label: "Audit Logs",
    path: "/admin/audit",
    icon: ShieldCheck,
    featureFlag: "auditLogs",
  },

  {
    id: "system",
    label: "System Health",
    path: "/admin/system-health",
    icon: Activity,
  },

  {
    id: "settings",
    label: "Platform Settings",
    path: "/admin/settings",
    icon: Settings,
  },
] as const;

// --------------------------------------------------
// 13. Role-Based Navigation Registry
// --------------------------------------------------

export const ROLE_NAVIGATION = {
  PATIENT: PATIENT_NAVIGATION,

  FAMILY_MEMBER: FAMILY_NAVIGATION,

  DOCTOR: DOCTOR_NAVIGATION,

  NURSE: NURSE_NAVIGATION,

  PHARMACIST: PHARMACIST_NAVIGATION,

  VENDOR: VENDOR_NAVIGATION,

  ORGANIZATION_ADMIN: ORGANIZATION_NAVIGATION,

  SUPER_ADMIN: ADMIN_NAVIGATION,
} as const satisfies Record<NavigationRole, readonly NavigationItem[]>;

// --------------------------------------------------
// 14. Breadcrumb Configuration
// --------------------------------------------------

export const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Dashboard",

  patients: "Patients",

  family: "Family",

  medicines: "Medicines",

  prescriptions: "Prescriptions",

  adherence: "Medication Adherence",

  appointments: "Appointments",

  doctors: "Doctors",

  organisations: "Organizations",

  organization: "Organization",

  inventory: "Inventory",

  vendors: "Vendors",

  procurement: "Procurement",

  notifications: "Notifications",

  analytics: "Analytics",

  ai: "AI Assistant",

  audit: "Audit Logs",

  settings: "Settings",

  profile: "My Profile",

  admin: "Administration",
};

// --------------------------------------------------
// 15. Navigation Utilities
// --------------------------------------------------

/**
 * Returns navigation items for a specific role.
 *
 * Filters disabled items and feature-flagged items.
 * Backend permissions must still be checked separately.
 */

export function getNavigationByRole(role: NavigationRole): NavigationItem[] {
  const navigation = ROLE_NAVIGATION[role];

  return filterNavigation(navigation);
}

/**
 * Recursively filters navigation items.
 */

function filterNavigation(items: readonly NavigationItem[]): NavigationItem[] {
  return items
    .filter((item) => {
      if (item.disabled) return false;

      if (item.featureFlag && !FEATURE_FLAGS[item.featureFlag]) {
        return false;
      }

      return true;
    })
    .map((item) => ({
      ...item,

      children: item.children ? filterNavigation(item.children) : undefined,
    }))
    .filter((item) => Boolean(item.path) || Boolean(item.children?.length));
}

/**
 * Checks whether a navigation item belongs
 * to a specific role.
 */

export function hasNavigationAccess(
  item: NavigationItem,
  role: NavigationRole,
): boolean {
  if (!item.roles) return true;

  return item.roles.includes(role);
}

/**
 * Returns breadcrumb label for a route segment.
 */

export function getBreadcrumbLabel(segment: string): string {
  return (
    BREADCRUMB_LABELS[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

// --------------------------------------------------
// 16. Default Export
// --------------------------------------------------

const NAVIGATION_CONFIG = {
  public: PUBLIC_NAVIGATION,

  roles: ROLE_NAVIGATION,

  breadcrumbs: BREADCRUMB_LABELS,
} as const;

export default NAVIGATION_CONFIG;
