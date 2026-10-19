import type { Role } from '@parle/contracts';
import { auth } from './auth';
import { ApiError } from './http';
export async function requireUser(role?: Role) {
  const session = await auth();
  if (!session?.user?.id) throw new ApiError(401, 'UNAUTHENTICATED', 'Sign in to continue');
  if (role && session.user.role !== role)
    throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this resource');
  return session.user;
}
