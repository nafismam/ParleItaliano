import { createHash, randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { logger, rateLimit, serverEnv } from '@parle/platform';
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}
export function assertSameOrigin(request: Request): void {
  if (request.headers.get('origin') !== serverEnv().APP_ORIGIN)
    throw new ApiError(403, 'ORIGIN_REJECTED', 'Request origin is not allowed');
}
export function clientKey(request: Request): string {
  const forwarded =
    serverEnv().TRUST_PROXY === 'true'
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      : undefined;
  return createHash('sha256')
    .update(forwarded || 'shared-untrusted-network')
    .digest('hex');
}
export async function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  let result;
  try {
    result = await rateLimit(key, limit, windowMs);
  } catch {
    throw new ApiError(503, 'RATE_LIMIT_UNAVAILABLE', 'Authentication is temporarily unavailable');
  }
  if (!result.allowed)
    throw new ApiError(
      429,
      'RATE_LIMITED',
      'Too many attempts. Try again later.',
      result.retryAfter,
    );
}
export async function readJson(request: Request, maxBytes = 8192): Promise<unknown> {
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new ApiError(415, 'JSON_REQUIRED', 'Expected application/json');
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'BODY_REQUIRED', 'Request body is required');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, 'BODY_TOO_LARGE', 'Request body is too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'Malformed JSON');
  }
}
export function apiHandler(
  handler: (request: NextRequest) => Promise<Response>,
): (request: NextRequest) => Promise<Response> {
  return async (request) => {
    const requestId = randomUUID();
    const started = Date.now();
    try {
      const response = await handler(request);
      response.headers.set('X-Request-Id', requestId);
      response.headers.set('Cache-Control', 'no-store');
      logger.info(
        { requestId, status: response.status, durationMs: Date.now() - started },
        'api.request',
      );
      return response;
    } catch (error) {
      const status =
        error instanceof ApiError ? error.status : error instanceof ZodError ? 400 : 500;
      logger[status >= 500 ? 'error' : 'info']({ requestId, status }, 'api.failure');
      return NextResponse.json(
        {
          error: {
            code:
              error instanceof ApiError
                ? error.code
                : error instanceof ZodError
                  ? 'VALIDATION_FAILED'
                  : 'INTERNAL_ERROR',
            message:
              error instanceof ApiError
                ? error.message
                : error instanceof ZodError
                  ? 'Check the submitted fields'
                  : 'Something went wrong',
            requestId,
          },
        },
        {
          status,
          headers: {
            'Cache-Control': 'no-store',
            'X-Request-Id': requestId,
            ...(error instanceof ApiError && error.retryAfter
              ? { 'Retry-After': String(error.retryAfter) }
              : {}),
          },
        },
      );
    }
  };
}
