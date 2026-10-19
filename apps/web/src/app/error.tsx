'use client';
import { Button } from '@parle/ui';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-28">
      <p className="mb-5 font-mono text-xs tracking-widest text-indigo-300">A LITTLE PAUSE</p>
      <h1 className="text-4xl font-semibold tracking-tight">Let’s try that again.</h1>
      <p className="my-6 text-sm leading-7 text-slate-400">
        Your learning space couldn’t be loaded. Take a moment, then give it another try.
      </p>
      <Button onClick={reset}>Try again ↗</Button>
    </main>
  );
}
