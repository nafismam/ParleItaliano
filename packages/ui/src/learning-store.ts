'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LearningSnapshot } from '@parle/contracts';

export const emptySnapshot: LearningSnapshot = {
  topics: {},
  xp: 0,
  streakDays: 0,
  lastActiveDate: null,
  activity: [],
};
export function utcDay(date: string | Date = new Date()): string {
  return new Date(date).toISOString().slice(0, 10);
}

type LearningState = {
  snapshot: LearningSnapshot;
  bookmarks: string[];
  dailyGoal: number;
  hydrated: boolean;
  setHydrated: () => void;
  toggleBookmark: (slug: string) => void;
  setDailyGoal: (goal: number) => void;
  reset: () => void;
  record: (
    slug: string,
    exerciseId: string,
    correct: boolean,
    exerciseIds: string[],
    attemptId: string,
  ) => void;
};

function validSnapshot(value: unknown): value is LearningSnapshot {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as LearningSnapshot;
  return (
    Number.isSafeInteger(snapshot.xp) &&
    snapshot.xp >= 0 &&
    Number.isSafeInteger(snapshot.streakDays) &&
    snapshot.streakDays >= 0 &&
    (snapshot.lastActiveDate === null ||
      (typeof snapshot.lastActiveDate === 'string' &&
        !Number.isNaN(Date.parse(snapshot.lastActiveDate)))) &&
    Boolean(
      snapshot.topics && typeof snapshot.topics === 'object' && !Array.isArray(snapshot.topics),
    ) &&
    Object.entries(snapshot.topics).length <= 200 &&
    Object.values(snapshot.topics).every(
      (topic) =>
        topic &&
        Array.isArray(topic.correctExerciseIds) &&
        topic.correctExerciseIds.length <= 5 &&
        topic.correctExerciseIds.every((id) => typeof id === 'string') &&
        typeof topic.attempts === 'number' &&
        typeof topic.lastPracticedAt === 'string' &&
        (topic.completedAt === null || typeof topic.completedAt === 'string'),
    ) &&
    Array.isArray(snapshot.activity) &&
    snapshot.activity.length <= 500 &&
    snapshot.activity.every(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.topicSlug === 'string' &&
        typeof item.date === 'string' &&
        !Number.isNaN(Date.parse(item.date)) &&
        typeof item.isCorrect === 'boolean' &&
        typeof item.xp === 'number',
    )
  );
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      snapshot: emptySnapshot,
      bookmarks: [],
      dailyGoal: 5,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      toggleBookmark: (slug) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(slug)
            ? state.bookmarks.filter((item) => item !== slug)
            : [...state.bookmarks, slug],
        })),
      setDailyGoal: (goal) => set({ dailyGoal: [5, 10, 15].includes(goal) ? goal : 5 }),
      reset: () => set({ snapshot: emptySnapshot, bookmarks: [] }),
      record: (slug, exerciseId, isCorrect, exerciseIds, attemptId) =>
        set((state) => {
          if (state.snapshot.activity.some((event) => event.id === attemptId)) return state;
          const now = new Date().toISOString();
          const previous = state.snapshot.topics[slug];
          const earned = new Set(previous?.correctExerciseIds || []);
          const isNew = isCorrect && !earned.has(exerciseId);
          if (isCorrect) earned.add(exerciseId);
          const complete = exerciseIds.every((id) => earned.has(id));
          const xp = (isNew ? 10 : 0) + (complete && !previous?.completedAt ? 50 : 0);
          const today = utcDay(now);
          const lastDay = state.snapshot.lastActiveDate
            ? utcDay(state.snapshot.lastActiveDate)
            : null;
          const yesterday = utcDay(new Date(Date.now() - 86400000));
          const streak =
            lastDay === today
              ? state.snapshot.streakDays
              : lastDay === yesterday
                ? state.snapshot.streakDays + 1
                : 1;
          return {
            snapshot: {
              topics: {
                ...state.snapshot.topics,
                [slug]: {
                  correctExerciseIds: [...earned],
                  attempts: (previous?.attempts || 0) + 1,
                  completedAt: previous?.completedAt || (complete ? now : null),
                  lastPracticedAt: now,
                },
              },
              xp: state.snapshot.xp + xp,
              streakDays: streak,
              lastActiveDate: now,
              activity: [
                ...state.snapshot.activity,
                { id: attemptId, date: now, topicSlug: slug, isCorrect, xp },
              ].slice(-500),
            },
          };
        }),
    }),
    {
      name: 'parle-learning-v1',
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        snapshot: state.snapshot,
        bookmarks: state.bookmarks,
        dailyGoal: state.dailyGoal,
      }),
      merge: (stored, current) => {
        const value = stored as Partial<LearningState> | undefined;
        return {
          ...current,
          snapshot: validSnapshot(value?.snapshot) ? value.snapshot : emptySnapshot,
          bookmarks: Array.isArray(value?.bookmarks)
            ? value.bookmarks
                .filter((item): item is string => typeof item === 'string')
                .slice(0, 200)
            : [],
          dailyGoal: [5, 10, 15].includes(value?.dailyGoal || 0) ? value!.dailyGoal! : 5,
        };
      },
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
