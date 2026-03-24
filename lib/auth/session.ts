import { redirect } from 'next/navigation';
import { auth } from './auth';
import { headers } from 'next/headers';
import { assertAdmin } from './authorization';

/**
 * Get the current session on the server.
 * Returns null if the user is not authenticated.
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Get the current session and redirect to login if not authenticated.
 * Use in Server Components / Server Actions that require auth.
 */
export async function requireSession() {
  const session = await getServerSession();
  if (!session) redirect('/auth/login');
  return session;
}

/**
 * Require the current user to be authenticated and have the ADMIN role.
 * Redirects to /auth/login if unauthenticated, or / if not an admin.
 */
export async function requireAdmin() {
  const session = await getServerSession();
  if (!session) redirect('/auth/login');
  assertAdmin(session.user);
  return session;
}
