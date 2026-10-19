import { z } from 'zod';

export const cefrLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1']);
export const roleSchema = z.enum(['learner', 'admin']);
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));
export const passwordSchema = z
  .string()
  .min(12)
  .max(72)
  .refine(
    (value) => new TextEncoder().encode(value).length <= 72,
    'Password must be at most 72 UTF-8 bytes',
  );
export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(80)
      .regex(/^[^<>\p{Cc}]+$/u, 'Name contains invalid characters'),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(256) });
const exerciseBase = {
  exerciseId: z.uuid(),
  order: z.number().int().min(1).max(5),
  prompt: z.string().trim().min(1).max(2000),
  correctAnswer: z.string().trim().min(1).max(1000),
  explanation: z.string().trim().min(1).max(5000),
};
export const exerciseSchema = z.discriminatedUnion('type', [
  z
    .object({
      ...exerciseBase,
      type: z.literal('multiple_choice'),
      options: z.array(z.string().min(1)).min(2).max(8),
    })
    .strict()
    .refine(
      (value) =>
        new Set(value.options).size === value.options.length &&
        value.options.includes(value.correctAnswer),
      'Choices must be distinct and include the answer',
    ),
  z.object({ ...exerciseBase, type: z.literal('fill_in_the_blank') }).strict(),
  z
    .object({
      ...exerciseBase,
      type: z.literal('sentence_reorder'),
      options: z.array(z.string().min(1)).min(2).max(30),
    })
    .strict()
    .refine(
      (value) =>
        value.options.slice().sort().join('\u0000') ===
        value.correctAnswer.split(/\s+/).sort().join('\u0000'),
      'Tokens must match the answer',
    ),
  z.object({ ...exerciseBase, type: z.literal('error_correction') }).strict(),
]);
export const topicSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    title: z.string().trim().min(1).max(150),
    cefrLevel: cefrLevelSchema,
    category: z.enum([
      'Verbs',
      'Pronouns',
      'Prepositions',
      'Syntax',
      'Articles',
      'Nouns',
      'Adjectives',
      'Time',
      'Everyday',
    ]),
    estimatedMinutes: z.number().int().min(1).max(120),
    theoryMarkdown: z.string().min(30).max(100000),
    keyRules: z
      .array(
        z
          .object({
            ruleTitle: z.string().min(1),
            explanation: z.string().min(1),
            italianExample: z.string().min(1),
            englishTranslation: z.string().min(1),
          })
          .strict(),
      )
      .min(1),
    exercises: z
      .array(exerciseSchema)
      .length(5)
      .refine(
        (values) =>
          values.every((value, i) => value.order === i + 1) &&
          new Set(values.map((value) => value.exerciseId)).size === 5,
        'Exercises need unique IDs and ordered positions 1–5',
      ),
  })
  .strict();
export type Topic = z.infer<typeof topicSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type Role = z.infer<typeof roleSchema>;
export type CefrLevel = z.infer<typeof cefrLevelSchema>;
export type PublicExercise = {
  [Kind in Exercise['type']]: Omit<
    Extract<Exercise, { type: Kind }>,
    'correctAnswer' | 'explanation'
  >;
}[Exercise['type']];
export type LearningTopic = Omit<Topic, 'exercises'> & { exercises: PublicExercise[] };
export type TopicProgress = {
  correctExerciseIds: string[];
  attempts: number;
  completedAt: string | null;
  lastPracticedAt: string;
};
export type PracticeActivity = {
  id: string;
  date: string;
  topicSlug: string;
  isCorrect: boolean;
  xp: number;
};
export type LearningSnapshot = {
  topics: Record<string, TopicProgress>;
  xp: number;
  streakDays: number;
  lastActiveDate: string | null;
  activity: PracticeActivity[];
};
export type GradeResult = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  xpAwarded?: number;
};
export function toPublicExercise(exercise: Exercise): PublicExercise {
  const { correctAnswer: _answer, explanation: _explanation, ...visible } = exercise;
  void _answer;
  void _explanation;
  return visible;
}
export const submissionSchema = z
  .object({ exerciseId: z.uuid(), answer: z.string().trim().min(1).max(1000), attemptId: z.uuid() })
  .strict();
export function normalizeAnswer(answer: string): string {
  return answer
    .normalize('NFC')
    .trim()
    .replace(/[’‘]/g, "'")
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('it-IT');
}
