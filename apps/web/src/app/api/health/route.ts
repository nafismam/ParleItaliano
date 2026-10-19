import { NextResponse } from 'next/server';
import { connectDatabase } from '@parle/database';
import { pingCache, serverEnv } from '@parle/platform';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const env = serverEnv();
    const [database, cache] = await Promise.allSettled([
      connectDatabase(env.MONGODB_URI).then((connection) =>
        connection.connection.db!.admin().ping(),
      ),
      pingCache(),
    ]);
    const checks = {
      database: database.status === 'fulfilled',
      cache: cache.status === 'fulfilled' && cache.value,
    };
    const healthy = checks.database && checks.cache;
    return NextResponse.json(
      { status: healthy ? 'ok' : 'degraded', checks },
      { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { status: 'unconfigured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
