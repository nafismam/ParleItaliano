import { Redis as Upstash } from '@upstash/redis';
import Redis from 'ioredis';
import { serverEnv } from './env';
const rateScript = `local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]); end; return {n, redis.call('PTTL', KEYS[1])}`;
let local: Redis | undefined;
let remote: Upstash | undefined;
function clients() {
  const env = serverEnv();
  if (env.REDIS_URL) {
    if (!local || local.status === 'end') {
      local = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
        commandTimeout: 4000,
        retryStrategy: () => null,
      });
      local.on('error', () => {});
    }
    return { local };
  }
  remote ??= new Upstash({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
    retry: { retries: 1 },
  });
  return { remote };
}
export async function pingCache(): Promise<boolean> {
  const client = clients();
  return (client.local ? await client.local.ping() : await client.remote!.ping()) === 'PONG';
}
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
  const client = clients();
  const name = `parle:${serverEnv().RATE_LIMIT_NAMESPACE}:limit:${key}`;
  const result = (
    client.local
      ? await client.local.eval(rateScript, 1, name, windowMs)
      : await client.remote!.eval(rateScript, [name], [windowMs])
  ) as [number, number];
  return {
    allowed: result[0] <= limit,
    remaining: Math.max(0, limit - result[0]),
    retryAfter: Math.max(1, Math.ceil(result[1] / 1000)),
  };
}
export async function disconnectCache(): Promise<void> {
  if (local) local.disconnect();
  local = undefined;
  remote = undefined;
}
