'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@parle/ui';
export function AuthForm({
  mode,
  googleEnabled,
}: {
  mode: 'sign-in' | 'sign-up';
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    try {
      if (mode === 'sign-up') {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: data.get('name') }),
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error?.message || 'Registration is temporarily unavailable');
        setMessage('You can now sign in with your credentials.');
        router.push('/sign-in?registered=1');
      } else {
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.error)
          throw new Error('Unable to sign in. Check your details or try again later.');
        router.push('/account');
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Please try again later.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <Link href="/" className="text-sm font-semibold text-indigo-300">
        ← Parle Italiano
      </Link>
      <p className="mt-12 font-mono text-xs uppercase tracking-widest text-indigo-300">
        Your Italian era
      </p>
      <h1 className="mb-3 mt-4 text-4xl font-bold tracking-tight">
        {mode === 'sign-in' ? 'Bentornato.' : 'Iniziamo.'}
      </h1>
      <p className="mb-8 text-sm leading-7 text-slate-400">
        {mode === 'sign-in'
          ? 'Welcome back. Sign in to your account.'
          : 'A new language starts with one small step.'}
      </p>
      {googleEnabled && (
        <>
          <Button
            type="button"
            disabled={busy}
            className="mb-6 w-full border border-white/15 bg-white/5 hover:bg-white/10"
            onClick={() => {
              void signIn('google', { callbackUrl: '/account' });
            }}
          >
            Continue with Google
          </Button>
          <p className="mb-6 text-center text-xs text-slate-500">or continue with email</p>
        </>
      )}
      <form onSubmit={submit} className="space-y-5">
        {mode === 'sign-up' && (
          <label className="block text-sm">
            Name
            <input
              required
              name="name"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              className="mt-2 w-full rounded-xl border border-white/15 bg-surface p-3"
            />
          </label>
        )}
        <label className="block text-sm">
          Email
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            className="mt-2 w-full rounded-xl border border-white/15 bg-surface p-3"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            required
            name="password"
            type="password"
            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            minLength={mode === 'sign-up' ? 12 : 1}
            maxLength={72}
            aria-describedby={mode === 'sign-up' ? 'password-help' : undefined}
            className="mt-2 w-full rounded-xl border border-white/15 bg-surface p-3"
          />
        </label>
        {mode === 'sign-up' && (
          <p id="password-help" className="text-xs text-slate-400">
            Use at least 12 characters and at most 72 UTF-8 bytes.
          </p>
        )}
        <p role="status" aria-live="polite" className="text-sm text-indigo-200">
          {message}
        </p>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'One moment…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-400">
        {mode === 'sign-in' ? 'New here?' : 'Already have an account?'}{' '}
        <a
          className="text-indigo-300 underline underline-offset-4"
          href={mode === 'sign-in' ? '/sign-up' : '/sign-in'}
        >
          {mode === 'sign-in' ? 'Create an account' : 'Sign in'}
        </a>
      </p>
    </div>
  );
}
