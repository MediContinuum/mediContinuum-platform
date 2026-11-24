export type ApiErrorCode = string;

export interface ApiError {
  code?: ApiErrorCode;
  message: string;
  details?: unknown;
  timestamp?: string;
  path?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string | string[];
}

export interface ApiValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  status?: number;
  timestamp?: string;
  path?: string;
  validationErrors?: ApiValidationError[];
}
