/**
 * An array of routes that are accessible to the public (no authentication required).
 * @types {string[]}
 */

export const publicRoutes = ['/'];

/**
 * An array of routes that require user authentication.
 * These routes do not require authentication.
 * @types {string[]}
 */

export const authRoutes = ['/auth/login', '/auth/register'];

/**
 * The prefix for all authentication-related API routes.
 * Routes starting with this prefix are use for authentication operations.
 * @types {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after a successful login.
 * @types {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/';
