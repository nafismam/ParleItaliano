import { NextResponse } from 'next/server';
import { requireUser } from '@/server/authorization';
import { apiHandler } from '@/server/http';
export const GET = apiHandler(async () => {
  await requireUser('admin');
  return NextResponse.json({ access: 'admin' });
});
