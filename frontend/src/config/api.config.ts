/**
 * MediContinuum - API Configuration
 *
 * Central source of truth for backend API connectivity.
 *
 * Responsibilities:
 * - Backend base URL configuration
 * - API version management
 * - Environment variable validation
 * - Request timeout configuration
 * - Authentication endpoint configuration
 * - HTTP client defaults
 * - API retry policies
 *
 * Backend: Spring Boot Modular Monolith
 * Frontend: React + TypeScript + Vite
 */

// --------------------------------------------------
// 1. Imports
// --------------------------------------------------

import { z } from "zod";

// --------------------------------------------------
// 2. Environment Variable Schema
// --------------------------------------------------

const apiEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),

  VITE_API_VERSION: z.string().default("v1"),

  VITE_API_TIMEOUT: z.coerce.number().int().positive().default(30000),
});

// --------------------------------------------------
// 3. Environment Validation
// --------------------------------------------------

const envResult = apiEnvSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,

  VITE_API_VERSION: import.meta.env.VITE_API_VERSION,

  VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
});

if (!envResult.success) {
  console.error(
    "MediContinuum API configuration validation failed:",
    z.treeifyError(envResult.error),
  );

  throw new Error(
    "Invalid API environment configuration. Check your .env file.",
  );
}

const ENV = envResult.data;

// --------------------------------------------------
// 4. API Base Configuration
// --------------------------------------------------

export const API_CONFIG = {
  baseURL: ENV.VITE_API_BASE_URL.replace(/\/+$/, ""),

  version: ENV.VITE_API_VERSION,

  timeout: ENV.VITE_API_TIMEOUT,

  get apiPrefix() {
    return `/api/${this.version}`;
  },

  get baseApiURL() {
    return `${this.baseURL}${this.apiPrefix}`;
  },
} as const;

// --------------------------------------------------
// 5. HTTP Client Configuration
// --------------------------------------------------

export const HTTP_CONFIG = {
  defaultMethod: "GET" as const,

  headers: {
    Accept: "application/json",

    "Content-Type": "application/json",
  },

  withCredentials: true,

  timeout: API_CONFIG.timeout,

  responseType: "json" as const,
} as const;

// --------------------------------------------------
// 6. Authentication API Endpoints
// --------------------------------------------------

export const AUTH_ENDPOINTS = {
  login: "/auth/login",

  register: "/auth/register",

  logout: "/auth/logout",

  refresh: "/auth/refresh",

  me: "/auth/me",

  forgotPassword: "/auth/forgot-password",

  resetPassword: "/auth/reset-password",

  verifyEmail: "/auth/verify-email",

  resendVerification: "/auth/resend-verification",
} as const;

// --------------------------------------------------
// 7. API Retry Configuration
// --------------------------------------------------

export const RETRY_CONFIG = {
  enabled: true,

  maxRetries: 2,

  retryDelay: 1000,

  retryableStatusCodes: [408, 429, 500, 502, 503, 504],

  retryableMethods: ["GET", "HEAD", "OPTIONS"],
} as const;

// --------------------------------------------------
// 8. Request Configuration
// --------------------------------------------------

export const REQUEST_CONFIG = {
  deduplicateRequests: true,

  includeCredentials: true,

  enableRequestLogging: import.meta.env.DEV,

  enableResponseLogging: import.meta.env.DEV,
} as const;

// --------------------------------------------------
// 9. API Response Configuration
// --------------------------------------------------

export const RESPONSE_CONFIG = {
  expectedContentType: "application/json",

  handleUnauthorized: true,

  handleForbidden: true,

  handleServerErrors: true,

  handleNetworkErrors: true,
} as const;

// --------------------------------------------------
// 10. Authentication Configuration
// --------------------------------------------------

export const AUTH_CONFIG = {
  strategy: "cookie" as const,

  useHttpOnlyCookies: true,

  refreshTokenEnabled: true,

  automaticTokenRefresh: true,

  redirectOnUnauthorized: "/login",
} as const;

// --------------------------------------------------
// 11. API Endpoint Groups
// --------------------------------------------------

export const API_ENDPOINTS = {
  auth: AUTH_ENDPOINTS,

  users: {
    base: "/users",
    current: "/users/me",
    search: "/users/search",
  },

  patients: {
    base: "/patients",
    profile: "/patients/profile",
  },

  family: {
    base: "/families",
    members: "/families/members",
  },

  organisations: {
    base: "/organisations",
    members: "/organisations/members",
  },

  doctors: {
    base: "/doctors",
    availability: "/doctors/availability",
  },

  medicines: {
    base: "/medicines",
    search: "/medicines/search",
  },

  prescriptions: {
    base: "/prescriptions",
  },

  adherence: {
    base: "/adherence",
    schedules: "/adherence/schedules",
    history: "/adherence/history",
  },

  inventory: {
    base: "/inventory",
  },

  appointments: {
    base: "/appointments",
    availability: "/appointments/availability",
  },

  notifications: {
    base: "/notifications",
    unread: "/notifications/unread",
  },

  vendors: {
    base: "/vendors",
  },

  procurement: {
    base: "/procurement",
  },

  analytics: {
    base: "/analytics",
  },

  ai: {
    base: "/ai",
  },

  audit: {
    base: "/audit",
  },

  health: {
    base: "/health",
  },
} as const;

// --------------------------------------------------
// 12. API URL Builder
// --------------------------------------------------

export const buildApiUrl = (endpoint: string): string => {
  const normalizedEndpoint = endpoint.replace(/^\/+/, "");

  return `${API_CONFIG.baseApiURL}/${normalizedEndpoint}`;
};

// --------------------------------------------------
// 13. Central API Settings Export
// --------------------------------------------------

export const API_SETTINGS = {
  api: API_CONFIG,

  http: HTTP_CONFIG,

  auth: AUTH_CONFIG,

  retry: RETRY_CONFIG,

  request: REQUEST_CONFIG,

  response: RESPONSE_CONFIG,

  endpoints: API_ENDPOINTS,
} as const;

export default API_SETTINGS;
