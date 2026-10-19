import { randomUUID } from 'node:crypto';
import {
  connectDatabase,
  disconnectDatabase,
  User,
  UserProgress,
  ExerciseAttempt,
} from '@parle/database';
import { grammarCatalog } from '@parle/content';
import { test, expect } from '@playwright/test';
test('registration, sign-in, profile authorization, and sign-out', async ({ page }) => {
  const email = `browser-${randomUUID()}@example.com`;
  const response = await page.goto('/');
  expect(response?.headers()['content-security-policy']).toContain("object-src 'none'");
  await expect(page.getByRole('heading', { name: /Make Italian/ })).toBeVisible();
  await page.getByRole('link', { name: /Create your account/ }).click();
  await page.getByLabel('Name', { exact: true }).fill('Browser Learner');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('A-unique-browser-password');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL(/sign-in/);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('A-unique-browser-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ciao, Browser Learner.' })).toBeVisible();
  const me = await page.request.get('/api/me');
  expect(me.status()).toBe(200);
  const profile = await me.json();
  expect(profile.user.email).toBe(email);
  expect(profile.user.role).toBe('learner');
  expect(profile.user.passwordHash).toBeUndefined();
  const lesson = grammarCatalog.find((topic) => topic.slug === 'articoli-determinativi')!;
  const exercise = lesson.exercises[0]!;
  const attempt = {
    exerciseId: exercise.exerciseId,
    answer: exercise.correctAnswer,
    attemptId: randomUUID(),
  };
  const submit = () =>
    page.request.post(`/api/topics/${lesson.slug}/grade`, {
      headers: { Origin: process.env.E2E_BASE_URL || 'http://localhost:3100' },
      data: attempt,
    });
  const firstGrade = await submit();
  expect(firstGrade.status()).toBe(200);
  expect((await firstGrade.json()).xpAwarded).toBe(10);
  expect((await (await submit()).json()).xpAwarded).toBe(10);
  const progress = await (await page.request.get('/api/progress')).json();
  expect(progress.xp).toBe(10);
  expect(progress.topics[lesson.slug].correctExerciseIds).toHaveLength(1);
  const topics = await page.request.get('/api/topics');
  expect(topics.headers()['cache-control']).toContain('s-maxage=300');
  for (const topic of (await topics.json()).topics)
    for (const question of topic.exercises) {
      expect(question.correctAnswer).toBeUndefined();
      expect(question.explanation).toBeUndefined();
    }
  expect((await page.request.get('/api/admin')).status()).toBe(403);
  await connectDatabase(process.env.MONGODB_URI!);
  try {
    await User.updateOne({ email }, { $set: { role: 'admin' } });
    expect((await page.request.get('/api/admin')).status()).toBe(200);
    await User.updateOne({ email }, { $set: { role: 'learner' } });
    expect((await page.request.get('/api/admin')).status()).toBe(403);
    await User.updateOne({ email }, { $inc: { sessionVersion: 1 } });
    expect((await page.request.get('/api/me')).status()).toBe(401);
    await page.goto('/sign-in');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill('A-unique-browser-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Ciao, Browser Learner.' })).toBeVisible();
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  } finally {
    await UserProgress.deleteMany({ userId: profile.user._id });
    await ExerciseAttempt.deleteMany({ userId: profile.user._id });
    await User.deleteOne({ email });
    await disconnectDatabase();
  }
  await expect(page).toHaveURL('/');
  expect((await page.request.get('/api/me')).status()).toBe(401);
});
test('rejects cross-origin mutations and unauthenticated access', async ({ request }) => {
  expect((await request.get('/api/me')).status()).toBe(401);
  expect(
    (
      await request.post('/api/register', {
        headers: { Origin: 'https://untrusted.example' },
        data: { email: 'nobody@example.com', password: 'secret' },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('/api/auth/signout', {
        headers: { Origin: 'https://untrusted.example' },
        form: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('/api/register', {
        headers: { Origin: process.env.E2E_BASE_URL || 'http://localhost:3100' },
        data: {
          name: 'Test Learner',
          email: 'valid@example.com',
          password: 'long-test-password',
          role: 'admin',
        },
      })
    ).status(),
  ).toBe(400);
});
