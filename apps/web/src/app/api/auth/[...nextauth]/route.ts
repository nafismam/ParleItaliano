import { handlers } from '@/server/auth';
import { apiHandler, assertSameOrigin, clientKey, enforceRateLimit } from '@/server/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = apiHandler(async (request) => {
  await enforceRateLimit(`auth-read:${clientKey(request)}`, 100, 60000);
  return handlers.GET(request);
});
export const POST = apiHandler(async (request) => {
  assertSameOrigin(request);
  await enforceRateLimit(`auth-write:${clientKey(request)}`, 30, 60000);
  return handlers.POST(request);
});
