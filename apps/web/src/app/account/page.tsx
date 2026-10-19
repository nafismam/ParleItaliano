import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import { User } from '@parle/database';
import { SignOut } from '@/components/sign-out';
export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect('/sign-in');
  const user = await User.findById(session.user.id).lean();
  if (!user) redirect('/sign-in');
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <Link className="text-sm text-indigo-300" href="/">
        ← Home
      </Link>
      <p className="mt-12 font-mono text-xs uppercase tracking-widest text-indigo-300">
        Your account
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Ciao, {user.name}.</h1>
      <p className="mt-4 text-slate-400">
        Your next little breakthrough is waiting. Explore your learning path, save a lesson, or make
        a little time for practice.
      </p>
      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ['Level', user.currentLevel],
          ['Experience', `${user.xp} XP`],
          ['Current streak', `${user.streakDays} days`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-surface p-6">
            <dt className="text-xs text-slate-400">{label}</dt>
            <dd className="mt-3 text-2xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-3 rounded-lg bg-electric px-5 py-3 text-sm font-medium"
      >
        Your learning space <span aria-hidden>↗</span>
      </Link>
      <SignOut />
    </main>
  );
}
