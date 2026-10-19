import { connectDatabase, Topic, UserProgress, User, ExerciseAttempt } from '@parle/database';
import { cacheJson, serverEnv } from '@parle/platform';
import {
  normalizeAnswer,
  toPublicExercise,
  topicSchema,
  type GradeResult,
  type LearningSnapshot,
  type LearningTopic,
  type Topic as GrammarTopic,
} from '@parle/contracts';
import { ApiError } from './http';

async function database() {
  return connectDatabase(serverEnv().MONGODB_URI);
}
function parseTopic(document: Record<string, unknown>): GrammarTopic {
  return topicSchema.parse({
    slug: document.slug,
    title: document.title,
    cefrLevel: document.cefrLevel,
    category: document.category,
    estimatedMinutes: document.estimatedMinutes,
    theoryMarkdown: document.theoryMarkdown,
    keyRules: document.keyRules,
    exercises: document.exercises,
  });
}
export async function publicCatalog(): Promise<LearningTopic[]> {
  return cacheJson('public-catalog-v1', 300, async () => {
    await database();
    const documents = await Topic.find()
      .select('+exercises.correctAnswer +exercises.explanation')
      .lean();
    return documents.map((document) => {
      const { exercises, ...topic } = parseTopic(document);
      return { ...topic, exercises: exercises.map(toPublicExercise) };
    });
  });
}

export async function learningSnapshot(userId: string): Promise<LearningSnapshot> {
  await database();
  const [profile, progress, attempts, topics] = await Promise.all([
    User.findById(userId).select('xp streakDays lastActiveDate').lean(),
    UserProgress.find({ userId }).lean(),
    ExerciseAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(500)
      .select('attemptId topicId isCorrect xpAwarded createdAt')
      .lean(),
    Topic.find().select('slug').lean(),
  ]);
  if (!profile) throw new ApiError(401, 'UNAUTHENTICATED', 'Sign in to continue');
  const slugs = new Map(topics.map((topic) => [String(topic._id), topic.slug]));
  return {
    topics: Object.fromEntries(
      progress.flatMap((item) => {
        const slug = slugs.get(String(item.topicId));
        return slug
          ? [
              [
                slug,
                {
                  correctExerciseIds: item.exerciseResults
                    .filter((exercise) => exercise.isCorrect)
                    .map((exercise) => exercise.exerciseId),
                  attempts: item.attempts,
                  completedAt: item.completedAt?.toISOString() || null,
                  lastPracticedAt: item.updatedAt.toISOString(),
                },
              ],
            ]
          : [];
      }),
    ),
    xp: profile.xp,
    streakDays: profile.streakDays,
    lastActiveDate: profile.lastActiveDate?.toISOString() || null,
    activity: attempts.reverse().flatMap((attempt) => {
      const slug = slugs.get(String(attempt.topicId));
      return slug
        ? [
            {
              id: attempt.attemptId,
              date: attempt.createdAt.toISOString(),
              topicSlug: slug,
              isCorrect: attempt.isCorrect,
              xp: attempt.xpAwarded || 0,
            },
          ]
        : [];
    }),
  };
}

