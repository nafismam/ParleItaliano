import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  connectDatabase,
  disconnectDatabase,
  ensureIndexes,
  ExerciseAttempt,
  Topic,
  User,
  UserProgress,
} from '@parle/database';
import { disconnectCache, pingCache, rateLimit } from '@parle/platform';
import { topicFixture } from '../fixtures/topic';
const suffix = randomUUID();
const userIds: string[] = [];
const topicIds: string[] = [];
beforeAll(async () => {
  if (!process.env.MONGODB_URI) throw new Error('Integration tests require MONGODB_URI');
  await connectDatabase(process.env.MONGODB_URI);
  await ensureIndexes();
});
afterAll(async () => {
  await Promise.all([
    User.deleteMany({ _id: { $in: userIds } }),
    Topic.deleteMany({ _id: { $in: topicIds } }),
    UserProgress.deleteMany({ userId: { $in: userIds } }),
    ExerciseAttempt.deleteMany({ userId: { $in: userIds } }),
  ]);
  await disconnectDatabase();
  await disconnectCache();
});
describe('MongoDB persistence invariants', () => {
  it('enforces unique normalized emails and hides password hashes', async () => {
    const user = await User.create({
      name: 'Integration Learner',
      email: `TEST-${suffix}@example.com`,
      authProvider: 'credentials',
      passwordHash: 'synthetic-not-a-real-password-hash',
    });
    userIds.push(user._id.toString());
    expect((await User.findById(user._id).lean())?.passwordHash).toBeUndefined();
    await expect(
      User.create({
        name: 'Duplicate',
        email: user.email,
        authProvider: 'credentials',
        passwordHash: 'synthetic',
      }),
    ).rejects.toMatchObject({ code: 11000 });
    const queried = await User.findById(user._id).select('+passwordHash').lean();
    expect(queried?.passwordHash).toBe('synthetic-not-a-real-password-hash');
  });
  it('excludes exercise answers by default and validates the strict exercise count', async () => {
    const fixture = topicFixture();
    const topic = await Topic.create(fixture);
    topicIds.push(topic._id.toString());
    const publicRead = await Topic.findById(topic._id).lean();
    expect(publicRead?.exercises[0]).not.toHaveProperty('correctAnswer');
    expect(publicRead?.exercises[0]).not.toHaveProperty('explanation');
    const gradingRead = await Topic.findById(topic._id)
      .select('+exercises.correctAnswer +exercises.explanation')
      .lean();
    expect(gradingRead?.exercises[0]?.correctAnswer).toBe('answer');
    await expect(
      Topic.create({
        ...fixture,
        slug: `invalid-${suffix}`,
        exercises: fixture.exercises.slice(1),
      }),
    ).rejects.toThrow();
  });
  it('enforces one progress document per user/topic and rejects premature mastery', async () => {
    const progressUser = await User.create({
      name: 'Progress Learner',
      email: `progress-${suffix}@example.com`,
      authProvider: 'credentials',
      passwordHash: 'synthetic-test-hash',
    });
    const progressTopic = await Topic.create(topicFixture());
    const user = progressUser._id;
    const topic = progressTopic._id;
    userIds.push(user.toString());
    topicIds.push(topic.toString());
    await UserProgress.create({ userId: user, topicId: topic });
    await expect(UserProgress.create({ userId: user, topicId: topic })).rejects.toMatchObject({
      code: 11000,
    });
    await expect(
      new UserProgress({
        userId: user,
        topicId: topic,
        status: 'completed',
        score: 5,
        completedAt: new Date(),
      }).validate(),
    ).rejects.toThrow('Mastery requires');
    const connection = await connectDatabase(process.env.MONGODB_URI!);
    const session = await connection.startSession();
    try {
      await session.withTransaction(async () => {
        await User.updateOne({ _id: user }, { $inc: { xp: 1 } }, { session });
      });
    } finally {
      await session.endSession();
    }
    expect((await User.findById(user).lean())?.xp).toBe(1);
  });
});
describe('Redis concurrency', () => {
  it('allows exactly the configured quota under concurrent requests', async () => {
    expect(await pingCache()).toBe(true);
    const results = await Promise.all(
      Array.from({ length: 12 }, () => rateLimit(`test:${suffix}`, 5, 2000)),
    );
    expect(results.filter((result) => result.allowed)).toHaveLength(5);
    expect(results.every((result) => result.retryAfter >= 1)).toBe(true);
  });
});
