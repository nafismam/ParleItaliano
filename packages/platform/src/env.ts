import { z } from 'zod';
const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_ORIGIN: z.url().refine((value) => {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) && url.origin === value;
    }, 'Use an HTTP(S) origin without a trailing slash'),
    AUTH_SECRET: z.string().min(32),
    AUTH_URL: z.url().optional(),
    MONGODB_URI: z.string().regex(/^mongodb(?:\+srv)?:\/\//),
    REDIS_URL: z
      .string()
      .regex(/^rediss?:\/\//)
      .optional(),
    UPSTASH_REDIS_REST_URL: z.url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().min(1).optional(),
    AUTH_GOOGLE_SECRET: z.string().min(1).optional(),
    TRUST_PROXY: z.enum(['true', 'false']).default('false'),
    RATE_LIMIT_NAMESPACE: z
      .string()
      .regex(/^[a-zA-Z0-9-]{1,80}$/)
      .default('app'),
  })
  .superRefine((value, ctx) => {
    if (!value.REDIS_URL && !(value.UPSTASH_REDIS_REST_URL && value.UPSTASH_REDIS_REST_TOKEN))
      ctx.addIssue({
        code: 'custom',
        message: 'Configure Redis or both Upstash REST bindings',
        path: ['REDIS_URL'],
      });
    if (Boolean(value.UPSTASH_REDIS_REST_URL) !== Boolean(value.UPSTASH_REDIS_REST_TOKEN))
      ctx.addIssue({
        code: 'custom',
        message: 'Upstash bindings must be provided together',
        path: ['UPSTASH_REDIS_REST_URL'],
      });
    if (Boolean(value.AUTH_GOOGLE_ID) !== Boolean(value.AUTH_GOOGLE_SECRET))
      ctx.addIssue({
        code: 'custom',
        message: 'Google OAuth bindings must be provided together',
        path: ['AUTH_GOOGLE_ID'],
      });
    if (
      value.NODE_ENV === 'production' &&
      !value.APP_ORIGIN.startsWith('https://') &&
      !['localhost', '127.0.0.1'].includes(new URL(value.APP_ORIGIN).hostname)
    )
      ctx.addIssue({ code: 'custom', message: 'Production requires HTTPS', path: ['APP_ORIGIN'] });
    if (value.AUTH_URL && new URL(value.AUTH_URL).origin !== value.APP_ORIGIN)
      ctx.addIssue({
        code: 'custom',
        message: 'Auth URL must match APP_ORIGIN',
        path: ['AUTH_URL'],
      });
  });
export type ServerEnvironment = z.infer<typeof schema>;
let cached: ServerEnvironment | undefined;
export function serverEnv(): ServerEnvironment {
  if (cached) return cached;
  const result = schema.safeParse(
    Object.fromEntries(
      Object.entries(process.env).map(([key, value]) => [key, value === '' ? undefined : value]),
    ),
  );
  if (!result.success)
    throw new Error(
      `Invalid server configuration: ${result.error.issues.map((issue) => issue.path.join('.') + ': ' + issue.message).join('; ')}`,
    );
  cached = result.data;
  return cached;
}
