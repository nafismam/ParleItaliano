'use client';
import { signOut } from 'next-auth/react';
import { Button } from '@parle/ui';
export function SignOut() {
  return (
    <Button
      className="mt-8 bg-white/10 hover:bg-white/15"
      onClick={() => {
        void signOut({ callbackUrl: '/' });
      }}
    >
      Sign out
    </Button>
  );
}
