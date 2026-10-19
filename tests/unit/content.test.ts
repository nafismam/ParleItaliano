import { describe, expect, it } from 'vitest';
import { grammarCatalog } from '@parle/content';
import { orderedSlugs } from '@parle/content/roadmap';
import { normalizeAnswer } from '@parle/contracts';
describe('editorial curriculum', () => {
  it('places every lesson in exactly one roadmap path', () => {
    expect(new Set(orderedSlugs).size).toBe(orderedSlugs.length);
    expect(new Set(grammarCatalog.map((topic) => topic.slug))).toEqual(new Set(orderedSlugs));
  });
  it('does not make the first option a predictable answer pattern', () => {
    const choices = grammarCatalog.flatMap((topic) =>
      topic.exercises.filter((exercise) => exercise.type === 'multiple_choice'),
    );
    const firstCorrect = choices.filter(
      (exercise) => exercise.options[0] === exercise.correctAnswer,
    ).length;
    expect(firstCorrect / choices.length).toBeLessThan(0.6);
    expect(firstCorrect).toBeGreaterThan(0);
  });
  it('accepts typographic apostrophes and optional sentence endings while preserving accents', () => {
    expect(normalizeAnswer('L’amica.')).toBe(normalizeAnswer("l'amica"));
    expect(normalizeAnswer('è')).not.toBe(normalizeAnswer('e'));
  });
});
