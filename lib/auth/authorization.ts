import { redirect } from 'next/navigation';
import type { Session } from './auth';
import { USER_ROLES } from '@/lib/constants';

type SessionUser = Session['user'];

/** Returns true if the user has the ADMIN role. */
export function isAdmin(user: SessionUser): boolean {
  return user.role === USER_ROLES.ADMIN;
}

/** Returns true if the user has the USER role. */
export function isUser(user: SessionUser): boolean {
  return user.role === USER_ROLES.USER || user.role === USER_ROLES.ADMIN;
}

/** Redirects if the user is not authenticated. */
export function assertAuth(
  user: SessionUser | null | undefined,
  redirectTo = '/auth/login',
): asserts user is SessionUser {
  if (!user) redirect(redirectTo);
}

/** Redirects if the user does not have the ADMIN role. */
export function assertAdmin(user: SessionUser, redirectTo = '/') {
  if (!isAdmin(user)) redirect(redirectTo);
}

/** Redirects if the user does not have at least the USER role. */
export function assertUser(user: SessionUser, redirectTo = '/auth/login') {
  if (!isUser(user)) redirect(redirectTo);
}
