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
import { disconnectCache } from '@parle/platform';
import { gradeExercise, learningSnapshot } from '../../apps/web/src/server/learning';
import { topicFixture } from '../fixtures/topic';

const fixture = topicFixture();
let userId: string;
let topicId: string;
beforeAll(async () => {
  await connectDatabase(process.env.MONGODB_URI!);
  await ensureIndexes();
  const user = await User.create({
    name: 'Grading Learner',
    email: `grade-${randomUUID()}@example.com`,
    authProvider: 'credentials',
    passwordHash: 'synthetic-test-hash',
  });
  const topic = await Topic.create(fixture);
  userId = String(user._id);
  topicId = String(topic._id);
});
afterAll(async () => {
  await Promise.all([
    User.deleteOne({ _id: userId }),
    Topic.deleteOne({ _id: topicId }),
    UserProgress.deleteMany({ userId }),
    ExerciseAttempt.deleteMany({ userId }),
  ]);
  await disconnectDatabase();
  await disconnectCache();
});
describe('transactional exercise grading', () => {
  it('grades guest answers without persisting an account attempt', async () => {
    const response = await gradeExercise({
      slug: fixture.slug,
      exerciseId: fixture.exercises[0]!.exerciseId,
      answer: ' ANSWER. ',
      attemptId: randomUUID(),
    });
    expect(response.isCorrect).toBe(true);
    expect(await ExerciseAttempt.countDocuments({ topicId })).toBe(0);
  });
  it('replays an attempt safely and rejects reusing its identifier for a changed payload', async () => {
    const input = {
      slug: fixture.slug,
      exerciseId: fixture.exercises[0]!.exerciseId,
      answer: 'answer',
      attemptId: randomUUID(),
      userId,
    };
    const results = await Promise.all([gradeExercise(input), gradeExercise(input)]);
    expect(results[0]).toEqual(results[1]);
    expect(results[0]?.xpAwarded).toBe(10);
    expect(await ExerciseAttempt.countDocuments({ userId })).toBe(1);
    expect((await User.findById(userId).lean())?.xp).toBe(10);
    await expect(gradeExercise({ ...input, answer: 'different' })).rejects.toMatchObject({
      status: 409,
    });
  });
  it('awards mastery once under concurrent submissions and preserves it on later errors', async () => {
    await Promise.all(
      fixture.exercises.slice(1).map((exercise) =>
        gradeExercise({
          slug: fixture.slug,
          exerciseId: exercise.exerciseId,
          answer: 'answer',
          attemptId: randomUUID(),
          userId,
        }),
      ),
    );
    const snapshot = await learningSnapshot(userId);
    expect(snapshot.xp).toBe(100);
    expect(snapshot.streakDays).toBe(1);
    expect(snapshot.topics[fixture.slug]?.correctExerciseIds).toHaveLength(5);
    expect(snapshot.topics[fixture.slug]?.completedAt).toBeTruthy();
    await gradeExercise({
      slug: fixture.slug,
      exerciseId: fixture.exercises[0]!.exerciseId,
      answer: 'wrong',
      attemptId: randomUUID(),
      userId,
    });
    await gradeExercise({
      slug: fixture.slug,
      exerciseId: fixture.exercises[0]!.exerciseId,
      answer: 'answer',
      attemptId: randomUUID(),
      userId,
    });
    const after = await learningSnapshot(userId);
    expect(after.xp).toBe(100);
    expect(after.topics[fixture.slug]?.correctExerciseIds).toHaveLength(5);
    expect((await UserProgress.findOne({ userId, topicId }).lean())?.status).toBe('completed');
  });
  it('does not grade an exercise through a different topic', async () => {
    await expect(
      gradeExercise({
        slug: fixture.slug,
        exerciseId: randomUUID(),
        answer: 'answer',
        attemptId: randomUUID(),
        userId,
      }),
    ).rejects.toMatchObject({ status: 404 });
  });
});
