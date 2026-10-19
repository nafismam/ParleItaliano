import type { DefaultSession } from 'next-auth';
import type { Role } from '@parle/contracts';
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & { id: string; role: Role };
  }
  interface User {
    role?: Role;
    sessionVersion?: number;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    sessionVersion: number;
  }
}
