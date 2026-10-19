import { createHash } from 'node:crypto';
import NextAuth, { AuthError } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { connectDatabase, User } from '@parle/database';
import { loginSchema, roleSchema } from '@parle/contracts';
import { logger, serverEnv } from '@parle/platform';
import { enforceRateLimit } from './http';
// A valid bcrypt hash ensures unknown accounts perform the same expensive comparison.
const dummyHash = '$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const env = serverEnv();
  return {
    secret: env.AUTH_SECRET,
    trustHost: env.NODE_ENV !== 'production' || env.TRUST_PROXY === 'true' || Boolean(env.AUTH_URL),
    session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 },
    pages: { signIn: '/sign-in', error: '/sign-in' },
    providers: [
      ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
        ? [
            Google({
              clientId: env.AUTH_GOOGLE_ID,
              clientSecret: env.AUTH_GOOGLE_SECRET,
              authorization: {
                params: { scope: 'openid email profile', prompt: 'select_account' },
              },
            }),
          ]
        : []),
      Credentials({
        credentials: { email: {}, password: {} },
        async authorize(credentials) {
          const input = loginSchema.safeParse(credentials);
          if (!input.success) return null;
          await enforceRateLimit(
            `login:${createHash('sha256').update(input.data.email).digest('hex')}`,
            5,
            15 * 60 * 1000,
          );
          await connectDatabase(env.MONGODB_URI);
          const user = await User.findOne({ email: input.data.email }).select('+passwordHash');
          const valid = await compare(input.data.password, user?.passwordHash ?? dummyHash);
          if (!user || !valid || user.disabledAt || user.authProvider !== 'credentials')
            return null;
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatarUrl ?? null,
            role: user.role,
            sessionVersion: user.sessionVersion,
          };
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }) {
        if (account?.provider !== 'google') return true;
        if (
          !profile ||
          profile.email_verified !== true ||
          typeof profile.sub !== 'string' ||
          !user.email
        )
          return false;
        await connectDatabase(env.MONGODB_URI);
        const existing = await User.findOne({ email: user.email.toLowerCase() }).select(
          '+googleSubject',
        );
        // Never implicitly link a Google identity to an existing password account.
        if (
          existing &&
          (existing.authProvider !== 'google' ||
            existing.googleSubject !== profile.sub ||
            existing.disabledAt)
        )
          return false;
        if (!existing) {
          try {
            await User.create({
              email: user.email.toLowerCase(),
              name: user.name?.slice(0, 80) || 'Italian learner',
              avatarUrl: user.image ?? null,
              authProvider: 'google',
              googleSubject: profile.sub,
            });
          } catch {
            return false;
          }
        }
        return true;
      },
      async jwt({ token, user, account }) {
        await connectDatabase(env.MONGODB_URI);
        const identity = user?.id ?? token.sub;
        if (!identity) return null;
        const record =
          account?.provider === 'google' && user?.email
            ? await User.findOne({ email: user.email.toLowerCase() })
            : await User.findById(identity);
        if (
          !record ||
          record.disabledAt ||
          (!user && token.sessionVersion !== record.sessionVersion)
        )
          return null;
        token.sub = record._id.toString();
        token.role = record.role;
        token.sessionVersion = record.sessionVersion;
        return token;
      },
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
          session.user.role = roleSchema.parse(token.role);
        }
        return session;
      },
      async redirect({ url }) {
        if (url.startsWith('/') && !url.startsWith('//')) return `${env.APP_ORIGIN}${url}`;
        return new URL(url).origin === env.APP_ORIGIN ? url : env.APP_ORIGIN;
      },
    },
    logger: {
      error(error) {
        logger.error(
          { event: 'auth.error', type: error instanceof AuthError ? error.type : 'Unknown' },
          'Authentication failure',
        );
      },
      warn() {},
      debug() {},
    },
  };
});
