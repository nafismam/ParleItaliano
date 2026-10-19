import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { registrationSchema } from '@parle/contracts';
import { connectDatabase, User } from '@parle/database';
import { serverEnv } from '@parle/platform';
import { apiHandler, assertSameOrigin, clientKey, enforceRateLimit, readJson } from '@/server/http';
export const runtime = 'nodejs';
export const POST = apiHandler(async (request) => {
  assertSameOrigin(request);
  await enforceRateLimit(`register:${clientKey(request)}`, 5, 60 * 60 * 1000);
  const input = registrationSchema.parse(await readJson(request));
  const passwordHash = await hash(input.password, 12);
  await connectDatabase(serverEnv().MONGODB_URI);
  try {
    await User.create({
      email: input.email,
      name: input.name,
      authProvider: 'credentials',
      passwordHash,
    });
  } catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 11000))
      throw error;
  }
  // Same response for an existing email to avoid an account enumeration endpoint.
  return NextResponse.json(
    { message: 'You can now try signing in with your credentials.' },
    { status: 202 },
  );
});
