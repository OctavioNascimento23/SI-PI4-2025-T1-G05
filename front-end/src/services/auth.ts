/**
 * Authentication service for managing user tokens
 * Stores tokens in localStorage with key 'token'
 */

const TOKEN_KEY = 'token';

/**
 * Save authentication token to localStorage
 * @param token - JWT token to store
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve authentication token from localStorage
 * @returns The stored token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from localStorage
 */
export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 * @returns true if token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
