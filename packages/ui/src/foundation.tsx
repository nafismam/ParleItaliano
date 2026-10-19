import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  Command,
  Layers3,
  LockKeyhole,
  Sparkles,
} from 'lucide-react';
import { Button } from './button';
export function Foundation({ preview = false }: { preview?: boolean }) {
  return (
    <main className="mx-auto max-w-[1440px] px-6 md:px-14">
      <a className="sr-only focus:not-sr-only" href="#main-content">
        Skip to content
      </a>
      <header className="flex h-24 items-center justify-between border-b border-white/10">
        <a
          href={preview ? './' : '/'}
          aria-label="Parle Italiano home"
          className="flex items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric text-lg font-extrabold italic">
            p.
          </span>
          <span className="text-lg font-bold tracking-tight">
            parle<span className="text-indigo-300">italiano</span>
          </span>
        </a>
        <span className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-slate-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {preview ? 'Frontend preview' : 'Development foundation'}
        </span>
        {!preview && (
          <a href="/sign-in" className="text-sm font-semibold text-slate-300 hover:text-white">
            Sign in <span aria-hidden>↗</span>
          </a>
        )}
      </header>
      <section
        id="main-content"
        className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center"
      >
        <div>
          <p className="mb-7 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-indigo-300">
            <Sparkles size={14} /> A little practice. A whole new language.
          </p>
          <h1 className="max-w-2xl text-6xl font-extrabold leading-[1.06] tracking-[-.065em] md:text-8xl">
            Make Italian
            <br />
            <span className="text-indigo-400">second nature.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-slate-400">
            Less memorizing. More understanding. A focused space to turn Italian grammar into
            everyday confidence.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button asChild>
              <a href={preview ? '#foundation' : '/sign-up'}>
                {preview ? 'Explore the foundation' : 'Create your account'}
                <ArrowUpRight size={17} />
              </a>
            </Button>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Built one thoughtful step at a time
            </span>
          </div>
        </div>
        <div className="mesh relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface p-7 md:p-10">
          <div className="mb-14 flex items-center justify-between">
            <span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo-300">
              The Italian mindset
            </span>
            <Command size={19} className="text-slate-500" />
          </div>
          <p className="font-mono text-xs text-slate-500">A phrase to begin with</p>
          <p
            lang="it"
            className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Un passo
            <br />
            alla <span className="text-indigo-400">volta.</span>
          </p>
          <p className="mt-5 text-sm text-slate-400">One step at a time.</p>
          <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Clarity → Practice → Confidence
            </span>
            <BookOpen size={20} className="text-indigo-300" />
          </div>
        </div>
      </section>
      <section id="foundation" className="pb-20">
        <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-8">
          <h2 className="text-xl font-semibold tracking-tight">A strong foundation.</h2>
          <ArrowDown size={18} className="text-slate-500" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Layers3,
              label: '01 / The approach',
              title: 'Space to focus.',
              detail:
                'A calm space for a clear mind. Bold typography, thoughtful contrast, and room to focus on what you are learning.',
            },
            {
              icon: LockKeyhole,
              label: '02 / Identity',
              title: 'Your progress. Protected.',
              detail: preview
                ? 'Your personal account belongs to the full application. This preview lets you explore the design; sign-in is unavailable here.'
                : 'Email registration, password sign-in, and protected profiles. Google sign-in is available when enabled.',
            },
            {
              icon: BookOpen,
              label: '03 / What comes next',
              title: 'Understanding, unlocked.',
              detail:
                'The next build stage adds teaching notes and five exercises per topic. Lessons and progress tracking are not available yet.',
            },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-white/10 bg-white/[.025] p-7"
            >
              <div className="mb-9 flex items-center justify-between">
                <card.icon size={22} className="text-indigo-300" />
                {card.label.startsWith('01') && <Check size={16} className="text-emerald-400" />}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {card.label}
              </p>
              <h3 className="mb-3 mt-3 text-xl font-semibold tracking-tight">{card.title}</h3>
              <p className="text-sm leading-7 text-slate-400">{card.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="flex flex-wrap justify-between gap-4 border-t border-white/10 py-8 text-xs text-slate-500">
        <p>Parle Italiano · Learn with intention.</p>
        <p>
          {preview
            ? 'Static preview · No accounts or learning data are stored here.'
            : 'Foundation release · Lessons arrive in the next stage.'}
        </p>
      </footer>
    </main>
  );
}