export async function gradeExercise(input: {
  slug: string;
  exerciseId: string;
  answer: string;
  attemptId: string;
  userId?: string | undefined;
}): Promise<GradeResult> {
  const mongoose = await database();
  const document = await Topic.findOne({ slug: input.slug })
    .select('+exercises.correctAnswer +exercises.explanation')
    .lean();
  if (!document) throw new ApiError(404, 'TOPIC_NOT_FOUND', 'This lesson could not be found');
  const topic = parseTopic(document);
  const exercise = topic.exercises.find((item) => item.exerciseId === input.exerciseId);
  if (!exercise)
    throw new ApiError(404, 'EXERCISE_NOT_FOUND', 'This exercise is not part of the lesson');
  const result: GradeResult = {
    isCorrect: normalizeAnswer(input.answer) === normalizeAnswer(exercise.correctAnswer),
    correctAnswer: exercise.correctAnswer,
    explanation: exercise.explanation,
    xpAwarded: 0,
  };
  if (!input.userId) return result;
  const userId = input.userId;
  // withTransaction retries write conflicts. A first-time progress upsert can also race on its unique key.
  for (let retry = 0; retry < 3; retry++) {
    const session = await mongoose.startSession();
    try {
      const outcome = await session.withTransaction(
        async () => {
          const old = await ExerciseAttempt.findOne({ userId, attemptId: input.attemptId }).session(
            session,
          );
          if (old) {
            if (
              String(old.topicId) !== String(document._id) ||
              old.exerciseId !== input.exerciseId ||
              normalizeAnswer(old.answer) !== normalizeAnswer(input.answer)
            )
              throw new ApiError(
                409,
                'ATTEMPT_CONFLICT',
                'This attempt identifier was already used for a different answer',
              );
            return old.gradingResult
              ? {
                  isCorrect: old.gradingResult.isCorrect,
                  correctAnswer: old.gradingResult.correctAnswer,
                  explanation: old.gradingResult.explanation,
                  xpAwarded: old.gradingResult.xpAwarded,
                }
              : { ...result, isCorrect: old.isCorrect, xpAwarded: old.xpAwarded || 0 };
          }
          const progress =
            (await UserProgress.findOne({ userId, topicId: document._id }).session(session)) ||
            new UserProgress({ userId, topicId: document._id });
          const wasComplete = progress.status === 'completed';
          const previous = progress.exerciseResults.findIndex(
            (item) => item.exerciseId === input.exerciseId,
          );
          const wasCorrect = previous !== -1 && progress.exerciseResults[previous]!.isCorrect;
          const now = new Date();
          if (!wasCorrect) {
            const entry = {
              exerciseId: input.exerciseId,
              isCorrect: result.isCorrect,
              userSubmittedAnswer: input.answer,
              timestamp: now,
            };
            if (previous === -1) progress.exerciseResults.push(entry);
            else progress.exerciseResults[previous]!.set(entry);
          }
          progress.attempts += 1;
          progress.score = progress.exerciseResults.filter((item) => item.isCorrect).length;
          progress.status = progress.score === 5 ? 'completed' : 'in_progress';
          if (progress.status === 'completed' && !progress.completedAt) progress.completedAt = now;
          progress.revision += 1;
          const xpAwarded =
            (result.isCorrect && !wasCorrect ? 10 : 0) +
            (!wasComplete && progress.status === 'completed' ? 50 : 0);
          const profile = await User.findById(userId).session(session);
          if (!profile || profile.disabledAt)
            throw new ApiError(401, 'UNAUTHENTICATED', 'Sign in to continue');
          const today = now.toISOString().slice(0, 10);
          const previousDay = profile.lastActiveDate?.toISOString().slice(0, 10);
          if (previousDay !== today)
            profile.streakDays =
              previousDay === new Date(now.getTime() - 86400000).toISOString().slice(0, 10)
                ? profile.streakDays + 1
                : 1;
          profile.lastActiveDate = now;
          profile.xp += xpAwarded;
          const gradingResult = { ...result, xpAwarded };
          await progress.save({ session });
          await profile.save({ session });
          await ExerciseAttempt.create(
            [
              {
                userId,
                topicId: document._id,
                attemptId: input.attemptId,
                exerciseId: input.exerciseId,
                isCorrect: result.isCorrect,
                answer: input.answer,
                xpAwarded,
                gradingResult,
                expiresAt: new Date(now.getTime() + 30 * 86400000),
              },
            ],
            { session },
          );
          return gradingResult;
        },
        { maxCommitTimeMS: 10000 },
      );
      if (!outcome) throw new Error('No grading result was committed');
      return outcome;
    } catch (error) {
      if (!(
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 11000 &&
        retry < 2
      ))
        throw error;
    } finally {
      await session.endSession();
    }
  }
  throw new Error('Could not commit the exercise attempt');
}
