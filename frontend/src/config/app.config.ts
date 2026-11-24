/**
 * MediContinuum - Application Configuration
 *
 * Central source of truth for global frontend application settings.
 *
 * Responsibilities:
 * - Application identity and branding
 * - Platform information
 * - Localization defaults
 * - UI preferences
 * - Pagination defaults
 * - Date and time preferences
 * - Feature availability
 *
 * Keep API configuration, roles, permissions, and navigation
 * in their respective configuration files.
 */

// --------------------------------------------------
// 1. Application Identity
// --------------------------------------------------

export const APP_CONFIG = {
  name: "MediContinuum",

  fullName: "MediContinuum Healthcare Platform",

  description:
    "A unified healthcare management platform for patients, families, healthcare professionals, and organizations.",

  shortDescription: "Connected Healthcare. Simplified Management.",

  version: "1.0.0",

  environment: import.meta.env.MODE,

  status: "development" as const,

  branding: {
    logo: "/medicontinuum-logo.svg",

    favicon: "/favicon.svg",

    appIcon: "/logo.svg",

    defaultTitle: "MediContinuum",

    titleTemplate: "%s | MediContinuum",
  },
} as const;

// --------------------------------------------------
// 2. Platform Configuration
// --------------------------------------------------

export const PLATFORM_CONFIG = {
  type: "healthcare-saas",

  architecture: "multi-tenant",

  supportedUserTypes: [
    "patient",
    "family-member",
    "doctor",
    "nurse",
    "pharmacist",
    "vendor",
    "organization",
    "admin",
  ],

  defaultLandingPage: "/dashboard",

  publicPages: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
} as const;

// --------------------------------------------------
// 3. Localization Configuration
// --------------------------------------------------

export const LOCALE_CONFIG = {
  defaultLanguage: "en",

  fallbackLanguage: "en",

  supportedLanguages: [
    {
      code: "en",
      name: "English",
      nativeName: "English",
    },
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
    },
  ],

  defaultCountry: "IN",

  defaultCurrency: "INR",

  defaultTimezone: "Asia/Kolkata",

  dateFormat: "dd MMM yyyy",

  timeFormat: "hh:mm a",

  weekStartsOn: 1,
} as const;

// --------------------------------------------------
// 4. UI Configuration
// --------------------------------------------------

export const UI_CONFIG = {
  theme: {
    default: "light" as const,

    allowSystemTheme: true,

    allowUserCustomization: true,
  },

  layout: {
    sidebarDefaultOpen: true,

    sidebarCollapsible: true,

    mobileSidebarDefaultOpen: false,

    headerHeight: 64,

    sidebarWidth: 260,

    sidebarCollapsedWidth: 76,
  },

  animation: {
    enabled: true,

    reducedMotionRespect: true,
  },

  responsive: {
    mobileBreakpoint: 768,

    tabletBreakpoint: 1024,

    desktopBreakpoint: 1280,
  },
} as const;

// --------------------------------------------------
// 5. Data Display Configuration
// --------------------------------------------------

export const DATA_CONFIG = {
  pagination: {
    defaultPage: 0,

    defaultPageSize: 10,

    pageSizeOptions: [10, 20, 50, 100],

    maxPageSize: 100,
  },

  search: {
    debounceDelay: 300,

    minCharacters: 2,
  },

  table: {
    enableSorting: true,

    enableFiltering: true,

    enablePagination: true,

    enableColumnVisibility: true,
  },
} as const;

// --------------------------------------------------
// 6. Date and Time Configuration
// --------------------------------------------------

export const DATETIME_CONFIG = {
  storageTimezone: "UTC",

  defaultDisplayTimezone: "Asia/Kolkata",

  dateFormat: "dd MMM yyyy",

  dateTimeFormat: "dd MMM yyyy, hh:mm a",

  timeFormat: "hh:mm a",

  use24HourFormat: false,

  weekStartsOn: 1,

  respectUserTimezone: true,
} as const;

// --------------------------------------------------
// 7. Feature Flags
// --------------------------------------------------

export const FEATURE_FLAGS = {
  analytics: true,

  aiAssistant: true,

  appointmentScheduling: true,

  medicationAdherence: true,

  familyManagement: true,

  inventoryManagement: true,

  vendorManagement: true,

  procurementManagement: true,

  notifications: true,

  auditLogs: true,

  multiLanguage: true,

  darkMode: true,
} as const;

// --------------------------------------------------
// 8. Application Limits
// --------------------------------------------------

export const APP_LIMITS = {
  upload: {
    maxFileSizeMB: 10,

    maxFilesPerRequest: 5,

    allowedDocumentTypes: ["application/pdf", "image/jpeg", "image/png"],
  },

  profile: {
    maxNameLength: 100,

    maxBioLength: 500,
  },

  password: {
    minLength: 8,

    maxLength: 128,
  },
} as const;

// --------------------------------------------------
// 9. Support and Legal Information
// --------------------------------------------------

export const SUPPORT_CONFIG = {
  supportEmail: "support@medicontinuum.com",

  helpCenterPath: "/help",

  privacyPolicyPath: "/privacy-policy",

  termsPath: "/terms",
} as const;

// --------------------------------------------------
// 10. Central Application Export
// --------------------------------------------------

export const APP_SETTINGS = {
  app: APP_CONFIG,

  platform: PLATFORM_CONFIG,

  locale: LOCALE_CONFIG,

  ui: UI_CONFIG,

  data: DATA_CONFIG,

  datetime: DATETIME_CONFIG,

  features: FEATURE_FLAGS,

  limits: APP_LIMITS,

  support: SUPPORT_CONFIG,
} as const;

export default APP_SETTINGS;
