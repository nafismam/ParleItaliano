'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Lenis from 'lenis';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Blocks,
  BookOpen,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Compass,
  Flame,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  List,
  Map,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  Trophy,
  UserRound,
  Users,
  X,
  Zap,
  Link2,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import {
  normalizeAnswer,
  type GradeResult,
  type LearningSnapshot,
  type LearningTopic,
} from '@parle/contracts';
import { learningPaths, orderedSlugs, topicDescriptions } from '@parle/content/roadmap';
import { BrandMark, LanguageArt } from './language-art';
import { Notes, SpeakButton } from './notes';
import { ExercisePlayer, type GradeHandler } from './exercise-player';
import { emptySnapshot, useLearningStore, utcDay } from './learning-store';

type View = 'overview' | 'path' | 'practice' | 'notebook' | 'progress' | 'lesson';
type Route = { view: View; slug?: string | undefined };
type Path = (typeof learningPaths)[number];
type AppProps = {
  catalog: LearningTopic[];
  mode: 'preview' | 'server';
  initialProgress?: LearningSnapshot | undefined;
  learner?: { name: string; id: string } | undefined;
  answerKey?: Record<string, { correctAnswer: string; explanation: string }> | undefined;
};
const pathIcons = {
  blocks: Blocks,
  people: Users,
  sun: Sun,
  clock: Clock3,
  link: Link2,
  chat: MessageCircle,
  calendar: CalendarDays,
  compass: Compass,
};
const navItems = [
  { view: 'overview' as const, title: 'Overview', icon: LayoutDashboard },
  { view: 'path' as const, title: 'Learning path', icon: Map },
  { view: 'practice' as const, title: 'Practice', icon: Zap },
  { view: 'notebook' as const, title: 'My notebook', icon: Bookmark },
  { view: 'progress' as const, title: 'Your progress', icon: BarChart3 },
];
function parseRoute(): Route {
  const [view, slug] = window.location.hash.replace(/^#\/?/, '').split('/');
  if (['overview', 'path', 'practice', 'notebook', 'progress', 'lesson'].includes(view || ''))
    return { view: view as View, slug };
  return { view: 'overview' };
}
function pathFor(slug: string): Path | undefined {
  return learningPaths.find((path) => (path.slugs as readonly string[]).includes(slug));
}
function mastered(snapshot: LearningSnapshot, slug: string) {
  return snapshot.topics[slug]?.correctExerciseIds.length || 0;
}
function completedCount(snapshot: LearningSnapshot) {
  return Object.values(snapshot.topics).filter((topic) => Boolean(topic.completedAt)).length;
}
function shownStreak(snapshot: LearningSnapshot) {
  if (!snapshot.lastActiveDate) return 0;
  const day = utcDay(snapshot.lastActiveDate);
  return day === utcDay() || day === utcDay(new Date(Date.now() - 86400000))
    ? snapshot.streakDays
    : 0;
}

export function LearningApp(props: AppProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30000, retry: 1, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <MotionConfig reducedMotion="user">
        <LearningWorkspace {...props} />
      </MotionConfig>
    </QueryClientProvider>
  );
}

