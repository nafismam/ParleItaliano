import { NextResponse } from 'next/server';
import { apiHandler } from '@/server/http';
import { requireUser } from '@/server/authorization';
import { learningSnapshot } from '@/server/learning';
export const runtime = 'nodejs';
export const GET = apiHandler(async () => {
  const user = await requireUser();
  return NextResponse.json(await learningSnapshot(user.id));
});
