import axios, { AxiosError } from 'axios';

/**
 * Axios instance configured for the Task Manager API
 */
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API error response structure
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * API success response structure
 */
export interface ApiSuccess<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

/**
 * Pagination response structure
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Extract error message from API error
 * @param error - Axios error object
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An error occurred';
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - only redirect if on protected /app routes
    if (error.response?.status === 401) {
      if (window.location.pathname.startsWith('/app')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
