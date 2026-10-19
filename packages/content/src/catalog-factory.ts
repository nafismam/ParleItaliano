import { createHash } from 'node:crypto';
import { topicSchema, type Exercise, type Topic } from '@parle/contracts';

/** Stable UUIDs keep saved exercise results attached when the curated notes are reseeded. */
function exerciseId(slug: string, order: number): string {
  const bytes = createHash('sha1')
    .update(`parle-italiano:${slug}:exercise:${order}`)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x50;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const value = bytes.toString('hex');
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

type DraftExercise = Exercise extends infer Item
  ? Item extends Exercise
    ? Omit<Item, 'exerciseId' | 'order'>
    : never
  : never;

export function defineTopic(
  value: Omit<Topic, 'exercises'> & { exercises: DraftExercise[] },
): Topic {
  return topicSchema.parse({
    ...value,
    exercises: value.exercises.map((exercise, index) => ({
      ...exercise,
      ...(exercise.type === 'multiple_choice'
        ? {
            options: exercise.options.slice().sort((a, b) => {
              const rank = (choice: string) =>
                createHash('sha256').update(`${value.slug}:${index}:${choice}`).digest('hex');
              return rank(a).localeCompare(rank(b));
            }),
          }
        : {}),
      order: index + 1,
      exerciseId: exerciseId(value.slug, index + 1),
    })),
  });
}
