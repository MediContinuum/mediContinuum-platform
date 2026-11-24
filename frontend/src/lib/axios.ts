import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  timestamp?: string;
  path?: string;
  details?: Record<string, string>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.error("Bad request:", error.response.data);
          break;
        case 401:
          console.error("Unauthorized: Authentication required.");
          break;
        case 403:
          console.error("Forbidden: Access denied.");
          break;
        case 404:
          console.error("Resource not found.");
          break;
        case 422:
          console.error("Validation failed:", error.response.data);
          break;
        case 429:
          console.error("Too many requests.");
          break;
        case 500:
          console.error("Internal server error.");
          break;
        case 502:
        case 503:
        case 504:
          console.error("Backend service unavailable.");
          break;
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error: No response received.");
    } else {
      console.error("Request configuration error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
