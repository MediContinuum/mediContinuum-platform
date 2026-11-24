/* -------------------------------------------------------------------------- */
/* CENTRALIZED APPLICATION ROUTE PATHS                                       */
/* -------------------------------------------------------------------------- */

export const ROUTE_PATHS = {
  /* ---------------------------------------------------------------------- */
  /* PUBLIC ROUTES                                                          */
  /* ---------------------------------------------------------------------- */

  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
  },

  /* ---------------------------------------------------------------------- */
  /* AUTHENTICATION ROUTES                                                  */
  /* ---------------------------------------------------------------------- */

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
  },

  /* ---------------------------------------------------------------------- */
  /* MAIN APPLICATION ROUTES                                                */
  /* ---------------------------------------------------------------------- */

  APP: {
    DASHBOARD: "/dashboard",

    /* Analytics */
    ANALYTICS: "/analytics",
    ANALYTICS_INVENTORY: "/analytics/inventory",
    ANALYTICS_PATIENTS: "/analytics/patients",

    /* Users and profiles */
    USERS: "/users",
    PROFILE: "/profile",

    /* Healthcare users */
    PATIENTS: "/patients",
    DOCTORS: "/doctors",
    FAMILY: "/family",

    /* Appointments and prescriptions */
    APPOINTMENTS: "/appointments",
    PRESCRIPTIONS: "/prescriptions",

    /* Medicines */
    MEDICINES: "/medicines",

    /* Medication adherence */
    ADHERENCE: "/adherence",
    ADHERENCE_TODAY: "/adherence/today",
    ADHERENCE_SCHEDULE: "/adherence/schedule",
    ADHERENCE_CALENDAR: "/adherence/calendar",
    ADHERENCE_HISTORY: "/adherence/history",
    ADHERENCE_STATISTICS: "/adherence/statistics",

    /* Inventory management */
    INVENTORY: "/inventory",
    ORDERS: "/orders",
    PROCUREMENT: "/procurement",
    VENDORS: "/vendors",

    /* Organisation management */
    ORGANISATIONS: "/organisations",

    /* AI features */
    AI: "/ai",
    AI_INSIGHTS: "/ai/insights",
    AI_INVENTORY: "/ai/inventory-intelligence",
    AI_MEDICINE_SCAN: "/ai/medicine-scan",
    AI_PRESCRIPTION_SCAN: "/ai/prescription-scan",

    /* Notifications and system */
    NOTIFICATIONS: "/notifications",
    AUDIT: "/audit",
    HEALTH: "/health",

    /* Settings */
    SETTINGS: "/settings",
  },

  /* ---------------------------------------------------------------------- */
  /* ROLE-SPECIFIC DASHBOARDS                                               */
  /* ---------------------------------------------------------------------- */

  DASHBOARDS: {
    ADMIN: "/dashboard/admin",
    DOCTOR: "/dashboard/doctor",
    FAMILY: "/dashboard/family",
    ORGANISATION: "/dashboard/organisation",
    PATIENT: "/dashboard/patient",
    VENDOR: "/dashboard/vendor",
  },

  /* ---------------------------------------------------------------------- */
  /* ERROR ROUTES                                                           */
  /* ---------------------------------------------------------------------- */

  ERROR: {
    UNAUTHORIZED: "/unauthorized",
    FORBIDDEN: "/forbidden",
    NOT_FOUND: "/not-found",
    SERVER_ERROR: "/server-error",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* ROUTE PATH TYPE                                                           */
/* -------------------------------------------------------------------------- */

export type RoutePath =
  | (typeof ROUTE_PATHS.PUBLIC)[keyof typeof ROUTE_PATHS.PUBLIC]
  | (typeof ROUTE_PATHS.AUTH)[keyof typeof ROUTE_PATHS.AUTH]
  | (typeof ROUTE_PATHS.APP)[keyof typeof ROUTE_PATHS.APP]
  | (typeof ROUTE_PATHS.DASHBOARDS)[keyof typeof ROUTE_PATHS.DASHBOARDS]
  | (typeof ROUTE_PATHS.ERROR)[keyof typeof ROUTE_PATHS.ERROR];
