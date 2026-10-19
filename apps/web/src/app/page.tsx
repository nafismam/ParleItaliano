import { LearningApp } from '@parle/ui';
import { auth } from '@/server/auth';
import { publicCatalog, learningSnapshot } from '@/server/learning';
export default async function Page() {
  const session = await auth();
  const [catalog, progress] = await Promise.all([
    publicCatalog(),
    session?.user?.id ? learningSnapshot(session.user.id) : Promise.resolve(undefined),
  ]);
  if (!catalog.length)
    return (
      <main className="mx-auto max-w-xl px-6 py-28">
        <h1 className="text-3xl font-semibold">Your learning path is being prepared.</h1>
        <p className="mt-5 text-slate-400">The first lessons will be available here soon.</p>
      </main>
    );
  return (
    <LearningApp
      catalog={catalog}
      mode="server"
      initialProgress={progress}
      learner={
        session?.user?.id
          ? { name: session.user.name || 'Learner', id: session.user.id }
          : undefined
      }
    />
  );
}
