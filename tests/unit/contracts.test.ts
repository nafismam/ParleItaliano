import { describe, expect, it } from 'vitest';
import {
  exerciseSchema,
  normalizeAnswer,
  registrationSchema,
  toPublicExercise,
  topicSchema,
} from '@parle/contracts';
import { topicFixture } from '../fixtures/topic';
describe('learning contracts', () => {
  it('requires exactly five exercises with ordered positions and unique IDs', () => {
    const topic = topicFixture();
    expect(topicSchema.safeParse(topic).success).toBe(true);
    expect(topicSchema.safeParse({ ...topic, exercises: topic.exercises.slice(1) }).success).toBe(
      false,
    );
    expect(
      topicSchema.safeParse({ ...topic, exercises: [...topic.exercises, topic.exercises[0]] })
        .success,
    ).toBe(false);
    topic.exercises[1]!.exerciseId = topic.exercises[0]!.exerciseId;
    expect(topicSchema.safeParse(topic).success).toBe(false);
  });
  it('rejects duplicate positions and invalid choices or reorder tokens', () => {
    const topic = topicFixture();
    topic.exercises[1]!.order = 1;
    expect(topicSchema.safeParse(topic).success).toBe(false);
    const base = { ...topic.exercises[0]!, type: 'multiple_choice', options: ['x', 'y'] };
    expect(exerciseSchema.safeParse(base).success).toBe(false);
    expect(exerciseSchema.safeParse({ ...base, correctAnswer: 'x' }).success).toBe(true);
    expect(
      exerciseSchema.safeParse({ ...base, type: 'sentence_reorder', correctAnswer: 'y x' }).success,
    ).toBe(true);
    expect(
      exerciseSchema.safeParse({ ...base, type: 'sentence_reorder', correctAnswer: 'y y' }).success,
    ).toBe(false);
  });
  it('normalizes Italian case, whitespace, and Unicode without removing meaningful accents', () => {
    expect(normalizeAnswer('  PERCHÉ   sì  ')).toBe('perché sì');
    expect(normalizeAnswer('e\u0300')).toBe('è');
    expect(normalizeAnswer('e')).not.toBe(normalizeAnswer('è'));
  });
  it('keeps answers and explanations out of public exercise objects', () => {
    const exercise = topicFixture().exercises[0]!;
    const publicExercise = toPublicExercise(exercise);
    expect(publicExercise).not.toHaveProperty('correctAnswer');
    expect(publicExercise).not.toHaveProperty('explanation');
    expect(publicExercise.exerciseId).toBe(exercise.exerciseId);
  });
});
describe('registration contract', () => {
  const valid = {
    name: 'Test Learner',
    email: 'LEARNER@example.com',
    password: 'a-long-test-password',
  };
  it('normalizes email and rejects privilege escalation', () => {
    expect(registrationSchema.parse(valid).email).toBe('learner@example.com');
    expect(registrationSchema.safeParse({ ...valid, role: 'admin' }).success).toBe(false);
  });
  it('rejects unsafe names, short passwords, and bcrypt byte truncation', () => {
    expect(registrationSchema.safeParse({ ...valid, name: '<script>' }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...valid, password: 'short' }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...valid, password: 'é'.repeat(40) }).success).toBe(
      false,
    );
  });
});
