import { NextResponse } from 'next/server';
import { apiHandler } from '@/server/http';
import { publicCatalog } from '@/server/learning';
export const runtime = 'nodejs';
export const GET = apiHandler(async () =>
  NextResponse.json(
    { topics: await publicCatalog() },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=60' } },
  ),
);
