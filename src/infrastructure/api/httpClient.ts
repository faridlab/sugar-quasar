import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios';
import { Result } from '@/domain/core/Result';

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Create configured Axios instance
 */
export function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Extract error message from Axios error
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.errors) {
      const firstError = Object.values(axiosError.response.data.errors)[0];
      if (firstError && firstError.length > 0) {
        return firstError[0]!;
      }
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Wrap API call with Result pattern
 */
export async function apiCall<T>(
  fn: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<Result<T>> {
  try {
    const response = await fn();
    return Result.ok(response.data.data);
  } catch (error) {
    return Result.fail(extractErrorMessage(error));
  }
}

/**
 * Wrap paginated API call with Result pattern
 */
export async function paginatedApiCall<T>(
  fn: () => Promise<AxiosResponse<PaginatedApiResponse<T>>>
): Promise<Result<PaginatedApiResponse<T>>> {
  try {
    const response = await fn();
    return Result.ok(response.data);
  } catch (error) {
    return Result.fail(extractErrorMessage(error));
  }
}

// Export singleton instance
export const httpClient = createHttpClient();