function LearningWorkspace({ catalog, mode, learner, answerKey, initialProgress }: AppProps) {
  const [route, setRoute] = useState<Route>({ view: 'overview' });
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const reducedMotion = useReducedMotion();
  const lenis = useRef<Lenis | null>(null);
  const local = useLearningStore();
  const client = useQueryClient();
  const account = mode === 'server' && Boolean(learner);
  const progress = useQuery<LearningSnapshot>({
    queryKey: ['progress'],
    ...(initialProgress ? { initialData: initialProgress } : {}),
    enabled: account,
    queryFn: async () => {
      const response = await fetch('/api/progress');
      if (!response.ok) throw new Error('Could not load your learning progress.');
      return response.json() as Promise<LearningSnapshot>;
    },
  });
  const snapshot = account ? progress.data || emptySnapshot : local.snapshot;
  const sorted = [...catalog].sort(
    (a, b) => orderedSlugs.indexOf(a.slug) - orderedSlugs.indexOf(b.slug),
  );
  const nextTopic = sorted.find((topic) => !snapshot.topics[topic.slug]?.completedAt) || sorted[0]!;
  const currentTopic = catalog.find((topic) => topic.slug === route.slug);

  useEffect(() => {
    void useLearningStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    const change = () => {
      setRoute(parseRoute());
      setMobile(false);
      lenis.current?.scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    change();
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    if (reducedMotion) return;
    const instance = new Lenis({ autoRaf: true, duration: 0.85, smoothWheel: true });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, [reducedMotion]);
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (
        event.key === '/' &&
        !(
          event.target instanceof HTMLElement &&
          (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) ||
            event.target.isContentEditable)
        )
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    document.title = `${currentTopic?.title || navItems.find((item) => item.view === route.view)?.title || 'Learn'} · Parle Italiano`;
  }, [route.view, currentTopic]);

  const go = useCallback((view: View, slug?: string) => {
    window.location.hash = slug ? `${view}/${slug}` : view;
  }, []);
  const gradeMutation = useMutation({
    mutationFn: async (input: {
      topic: LearningTopic;
      exerciseId: string;
      answer: string;
      attemptId: string;
    }): Promise<GradeResult> => {
      let result: GradeResult;
      if (mode === 'preview') {
        const key = answerKey?.[input.exerciseId];
        if (!key) throw new Error('This exercise could not be loaded. Try another lesson.');
        result = {
          isCorrect: normalizeAnswer(input.answer) === normalizeAnswer(key.correctAnswer),
          correctAnswer: key.correctAnswer,
          explanation: key.explanation,
        };
      } else {
        const response = await fetch(`/api/topics/${input.topic.slug}/grade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseId: input.exerciseId,
            answer: input.answer,
            attemptId: input.attemptId,
          }),
        });
        const body = await response.json();
        if (!response.ok)
          throw new Error(body.error?.message || 'Could not check your answer. Please try again.');
        result = body as GradeResult;
      }
      if (!account) {
        const before = useLearningStore.getState().snapshot.xp;
        useLearningStore.getState().record(
          input.topic.slug,
          input.exerciseId,
          result.isCorrect,
          input.topic.exercises.map((exercise) => exercise.exerciseId),
          input.attemptId,
        );
        result = { ...result, xpAwarded: useLearningStore.getState().snapshot.xp - before };
      } else {
        void client.invalidateQueries({ queryKey: ['progress'] });
      }
      return result;
    },
  });
  const grade: GradeHandler = (topic, exerciseId, answer, attemptId) =>
    gradeMutation.mutateAsync({ topic, exerciseId, answer, attemptId });
  const toggleSaved = (slug: string) => {
    const saved = local.bookmarks.includes(slug);
    local.toggleBookmark(slug);
    setToast(saved ? 'Removed from your notebook' : 'Saved to your notebook');
  };
  const complete = completedCount(snapshot);

  const sidebar = (
    <>
      <a className="brand" href="#overview" aria-label="Parle Italiano home">
        <BrandMark />
        <span>
          parle<span className="brand-period">.</span>
          <small>ITALIANO</small>
        </span>
      </a>
      <button className="workspace-select" onClick={() => setSettingsOpen(true)}>
        <span className="italian-flag">
          <i />
          <i />
          <i />
        </span>
        <span>
          My Italian journey<small>Your personal learning space</small>
        </span>
        <ChevronDown size={14} />
      </button>
      <p className="nav-label">YOUR WORKSPACE</p>
      <nav aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.view}
            href={`#${item.view}`}
            aria-label={item.title}
            className={`nav-item ${route.view === item.view || (route.view === 'lesson' && item.view === 'path') ? 'is-active' : ''}`}
            aria-current={route.view === item.view ? 'page' : undefined}
          >
            <item.icon size={18} strokeWidth={1.65} />
            <span>{item.title}</span>
            {item.view === 'practice' && <span className="nav-new">LET’S GO</span>}
            {item.view === 'notebook' && local.bookmarks.length > 0 && (
              <span className="nav-count">{local.bookmarks.length}</span>
            )}
          </a>
        ))}
      </nav>
      <div className="sidebar-journey">
        <div className="journey-dots">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <Sparkles size={18} />
        <h3>
          A little every day.
          <br />A whole new you.
        </h3>
        <p>
          Your next chapter
          <br />
          starts with one small step.
        </p>
        <button onClick={() => go('lesson', nextTopic.slug)}>
          Keep learning <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="sidebar-bottom">
        <button onClick={() => setHelpOpen(true)}>
          <HelpCircle size={17} /> A little guidance <ArrowUpRight size={13} />
        </button>
        <button onClick={() => setSettingsOpen(true)}>
          <Settings2 size={17} /> Preferences
        </button>
        <div className="sidebar-profile">
          <span className="avatar">
            {learner ? learner.name[0]?.toUpperCase() : <UserRound size={17} />}
          </span>
          <span>
            {learner?.name || 'Your learning space'}
            <small>{account ? 'Account progress synced' : 'Saved in this browser'}</small>
          </span>
          <button
            className="icon-button"
            aria-label="Open profile preferences"
            onClick={() => setSettingsOpen(true)}
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
        {mode === 'server' && !learner && (
          <a href="/sign-up" className="create-account-link">
            Create your account <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </>
  );

  return (
    <div className="learning-workspace">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">{sidebar}</aside>
      <Dialog.Root open={mobile} onOpenChange={setMobile}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay mobile-overlay" />
          <Dialog.Content className="mobile-sidebar" data-lenis-prevent>
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose a page in your learning space.
            </Dialog.Description>
            <Dialog.Close className="icon-button mobile-close" aria-label="Close navigation">
              <X size={18} />
            </Dialog.Close>
            {sidebar}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="workspace-body">
        {(route.view === 'lesson' || route.view === 'practice') && currentTopic && (
          <div className="viewport-progress">
            <motion.span animate={{ width: `${mastered(snapshot, currentTopic.slug) * 20}%` }} />
          </div>
        )}
        <header className="workspace-header">
          <div className="header-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <span className="header-home">
              <BookOpen size={14} />
            </span>
            <span className="breadcrumb-muted">Your workspace</span>
            <ChevronRight size={12} />
            <span>
              {route.view === 'lesson'
                ? 'Grammar notes'
                : navItems.find((item) => item.view === route.view)?.title}
            </span>
          </div>
          <div className="header-actions">
            <button
              className="header-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Search lessons"
            >
              <Search size={16} />
              <span>Find a little clarity</span>
              <kbd>/</kbd>
            </button>
            <span className="header-divider" />
            <button
              className="streak-pill"
              onClick={() => go('progress')}
              aria-label={`${shownStreak(snapshot)} day streak`}
            >
              <Flame size={17} />
              <span>{shownStreak(snapshot)}</span>
            </button>
            <button
              className="header-avatar"
              aria-label="Your profile and preferences"
              onClick={() => setSettingsOpen(true)}
            >
              {learner?.name[0]?.toUpperCase() || <UserRound size={16} />}
            </button>
          </div>
        </header>
        {account && progress.isError && (
          <div className="sync-error" role="alert">
            Your progress couldn’t be synced.{' '}
            <button onClick={() => void progress.refetch()}>Try again</button>
          </div>
        )}
        <main id="main-content" className={`workspace-main ${currentTopic ? 'has-lesson' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${route.view}-${route.slug || ''}`}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.22 }}
            >
              {route.view === 'overview' && (
                <>
                  <div className="page-welcome">
                    <p>
                      <span className="greeting-dot" />{' '}
                      {learner
                        ? `Ciao, ${learner.name.split(' ')[0]}. Bentornato!`
                        : 'CIAO, YOUR ITALIAN ERA STARTS HERE'}
                    </p>
                    <span>
                      <span className="italian-flag mini">
                        <i />
                        <i />
                        <i />
                      </span>{' '}
                      A LITTLE CLOSER TO FLUENT
                    </span>
                  </div>
                  <section className="hero-card">
                    <div className="hero-copy">
                      <span className="hero-kicker">
                        <span /> FIND YOUR ITALIAN VOICE
                      </span>
                      <h1>
                        Make Italian
                        <br />
                        <span>second nature.</span>
                      </h1>
                      <p>
                        Less memorizing. More understanding.
                        <br />
                        Your next chapter starts one rule at a time.
                      </p>
                      <div className="hero-action">
                        <MagneticButton onClick={() => go('lesson', nextTopic.slug)}>
                          {complete > 0 || Object.keys(snapshot.topics).length
                            ? 'Keep learning'
                            : 'Let’s get started'}
                          <ArrowUpRight size={18} />
                        </MagneticButton>
                        <span>
                          <Clock3 size={13} /> {nextTopic.estimatedMinutes} min, just for you
                        </span>
                      </div>
                    </div>
                    <LanguageArt />
                  </section>
                  <div className="stats-row">
                    <Stat
                      icon={BookOpen}
                      label="Lessons mastered"
                      value={account && !progress.data ? '—' : String(complete)}
                      suffix={`/ ${catalog.length}`}
                      detail="Your knowledge, taking shape"
                      color="violet"
                    />
                    <Stat
                      icon={Zap}
                      label="Experience earned"
                      value={account && !progress.data ? '—' : String(snapshot.xp)}
                      suffix="XP"
                      detail="Every little breakthrough counts"
                      color="amber"
                    />
                    <Stat
                      icon={Flame}
                      label="Current streak"
                      value={String(shownStreak(snapshot))}
                      suffix={shownStreak(snapshot) === 1 ? 'day' : 'days'}
                      detail={
                        snapshot.activity.length
                          ? 'Keep your Italian habit alive'
                          : 'Your first day is waiting for you'
                      }
                      color="rose"
                    />
                  </div>
                  <div className="dashboard-columns">
                    <div>
                      <PathLibrary catalog={catalog} snapshot={snapshot} go={go} compact />
                    </div>
                    <RightRail
                      snapshot={snapshot}
                      dailyGoal={local.dailyGoal}
                      onGoal={() => setSettingsOpen(true)}
                      onPractice={() => go('practice', nextTopic.slug)}
                    />
                  </div>
                </>
              )}
              {route.view === 'path' && (
                <>
                  <PageIntro
                    eyebrow="A PATH THAT MAKES SENSE"
                    title={
                      <>
                        Little steps.
                        <br />
                        <span>Lasting confidence.</span>
                      </>
                    }
                    description="From your first article to your next conversation. A thoughtful roadmap through Italian grammar."
                    side={
                      <span className="large-progress">
                        <strong>{complete.toString().padStart(2, '0')}</strong>
                        <span>
                          OF {catalog.length} LESSONS
                          <br />
                          MADE YOURS
                        </span>
                      </span>
                    }
                  />
                  <PathLibrary catalog={catalog} snapshot={snapshot} go={go} />
                </>
              )}
              {route.view === 'notebook' && (
                <>
                  <PageIntro
                    eyebrow="KEEP A LITTLE INSPIRATION"
                    title={
                      <>
                        Your notes.
                        <br />
                        <span>Your little discoveries.</span>
                      </>
                    }
                    description="The lessons you want to come back to. A personal collection, always close at hand."
                    side={<Bookmark size={64} className="intro-symbol" strokeWidth={0.8} />}
                  />
                  {local.bookmarks.length ? (
                    <div className="saved-grid">
                      {catalog
                        .filter((topic) => local.bookmarks.includes(topic.slug))
                        .map((topic) => (
                          <TopicCard
                            key={topic.slug}
                            topic={topic}
                            snapshot={snapshot}
                            onOpen={() => go('lesson', topic.slug)}
                            onUnsave={() => toggleSaved(topic.slug)}
                          />
                        ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Bookmark}
                      title="Something worth keeping."
                      text="Tap the bookmark on any lesson to save it here. Your future self will thank you."
                      action="Explore the learning path"
                      onClick={() => go('path')}
                    />
                  )}
                </>
              )}
              {route.view === 'progress' && (
                <ProgressView catalog={catalog} snapshot={snapshot} go={go} />
              )}
              {route.view === 'practice' && !currentTopic && (
                <>
                  <PageIntro
                    eyebrow="CLARITY COMES WITH PRACTICE"
                    title={
                      <>
                        A little repetition.
                        <br />
                        <span>A lot more intuition.</span>
                      </>
                    }
                    description="Five questions. One focused moment. Turn a rule you’ve learned into something you just know."
                    side={<Zap size={64} className="intro-symbol" strokeWidth={0.8} />}
                  />
                  <div className="practice-launch">
                    <div>
                      <span className="eyebrow">
                        <Sparkles size={13} /> PICK UP YOUR MOMENTUM
                      </span>
                      <h2>{nextTopic.title}</h2>
                      <p>{topicDescriptions[nextTopic.slug]}</p>
                      <button
                        className="primary-button"
                        onClick={() => go('practice', nextTopic.slug)}
                      >
                        Start a little practice <ArrowRight size={16} />
                      </button>
                    </div>
                    <div className="practice-five">
                      5
                      <span>
                        SMALL QUESTIONS.
                        <br />
                        REAL PROGRESS.
                      </span>
                    </div>
                  </div>
                  <h2 className="section-title practice-browse">
                    Or choose your own focus <span>{catalog.length} topics to explore</span>
                  </h2>
                  <div className="practice-topic-grid">
                    {sorted.map((topic) => (
                      <button
                        key={topic.slug}
                        onClick={() => go('practice', topic.slug)}
                        className="practice-topic"
                      >
                        <span
                          className={`topic-color color-${pathFor(topic.slug)?.color || 'violet'}`}
                        >
                          <BookOpen size={17} />
                        </span>
                        <span>
                          {topic.title}
                          <small>
                            {topic.cefrLevel} · {mastered(snapshot, topic.slug)} / 5 mastered
                          </small>
                        </span>
                        <ArrowUpRight size={16} />
                      </button>
                    ))}
                  </div>
                </>
              )}
              {(route.view === 'lesson' || route.view === 'practice') && currentTopic && (
                <LessonView
                  topic={currentTopic}
                  practiceOnly={route.view === 'practice'}
                  snapshot={snapshot}
                  grade={grade}
                  saved={local.bookmarks.includes(currentTopic.slug)}
                  onSave={() => toggleSaved(currentTopic.slug)}
                  go={go}
                />
              )}
              {(route.view === 'lesson' || route.view === 'practice') &&
                route.slug &&
                !currentTopic && (
                  <EmptyState
                    icon={Search}
                    title="A little lost?"
                    text="We couldn’t find that lesson. Your learning path will point you in the right direction."
                    action="Back to the learning path"
                    onClick={() => go('path')}
                  />
                )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="workspace-footer">
          <span>
            parle<span className="brand-period">.</span>{' '}
            <span>
              Little by little. <i lang="it">Piano piano.</i>
            </span>
          </span>
          <span>
            <span className="footer-dot" />{' '}
            {account ? 'Your progress, safely synced' : 'Your progress stays in this browser'}{' '}
            <span className="footer-tricolor">
              <i />
              <i />
              <i />
            </span>
          </span>
        </footer>
      </div>
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="search-dialog" data-lenis-prevent>
            <Dialog.Title className="sr-only">Find a grammar lesson</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search by topic name, description, or learning path.
            </Dialog.Description>
            <div className="search-dialog-input">
              <Search size={20} />
              <input
                autoFocus
                placeholder="What would you like to understand?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search grammar lessons"
              />
              <Dialog.Close className="search-escape">ESC</Dialog.Close>
            </div>
            <p className="search-section-label">
              {search ? 'A LITTLE CLARITY, FOUND' : 'A GOOD PLACE TO START'}
            </p>
            <div className="search-results">
              {sorted
                .filter((topic) =>
                  `${topic.title} ${topicDescriptions[topic.slug]} ${pathFor(topic.slug)?.subtitle}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .slice(0, search ? 37 : 6)
                .map((topic) => (
                  <button
                    key={topic.slug}
                    onClick={() => {
                      go('lesson', topic.slug);
                      setSearchOpen(false);
                      setSearch('');
                    }}
                  >
                    <span className={`topic-color color-${pathFor(topic.slug)?.color || 'violet'}`}>
                      <BookOpen size={17} />
                    </span>
                    <span>
                      {topic.title}
                      <small>{pathFor(topic.slug)?.subtitle}</small>
                    </span>
                    <span className="level-badge">{topic.cefrLevel}</span>
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              {!sorted.some((topic) =>
                `${topic.title} ${topicDescriptions[topic.slug]} ${pathFor(topic.slug)?.subtitle}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              ) && (
                <div className="search-empty">
                  No lessons found. Try “articles”, “verbs”, or “past”.
                </div>
              )}
            </div>
            <div className="search-footer">
              <BookOpen size={13} /> {catalog.length} little doors to understanding.
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <SettingsDialog
        open={settingsOpen}
        setOpen={setSettingsOpen}
        mode={mode}
        account={account}
        learner={learner}
        notify={setToast}
      />
      <Dialog.Root open={helpOpen} onOpenChange={setHelpOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="settings-dialog help-dialog" data-lenis-prevent>
            <Dialog.Close className="dialog-close icon-button" aria-label="Close guidance">
              <X size={19} />
            </Dialog.Close>
            <span className="dialog-emblem">
              <Compass size={23} />
            </span>
            <Dialog.Title>A little direction.</Dialog.Title>
            <Dialog.Description>
              Your Italian journey, one thoughtful step at a time.
            </Dialog.Description>
            <ol className="guidance-steps">
              <li>
                <span>01</span>
                <div>
                  <strong>Find your foundation</strong>
                  <p>
                    Explore eight learning paths. Start at the beginning or choose what you’re
                    curious about.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Make the rule click</strong>
                  <p>
                    Read the notes, open the examples, listen, and try a flashcard. Bookmark what’s
                    useful.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Turn clarity into confidence</strong>
                  <p>
                    Master five exercises to complete a lesson. Earn 10 XP per new correct answer
                    and a 50 XP completion bonus.
                  </p>
                </div>
              </li>
            </ol>
            <p className="help-footnote">
              Your daily goal counts correct practice answers. Streaks use UTC calendar days.{' '}
              {mode === 'preview'
                ? 'This GitHub Pages edition saves learning progress on this device.'
                : account
                  ? 'Your account progress syncs with the server.'
                  : 'Sign in to sync your progress across devices.'}
            </p>
            <button
              className="primary-button"
              onClick={() => {
                setHelpOpen(false);
                go('path');
              }}
            >
              Find my next step <ArrowRight size={16} />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="workspace-toast"
            role="status"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MagneticButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  return (
    <motion.button
      className="primary-button"
      onClick={onClick}
      animate={point}
      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        setPoint({
          x: (event.clientX - rect.left - rect.width / 2) * 0.1,
          y: (event.clientY - rect.top - rect.height / 2) * 0.15,
        });
      }}
      onPointerLeave={() => setPoint({ x: 0, y: 0 })}
    >
      {children}
    </motion.button>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  suffix,
  detail,
  color,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  suffix: string;
  detail: string;
  color: string;
}) {
  return (
    <div className="stat-card">
      <span className={`stat-icon color-${color}`}>
        <Icon size={19} strokeWidth={1.6} />
      </span>
      <div>
        <span className="stat-label">{label}</span>
        <p className="stat-value">
          {value}
          <span>{suffix}</span>
        </p>
        <p className="stat-detail">{detail}</p>
      </div>
      <ArrowUpRight size={14} className="stat-arrow" />
    </div>
  );
}
function PageIntro({
  eyebrow,
  title,
  description,
  side,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  side?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <p className="eyebrow">
          <span className="live-dot" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {side}
    </div>
  );
}
function EmptyState({
  icon: Icon,
  title,
  text,
  action,
  onClick,
}: {
  icon: typeof BookOpen;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={29} strokeWidth={1.1} />
        <span>✧</span>
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary-button" onClick={onClick}>
        {action}
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

function PathLibrary({
  catalog,
  snapshot,
  go,
  compact = false,
}: {
  catalog: LearningTopic[];
  snapshot: LearningSnapshot;
  go: (view: View, slug?: string) => void;
  compact?: boolean;
}) {
  const [filter, setFilter] = useState('all');
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');
  const [openPaths, setOpenPaths] = useState<string[]>(['foundations']);
  const [display, setDisplay] = useState('list');
  const filtered = catalog.filter(
    (topic) =>
      (level === 'all' || topic.cefrLevel === level) &&
      (filter === 'all' ||
        (filter === 'completed' && snapshot.topics[topic.slug]?.completedAt) ||
        (filter === 'started' &&
          mastered(snapshot, topic.slug) > 0 &&
          !snapshot.topics[topic.slug]?.completedAt)) &&
      `${topic.title} ${topicDescriptions[topic.slug]} ${pathFor(topic.slug)?.subtitle}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section className="path-library" id="learning-path">
      <div className="library-heading">
        <div>
          <p className="eyebrow">YOUR NEXT LITTLE BREAKTHROUGH</p>
          <h2>
            {compact ? 'A path to your Italian.' : 'The learning roadmap'}
            <span>{catalog.length} lessons · 8 paths</span>
          </h2>
        </div>
        <button
          className="icon-button"
          aria-label="Switch between list and roadmap"
          aria-pressed={display === 'map'}
          onClick={() => setDisplay(display === 'list' ? 'map' : 'list')}
        >
          {display === 'list' ? <Map size={18} /> : <List size={18} />}
        </button>
      </div>
      <div className="library-toolbar">
        <div className="library-tabs" role="group" aria-label="Filter by progress">
          {[
            ['all', 'All topics'],
            ['started', 'In progress'],
            ['completed', 'Completed'],
          ].map(([id, label]) => (
            <button
              aria-pressed={filter === id}
              key={id}
              className={filter === id ? 'is-active' : ''}
              onClick={() => setFilter(id!)}
            >
              {label}
              {id === 'all' && <span>{catalog.length}</span>}
            </button>
          ))}
        </div>
        <label className="level-select">
          <SlidersHorizontal size={13} />
          <select
            aria-label="Filter by CEFR level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="all">All levels</option>
            <option value="A1">A1 · Beginner</option>
            <option value="A2">A2 · Elementary</option>
            <option value="B1">B1 · Intermediate</option>
          </select>
          <ChevronDown size={12} />
        </label>
      </div>
      {!compact && (
        <label className="path-search">
          <Search size={16} />
          <input
            placeholder="Find your next topic…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span>{filtered.length} topics</span>
        </label>
      )}
      <div className={`path-groups ${display === 'map' ? 'paths-map' : ''}`}>
        {learningPaths.map((path, pathIndex) => {
          const topics = path.slugs
            .map((slug) => filtered.find((topic) => topic.slug === slug))
            .filter((topic): topic is LearningTopic => Boolean(topic));
          if (!topics.length) return null;
          const count = path.slugs.filter((slug) =>
            Boolean(snapshot.topics[slug]?.completedAt),
          ).length;
          const Icon = pathIcons[path.icon];
          const open = openPaths.includes(path.id) || Boolean(query) || filter !== 'all';
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: pathIndex * 0.025 }}
              className={`path-group color-${path.color} ${open ? 'is-open' : ''}`}
            >
              <button
                className="path-group-heading"
                onClick={() =>
                  setOpenPaths(
                    openPaths.includes(path.id)
                      ? openPaths.filter((id) => id !== path.id)
                      : [...openPaths, path.id],
                  )
                }
                aria-expanded={open}
                aria-controls={`path-${path.id}`}
              >
                <span className="path-symbol">
                  <Icon size={21} strokeWidth={1.65} />
                </span>
                <span className="path-heading-text">
                  <span>
                    {path.subtitle}
                    {pathIndex === 0 && <i className="start-here">START HERE</i>}
                  </span>
                  <small>{path.title}</small>
                </span>
                <span className="group-count">
                  {count}
                  <span> / {path.slugs.length}</span>
                </span>
                <span className="mini-progress">
                  <span style={{ width: `${(count / path.slugs.length) * 100}%` }} />
                </span>
                <ChevronDown size={16} className="path-chevron" />
              </button>
              {display === 'map' && <p className="path-card-description">{path.description}</p>}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`path-${path.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="topic-rows"
                  >
                    <div className="topic-column-head">
                      <span>THE TOPIC</span>
                      <span>LEVEL</span>
                      <span>PRACTICE</span>
                    </div>
                    {topics.map((topic) => {
                      const done = Boolean(snapshot.topics[topic.slug]?.completedAt);
                      const score = mastered(snapshot, topic.slug);
                      return (
                        <div key={topic.slug} className={`topic-row ${done ? 'is-mastered' : ''}`}>
                          <button className="topic-main" onClick={() => go('lesson', topic.slug)}>
                            <span
                              className={`topic-status ${done ? 'done' : score ? 'started' : ''}`}
                              aria-label={
                                done ? 'Mastered' : score ? `${score} of 5 mastered` : 'Not started'
                              }
                            >
                              {done ? <Check size={12} /> : score ? <span /> : null}
                            </span>
                            <span className="topic-title">
                              {topic.title}
                              <small>{topicDescriptions[topic.slug]}</small>
                            </span>
                          </button>
                          <span className="level-badge">{topic.cefrLevel}</span>
                          <button
                            className="topic-practice"
                            onClick={() => go('practice', topic.slug)}
                            aria-label={`Practice ${topic.title}`}
                          >
                            {score ? <span>{score}/5</span> : <span>0/5</span>}
                            <ArrowUpRight size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="filtered-empty">
          <Search size={23} />
          <h3>
            {filter === 'completed'
              ? 'Your first milestone is ahead.'
              : filter === 'started'
                ? 'Ready for a little momentum?'
                : 'No topics found just yet.'}
          </h3>
          <p>
            {filter === 'completed'
              ? 'Master all five exercises in a lesson to see it here.'
              : filter === 'started'
                ? 'Start any lesson and watch your path take shape.'
                : 'Try another search or level.'}
          </p>
          <button
            className="text-button"
            onClick={() => {
              setFilter('all');
              setLevel('all');
              setQuery('');
            }}
          >
            Explore all topics <ArrowRight size={14} />
          </button>
        </div>
      )}
      {compact && (
        <button className="all-paths-link" onClick={() => go('path')}>
          Your whole journey, at a glance <ArrowRight size={15} />
        </button>
      )}
    </section>
  );
}

function RightRail({
  snapshot,
  dailyGoal,
  onGoal,
  onPractice,
}: {
  snapshot: LearningSnapshot;
  dailyGoal: number;
  onGoal: () => void;
  onPractice: () => void;
}) {
  const today = snapshot.activity.filter(
    (item) => utcDay(item.date) === utcDay() && item.isCorrect,
  ).length;
  const pct = Math.min(1, today / dailyGoal);
  return (
    <aside className="right-rail">
      <div className="daily-goal-card">
        <div className="rail-heading">
          <span>
            <Target size={15} /> TODAY’S INTENTION
          </span>
          <button className="icon-button" aria-label="Change daily goal" onClick={onGoal}>
            <MoreHorizontal size={17} />
          </button>
        </div>
        <div className="goal-ring">
          <svg viewBox="0 0 140 140" aria-hidden="true">
            <circle cx="70" cy="70" r="60" />
            <circle
              cx="70"
              cy="70"
              r="60"
              strokeDasharray={377}
              strokeDashoffset={377 * (1 - pct)}
            />
          </svg>
          <div>
            <strong>
              {today}
              <span>/{dailyGoal}</span>
            </strong>
            <span>CORRECT ANSWERS</span>
          </div>
          <span className="goal-spark">✦</span>
        </div>
        <h3>{pct >= 1 ? 'A little promise, kept.' : 'A small habit. A big difference.'}</h3>
        <p>
          {pct >= 1
            ? 'You’ve met your intention for today. Bravissimo!'
            : 'A few focused minutes. A little closer to the person you want to be.'}
        </p>
        <button className="secondary-button" onClick={onPractice}>
          {pct >= 1 ? 'Keep the momentum' : 'Make a little time'}
          <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="word-card">
        <div className="rail-heading">
          <span>UN PO’ DI BELLEZZA</span>
          <Sparkles size={14} />
        </div>
        <div>
          <span className="word-type">/ me·ra·vì·glia /</span>
          <h3 lang="it">
            meraviglia<span>.</span>
          </h3>
          <span className="word-definition">wonder · something beautiful</span>
        </div>
        <div className="word-card-bottom">
          <span>A little word. A lovely feeling.</span>
          <SpeakButton phrase="meraviglia" compact />
        </div>
      </div>
      <div className="quote-card">
        <span className="quote-mark">“</span>
        <p lang="it">
          Piano piano,
          <br />
          <em>si va lontano.</em>
        </p>
        <span>Little by little, one goes far.</span>
        <div className="quote-foot">
          <span>AN ITALIAN WAY OF LIFE</span>
          <span className="italian-flag mini">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </aside>
  );
}

function TopicCard({
  topic,
  snapshot,
  onOpen,
  onUnsave,
}: {
  topic: LearningTopic;
  snapshot: LearningSnapshot;
  onOpen: () => void;
  onUnsave?: () => void;
}) {
  const path = pathFor(topic.slug);
  const Icon = pathIcons[path?.icon || 'blocks'];
  return (
    <article className={`saved-card color-${path?.color || 'violet'}`}>
      <div>
        <span className="path-symbol">
          <Icon size={23} />
        </span>
        {onUnsave && (
          <button
            className="icon-button bookmark-is-saved"
            onClick={onUnsave}
            aria-label={`Remove ${topic.title} from notebook`}
          >
            <Bookmark size={18} fill="currentColor" />
          </button>
        )}
      </div>
      <span className="eyebrow">{path?.subtitle}</span>
      <h2>{topic.title}</h2>
      <p>{topicDescriptions[topic.slug]}</p>
      <div className="saved-card-bottom">
        <span className="level-badge">{topic.cefrLevel}</span>
        <span>
          <Clock3 size={12} /> {topic.estimatedMinutes} min
        </span>
        <button onClick={onOpen} aria-label={`Open ${topic.title}`}>
          <ArrowUpRight size={19} />
        </button>
      </div>
      <div className="saved-card-progress">
        <span style={{ width: `${mastered(snapshot, topic.slug) * 20}%` }} />
      </div>
    </article>
  );
}

function LessonView({
  topic,
  practiceOnly,
  snapshot,
  grade,
  saved,
  onSave,
  go,
}: {
  topic: LearningTopic;
  practiceOnly: boolean;
  snapshot: LearningSnapshot;
  grade: GradeHandler;
  saved: boolean;
  onSave: () => void;
  go: (view: View, slug?: string) => void;
}) {
  const [mobileTab, setMobileTab] = useState(practiceOnly ? 'practice' : 'notes');
  const path = pathFor(topic.slug);
  const score = mastered(snapshot, topic.slug);
  return (
    <div className={`lesson-view ${practiceOnly ? 'practice-focus' : ''} mobile-${mobileTab}`}>
      <div className="lesson-back-row">
        <button onClick={() => go('path')}>
          <ArrowLeft size={15} /> Learning path
        </button>
        <span>
          {path?.subtitle}
          <ChevronRight size={12} />
          <span>{practiceOnly ? 'Practice' : 'Grammar notes'}</span>
        </span>
      </div>
      <div className="lesson-header">
        <div>
          <span className="eyebrow">
            <span className="live-dot" />{' '}
            {practiceOnly ? 'MAKE IT SECOND NATURE' : 'A LITTLE CLARITY GOES A LONG WAY'}
          </span>
          <h1>{topic.title}</h1>
          <p>{topicDescriptions[topic.slug]}</p>
          <div className="lesson-meta">
            <span className="level-badge">{topic.cefrLevel}</span>
            <span>
              <Clock3 size={13} /> {topic.estimatedMinutes} min read
            </span>
            <span>
              <Zap size={13} /> 5 exercises
            </span>
            <span className={score === 5 ? 'mastered-label' : ''}>
              <CircleCheck size={13} /> {score}/5 mastered
            </span>
          </div>
        </div>
        <button className={`save-lesson-button ${saved ? 'is-saved' : ''}`} onClick={onSave}>
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Save lesson'}
        </button>
      </div>
      <div className="lesson-mobile-tabs">
        <button
          className={mobileTab === 'notes' ? 'is-active' : ''}
          onClick={() => setMobileTab('notes')}
        >
          <BookOpen size={15} /> Notes
        </button>
        <button
          className={mobileTab === 'practice' ? 'is-active' : ''}
          onClick={() => setMobileTab('practice')}
        >
          <Zap size={15} /> Practice <span>{score}/5</span>
        </button>
      </div>
      <div className="lesson-columns">
        <article className="lesson-notes">
          {practiceOnly ? (
            <div className="quick-reference">
              <span className="eyebrow">
                <BookOpen size={14} /> A LITTLE REMINDER
              </span>
              <h2>The idea, in a nutshell.</h2>
              {topic.keyRules.slice(0, 3).map((rule) => (
                <div key={rule.ruleTitle}>
                  <h3>{rule.ruleTitle}</h3>
                  <p lang="it">{rule.explanation}</p>
                  <blockquote lang="it">{rule.italianExample}</blockquote>
                </div>
              ))}
              <button className="text-button" onClick={() => go('lesson', topic.slug)}>
                Open the full notes <ArrowUpRight size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="notes-intro-bar">
                <span>
                  <BookOpen size={14} /> THE NOTES
                </span>
                <span>Read. Explore. Make it click.</span>
              </div>
              <Notes markdown={topic.theoryMarkdown.replace(/^# .+\n/, '')} />
            </>
          )}
        </article>
        <aside className="practice-panel">
          <ExercisePlayer
            key={topic.slug}
            topic={topic}
            correctIds={snapshot.topics[topic.slug]?.correctExerciseIds || []}
            grade={grade}
            onDone={() => go('path')}
          />
          <div className="practice-panel-footer">
            <Headphones size={15} />
            <span>
              Take your time.
              <br />
              <strong>Understanding comes before speed.</strong>
            </span>
            <span>✧</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProgressView({
  catalog,
  snapshot,
  go,
}: {
  catalog: LearningTopic[];
  snapshot: LearningSnapshot;
  go: (view: View, slug?: string) => void;
}) {
  const complete = completedCount(snapshot);
  const count = Object.values(snapshot.topics).reduce(
    (total, topic) => total + topic.correctExerciseIds.length,
    0,
  );
  const [now] = useState(() => Date.now());
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now - (6 - index) * 86400000);
    const events = snapshot.activity.filter((item) => utcDay(item.date) === utcDay(date));
    return {
      date,
      count: events.filter((item) => item.isCorrect).length,
      xp: events.reduce((sum, item) => sum + item.xp, 0),
    };
  });
  const largest = Math.max(5, ...days.map((day) => day.count));
  return (
    <>
      <PageIntro
        eyebrow="LOOK HOW FAR YOU’RE GOING"
        title={
          <>
            Every little effort.
            <br />
            <span>Quietly adding up.</span>
          </>
        }
        description="Your progress is more than a number. It’s every moment you chose to show up for yourself."
        side={<Trophy size={64} className="intro-symbol" strokeWidth={0.8} />}
      />
      <div className="stats-row">
        <Stat
          icon={BookOpen}
          label="Lessons mastered"
          value={String(complete)}
          suffix={`/ ${catalog.length}`}
          detail="Understanding you can build on"
          color="violet"
        />
        <Stat
          icon={Sparkles}
          label="Experience earned"
          value={String(snapshot.xp)}
          suffix="XP"
          detail={`${count} grammar moments mastered`}
          color="amber"
        />
        <Stat
          icon={Flame}
          label="Your streak"
          value={String(shownStreak(snapshot))}
          suffix="days"
          detail="A little consistency, a lot of possibility"
          color="rose"
        />
      </div>
      <div className="progress-grid">
        <section className="activity-card">
          <div className="section-card-heading">
            <div>
              <span className="eyebrow">A LITTLE EVERY DAY</span>
              <h2>Your week, in Italian.</h2>
            </div>
            <span>LAST 7 DAYS</span>
          </div>
          <div className="activity-chart">
            {days.map((day) => (
              <div
                key={day.date.toISOString()}
                className={utcDay(day.date) === utcDay() ? 'today' : ''}
              >
                <span>{day.count}</span>
                <div className="activity-bar-track">
                  <span
                    style={{ height: `${Math.max(3, (day.count / largest) * 100)}%` }}
                    title={`${day.count} correct answers · ${day.xp} XP`}
                  />
                </div>
                <span>
                  {day.date.toLocaleDateString('en', { weekday: 'short', timeZone: 'UTC' })}
                </span>
              </div>
            ))}
          </div>
          <p className="activity-caption">
            <span className="live-dot" /> Correct answers. Real little breakthroughs.
          </p>
        </section>
        <section className="mastery-card">
          <span className="eyebrow">THE BIGGER PICTURE</span>
          <div className="mastery-visual">
            <svg viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" />
              <circle
                cx="80"
                cy="80"
                r="68"
                strokeDasharray={427}
                strokeDashoffset={427 * (1 - complete / catalog.length)}
              />
            </svg>
            <div>
              <strong>
                {Math.round((complete / catalog.length) * 100)}
                <span>%</span>
              </strong>
              <small>SECOND NATURE</small>
            </div>
          </div>
          <h3>{complete ? 'Look at you, moving forward.' : 'A beautiful beginning.'}</h3>
          <p>
            {complete
              ? `${complete} lessons made yours. Keep going.`
              : 'Every journey starts with a single step.'}
          </p>
          <button className="text-button" onClick={() => go('path')}>
            Your next step <ArrowRight size={15} />
          </button>
        </section>
      </div>
      <h2 className="section-title">Your paths, taking shape.</h2>
      <div className="progress-paths">
        {learningPaths.map((path) => {
          const total = path.slugs.reduce((sum, slug) => sum + mastered(snapshot, slug), 0);
          const Icon = pathIcons[path.icon];
          return (
            <button
              className={`progress-path color-${path.color}`}
              key={path.id}
              onClick={() =>
                go(
                  'lesson',
                  path.slugs.find((slug) => !snapshot.topics[slug]?.completedAt) || path.slugs[0],
                )
              }
            >
              <span className="path-symbol">
                <Icon size={19} />
              </span>
              <span>
                {path.subtitle}
                <small>
                  {total} / {path.slugs.length * 5} exercises mastered
                </small>
              </span>
              <div>
                <span style={{ width: `${(total / (path.slugs.length * 5)) * 100}%` }} />
              </div>
              <ArrowUpRight size={15} />
            </button>
          );
        })}
      </div>
      {snapshot.activity.length > 0 && (
        <section className="recent-activity">
          <h2 className="section-title">Little moments of progress.</h2>
          {snapshot.activity
            .slice(-6)
            .reverse()
            .map((item) => (
              <div key={item.id}>
                <span className={`recent-icon ${item.isCorrect ? 'correct' : ''}`}>
                  {item.isCorrect ? <Check size={15} /> : <RotateCcw size={15} />}
                </span>
                <span>
                  {catalog.find((topic) => topic.slug === item.topicSlug)?.title ||
                    'Grammar practice'}
                  <small>
                    {item.isCorrect ? 'A little more confident' : 'Learning something new'} ·{' '}
                    {new Date(item.date).toLocaleDateString('en', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </small>
                </span>
                <span>{item.xp ? `+${item.xp} XP` : 'PRACTICE'}</span>
              </div>
            ))}
        </section>
      )}
    </>
  );
}

function SettingsDialog({
  open,
  setOpen,
  mode,
  account,
  learner,
  notify,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: AppProps['mode'];
  account: boolean;
  learner: AppProps['learner'];
  notify: (message: string) => void;
}) {
  const local = useLearningStore();
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setConfirmReset(false);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="settings-dialog" data-lenis-prevent>
          <Dialog.Close className="dialog-close icon-button" aria-label="Close preferences">
            <X size={19} />
          </Dialog.Close>
          <span className="dialog-emblem">
            <Settings2 size={23} />
          </span>
          <Dialog.Title>A space that’s yours.</Dialog.Title>
          <Dialog.Description>
            A few little preferences for your learning journey.
          </Dialog.Description>
          <div className="settings-profile">
            <span className="avatar">
              <UserRound size={21} />
            </span>
            <div>
              <strong>{learner?.name || 'Your local learning profile'}</strong>
              <span>
                {account
                  ? 'Progress is synced to your account.'
                  : 'Your learning progress is saved on this device.'}
              </span>
            </div>
          </div>
          <div className="settings-section">
            <h3>Your daily intention</h3>
            <p>A manageable little goal. Consistency over intensity.</p>
            <div className="goal-options">
              {[5, 10, 15].map((goal) => (
                <button
                  key={goal}
                  aria-pressed={local.dailyGoal === goal}
                  onClick={() => local.setDailyGoal(goal)}
                  className={local.dailyGoal === goal ? 'is-selected' : ''}
                >
                  <strong>{goal}</strong>
                  <span>correct answers</span>
                  {local.dailyGoal === goal && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>
          {mode === 'server' && !account && (
            <div className="settings-signin">
              <h3>Take your progress with you.</h3>
              <p>
                Sign in for account progress across devices. Browser practice remains on this
                device.
              </p>
              <a href="/sign-in" className="secondary-button">
                Sign in <ArrowUpRight size={15} />
              </a>
            </div>
          )}
          {account && (
            <a href="/account" className="secondary-button">
              Manage your account <ArrowUpRight size={15} />
            </a>
          )}
          <div className="settings-section settings-data">
            <div>
              <h3>Made for focus.</h3>
              <p>
                {mode === 'preview'
                  ? 'GitHub Pages edition · local learning'
                  : 'Parle Italiano · your grammar workspace'}
              </p>
            </div>
            <a
              href="https://github.com/nafismam/ParleItaliano"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View the project on GitHub"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          {!account && (
            <div className="reset-section">
              {confirmReset ? (
                <>
                  <p>This clears practice progress and saved lessons on this browser.</p>
                  <button
                    onClick={() => {
                      local.reset();
                      setConfirmReset(false);
                      notify('A fresh start. Your local progress was cleared.');
                    }}
                    className="reset-confirm"
                  >
                    Yes, start fresh
                  </button>
                  <button onClick={() => setConfirmReset(false)} className="text-button">
                    Keep my progress
                  </button>
                </>
              ) : (
                <button className="reset-button" onClick={() => setConfirmReset(true)}>
                  <RotateCcw size={12} /> Start fresh on this device
                </button>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
