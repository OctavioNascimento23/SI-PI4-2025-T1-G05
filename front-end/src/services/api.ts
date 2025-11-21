/**
 * Centralized HTTP client for API communication
 * Uses axios with automatic Bearer token injection
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, setToken as saveToken, clearToken as removeToken } from './auth';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for basic error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status } = error.response;
      
      // Handle unauthorized errors
      if (status === 401) {
        removeToken();
        // Optionally redirect to login
        // window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Perform GET request
 * @param url - Endpoint URL
 * @param config - Optional axios config
 * @returns Response data
 */
export const get = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url, config);
  return response.data;
};

/**
 * Perform POST request
 * @param url - Endpoint URL
 * @param data - Request body
 * @param config - Optional axios config
 * @returns Response data
 */
export const post = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data, config);
  return response.data;
};

/**
 * Perform PUT request
 * @param url - Endpoint URL
 * @param data - Request body
 * @param config - Optional axios config
 * @returns Response data
 */
export const put = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.put(url, data, config);
  return response.data;
};

/**
 * Perform DELETE request
 * @param url - Endpoint URL
 * @param config - Optional axios config
 * @returns Response data
 */
export const del = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
};

/**
 * Save authentication token
 * @param token - JWT token to store
 * Note: Token will be automatically injected in requests via interceptor
 */
export const setToken = (token: string): void => {
  saveToken(token);
};

/**
 * Clear authentication token
 * Note: Requests will automatically stop including Authorization header
 */
export const clearToken = (): void => {
  removeToken();
};

// Export the axios instance for advanced use cases
export default apiClient;
