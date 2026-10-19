import pino from 'pino';
export const logger = pino({
  name: 'parle-italiano',
  level: 'info',
  redact: {
    paths: [
      'password',
      'passwordHash',
      'token',
      'secret',
      'authorization',
      'cookie',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
  serializers: { err: () => ({ message: 'Internal service failure' }) },
});
