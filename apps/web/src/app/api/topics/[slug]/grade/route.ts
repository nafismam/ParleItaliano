import { NextResponse } from 'next/server';
import { submissionSchema } from '@parle/contracts';
import {
  apiHandler,
  ApiError,
  assertSameOrigin,
  clientKey,
  enforceRateLimit,
  readJson,
} from '@/server/http';
import { auth } from '@/server/auth';
import { gradeExercise } from '@/server/learning';
export const runtime = 'nodejs';
export const POST = apiHandler(async (request) => {
  assertSameOrigin(request);
  const slug = request.nextUrl.pathname.split('/').at(-2);
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100)
    throw new ApiError(400, 'INVALID_TOPIC', 'Choose a valid lesson');
  const session = await auth();
  await enforceRateLimit(`grade:${session?.user?.id || clientKey(request)}`, 120, 60000);
  const submission = submissionSchema.parse(await readJson(request));
  return NextResponse.json(await gradeExercise({ slug, ...submission, userId: session?.user?.id }));
});
